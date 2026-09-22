package com.codeorbit.controller;

import com.codeorbit.dto.*;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.CertificateService;
import com.codeorbit.service.LessonProgressService;
import com.codeorbit.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentLearningController {

    private final LessonProgressService progressService;
    private final QuizService quizService;
    private final CertificateService certificateService;
    private final com.codeorbit.service.StudentEnrollmentService studentEnrollmentService;

    public StudentLearningController(LessonProgressService progressService,
                                     QuizService quizService,
                                     CertificateService certificateService,
                                     com.codeorbit.service.StudentEnrollmentService studentEnrollmentService) {
        this.progressService = progressService;
        this.quizService = quizService;
        this.certificateService = certificateService;
        this.studentEnrollmentService = studentEnrollmentService;
    }

    /**
     * POST /api/student/progress/in-progress
     * Records that a student started viewing a lesson.
     */
    @PostMapping("/progress/in-progress")
    public ResponseEntity<ApiResponse<String>> markLessonInProgress(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody LessonProgressUpdateDto request
    ) {
        progressService.markLessonInProgress(principal, request.getLessonId());
        return ResponseEntity.ok(ApiResponse.success("Lesson marked in-progress", null));
    }

    /**
     * POST /api/student/progress/complete
     * Explicit action marking a lesson completed.
     */
    @PostMapping("/progress/complete")
    public ResponseEntity<ApiResponse<String>> markLessonCompleted(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody LessonProgressUpdateDto request
    ) {
        progressService.markLessonCompleted(principal, request.getLessonId());
        return ResponseEntity.ok(ApiResponse.success("Lesson marked completed", null));
    }

    /**
     * POST /api/student/progress/bookmark
     * Toggles bookmark for a lesson.
     */
    @PostMapping("/progress/bookmark")
    public ResponseEntity<ApiResponse<Boolean>> toggleBookmark(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody LessonProgressUpdateDto request
    ) {
        boolean bookmarked = progressService.toggleLessonBookmark(principal, request.getLessonId());
        return ResponseEntity.ok(ApiResponse.success(bookmarked ? "Lesson bookmarked" : "Bookmark removed", bookmarked));
    }

    /**
     * GET /api/student/progress/{courseSlug}
     * Returns learner's progress percentage, completed lesson IDs, and certificate eligibility.
     */
    @GetMapping("/progress/{courseSlug}")
    public ResponseEntity<ApiResponse<UserProgressDto>> getCourseProgress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String courseSlug
    ) {
        UserProgressDto progress = progressService.getStudentCourseProgress(principal, courseSlug);
        return ResponseEntity.ok(ApiResponse.success(progress));
    }

    /**
     * POST /api/student/progress/sync
     * Synchronizes guest/local progress upon login via union-merge strategy.
     */
    @PostMapping("/progress/sync")
    public ResponseEntity<ApiResponse<GuestProgressSyncResponseDto>> syncGuestProgress(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody GuestProgressSyncRequestDto request
    ) {
        GuestProgressSyncResponseDto response = progressService.syncGuestProgress(principal, request);
        return ResponseEntity.ok(ApiResponse.success("Guest progress synchronized successfully", response));
    }

    /**
     * POST /api/student/quizzes/{quizId}/submit
     * Submits an attempt for a quiz with server-side validation, 80% pass rule, and atomic logging.
     */
    @PostMapping("/quizzes/{quizId}/submit")
    public ResponseEntity<ApiResponse<QuizSubmissionResultDto>> submitQuizAttempt(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long quizId,
            @Valid @RequestBody QuizSubmissionRequestDto request
    ) {
        QuizSubmissionResultDto result = quizService.submitQuizAttempt(principal, quizId, request);
        return ResponseEntity.ok(ApiResponse.success("Quiz attempt evaluated successfully", result));
    }

    /**
     * GET /api/student/quizzes/{quizId}/attempts
     * Retrieves past attempts with full audit snapshot data.
     */
    @GetMapping("/quizzes/{quizId}/attempts")
    public ResponseEntity<ApiResponse<List<QuizSubmissionResultDto>>> getQuizAttempts(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long quizId
    ) {
        List<QuizSubmissionResultDto> attempts = quizService.getStudentQuizAttempts(principal, quizId);
        return ResponseEntity.ok(ApiResponse.success(attempts));
    }

    /**
     * POST /api/student/certificates/claim/{courseSlug}
     * Validates 100% course completion and issues verifiable certificate.
     */
    @PostMapping("/certificates/claim/{courseSlug}")
    public ResponseEntity<ApiResponse<CertificatePublicDto>> claimCertificate(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String courseSlug
    ) {
        CertificatePublicDto certificate = certificateService.claimCourseCertificate(principal, courseSlug);
        return ResponseEntity.ok(ApiResponse.success("Certificate issued successfully! 🎉", certificate));
    }

    /**
     * GET /api/student/certificates
     * Returns list of all certificates earned by student.
     */
    @GetMapping("/certificates")
    public ResponseEntity<ApiResponse<List<CertificatePublicDto>>> getStudentCertificates(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<CertificatePublicDto> certificates = certificateService.getStudentCertificates(principal);
        return ResponseEntity.ok(ApiResponse.success(certificates));
    }

    /**
     * POST /api/student/courses/{courseSlug}/enroll
     * Explicitly enrolls the authenticated student into the specified subject/course.
     */
    @PostMapping("/courses/{courseSlug}/enroll")
    public ResponseEntity<ApiResponse<StudentEnrollmentDto>> enrollInCourse(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String courseSlug
    ) {
        StudentEnrollmentDto enrollment = studentEnrollmentService.enrollInCourse(principal, courseSlug);
        return ResponseEntity.ok(ApiResponse.success("Successfully enrolled in course", enrollment));
    }

    /**
     * GET /api/student/courses/{courseSlug}/enrollment-status
     * Checks whether the authenticated student is actively enrolled in the specified subject/course.
     */
    @GetMapping("/courses/{courseSlug}/enrollment-status")
    public ResponseEntity<ApiResponse<Boolean>> getEnrollmentStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String courseSlug
    ) {
        boolean isEnrolled = studentEnrollmentService.isStudentEnrolled(principal, courseSlug);
        return ResponseEntity.ok(ApiResponse.success(isEnrolled));
    }

    /**
     * GET /api/student/dashboard
     * Returns personal enrolled-only learning metrics, course cards, 4-level progress, and quick resume link.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<StudentDashboardSummaryDto>> getStudentDashboard(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        StudentDashboardSummaryDto dashboard = studentEnrollmentService.getStudentDashboardSummary(principal);
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }
}
