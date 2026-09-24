package com.codeorbit.controller;

import com.codeorbit.dto.AdminSettingsDto;
import com.codeorbit.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/admin/settings")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER', 'SUPPORT')")
public class AdminSettingsController {

    @Value("${app.razorpay.key-id:rzp_live_default}")
    private String razorpayKeyId;

    @GetMapping
    public ResponseEntity<ApiResponse<AdminSettingsDto>> getSettings() {
        AdminSettingsDto settings = new AdminSettingsDto();
        settings.setPlacementReadyPrice(new BigDecimal("29.00"));
        settings.setCertificatePrice(new BigDecimal("9.00"));
        settings.setPlacementKitPrice(new BigDecimal("99.00"));
        settings.setServerEnforcedPricing(true);
        settings.setRazorpayKeyId(razorpayKeyId != null && !razorpayKeyId.isEmpty() ? razorpayKeyId : "rzp_test_public_key");
        return ResponseEntity.ok(ApiResponse.success(settings));
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<AdminSettingsDto>> updateSettings(@RequestBody AdminSettingsDto request) {
        // Enforce immutable pricing rules
        request.setPlacementReadyPrice(new BigDecimal("29.00"));
        request.setCertificatePrice(new BigDecimal("9.00"));
        request.setPlacementKitPrice(new BigDecimal("99.00"));
        request.setServerEnforcedPricing(true);
        return ResponseEntity.ok(ApiResponse.success("Platform settings updated successfully", request));
    }
}
