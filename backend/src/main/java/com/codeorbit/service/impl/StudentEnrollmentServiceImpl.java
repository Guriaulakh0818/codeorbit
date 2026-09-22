package com.codeorbit.service.impl;

import com.codeorbit.dto.*;
import com.codeorbit.entity.*;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.*;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.CurriculumProgressionService;
import com.codeorbit.service.StudentEnrollmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentEnrollmentServiceImpl implements StudentEnrollmentService {

    private static final Logger logger = LoggerFactory.getLogger(StudentEnrollmentServiceImpl.class);

    private final StudentEnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final SubcourseRepository subcourseRepository;
    private final CourseModuleRepository courseModuleRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final UserLessonProgressRepository progressRepository;
    private final UserCourseBookmarkRepository bookmarkRepository;
    private final UserQuizTrackerRepository trackerRepository;
    private final CertificateRepository certificateRepository;
    private final CurriculumProgressionService progressionService;

    public StudentEnrollmentServiceImpl(
            StudentEnrollmentRepository enrollmentRepository,
            UserRepository userRepository,
            CourseRepository courseRepository,
            SubcourseRepository subcourseRepository,
            CourseModuleRepository courseModuleRepository,
            LessonRepository lessonRepository,
            QuizRepository quizRepository,
            UserLessonProgressRepository progressRepository,
            UserCourseBookmarkRepository bookmarkRepository,
            UserQuizTrackerRepository trackerRepository,
            CertificateRepository certificateRepository,
            CurriculumProgressionService progressionService
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.subcourseRepository = subcourseRepository;
        this.courseModuleRepository = courseModuleRepository;
        this.lessonRepository = lessonRepository;
        this.quizRepository = quizRepository;
        this.progressRepository = progressRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.trackerRepository = trackerRepository;
        this.certificateRepository = certificateRepository;
        this.progressionService = progressionService;
    }

    @Override
    public StudentEnrollmentDto enrollInCourse(UserPrincipal principal, String courseSlug) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        Course course = courseRepository.findBySlugAndStatus(courseSlug, PublishStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "slug", courseSlug));

        Optional<StudentEnrollment> existingOpt = enrollmentRepository.findByUserIdAndCourseId(user.getId(), course.getId());
        if (existingOpt.isPresent()) {
            StudentEnrollment existing = existingOpt.get();
            return new StudentEnrollmentDto(
                    existing.getId(),
                    course.getId(),
                    course.getTitle(),
                    course.getSlug(),
                    course.getTrack(),
                    existing.getStatus().name(),
                    existing.getEnrolledAt()
            );
        }

        StudentEnrollment enrollment = new StudentEnrollment(user, course);
        enrollment = enrollmentRepository.save(enrollment);
        logger.info("Student #{} ('{}') successfully enrolled in course '{}'", user.getId(), user.getEmail(), course.getSlug());

        return new StudentEnrollmentDto(
                enrollment.getId(),
                course.getId(),
                course.getTitle(),
                course.getSlug(),
                course.getTrack(),
                enrollment.getStatus().name(),
                enrollment.getEnrolledAt()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isEnrolled(Long userId, Long courseId) {
        if (userId == null || courseId == null) return false;
        return enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isStudentEnrolled(UserPrincipal principal, String courseSlug) {
        if (principal == null || courseSlug == null) return false;
        Optional<Course> courseOpt = courseRepository.findBySlugAndStatus(courseSlug, PublishStatus.PUBLISHED);
        if (courseOpt.isEmpty()) {
            courseOpt = courseRepository.findBySlug(courseSlug);
        }
        return courseOpt.map(course -> enrollmentRepository.existsByUserIdAndCourseId(principal.getId(), course.getId())).orElse(false);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentEnrollmentDto getEnrollmentStatus(UserPrincipal principal, String courseSlug) {
        if (principal == null) return null;

        Course course = courseRepository.findBySlugAndStatus(courseSlug, PublishStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "slug", courseSlug));

        Optional<StudentEnrollment> existingOpt = enrollmentRepository.findByUserIdAndCourseId(principal.getId(), course.getId());
        return existingOpt.map(existing -> new StudentEnrollmentDto(
                existing.getId(),
                course.getId(),
                course.getTitle(),
                course.getSlug(),
                course.getTrack(),
                existing.getStatus().name(),
                existing.getEnrolledAt()
        )).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDashboardSummaryDto getStudentDashboardSummary(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        List<StudentEnrollment> enrollments = enrollmentRepository.findByUserIdWithCourseOrderByEnrolledAtDesc(user.getId());
        List<EnrolledCourseCardDto> enrolledCourseCards = new ArrayList<>();

        for (StudentEnrollment enrollment : enrollments) {
            Course course = enrollment.getCourse();
            EnrolledCourseCardDto card = buildEnrolledCourseCard(user.getId(), course, enrollment);
            enrolledCourseCards.add(card);
        }

        List<CertificatePublicDto> certificates = certificateRepository.findByUserIdOrderByIssuedAtDesc(user.getId()).stream()
                .map(c -> new CertificatePublicDto(
                        c.getCertificateCode(),
                        c.getStudentFullName(),
                        c.getCourseTitle(),
                        c.getCourse().getSlug(),
                        c.getStatus().name(),
                        c.getStatus() == CertificateStatus.VALID,
                        c.getRevocationReason(),
                        c.getIssuedAt()
                ))
                .collect(Collectors.toList());

        long totalCompletedLessons = progressRepository.countCompletedPublishedLessons(user.getId());
        long totalBookmarks = bookmarkRepository.countByUserId(user.getId());

        StudentDashboardSummaryDto summary = new StudentDashboardSummaryDto();
        summary.setStudentId(user.getId());
        summary.setFullName(user.getFullName());
        summary.setEmail(user.getEmail());
        summary.setAvatarUrl(user.getAvatarUrl());
        summary.setRole(user.getRole().name());
        summary.setTotalEnrolledCourses(enrolledCourseCards.size());
        summary.setTotalCompletedLessons((int) totalCompletedLessons);
        summary.setTotalBookmarks((int) totalBookmarks);
        summary.setTotalCertificatesEarned(certificates.size());
        summary.setEnrolledCourses(enrolledCourseCards);
        summary.setCertificates(certificates);

        return summary;
    }

    private EnrolledCourseCardDto buildEnrolledCourseCard(Long userId, Course course, StudentEnrollment enrollment) {
        EnrolledCourseCardDto card = new EnrolledCourseCardDto();
        card.setCourseId(course.getId());
        card.setCourseTitle(course.getTitle());
        card.setCourseSlug(course.getSlug());
        card.setTrack(course.getTrack());
        card.setCoverImageUrl(course.getCoverImageUrl());
        card.setShortDescription(course.getShortDescription() != null ? course.getShortDescription() : course.getDescription());
        card.setEstimatedHours(course.getEstimatedHours());
        card.setEnrollmentStatus(enrollment.getStatus().name());
        card.setEnrolledAt(enrollment.getEnrolledAt());

        // Total Lessons & Completed in course
        long totalLessons = lessonRepository.countPublishedLessonsByCourseId(course.getId());
        long completedLessons = progressRepository.countCompletedPublishedLessons(userId, course.getId());
        card.setTotalLessons((int) totalLessons);
        card.setCompletedLessons((int) completedLessons);
        int completionPct = totalLessons > 0 ? (int) Math.round(((double) completedLessons / totalLessons) * 100.0) : 0;
        card.setCompletionPercentage(completionPct);

        // Total Quizzes & Passed in course
        long totalQuizzes = quizRepository.countPublishedQuizzesByCourseId(course.getId());
        long passedQuizzes = trackerRepository.countPassedPublishedQuizzesByCourse(userId, course.getId());
        card.setTotalQuizzes((int) totalQuizzes);
        card.setPassedQuizzes((int) passedQuizzes);

        // Certificate status
        boolean isEligible = progressionService.isEligibleForCertificate(userId, course.getId());
        card.setEligibleForCertificate(isEligible);
        Optional<Certificate> certOpt = certificateRepository.findByUserIdAndCourseId(userId, course.getId());
        card.setCertificateCode(certOpt.map(Certificate::getCertificateCode).orElse(null));

        // Subcourses Breakdown
        List<Subcourse> subcourses = subcourseRepository.findByCourseIdAndStatusOrderByOrderIndexAsc(course.getId(), PublishStatus.PUBLISHED);
        List<SubcourseProgressSummaryDto> subcourseDtos = new ArrayList<>();

        for (Subcourse sub : subcourses) {
            SubcourseProgressSummaryDto subDto = new SubcourseProgressSummaryDto();
            subDto.setSubcourseId(sub.getId());
            subDto.setLevel(sub.getCurriculumLevel());
            subDto.setTitle(sub.getTitle());
            subDto.setSlug(sub.getSlug());
            subDto.setOrderIndex(sub.getOrderIndex());
            subDto.setFree(sub.isFree());
            subDto.setPriceInr(sub.getPriceInr());

            // Check if subcourse is unlocked
            List<CourseModule> modules = courseModuleRepository.findBySubcourseIdAndStatusOrderByOrderIndexAsc(sub.getId(), PublishStatus.PUBLISHED);
            boolean isSubUnlocked = modules.isEmpty() || progressionService.isModuleUnlocked(userId, modules.get(0));
            subDto.setUnlocked(isSubUnlocked);

            // Count modules, lessons, quizzes
            subDto.setTotalModules(modules.size());
            int completedModulesCount = 0;
            int totalSubLessons = 0;
            int completedSubLessons = 0;
            int totalSubModuleQuizzes = 0;
            int passedSubModuleQuizzes = 0;

            for (CourseModule mod : modules) {
                List<Lesson> modLessons = lessonRepository.findByModuleIdAndStatusOrderByOrderIndexAsc(mod.getId(), PublishStatus.PUBLISHED);
                totalSubLessons += modLessons.size();
                int modCompletedLessons = 0;
                for (Lesson l : modLessons) {
                    if (progressRepository.findByUserIdAndLessonId(userId, l.getId()).filter(p -> p.getStatus() == LessonProgressStatus.COMPLETED).isPresent()) {
                        modCompletedLessons++;
                        completedSubLessons++;
                    }
                }

                List<Quiz> modQuizzes = quizRepository.findByModuleIdAndStatus(mod.getId(), PublishStatus.PUBLISHED);
                boolean modQuizPassed = true;
                for (Quiz mq : modQuizzes) {
                    if (mq.getQuizType() == QuizType.MODULE_QUIZ) {
                        totalSubModuleQuizzes++;
                        Optional<UserQuizTracker> trk = trackerRepository.findByUserIdAndQuizId(userId, mq.getId());
                        if (trk.isPresent() && trk.get().isHasPassed() && trk.get().getHighestScorePercentage().intValue() >= mq.getMinPassScorePercentage()) {
                            passedSubModuleQuizzes++;
                        } else {
                            modQuizPassed = false;
                        }
                    }
                }

                if (!modLessons.isEmpty() && modCompletedLessons == modLessons.size() && modQuizPassed) {
                    completedModulesCount++;
                }
            }

            subDto.setCompletedModules(completedModulesCount);
            subDto.setTotalLessons(totalSubLessons);
            subDto.setCompletedLessons(completedSubLessons);
            subDto.setTotalModuleQuizzes(totalSubModuleQuizzes);
            subDto.setPassedModuleQuizzes(passedSubModuleQuizzes);

            // Level Final Quiz
            List<Quiz> finalQuizzes = quizRepository.findByCourseIdAndQuizTypeAndCurriculumLevel(course.getId(), QuizType.LEVEL_FINAL_QUIZ, sub.getCurriculumLevel());
            if (!finalQuizzes.isEmpty()) {
                subDto.setHasLevelFinalQuiz(true);
                Quiz fq = finalQuizzes.get(0);
                Optional<UserQuizTracker> finalTracker = trackerRepository.findByUserIdAndQuizId(userId, fq.getId());
                if (finalTracker.isPresent() && finalTracker.get().isHasPassed()) {
                    subDto.setLevelFinalPassed(true);
                    subDto.setLevelFinalScorePercentage(finalTracker.get().getHighestScorePercentage().intValue());
                } else {
                    subDto.setLevelFinalPassed(false);
                    subDto.setLevelFinalScorePercentage(finalTracker.map(t -> t.getHighestScorePercentage().intValue()).orElse(null));
                }
            } else {
                subDto.setHasLevelFinalQuiz(false);
                subDto.setLevelFinalPassed(false);
            }

            subcourseDtos.add(subDto);
        }

        card.setSubcourses(subcourseDtos);
        return card;
    }
}
