package com.codeorbit.controller;

import com.codeorbit.dto.*;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.CertificateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificates")
public class CertificateVerificationController {

    private final CertificateService certificateService;

    public CertificateVerificationController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    /**
     * GET /api/certificates/verify/{certificateCode}
     * Public verification endpoint returning solely non-sensitive credential verification data.
     */
    @GetMapping("/verify/{certificateCode}")
    public ResponseEntity<ApiResponse<CertificatePublicDto>> verifyCertificate(
            @PathVariable String certificateCode
    ) {
        CertificatePublicDto cert = certificateService.verifyCertificate(certificateCode);
        return ResponseEntity.ok(ApiResponse.success("Certificate verified", cert));
    }

    /**
     * GET /api/certificates/{courseSlug}/status or /api/certificates/status/{courseSlug}
     * Checks server-side certificate eligibility and payment status for authenticated student.
     */
    @GetMapping({"/status/{courseSlug}", "/{courseSlug}/status"})
    public ResponseEntity<ApiResponse<CertificateStatusDto>> getCertificateStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String courseSlug
    ) {
        CertificateStatusDto status = certificateService.getCertificateStatus(principal, courseSlug);
        return ResponseEntity.ok(ApiResponse.success(status));
    }

    /**
     * POST /api/certificates/{courseSlug}/order
     * Creates a ₹9 Razorpay payment order for eligible students.
     */
    @PostMapping("/{courseSlug}/order")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<CertificateOrderResponseDto>> createCertificateOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String courseSlug
    ) {
        CertificateOrderResponseDto order = certificateService.createCertificateOrder(principal, courseSlug);
        return ResponseEntity.ok(ApiResponse.success("Certificate order created successfully", order));
    }

    /**
     * POST /api/certificates/{courseSlug}/verify
     * Verifies Razorpay HMAC-SHA256 payment signature and issues certificate idempotently.
     */
    @PostMapping("/{courseSlug}/verify")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<CertificatePublicDto>> verifyCertificatePayment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String courseSlug,
            @Valid @RequestBody CertificatePaymentVerifyRequestDto request
    ) {
        CertificatePublicDto certificate = certificateService.verifyAndIssueCertificate(principal, courseSlug, request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified! Certificate issued successfully 🎉", certificate));
    }

    /**
     * GET /api/certificates/{certificateCode}/download
     * Downloads authentic server-generated PDF certificate for the student owner.
     */
    @GetMapping("/{certificateCode}/download")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<byte[]> downloadCertificatePdf(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String certificateCode
    ) {
        byte[] pdfBytes = certificateService.downloadCertificatePdf(principal, certificateCode);
        String filename = "CodeOrbit_Certificate_" + certificateCode.replace(" ", "_") + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
