package com.codeorbit.controller;

import com.codeorbit.dto.*;
import com.codeorbit.entity.PaymentStatus;
import com.codeorbit.service.PlacementReadyPaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PlacementReadyPaymentController.class)
@AutoConfigureMockMvc(addFilters = false)
class PlacementReadyPaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PlacementReadyPaymentService paymentService;

    @Test
    @DisplayName("POST /api/payments/placement-ready/order - Creates Razorpay order successfully")
    void testCreatePlacementReadyOrder() throws Exception {
        PlacementReadyOrderRequestDto request = new PlacementReadyOrderRequestDto("dsa");
        PlacementReadyOrderResponseDto response = new PlacementReadyOrderResponseDto(
                "PR-ORD-2026-001",
                "order_rzp_mock_123",
                "rzp_test_key_id",
                2900,
                29,
                "INR",
                "Data Structures & Algorithms",
                "dsa",
                "DSA Placement Ready",
                "student@codeorbit.dev",
                "Student Name"
        );

        when(paymentService.createPlacementReadyOrder(any(), eq("dsa"))).thenReturn(response);

        mockMvc.perform(post("/api/payments/placement-ready/order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderNumber").value("PR-ORD-2026-001"))
                .andExpect(jsonPath("$.data.razorpayOrderId").value("order_rzp_mock_123"))
                .andExpect(jsonPath("$.data.amountPaise").value(2900))
                .andExpect(jsonPath("$.data.amountInr").value(29));
    }

    @Test
    @DisplayName("POST /api/payments/placement-ready/verify - Verifies payment signature and unlocks entitlement")
    void testVerifyPayment() throws Exception {
        PlacementReadyVerifyRequestDto request = new PlacementReadyVerifyRequestDto(
                "PR-ORD-2026-001",
                "order_rzp_mock_123",
                "pay_rzp_mock_456",
                "sig_valid_789"
        );

        PlacementReadyPaymentSummaryDto response = new PlacementReadyPaymentSummaryDto(
                501L,
                "PR-ORD-2026-001",
                "Data Structures & Algorithms",
                "dsa",
                "DSA Placement Ready",
                29,
                "INR",
                PaymentStatus.PAID,
                "order_rzp_mock_123",
                "pay_rzp_mock_456",
                LocalDateTime.now(),
                LocalDateTime.now(),
                true
        );

        when(paymentService.verifyPayment(any(), any(PlacementReadyVerifyRequestDto.class))).thenReturn(response);

        mockMvc.perform(post("/api/payments/placement-ready/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PAID"))
                .andExpect(jsonPath("$.data.entitlementActive").value(true));
    }

    @Test
    @DisplayName("GET /api/payments/my - Returns authenticated student payment history")
    void testGetMyPayments() throws Exception {
        PlacementReadyPaymentSummaryDto p1 = new PlacementReadyPaymentSummaryDto(
                501L,
                "PR-ORD-2026-001",
                "Data Structures & Algorithms",
                "dsa",
                "DSA Placement Ready",
                29,
                "INR",
                PaymentStatus.PAID,
                "order_rzp_mock_123",
                "pay_rzp_mock_456",
                LocalDateTime.now(),
                LocalDateTime.now(),
                true
        );

        when(paymentService.getStudentPayments(any())).thenReturn(List.of(p1));

        mockMvc.perform(get("/api/payments/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].orderNumber").value("PR-ORD-2026-001"))
                .andExpect(jsonPath("$.data[0].amountInr").value(29));
    }

    @Test
    @DisplayName("GET /api/payments/placement-ready/status/{slug} - Returns placement ready status")
    void testGetPlacementReadyStatus() throws Exception {
        PlacementReadyStatusDto status = new PlacementReadyStatusDto("dsa", true, true, 29, "PR-ORD-2026-001");
        when(paymentService.getPlacementReadyStatus(any(), eq("dsa"))).thenReturn(status);

        mockMvc.perform(get("/api/payments/placement-ready/status/dsa"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.courseSlug").value("dsa"))
                .andExpect(jsonPath("$.data.hasAccess").value(true));
    }
}
