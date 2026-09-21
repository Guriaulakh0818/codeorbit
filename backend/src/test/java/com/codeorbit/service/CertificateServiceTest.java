package com.codeorbit.service;

import com.codeorbit.dto.CertificatePublicDto;
import com.codeorbit.entity.*;
import com.codeorbit.exception.BadRequestException;
import com.codeorbit.repository.*;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.impl.CertificateServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collection;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CertificateServiceTest {

    @Mock
    private CertificateRepository certificateRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private UserLessonProgressRepository progressRepository;

    @Mock
    private UserQuizTrackerRepository trackerRepository;

    @InjectMocks
    private CertificateServiceImpl certificateService;

    private User user;
    private Course course;
    private UserPrincipal principal;

    @BeforeEach
    void setUp() {
        user = new User("Aman Sharma", "aman@student.edu", "hash", Role.STUDENT);
        user.setId(10L);

        course = new Course("DSA Track", "dsa", "Master DSA", "Short", "DSA", "BEGINNER", 35, 1, PublishStatus.PUBLISHED);
        course.setId(1L);

        principal = UserPrincipal.create(user);
    }

    @Test
    @DisplayName("claimCourseCertificate - Success when 100% lessons completed and all quizzes passed across required levels")
    void testClaimCertificateSuccess() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(courseRepository.findBySlugAndStatus("dsa", PublishStatus.PUBLISHED)).thenReturn(Optional.of(course));
        when(certificateRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.empty());

        when(lessonRepository.countPublishedLessonsByCourseIdAndLevels(anyLong(), any())).thenReturn(10L);
        when(progressRepository.countCompletedPublishedLessonsByLevels(anyLong(), anyLong(), any())).thenReturn(10L);

        when(quizRepository.countPublishedQuizzesByCourseIdAndLevels(anyLong(), any())).thenReturn(2L);
        when(trackerRepository.countPassedPublishedQuizzesByCourseAndLevels(anyLong(), anyLong(), any())).thenReturn(2L);

        when(certificateRepository.existsByCertificateCode(anyString())).thenReturn(false);
        when(certificateRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        CertificatePublicDto result = certificateService.claimCourseCertificate(principal, "dsa");
        assertNotNull(result);
        assertEquals("Aman Sharma", result.getStudentFullName());
        assertEquals("DSA Track", result.getCourseTitle());
        assertTrue(result.isValid());
    }

    @Test
    @DisplayName("claimCourseCertificate - Rejects when lessons incomplete across required levels")
    void testClaimCertificateIncompleteLessons() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(courseRepository.findBySlugAndStatus("dsa", PublishStatus.PUBLISHED)).thenReturn(Optional.of(course));
        when(certificateRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.empty());

        when(lessonRepository.countPublishedLessonsByCourseIdAndLevels(anyLong(), any())).thenReturn(10L);
        when(progressRepository.countCompletedPublishedLessonsByLevels(anyLong(), anyLong(), any())).thenReturn(7L); // only 7 of 10 done

        assertThrows(BadRequestException.class, () -> certificateService.claimCourseCertificate(principal, "dsa"));
    }

    @Test
    @DisplayName("claimCourseCertificate - Placement Ready incomplete content does NOT block certificate when Beginner, Intermediate, and Advanced are complete")
    @SuppressWarnings("unchecked")
    void testClaimCertificate_PlacementReadyIncomplete_StillEligible() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(courseRepository.findBySlugAndStatus("dsa", PublishStatus.PUBLISHED)).thenReturn(Optional.of(course));
        when(certificateRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.empty());

        // Required levels (Beginner, Intermediate, Advanced) are 100% completed
        when(lessonRepository.countPublishedLessonsByCourseIdAndLevels(anyLong(), any())).thenReturn(15L);
        when(progressRepository.countCompletedPublishedLessonsByLevels(anyLong(), anyLong(), any())).thenReturn(15L);

        when(quizRepository.countPublishedQuizzesByCourseIdAndLevels(anyLong(), any())).thenReturn(4L);
        when(trackerRepository.countPassedPublishedQuizzesByCourseAndLevels(anyLong(), anyLong(), any())).thenReturn(4L);

        when(certificateRepository.existsByCertificateCode(anyString())).thenReturn(false);
        when(certificateRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        CertificatePublicDto result = certificateService.claimCourseCertificate(principal, "dsa");
        assertNotNull(result);
        assertEquals("Aman Sharma", result.getStudentFullName());
        assertTrue(result.isValid(), "Should issue certificate despite Placement Ready incompleteness");

        // Verify exact levels passed to lesson and quiz repositories
        ArgumentCaptor<Collection<CurriculumLevel>> lessonLevelsCaptor = ArgumentCaptor.forClass(Collection.class);
        verify(lessonRepository).countPublishedLessonsByCourseIdAndLevels(eq(1L), lessonLevelsCaptor.capture());
        Collection<CurriculumLevel> capturedLessonLevels = lessonLevelsCaptor.getValue();
        assertEquals(3, capturedLessonLevels.size());
        assertTrue(capturedLessonLevels.contains(CurriculumLevel.BEGINNER));
        assertTrue(capturedLessonLevels.contains(CurriculumLevel.INTERMEDIATE));
        assertTrue(capturedLessonLevels.contains(CurriculumLevel.ADVANCED));
        assertFalse(capturedLessonLevels.contains(CurriculumLevel.PLACEMENT_READY));

        ArgumentCaptor<Collection<CurriculumLevel>> quizLevelsCaptor = ArgumentCaptor.forClass(Collection.class);
        verify(quizRepository).countPublishedQuizzesByCourseIdAndLevels(eq(1L), quizLevelsCaptor.capture());
        Collection<CurriculumLevel> capturedQuizLevels = quizLevelsCaptor.getValue();
        assertEquals(3, capturedQuizLevels.size());
        assertTrue(capturedQuizLevels.contains(CurriculumLevel.BEGINNER));
        assertTrue(capturedQuizLevels.contains(CurriculumLevel.INTERMEDIATE));
        assertTrue(capturedQuizLevels.contains(CurriculumLevel.ADVANCED));
        assertFalse(capturedQuizLevels.contains(CurriculumLevel.PLACEMENT_READY));
    }

    @Test
    @DisplayName("claimCourseCertificate - Rejects when an Advanced level quiz is not passed")
    @SuppressWarnings("unchecked")
    void testClaimCertificate_AdvancedLevelQuizFailed_Rejects() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(courseRepository.findBySlugAndStatus("dsa", PublishStatus.PUBLISHED)).thenReturn(Optional.of(course));
        when(certificateRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.empty());

        when(lessonRepository.countPublishedLessonsByCourseIdAndLevels(anyLong(), any())).thenReturn(15L);
        when(progressRepository.countCompletedPublishedLessonsByLevels(anyLong(), anyLong(), any())).thenReturn(15L);

        // 4 quizzes across required levels (e.g. 3 module quizzes + 1 Advanced level final), but student passed only 3
        when(quizRepository.countPublishedQuizzesByCourseIdAndLevels(anyLong(), any())).thenReturn(4L);
        when(trackerRepository.countPassedPublishedQuizzesByCourseAndLevels(anyLong(), anyLong(), any())).thenReturn(3L);

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> certificateService.claimCourseCertificate(principal, "dsa"));
        assertTrue(ex.getMessage().contains("required module/level final quiz(zes) have not met the passing threshold"));

        // Verify that the query enforced the Advanced level
        ArgumentCaptor<Collection<CurriculumLevel>> trackerLevelsCaptor = ArgumentCaptor.forClass(Collection.class);
        verify(trackerRepository).countPassedPublishedQuizzesByCourseAndLevels(eq(10L), eq(1L), trackerLevelsCaptor.capture());
        Collection<CurriculumLevel> capturedTrackerLevels = trackerLevelsCaptor.getValue();
        assertTrue(capturedTrackerLevels.contains(CurriculumLevel.ADVANCED), "Must include ADVANCED in passed quiz verification");
        assertFalse(capturedTrackerLevels.contains(CurriculumLevel.PLACEMENT_READY), "Must NOT include PLACEMENT_READY in required checks");
    }
}
