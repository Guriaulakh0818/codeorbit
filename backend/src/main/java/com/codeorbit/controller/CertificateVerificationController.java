package com.codeorbit.controller;

import com.codeorbit.dto.ApiResponse;
import com.codeorbit.dto.CertificatePublicDto;
import com.codeorbit.service.CertificateService;
import org.springframework.http.ResponseEntity;
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
}
