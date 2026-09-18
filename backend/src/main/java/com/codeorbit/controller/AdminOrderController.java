package com.codeorbit.controller;

import com.codeorbit.dto.AdminDashboardMetricsDto;
import com.codeorbit.dto.AdminOrderResponseDto;
import com.codeorbit.dto.ApiResponse;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.entity.OrderStatus;
import com.codeorbit.service.AdminOrderService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * REST Controller for Store Owner / Admin Orders and Sales Management.
 * Strictly secured for ROLE_ADMIN.
 */
@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    public AdminOrderController(AdminOrderService adminOrderService) {
        this.adminOrderService = adminOrderService;
    }

    /**
     * GET /api/admin/orders
     * Returns paginated student orders with optional status, search, and date range filters.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponseDto<AdminOrderResponseDto>>> getAllAdminOrders(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PagedResponseDto<AdminOrderResponseDto> response = adminOrderService.getAllAdminOrders(
                search, status, startDate, endDate, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * GET /api/admin/orders/{id}
     * Returns detailed breakdown of a single student order.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminOrderResponseDto>> getAdminOrderById(@PathVariable Long id) {
        AdminOrderResponseDto response = adminOrderService.getAdminOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * GET /api/admin/orders/metrics
     * Returns real database sales and order analytics metrics.
     */
    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<AdminDashboardMetricsDto>> getAdminOrderMetrics() {
        AdminDashboardMetricsDto metrics = adminOrderService.getAdminDashboardMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }
}
