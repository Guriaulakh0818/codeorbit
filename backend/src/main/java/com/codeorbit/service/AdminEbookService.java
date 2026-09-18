package com.codeorbit.service;

import com.codeorbit.dto.AdminDashboardMetricsDto;
import com.codeorbit.dto.AdminEbookRequestDto;
import com.codeorbit.dto.AdminEbookResponseDto;
import com.codeorbit.dto.PagedResponseDto;
import org.springframework.web.multipart.MultipartFile;

public interface AdminEbookService {

    AdminEbookResponseDto createEbook(AdminEbookRequestDto dto, MultipartFile pdfFile);

    AdminEbookResponseDto updateEbook(Long id, AdminEbookRequestDto dto, MultipartFile pdfFile);

    AdminEbookResponseDto updateEbookStatus(Long id, boolean active);

    void deleteEbook(Long id);

    AdminEbookResponseDto getAdminEbookById(Long id);

    PagedResponseDto<AdminEbookResponseDto> getAllAdminEbooks(
            String search,
            String category,
            Boolean active,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    AdminDashboardMetricsDto getAdminMetrics();
}
