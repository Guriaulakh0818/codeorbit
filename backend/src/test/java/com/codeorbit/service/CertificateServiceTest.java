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
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
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
    @DisplayName("claimCourseCertificate - Success when 100% lessons completed and all quizzes passed")
    void testClaimCertificateSuccess() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(courseRepository.findBySlugAndStatus("dsa", PublishStatus.PUBLISHED)).thenReturn(Optional.of(course));
        when(certificateRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.empty());

        when(lessonRepository.countPublishedLessonsByCourseId(1L)).thenReturn(10L);
        when(progressRepository.countCompletedPublishedLessons(10L, 1L)).thenReturn(10L);

        when(quizRepository.countPublishedQuizzesByCourseId(1L)).thenReturn(2L);
        when(trackerRepository.countPassedPublishedQuizzesByCourse(10L, 1L)).thenReturn(2L);

        when(certificateRepository.existsByCertificateCode(anyString())).thenReturn(false);
        when(certificateRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        CertificatePublicDto result = certificateService.claimCourseCertificate(principal, "dsa");
        assertNotNull(result);
        assertEquals("Aman Sharma", result.getStudentFullName());
        assertEquals("DSA Track", result.getCourseTitle());
        assertTrue(result.isValid());
    }

    @Test
    @DisplayName("claimCourseCertificate - Rejects when lessons incomplete")
    void testClaimCertificateIncompleteLessons() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(courseRepository.findBySlugAndStatus("dsa", PublishStatus.PUBLISHED)).thenReturn(Optional.of(course));
        when(certificateRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.empty());

        when(lessonRepository.countPublishedLessonsByCourseId(1L)).thenReturn(10L);
        when(progressRepository.countCompletedPublishedLessons(10L, 1L)).thenReturn(7L); // only 7 of 10 done

        assertThrows(BadRequestException.class, () -> certificateService.claimCourseCertificate(principal, "dsa"));
    }
}
