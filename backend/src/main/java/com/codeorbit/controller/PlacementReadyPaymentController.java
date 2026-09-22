package com.codeorbit.controller;

import com.codeorbit.dto.*;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.PlacementReadyPaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PlacementReadyPaymentController {

    private final PlacementReadyPaymentService paymentService;

    public PlacementReadyPaymentController(PlacementReadyPaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * POST /api/payments/placement-ready/order
     * Creates a verified Razorpay order for ₹29 Placement Ready subcourse.
     */
    @PostMapping("/placement-ready/order")
    public ResponseEntity<ApiResponse<PlacementReadyOrderResponseDto>> createPlacementReadyOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PlacementReadyOrderRequestDto request
    ) {
        PlacementReadyOrderResponseDto response = paymentService.createPlacementReadyOrder(principal, request.getCourseSlug());
        return ResponseEntity.ok(ApiResponse.success("Razorpay payment order created successfully", response));
    }

    /**
     * POST /api/payments/placement-ready/verify
     * Verifies HMAC-SHA256 signature and grants Placement Ready access.
     */
    @PostMapping("/placement-ready/verify")
    public ResponseEntity<ApiResponse<PlacementReadyPaymentSummaryDto>> verifyPayment(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PlacementReadyVerifyRequestDto request
    ) {
        PlacementReadyPaymentSummaryDto response = paymentService.verifyPayment(principal, request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully. Placement Ready track is now unlocked!", response));
    }

    /**
     * GET /api/payments/my
     * Returns authenticated student's placement ready payment history.
     */
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<PlacementReadyPaymentSummaryDto>>> getMyPayments(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<PlacementReadyPaymentSummaryDto> payments = paymentService.getStudentPayments(principal);
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    /**
     * GET /api/payments/placement-ready/status/{courseSlug}
     * Returns placement ready access and purchase status for a course.
     */
    @GetMapping("/placement-ready/status/{courseSlug}")
    public ResponseEntity<ApiResponse<PlacementReadyStatusDto>> getPlacementReadyStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String courseSlug
    ) {
        PlacementReadyStatusDto status = paymentService.getPlacementReadyStatus(principal, courseSlug);
        return ResponseEntity.ok(ApiResponse.success(status));
    }
}
