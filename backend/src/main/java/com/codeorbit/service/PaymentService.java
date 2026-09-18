package com.codeorbit.service;

import com.codeorbit.dto.OrderResponseDto;
import com.codeorbit.dto.PaymentVerificationRequestDto;
import com.codeorbit.dto.RazorpayOrderCreationDto;
import com.codeorbit.dto.RazorpayOrderResponseDto;
import com.codeorbit.security.UserPrincipal;

public interface PaymentService {

    RazorpayOrderResponseDto createRazorpayOrder(UserPrincipal principal, RazorpayOrderCreationDto dto);

    OrderResponseDto verifyPayment(UserPrincipal principal, PaymentVerificationRequestDto dto);

    void handleWebhook(String rawBody, String signature);
}
