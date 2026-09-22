package com.codeorbit.controller;

import com.codeorbit.dto.*;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.PlacementKitService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/placement-kits")
public class PlacementKitController {

    private final PlacementKitService placementKitService;

    public PlacementKitController(PlacementKitService placementKitService) {
        this.placementKitService = placementKitService;
    }

    /**
     * GET /api/placement-kits
     * Public catalog of active Role-Based Placement Preparation Kits.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<PlacementKitSummaryDto>>> getAllKits(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<PlacementKitSummaryDto> kits = placementKitService.getAllActiveKits(principal);
        return ResponseEntity.ok(ApiResponse.success(kits));
    }

    /**
     * GET /api/placement-kits/{slug}
     * Kit details. Unentitled users receive preview samples; entitled users receive full question bank.
     */
    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<PlacementKitDetailDto>> getKitBySlug(
            @PathVariable String slug,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        PlacementKitDetailDto kit = placementKitService.getKitBySlug(slug, principal);
        return ResponseEntity.ok(ApiResponse.success(kit));
    }

    /**
     * POST /api/placement-kits/{slug}/order
     * Creates a ₹99 Razorpay payment order for the authenticated student.
     */
    @PostMapping("/{slug}/order")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<PlacementKitOrderResponseDto>> createKitOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String slug
    ) {
        PlacementKitOrderResponseDto order = placementKitService.createKitOrder(principal, slug);
        return ResponseEntity.ok(ApiResponse.success("Placement Kit order created successfully", order));
    }

    /**
     * POST /api/placement-kits/{slug}/verify
     * Verifies Razorpay HMAC signature and unlocks the Placement Kit for the student.
     */
    @PostMapping("/{slug}/verify")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<PlacementKitDetailDto>> verifyKitPayment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String slug,
            @Valid @RequestBody PlacementKitVerifyRequestDto request
    ) {
        PlacementKitDetailDto kit = placementKitService.verifyAndFulfillKitPayment(principal, slug, request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified! Placement Kit unlocked 🎉", kit));
    }

    /**
     * GET /api/placement-kits/my
     * Retrieves all Placement Kits purchased by the authenticated student.
     */
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<PlacementKitSummaryDto>>> getMyPurchasedKits(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<PlacementKitSummaryDto> purchased = placementKitService.getStudentPurchasedKits(principal);
        return ResponseEntity.ok(ApiResponse.success(purchased));
    }

    /**
     * POST /api/placement-kits/{slug}/practice/{questionId}/submit
     * Submits a question attempt during practice and returns immediate feedback.
     */
    @PostMapping("/{slug}/practice/{questionId}/submit")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<PlacementKitPracticeResultDto>> submitPracticeAnswer(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String slug,
            @PathVariable Long questionId,
            @RequestBody PlacementKitPracticeSubmitDto submitDto
    ) {
        PlacementKitPracticeResultDto result = placementKitService.submitPracticeAnswer(principal, slug, questionId, submitDto);
        return ResponseEntity.ok(ApiResponse.success("Answer evaluated", result));
    }

    /**
     * GET /api/placement-kits/{slug}/progress
     * Retrieves progress metrics for the authenticated student on this kit.
     */
    @GetMapping("/{slug}/progress")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<PlacementKitProgressDto>> getKitProgress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String slug
    ) {
        PlacementKitProgressDto progress = placementKitService.getKitProgress(principal, slug);
        return ResponseEntity.ok(ApiResponse.success(progress));
    }
}
