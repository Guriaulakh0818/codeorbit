package com.codeorbit.controller;

import com.codeorbit.dto.AdminPlacementReadyDto;
import com.codeorbit.dto.ApiResponse;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.service.AdminPlacementReadyService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/placement-ready")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER', 'SUPPORT')")
public class AdminPlacementReadyController {

    private final AdminPlacementReadyService placementReadyService;

    public AdminPlacementReadyController(AdminPlacementReadyService placementReadyService) {
        this.placementReadyService = placementReadyService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<AdminPlacementReadyDto.Metrics>> getMetrics() {
        return ResponseEntity.ok(ApiResponse.success(placementReadyService.getMetrics()));
    }

    @GetMapping("/entitlements")
    public ResponseEntity<ApiResponse<PagedResponseDto<AdminPlacementReadyDto.EntitlementItem>>> getEntitlements(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(placementReadyService.getEntitlements(search, pageable)));
    }
}
