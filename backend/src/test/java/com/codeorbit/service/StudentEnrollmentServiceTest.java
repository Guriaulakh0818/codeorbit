package com.codeorbit.service;

import com.codeorbit.dto.StudentDashboardSummaryDto;
import com.codeorbit.dto.StudentEnrollmentDto;
import com.codeorbit.entity.*;
import com.codeorbit.repository.*;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.impl.StudentEnrollmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentEnrollmentServiceTest {

    @Mock
    private StudentEnrollmentRepository enrollmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private SubcourseRepository subcourseRepository;

    @Mock
    private CourseModuleRepository courseModuleRepository;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private UserLessonProgressRepository progressRepository;

    @Mock
    private UserCourseBookmarkRepository bookmarkRepository;

    @Mock
    private UserQuizTrackerRepository trackerRepository;

    @Mock
    private CertificateRepository certificateRepository;

    @Mock
    private CurriculumProgressionService progressionService;

    private StudentEnrollmentService enrollmentService;

    private UserPrincipal studentPrincipal;
    private User studentUser;
    private Course dsaCourse;

    @BeforeEach
    void setUp() {
        enrollmentService = new StudentEnrollmentServiceImpl(
                enrollmentRepository,
                userRepository,
                courseRepository,
                subcourseRepository,
                courseModuleRepository,
                lessonRepository,
                quizRepository,
                progressRepository,
                bookmarkRepository,
                trackerRepository,
                certificateRepository,
                progressionService
        );

        studentPrincipal = new UserPrincipal(201L, "Student User", "student@codeorbit.dev", "hash", Role.STUDENT, true);

        studentUser = new User();
        studentUser.setId(201L);
        studentUser.setEmail("student@codeorbit.dev");
        studentUser.setFullName("Student User");

        dsaCourse = new Course();
        dsaCourse.setId(1L);
        dsaCourse.setTitle("Data Structures & Algorithms");
        dsaCourse.setSlug("dsa");
        dsaCourse.setStatus(PublishStatus.PUBLISHED);
        dsaCourse.setTrack("DSA");
    }

    @Test
    @DisplayName("enrollInCourse: Creates new enrollment for authenticated student")
    void testEnrollInCourse_Success() {
        when(userRepository.findById(201L)).thenReturn(Optional.of(studentUser));
        when(courseRepository.findBySlugAndStatus("dsa", PublishStatus.PUBLISHED)).thenReturn(Optional.of(dsaCourse));
        when(enrollmentRepository.findByUserIdAndCourseId(201L, 1L)).thenReturn(Optional.empty());

        StudentEnrollment savedEnrollment = new StudentEnrollment(studentUser, dsaCourse);
        savedEnrollment.setId(5001L);
        when(enrollmentRepository.save(any(StudentEnrollment.class))).thenReturn(savedEnrollment);

        StudentEnrollmentDto result = enrollmentService.enrollInCourse(studentPrincipal, "dsa");

        assertNotNull(result);
        assertEquals(5001L, result.getId());
        assertEquals("dsa", result.getCourseSlug());
        assertEquals("Data Structures & Algorithms", result.getCourseTitle());
        assertEquals("ACTIVE", result.getStatus());
        verify(enrollmentRepository).save(any(StudentEnrollment.class));
    }

    @Test
    @DisplayName("enrollInCourse: Idempotent when already enrolled")
    void testEnrollInCourse_AlreadyEnrolled_Idempotent() {
        when(userRepository.findById(201L)).thenReturn(Optional.of(studentUser));
        when(courseRepository.findBySlugAndStatus("dsa", PublishStatus.PUBLISHED)).thenReturn(Optional.of(dsaCourse));

        StudentEnrollment existing = new StudentEnrollment(studentUser, dsaCourse);
        existing.setId(5001L);
        when(enrollmentRepository.findByUserIdAndCourseId(201L, 1L)).thenReturn(Optional.of(existing));

        StudentEnrollmentDto result = enrollmentService.enrollInCourse(studentPrincipal, "dsa");

        assertNotNull(result);
        assertEquals(5001L, result.getId());
        verify(enrollmentRepository, never()).save(any());
    }

    @Test
    @DisplayName("isStudentEnrolled: Returns true only when active enrollment exists")
    void testIsStudentEnrolled() {
        when(courseRepository.findBySlugAndStatus("dsa", PublishStatus.PUBLISHED)).thenReturn(Optional.of(dsaCourse));
        when(enrollmentRepository.existsByUserIdAndCourseId(201L, 1L)).thenReturn(true);

        boolean enrolled = enrollmentService.isStudentEnrolled(studentPrincipal, "dsa");
        assertTrue(enrolled);

        when(enrollmentRepository.existsByUserIdAndCourseId(201L, 1L)).thenReturn(false);
        boolean notEnrolled = enrollmentService.isStudentEnrolled(studentPrincipal, "dsa");
        assertFalse(notEnrolled);
    }

    @Test
    @DisplayName("getStudentDashboardSummary: Isolates enrolled-only subjects and computes 4-level progress breakdown")
    void testGetStudentDashboardSummary_EnrolledIsolationAnd4LevelBreakdown() {
        StudentEnrollment enrollment = new StudentEnrollment(studentUser, dsaCourse);
        enrollment.setId(9001L);

        when(userRepository.findById(201L)).thenReturn(Optional.of(studentUser));
        when(enrollmentRepository.findByUserIdWithCourseOrderByEnrolledAtDesc(201L)).thenReturn(List.of(enrollment));
        when(certificateRepository.findByUserIdOrderByIssuedAtDesc(201L)).thenReturn(List.of());
        when(progressRepository.countCompletedPublishedLessons(201L)).thenReturn(4L);
        when(bookmarkRepository.countByUserId(201L)).thenReturn(2L);

        when(lessonRepository.countPublishedLessonsByCourseId(1L)).thenReturn(16L);
        when(progressRepository.countCompletedPublishedLessons(201L, 1L)).thenReturn(4L);
        when(quizRepository.countPublishedQuizzesByCourseId(1L)).thenReturn(5L);
        when(trackerRepository.countPassedPublishedQuizzesByCourse(201L, 1L)).thenReturn(2L);
        when(progressionService.isEligibleForCertificate(201L, 1L)).thenReturn(false);
        when(certificateRepository.findByUserIdAndCourseId(201L, 1L)).thenReturn(Optional.empty());

        // Subcourse setup using setters
        Subcourse beginner = new Subcourse();
        beginner.setId(10L);
        beginner.setCourse(dsaCourse);
        beginner.setCurriculumLevel(CurriculumLevel.BEGINNER);
        beginner.setTitle("DSA Beginner");
        beginner.setSlug("dsa-beginner");
        beginner.setDescription("Beginner");
        beginner.setPriceInr(0);
        beginner.setFree(true);
        beginner.setOrderIndex(1);
        beginner.setStatus(PublishStatus.PUBLISHED);

        when(subcourseRepository.findByCourseIdAndStatusOrderByOrderIndexAsc(1L, PublishStatus.PUBLISHED)).thenReturn(List.of(beginner));

        CourseModule mod1 = new CourseModule();
        mod1.setId(101L);
        mod1.setCourse(dsaCourse);
        mod1.setSubcourse(beginner);
        mod1.setTitle("Mod 1");
        mod1.setSlug("mod-1");
        mod1.setDescription("Desc");
        mod1.setOrderIndex(1);
        mod1.setStatus(PublishStatus.PUBLISHED);
        mod1.setCurriculumLevel(CurriculumLevel.BEGINNER);

        when(courseModuleRepository.findBySubcourseIdAndStatusOrderByOrderIndexAsc(10L, PublishStatus.PUBLISHED)).thenReturn(List.of(mod1));
        when(progressionService.isModuleUnlocked(201L, mod1)).thenReturn(true);

        Lesson l1 = new Lesson();
        l1.setId(1001L);
        l1.setModule(mod1);
        l1.setTitle("L1");
        l1.setSlug("l1");
        l1.setContentEn("Content");
        l1.setEstimatedMinutes(10);
        l1.setOrderIndex(1);
        l1.setStatus(PublishStatus.PUBLISHED);

        when(lessonRepository.findByModuleIdAndStatusOrderByOrderIndexAsc(101L, PublishStatus.PUBLISHED)).thenReturn(List.of(l1));
        UserLessonProgress progress = new UserLessonProgress(studentUser, l1, LessonProgressStatus.COMPLETED);
        when(progressRepository.findByUserIdAndLessonId(201L, 1001L)).thenReturn(Optional.of(progress));

        Quiz q1 = new Quiz();
        q1.setId(2001L);
        q1.setModule(mod1);
        q1.setSubcourse(beginner);
        q1.setTitle("Q1");
        q1.setSlug("q1");
        q1.setDescription("Desc");
        q1.setMinPassScorePercentage(80);
        q1.setMaxAttempts(5);
        q1.setStatus(PublishStatus.PUBLISHED);
        q1.setQuizType(QuizType.MODULE_QUIZ);
        q1.setCurriculumLevel(CurriculumLevel.BEGINNER);

        when(quizRepository.findByModuleIdAndStatus(101L, PublishStatus.PUBLISHED)).thenReturn(List.of(q1));

        UserQuizTracker trk = new UserQuizTracker(studentUser, q1);
        trk.setHasPassed(true);
        trk.setHighestScorePercentage(new BigDecimal("100.00"));
        when(trackerRepository.findByUserIdAndQuizId(201L, 2001L)).thenReturn(Optional.of(trk));

        when(quizRepository.findByCourseIdAndQuizTypeAndCurriculumLevel(1L, QuizType.LEVEL_FINAL_QUIZ, CurriculumLevel.BEGINNER)).thenReturn(List.of());

        StudentDashboardSummaryDto summary = enrollmentService.getStudentDashboardSummary(studentPrincipal);

        assertNotNull(summary);
        assertEquals(1, summary.getTotalEnrolledCourses());
        assertEquals(4, summary.getTotalCompletedLessons());
        assertEquals(2, summary.getTotalBookmarks());
        assertEquals(0, summary.getTotalCertificatesEarned());
        assertEquals(1, summary.getEnrolledCourses().size());

        var enrolledCard = summary.getEnrolledCourses().get(0);
        assertEquals("Data Structures & Algorithms", enrolledCard.getCourseTitle());
        assertEquals("dsa", enrolledCard.getCourseSlug());
        assertEquals(25, enrolledCard.getCompletionPercentage()); // 4 of 16 lessons = 25%

        assertEquals(1, enrolledCard.getSubcourses().size());
        var subcourse = enrolledCard.getSubcourses().get(0);
        assertEquals("BEGINNER", subcourse.getLevel().name());
        assertEquals(1, subcourse.getTotalLessons());
        assertEquals(1, subcourse.getCompletedLessons());
        assertEquals(1, subcourse.getPassedModuleQuizzes());
    }
}
