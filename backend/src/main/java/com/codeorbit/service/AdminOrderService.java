package com.codeorbit.service;

import com.codeorbit.dto.AdminDashboardMetricsDto;
import com.codeorbit.dto.AdminOrderResponseDto;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.entity.OrderStatus;

import java.time.LocalDateTime;

public interface AdminOrderService {

    PagedResponseDto<AdminOrderResponseDto> getAllAdminOrders(
            String search,
            OrderStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    AdminOrderResponseDto getAdminOrderById(Long id);

    AdminDashboardMetricsDto getAdminDashboardMetrics();
}
