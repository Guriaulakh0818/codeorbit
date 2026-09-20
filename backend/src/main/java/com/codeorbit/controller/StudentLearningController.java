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

    public StudentLearningController(LessonProgressService progressService,
                                     QuizService quizService,
                                     CertificateService certificateService) {
        this.progressService = progressService;
        this.quizService = quizService;
        this.certificateService = certificateService;
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
}
