package com.codeorbit.service;

import com.codeorbit.dto.AdminPaymentDto;
import com.codeorbit.dto.PagedResponseDto;
import org.springframework.data.domain.Pageable;

public interface AdminPaymentService {
    AdminPaymentDto.Metrics getMetrics();
    PagedResponseDto<AdminPaymentDto.TransactionItem> getTransactions(String search, String productType, String status, Pageable pageable);
}
