package com.codeorbit.controller;

import com.codeorbit.dto.OrderResponseDto;
import com.codeorbit.dto.PaymentVerificationRequestDto;
import com.codeorbit.dto.RazorpayOrderCreationDto;
import com.codeorbit.dto.RazorpayOrderResponseDto;
import com.codeorbit.entity.OrderStatus;
import com.codeorbit.service.PaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaymentController.class)
@AutoConfigureMockMvc(addFilters = false)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    @Test
    @DisplayName("POST /api/payments/create-order should return 200 OK and Razorpay order details")
    void testCreateRazorpayOrder() throws Exception {
        RazorpayOrderCreationDto requestDto = new RazorpayOrderCreationDto(10L);
        RazorpayOrderResponseDto responseDto = new RazorpayOrderResponseDto(
                "order_rzp_123", 10L, "ORD-2026-001", new BigDecimal("499.00"), 49900L, "INR", "rzp_test_key"
        );

        when(paymentService.createRazorpayOrder(any(), any())).thenReturn(responseDto);

        mockMvc.perform(post("/api/payments/create-order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.razorpayOrderId").value("order_rzp_123"))
                .andExpect(jsonPath("$.data.amountInPaise").value(49900));
    }

    @Test
    @DisplayName("POST /api/payments/verify should return 200 OK when signature is valid")
    void testVerifyPayment() throws Exception {
        PaymentVerificationRequestDto requestDto = new PaymentVerificationRequestDto(
                "order_rzp_123", "pay_rzp_456", "valid_sig"
        );
        OrderResponseDto responseDto = new OrderResponseDto(
                10L, "ORD-2026-001", new BigDecimal("499.00"), "INR",
                OrderStatus.PAID, "order_rzp_123", "pay_rzp_456", LocalDateTime.now(), LocalDateTime.now(), List.of()
        );

        when(paymentService.verifyPayment(any(), any())).thenReturn(responseDto);

        mockMvc.perform(post("/api/payments/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PAID"));
    }

    @Test
    @DisplayName("POST /api/payments/webhook should process webhook with signature header")
    void testHandleWebhook() throws Exception {
        String webhookBody = "{\"event\":\"payment.captured\"}";
        doNothing().when(paymentService).handleWebhook(any(), any());

        mockMvc.perform(post("/api/payments/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Razorpay-Signature", "valid_header_signature")
                        .content(webhookBody))
                .andExpect(status().isOk())
                .andExpect(content().string("Webhook processed successfully"));
    }
}
