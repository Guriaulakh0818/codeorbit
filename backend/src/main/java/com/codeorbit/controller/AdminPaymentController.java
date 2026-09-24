package com.codeorbit.controller;

import com.codeorbit.dto.AdminPaymentDto;
import com.codeorbit.dto.ApiResponse;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.service.AdminPaymentService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/payments")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER', 'SUPPORT')")
public class AdminPaymentController {

    private final AdminPaymentService paymentService;

    public AdminPaymentController(AdminPaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<AdminPaymentDto.Metrics>> getMetrics() {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getMetrics()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponseDto<AdminPaymentDto.TransactionItem>>> getTransactions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String productType,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(paymentService.getTransactions(search, productType, status, pageable)));
    }
}
