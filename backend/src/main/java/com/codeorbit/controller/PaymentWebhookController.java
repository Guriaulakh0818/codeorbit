package com.codeorbit.controller;

import com.codeorbit.dto.ApiResponse;
import com.codeorbit.service.PlacementReadyPaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentWebhookController {

    private static final Logger log = LoggerFactory.getLogger(PaymentWebhookController.class);

    private final PlacementReadyPaymentService paymentService;

    public PaymentWebhookController(PlacementReadyPaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping({"/webhook", "/razorpay/webhook"})
    public ResponseEntity<ApiResponse<String>> handleWebhook(
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
            @RequestBody(required = false) String payload
    ) {
        log.info("Received Razorpay webhook event with signature header present: {}", signature != null);
        paymentService.handleWebhook(payload, signature);
        return ResponseEntity.ok(ApiResponse.success("Webhook processed successfully", null));
    }
}
