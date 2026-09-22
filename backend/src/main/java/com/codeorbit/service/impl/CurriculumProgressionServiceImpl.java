package com.codeorbit.service.impl;

import com.codeorbit.entity.*;
import com.codeorbit.exception.ForbiddenException;
import com.codeorbit.repository.*;
import com.codeorbit.service.CurriculumProgressionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class CurriculumProgressionServiceImpl implements CurriculumProgressionService {

    private final CourseModuleRepository courseModuleRepository;
    private final QuizRepository quizRepository;
    private final LessonRepository lessonRepository;
    private final UserLessonProgressRepository progressRepository;
    private final UserQuizTrackerRepository trackerRepository;
    private final PlacementReadyEntitlementRepository entitlementRepository;

    public CurriculumProgressionServiceImpl(
            CourseModuleRepository courseModuleRepository,
            QuizRepository quizRepository,
            LessonRepository lessonRepository,
            UserLessonProgressRepository progressRepository,
            UserQuizTrackerRepository trackerRepository,
            PlacementReadyEntitlementRepository entitlementRepository
    ) {
        this.courseModuleRepository = courseModuleRepository;
        this.quizRepository = quizRepository;
        this.lessonRepository = lessonRepository;
        this.progressRepository = progressRepository;
        this.trackerRepository = trackerRepository;
        this.entitlementRepository = entitlementRepository;
    }

    @Override
    public boolean hasPlacementReadyAccess(Long userId, Long courseId) {
        if (userId == null || courseId == null) {
            return false;
        }
        return entitlementRepository.existsByUserIdAndCourseId(userId, courseId);
    }

    @Override
    public boolean isModuleUnlocked(Long userId, CourseModule module) {
        if (module == null) return false;
        if (userId == null) {
            // Unauthenticated guest: only first module of Beginner is readable
            return module.getCurriculumLevel() == CurriculumLevel.BEGINNER && module.getOrderIndex() <= 1;
        }

        Long courseId = module.getCourse().getId();
        CurriculumLevel level = module.getCurriculumLevel();
        int orderIndex = module.getOrderIndex();

        // Check level prerequisites for entry into higher levels
        if (!isLevelPrerequisiteSatisfied(userId, courseId, level)) {
            return false;
        }

        // Placement Ready subcourse strictly requires an active paid entitlement
        if (level == CurriculumLevel.PLACEMENT_READY && !hasPlacementReadyAccess(userId, courseId)) {
            return false;
        }

        // Within level: Module 1 is open if level prerequisite (and payment if applicable) is satisfied
        if (orderIndex <= 1) {
            return true;
        }

        // Module N (N > 1) requires passing Module N-1's quiz
        Optional<CourseModule> prevModuleOpt = courseModuleRepository.findByCourseIdAndCurriculumLevelAndOrderIndex(
                courseId, level, orderIndex - 1);
        if (prevModuleOpt.isEmpty()) {
            return true; // No previous module found, allow
        }

        CourseModule prevModule = prevModuleOpt.get();
        List<Quiz> prevQuizzes = quizRepository.findByModuleIdAndStatus(prevModule.getId(), PublishStatus.PUBLISHED);
        if (prevQuizzes.isEmpty()) {
            return true; // No quiz on previous module, allow
        }

        for (Quiz q : prevQuizzes) {
            if (q.getQuizType() == QuizType.MODULE_QUIZ) {
                Optional<UserQuizTracker> tracker = trackerRepository.findByUserIdAndQuizId(userId, q.getId());
                if (tracker.isEmpty() || !tracker.get().isHasPassed() || tracker.get().getHighestScorePercentage().intValue() < q.getMinPassScorePercentage()) {
                    return false;
                }
            }
        }

        return true;
    }

    @Override
    public boolean isQuizUnlocked(Long userId, Quiz quiz) {
        if (quiz == null) return false;
        if (userId == null) return false; // Quizzes strictly require authentication

        if (quiz.getQuizType() == QuizType.MODULE_QUIZ) {
            return isModuleUnlocked(userId, quiz.getModule());
        }

        if (quiz.getQuizType() == QuizType.LEVEL_FINAL_QUIZ) {
            Long courseId = quiz.getModule() != null ? quiz.getModule().getCourse().getId() : null;
            if (courseId == null) return false;

            CurriculumLevel level = quiz.getCurriculumLevel();
            if (level == null && quiz.getModule() != null) {
                level = quiz.getModule().getCurriculumLevel();
            }
            if (level == null) return false;

            if (level == CurriculumLevel.PLACEMENT_READY && !hasPlacementReadyAccess(userId, courseId)) {
                return false;
            }

            // Level final quiz requires passing all module quizzes in that level
            List<Quiz> moduleQuizzes = quizRepository.findModuleQuizzesByCourseAndLevel(courseId, level);
            if (moduleQuizzes.isEmpty()) return true;

            for (Quiz mq : moduleQuizzes) {
                Optional<UserQuizTracker> tracker = trackerRepository.findByUserIdAndQuizId(userId, mq.getId());
                if (tracker.isEmpty() || !tracker.get().isHasPassed() || tracker.get().getHighestScorePercentage().intValue() < mq.getMinPassScorePercentage()) {
                    return false;
                }
            }

            return true;
        }

        return true;
    }

    @Override
    public boolean isEligibleForCertificate(Long userId, Long courseId) {
        if (userId == null || courseId == null) return false;

        List<CurriculumLevel> certLevels = List.of(
                CurriculumLevel.BEGINNER,
                CurriculumLevel.INTERMEDIATE,
                CurriculumLevel.ADVANCED
        );

        for (CurriculumLevel level : certLevels) {
            // 1. Check all module quizzes in this level
            List<Quiz> moduleQuizzes = quizRepository.findModuleQuizzesByCourseAndLevel(courseId, level);
            for (Quiz mq : moduleQuizzes) {
                Optional<UserQuizTracker> tracker = trackerRepository.findByUserIdAndQuizId(userId, mq.getId());
                if (tracker.isEmpty() || !tracker.get().isHasPassed() || tracker.get().getHighestScorePercentage().intValue() < mq.getMinPassScorePercentage()) {
                    return false;
                }
            }

            // 2. Check Level Final Quiz in this level
            List<Quiz> finalQuizzes = quizRepository.findByCourseIdAndQuizTypeAndCurriculumLevel(courseId, QuizType.LEVEL_FINAL_QUIZ, level);
            for (Quiz fq : finalQuizzes) {
                Optional<UserQuizTracker> tracker = trackerRepository.findByUserIdAndQuizId(userId, fq.getId());
                if (tracker.isEmpty() || !tracker.get().isHasPassed() || tracker.get().getHighestScorePercentage().intValue() < fq.getMinPassScorePercentage()) {
                    return false;
                }
            }
        }

        // 3. Check all lessons in Beginner, Intermediate, Advanced are completed
        long totalLessons = lessonRepository.countPublishedLessonsByCourseIdAndLevels(courseId, certLevels);
        long completedLessons = progressRepository.countCompletedPublishedLessonsByLevels(userId, courseId, certLevels);
        return totalLessons > 0 && completedLessons >= totalLessons;
    }

    @Override
    public int getPassedModuleQuizCount(Long userId, Long courseId) {
        if (userId == null || courseId == null) return 0;
        List<CurriculumLevel> certLevels = List.of(
                CurriculumLevel.BEGINNER,
                CurriculumLevel.INTERMEDIATE,
                CurriculumLevel.ADVANCED
        );
        int passedCount = 0;
        for (CurriculumLevel level : certLevels) {
            List<Quiz> moduleQuizzes = quizRepository.findModuleQuizzesByCourseAndLevel(courseId, level);
            for (Quiz mq : moduleQuizzes) {
                Optional<UserQuizTracker> tracker = trackerRepository.findByUserIdAndQuizId(userId, mq.getId());
                if (tracker.isPresent() && tracker.get().isHasPassed() && tracker.get().getHighestScorePercentage().intValue() >= mq.getMinPassScorePercentage()) {
                    passedCount++;
                }
            }
        }
        return passedCount;
    }

    @Override
    public int getPassedFinalQuizCount(Long userId, Long courseId) {
        if (userId == null || courseId == null) return 0;
        List<CurriculumLevel> certLevels = List.of(
                CurriculumLevel.BEGINNER,
                CurriculumLevel.INTERMEDIATE,
                CurriculumLevel.ADVANCED
        );
        int passedCount = 0;
        for (CurriculumLevel level : certLevels) {
            List<Quiz> finalQuizzes = quizRepository.findByCourseIdAndQuizTypeAndCurriculumLevel(courseId, QuizType.LEVEL_FINAL_QUIZ, level);
            for (Quiz fq : finalQuizzes) {
                Optional<UserQuizTracker> tracker = trackerRepository.findByUserIdAndQuizId(userId, fq.getId());
                if (tracker.isPresent() && tracker.get().isHasPassed() && tracker.get().getHighestScorePercentage().intValue() >= fq.getMinPassScorePercentage()) {
                    passedCount++;
                }
            }
        }
        return passedCount;
    }

    @Override
    public void validateModuleAccess(Long userId, CourseModule module) {
        if (module == null) {
            throw new ForbiddenException("Invalid module specified.");
        }
        if (module.getCurriculumLevel() == CurriculumLevel.PLACEMENT_READY) {
            Long courseId = module.getCourse().getId();
            if (!hasPlacementReadyAccess(userId, courseId)) {
                throw new ForbiddenException("Placement Ready access requires purchase.");
            }
        }
        if (!isModuleUnlocked(userId, module)) {
            throw new ForbiddenException("Module '" + module.getTitle() + "' is locked. Please pass prerequisite module quizzes to unlock.");
        }
    }

    @Override
    public void validateQuizAccess(Long userId, Quiz quiz) {
        if (quiz == null) {
            throw new ForbiddenException("Invalid assessment specified.");
        }
        Long courseId = quiz.getModule() != null ? quiz.getModule().getCourse().getId() : null;
        CurriculumLevel level = quiz.getCurriculumLevel();
        if (level == null && quiz.getModule() != null) {
            level = quiz.getModule().getCurriculumLevel();
        }

        if (level == CurriculumLevel.PLACEMENT_READY && courseId != null) {
            if (!hasPlacementReadyAccess(userId, courseId)) {
                throw new ForbiddenException("Placement Ready access requires purchase.");
            }
        }

        if (!isQuizUnlocked(userId, quiz)) {
            throw new ForbiddenException("Assessment '" + quiz.getTitle() + "' is locked. Please pass prerequisite quizzes to unlock.");
        }
    }

    private boolean isLevelPrerequisiteSatisfied(Long userId, Long courseId, CurriculumLevel level) {
        if (level == null || level == CurriculumLevel.BEGINNER) {
            return true;
        }

        if (level == CurriculumLevel.INTERMEDIATE) {
            return isLevelFinalPassed(userId, courseId, CurriculumLevel.BEGINNER);
        }

        if (level == CurriculumLevel.ADVANCED) {
            return isLevelFinalPassed(userId, courseId, CurriculumLevel.INTERMEDIATE);
        }

        if (level == CurriculumLevel.PLACEMENT_READY) {
            return isLevelFinalPassed(userId, courseId, CurriculumLevel.ADVANCED);
        }

        return true;
    }

    private boolean isLevelFinalPassed(Long userId, Long courseId, CurriculumLevel level) {
        List<Quiz> finalQuizzes = quizRepository.findByCourseIdAndQuizTypeAndCurriculumLevel(courseId, QuizType.LEVEL_FINAL_QUIZ, level);
        if (finalQuizzes.isEmpty()) {
            return true; // If no final quiz defined for that level, allow progression
        }

        for (Quiz fq : finalQuizzes) {
            Optional<UserQuizTracker> tracker = trackerRepository.findByUserIdAndQuizId(userId, fq.getId());
            if (tracker.isEmpty() || !tracker.get().isHasPassed() || tracker.get().getHighestScorePercentage().intValue() < fq.getMinPassScorePercentage()) {
                return false;
            }
        }
        return true;
    }
}
