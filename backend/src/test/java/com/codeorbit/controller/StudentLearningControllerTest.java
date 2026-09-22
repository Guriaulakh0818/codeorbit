package com.codeorbit.controller;

import com.codeorbit.dto.*;
import com.codeorbit.service.CertificateService;
import com.codeorbit.service.LessonProgressService;
import com.codeorbit.service.QuizService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudentLearningController.class)
@AutoConfigureMockMvc(addFilters = false)
class StudentLearningControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private LessonProgressService progressService;

    @MockBean
    private QuizService quizService;

    @MockBean
    private CertificateService certificateService;

    @MockBean
    private com.codeorbit.service.StudentEnrollmentService studentEnrollmentService;

    @Test
    @DisplayName("POST /api/student/progress/complete - Marks lesson complete")
    void testMarkLessonCompleted() throws Exception {
        LessonProgressUpdateDto req = new LessonProgressUpdateDto(100L, true);

        mockMvc.perform(post("/api/student/progress/complete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("POST /api/student/quizzes/{id}/submit - Evaluates quiz with 80% pass rule")
    void testSubmitQuizAttempt() throws Exception {
        QuizSubmissionRequestDto req = new QuizSubmissionRequestDto("en", List.of(
                new QuizAnswerSubmissionDto(1L, "opt_b"),
                new QuizAnswerSubmissionDto(2L, "opt_b")
        ));

        QuizSubmissionResultDto result = new QuizSubmissionResultDto();
        result.setAttemptId(1L);
        result.setQuizId(5L);
        result.setQuizTitle("Module 1 Assessment");
        result.setAttemptNumber(1);
        result.setTotalQuestions(2);
        result.setCorrectAnswers(2);
        result.setScorePercentage(new BigDecimal("100.00"));
        result.setPassThresholdPercentage(80);
        result.setPassed(true);
        result.setSubmittedAt(LocalDateTime.now());

        when(quizService.submitQuizAttempt(any(), eq(5L), any())).thenReturn(result);

        mockMvc.perform(post("/api/student/quizzes/5/submit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.passed").value(true))
                .andExpect(jsonPath("$.data.scorePercentage").value(100.00));
    }

    @Test
    @DisplayName("POST /api/student/certificates/claim/{slug} - Issues verifiable certificate upon 100% completion")
    void testClaimCertificate() throws Exception {
        CertificatePublicDto cert = new CertificatePublicDto(
                "CO-DSA-2026-9A7F2B",
                "Aman Sharma",
                "Data Structures & Algorithms (DSA) Master Track",
                "dsa",
                "VALID",
                true,
                null,
                LocalDateTime.now()
        );

        when(certificateService.claimCourseCertificate(any(), eq("dsa"))).thenReturn(cert);

        mockMvc.perform(post("/api/student/certificates/claim/dsa"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.certificateCode").value("CO-DSA-2026-9A7F2B"));
    }

    @Test
    @DisplayName("GET /api/student/progress/{courseSlug} - Returns student course progress summary")
    void testGetCourseProgress() throws Exception {
        UserProgressDto progress = new UserProgressDto();
        progress.setCourseId(1L);
        progress.setCourseSlug("dsa");
        progress.setTotalLessons(10);
        progress.setCompletedLessons(8);
        progress.setCompletionPercentage(80);
        progress.setEligibleForCertificate(false);

        when(progressService.getStudentCourseProgress(any(), eq("dsa"))).thenReturn(progress);

        mockMvc.perform(get("/api/student/progress/dsa"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.completionPercentage").value(80));
    }

    @Test
    @DisplayName("POST /api/student/courses/{slug}/enroll - Enrolls student into course")
    void testEnrollInCourse() throws Exception {
        StudentEnrollmentDto enrollmentDto = new StudentEnrollmentDto();
        enrollmentDto.setId(101L);
        enrollmentDto.setCourseId(1L);
        enrollmentDto.setCourseSlug("dsa");
        enrollmentDto.setCourseTitle("Data Structures & Algorithms");
        enrollmentDto.setStatus("ACTIVE");

        when(studentEnrollmentService.enrollInCourse(any(), eq("dsa"))).thenReturn(enrollmentDto);

        mockMvc.perform(post("/api/student/courses/dsa/enroll"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.courseSlug").value("dsa"))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"));
    }

    @Test
    @DisplayName("GET /api/student/courses/{slug}/enrollment-status - Returns enrollment status")
    void testGetEnrollmentStatus() throws Exception {
        when(studentEnrollmentService.isStudentEnrolled(any(), eq("dsa"))).thenReturn(true);

        mockMvc.perform(get("/api/student/courses/dsa/enrollment-status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value(true));
    }

    @Test
    @DisplayName("GET /api/student/dashboard - Returns enrolled student dashboard metrics")
    void testGetStudentDashboard() throws Exception {
        StudentDashboardSummaryDto summary = new StudentDashboardSummaryDto();
        summary.setTotalEnrolledCourses(1);
        summary.setTotalCompletedLessons(10);
        summary.setTotalBookmarks(2);
        summary.setTotalCertificatesEarned(0);

        when(studentEnrollmentService.getStudentDashboardSummary(any())).thenReturn(summary);

        mockMvc.perform(get("/api/student/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalEnrolledCourses").value(1));
    }
}
