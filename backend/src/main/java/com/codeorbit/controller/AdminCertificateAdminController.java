package com.codeorbit.controller;

import com.codeorbit.dto.AdminCertificateDto;
import com.codeorbit.dto.ApiResponse;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.service.AdminCertificateAdminService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/certificates")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER', 'SUPPORT')")
public class AdminCertificateAdminController {

    private final AdminCertificateAdminService certificateAdminService;

    public AdminCertificateAdminController(AdminCertificateAdminService certificateAdminService) {
        this.certificateAdminService = certificateAdminService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<AdminCertificateDto.Metrics>> getMetrics() {
        return ResponseEntity.ok(ApiResponse.success(certificateAdminService.getMetrics()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponseDto<AdminCertificateDto.CertificateItem>>> getCertificates(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(certificateAdminService.getCertificates(search, pageable)));
    }
}
