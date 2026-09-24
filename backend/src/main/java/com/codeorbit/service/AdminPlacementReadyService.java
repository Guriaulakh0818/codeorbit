package com.codeorbit.service;

import com.codeorbit.dto.AdminPlacementReadyDto;
import com.codeorbit.dto.PagedResponseDto;
import org.springframework.data.domain.Pageable;

public interface AdminPlacementReadyService {
    AdminPlacementReadyDto.Metrics getMetrics();
    PagedResponseDto<AdminPlacementReadyDto.EntitlementItem> getEntitlements(String search, Pageable pageable);
}
