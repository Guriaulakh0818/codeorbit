package com.codeorbit.service;

import com.codeorbit.dto.AdminCertificateDto;
import com.codeorbit.dto.PagedResponseDto;
import org.springframework.data.domain.Pageable;

public interface AdminCertificateAdminService {
    AdminCertificateDto.Metrics getMetrics();
    PagedResponseDto<AdminCertificateDto.CertificateItem> getCertificates(String search, Pageable pageable);
}
