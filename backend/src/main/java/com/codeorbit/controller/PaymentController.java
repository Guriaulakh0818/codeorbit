package com.codeorbit.controller;

import com.codeorbit.dto.ApiResponse;
import com.codeorbit.dto.OrderResponseDto;
import com.codeorbit.dto.PaymentVerificationRequestDto;
import com.codeorbit.dto.RazorpayOrderCreationDto;
import com.codeorbit.dto.RazorpayOrderResponseDto;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<RazorpayOrderResponseDto>> createRazorpayOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody RazorpayOrderCreationDto dto
    ) {
        RazorpayOrderResponseDto response = paymentService.createRazorpayOrder(principal, dto);
        return ResponseEntity.ok(ApiResponse.success("Razorpay order generated successfully", response));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<OrderResponseDto>> verifyPayment(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PaymentVerificationRequestDto dto
    ) {
        OrderResponseDto response = paymentService.verifyPayment(principal, dto);
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", response));
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestBody String rawBody,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature
    ) {
        if (signature == null || signature.isBlank()) {
            return ResponseEntity.badRequest().body("Missing X-Razorpay-Signature header");
        }

        paymentService.handleWebhook(rawBody, signature);
        return ResponseEntity.ok("Webhook processed successfully");
    }
}
