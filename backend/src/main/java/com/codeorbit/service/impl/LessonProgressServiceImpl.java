package com.codeorbit.service.impl;

import com.codeorbit.dto.GuestProgressSyncRequestDto;
import com.codeorbit.dto.GuestProgressSyncResponseDto;
import com.codeorbit.dto.UserProgressDto;
import com.codeorbit.entity.*;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.*;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.LessonProgressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LessonProgressServiceImpl implements LessonProgressService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final UserLessonProgressRepository progressRepository;
    private final UserQuizTrackerRepository trackerRepository;
    private final UserCourseBookmarkRepository bookmarkRepository;
    private final CertificateRepository certificateRepository;
    private final com.codeorbit.service.CurriculumProgressionService progressionService;

    public LessonProgressServiceImpl(UserRepository userRepository,
                                     CourseRepository courseRepository,
                                     LessonRepository lessonRepository,
                                     QuizRepository quizRepository,
                                     UserLessonProgressRepository progressRepository,
                                     UserQuizTrackerRepository trackerRepository,
                                     UserCourseBookmarkRepository bookmarkRepository,
                                     CertificateRepository certificateRepository,
                                     com.codeorbit.service.CurriculumProgressionService progressionService) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.quizRepository = quizRepository;
        this.progressRepository = progressRepository;
        this.trackerRepository = trackerRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.certificateRepository = certificateRepository;
        this.progressionService = progressionService;
    }

    @Override
    public void markLessonInProgress(UserPrincipal principal, Long lessonId) {
        User user = getUser(principal);
        Lesson lesson = getLesson(lessonId);

        Optional<UserLessonProgress> existing = progressRepository.findByUserIdAndLessonId(user.getId(), lesson.getId());
        if (existing.isEmpty()) {
            UserLessonProgress progress = new UserLessonProgress(user, lesson, LessonProgressStatus.IN_PROGRESS);
            progressRepository.save(progress);
        }
    }

    @Override
    public void markLessonCompleted(UserPrincipal principal, Long lessonId) {
        User user = getUser(principal);
        Lesson lesson = getLesson(lessonId);

        // Enforce sequential progression check on backend
        progressionService.validateModuleAccess(user.getId(), lesson.getModule());

        UserLessonProgress progress = progressRepository.findByUserIdAndLessonId(user.getId(), lesson.getId())
                .orElseGet(() -> new UserLessonProgress(user, lesson, LessonProgressStatus.COMPLETED));

        progress.setStatus(LessonProgressStatus.COMPLETED);
        progress.setCompletedAt(LocalDateTime.now());
        progressRepository.save(progress);
    }

    @Override
    public boolean toggleLessonBookmark(UserPrincipal principal, Long lessonId) {
        User user = getUser(principal);
        Lesson lesson = getLesson(lessonId);

        Optional<UserCourseBookmark> existing = bookmarkRepository.findByUserIdAndLessonId(user.getId(), lesson.getId());
        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            return false; // unbookmarked
        } else {
            UserCourseBookmark bookmark = new UserCourseBookmark(user, lesson);
            bookmarkRepository.save(bookmark);
            return true; // bookmarked
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserProgressDto getStudentCourseProgress(UserPrincipal principal, String courseSlug) {
        User user = getUser(principal);
        Course course = courseRepository.findBySlugAndStatus(courseSlug, PublishStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with slug: " + courseSlug));

        long totalLessons = lessonRepository.countPublishedLessonsByCourseId(course.getId());
        long completedLessons = progressRepository.countCompletedPublishedLessons(user.getId(), course.getId());
        long totalQuizzes = quizRepository.countPublishedQuizzesByCourseId(course.getId());
        long passedQuizzes = trackerRepository.countPassedPublishedQuizzesByCourse(user.getId(), course.getId());

        int completionPercentage = 0;
        if (totalLessons > 0) {
            completionPercentage = (int) Math.round(((double) completedLessons / totalLessons) * 100.0);
        }

        boolean eligibleForCertificate = progressionService.isEligibleForCertificate(user.getId(), course.getId());

        Optional<Certificate> cert = certificateRepository.findByUserIdAndCourseId(user.getId(), course.getId());

        UserProgressDto dto = new UserProgressDto();
        dto.setCourseId(course.getId());
        dto.setCourseSlug(course.getSlug());
        dto.setCourseTitle(course.getTitle());
        dto.setTotalLessons(totalLessons);
        dto.setCompletedLessons(completedLessons);
        dto.setCompletionPercentage(completionPercentage);
        dto.setTotalQuizzes(totalQuizzes);
        dto.setPassedQuizzes(passedQuizzes);
        dto.setEligibleForCertificate(eligibleForCertificate);
        cert.ifPresent(c -> dto.setCertificateCode(c.getCertificateCode()));

        dto.setCompletedLessonIds(progressRepository.findCompletedLessonIdsByUserIdAndCourseId(user.getId(), course.getId()));
        dto.setBookmarkedLessonIds(bookmarkRepository.findBookmarkedLessonIdsByUserId(user.getId()));

        return dto;
    }

    @Override
    public GuestProgressSyncResponseDto syncGuestProgress(UserPrincipal principal, GuestProgressSyncRequestDto request) {
        User user = getUser(principal);
        GuestProgressSyncResponseDto response = new GuestProgressSyncResponseDto();

        int newLessons = 0;
        if (request.getCompletedLessonIds() != null) {
            for (Long lessonId : request.getCompletedLessonIds()) {
                Optional<Lesson> lessonOpt = lessonRepository.findById(lessonId);
                if (lessonOpt.isPresent() && lessonOpt.get().getStatus() == PublishStatus.PUBLISHED) {
                    Optional<UserLessonProgress> existing = progressRepository.findByUserIdAndLessonId(user.getId(), lessonId);
                    if (existing.isEmpty() || existing.get().getStatus() != LessonProgressStatus.COMPLETED) {
                        UserLessonProgress progress = existing.orElseGet(() -> new UserLessonProgress(user, lessonOpt.get(), LessonProgressStatus.COMPLETED));
                        progress.setStatus(LessonProgressStatus.COMPLETED);
                        progress.setCompletedAt(LocalDateTime.now());
                        progressRepository.save(progress);
                        newLessons++;
                    }
                }
            }
        }
        response.setNewLessonsCompleted(newLessons);

        int newBookmarks = 0;
        if (request.getBookmarkedLessonIds() != null) {
            for (Long lessonId : request.getBookmarkedLessonIds()) {
                Optional<Lesson> lessonOpt = lessonRepository.findById(lessonId);
                if (lessonOpt.isPresent()) {
                    Optional<UserCourseBookmark> existing = bookmarkRepository.findByUserIdAndLessonId(user.getId(), lessonId);
                    if (existing.isEmpty()) {
                        bookmarkRepository.save(new UserCourseBookmark(user, lessonOpt.get()));
                        newBookmarks++;
                    }
                }
            }
        }
        response.setNewBookmarksAdded(newBookmarks);

        // Populate complete totals
        List<UserLessonProgress> allProgress = progressRepository.findByUserId(user.getId());
        List<Long> totalCompleted = allProgress.stream()
                .filter(p -> p.getStatus() == LessonProgressStatus.COMPLETED)
                .map(p -> p.getLesson().getId())
                .toList();
        response.setTotalCompletedLessonIds(totalCompleted);
        response.setTotalBookmarkedLessonIds(bookmarkRepository.findBookmarkedLessonIdsByUserId(user.getId()));

        return response;
    }

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + principal.getId()));
    }

    private Lesson getLesson(Long lessonId) {
        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));
    }
}
