package com.codeorbit.controller;

import com.codeorbit.dto.*;
import com.codeorbit.service.PlacementKitService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PlacementKitController.class)
@AutoConfigureMockMvc(addFilters = false)
class PlacementKitControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PlacementKitService placementKitService;

    @Test
    @DisplayName("GET /api/placement-kits - Returns list of all active placement kits")
    void testGetAllKits() throws Exception {
        PlacementKitSummaryDto kit = new PlacementKitSummaryDto(
                1L,
                "full-stack-developer-kit",
                "Full Stack Developer Prep Kit",
                "Full Stack Developer",
                "MERN & Java Full Stack interview questions",
                99,
                9900,
                "INR",
                null,
                "₹99 Kit",
                40,
                4,
                false
        );

        when(placementKitService.getAllActiveKits(any())).thenReturn(List.of(kit));

        mockMvc.perform(get("/api/placement-kits"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].slug").value("full-stack-developer-kit"))
                .andExpect(jsonPath("$.data[0].priceInr").value(99))
                .andExpect(jsonPath("$.data[0].role").value("Full Stack Developer"));
    }

    @Test
    @DisplayName("GET /api/placement-kits/{slug} - Returns kit detail")
    void testGetKitBySlug() throws Exception {
        PlacementKitDetailDto detail = new PlacementKitDetailDto();
        detail.setId(1L);
        detail.setTitle("Full Stack Developer Prep Kit");
        detail.setSlug("full-stack-developer-kit");
        detail.setRole("Full Stack Developer");
        detail.setPriceInr(99);
        detail.setPurchased(false);

        when(placementKitService.getKitBySlug(eq("full-stack-developer-kit"), any())).thenReturn(detail);

        mockMvc.perform(get("/api/placement-kits/full-stack-developer-kit"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.slug").value("full-stack-developer-kit"))
                .andExpect(jsonPath("$.data.priceInr").value(99))
                .andExpect(jsonPath("$.data.purchased").value(false));
    }

    @Test
    @DisplayName("POST /api/placement-kits/{slug}/order - Creates Razorpay order for ₹99 kit")
    void testCreateKitOrder() throws Exception {
        PlacementKitOrderResponseDto response = new PlacementKitOrderResponseDto(
                "PK-ORD-2026-001",
                "order_rzp_pk_123",
                "rzp_test_key_id",
                9900,
                99,
                "INR",
                "full-stack-developer-kit",
                "Full Stack Developer Prep Kit",
                "Full Stack Developer",
                "student@codeorbit.dev",
                "Student Name",
                "Order created"
        );

        when(placementKitService.createKitOrder(any(), eq("full-stack-developer-kit"))).thenReturn(response);

        mockMvc.perform(post("/api/placement-kits/full-stack-developer-kit/order"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderNumber").value("PK-ORD-2026-001"))
                .andExpect(jsonPath("$.data.razorpayOrderId").value("order_rzp_pk_123"))
                .andExpect(jsonPath("$.data.amountPaise").value(9900))
                .andExpect(jsonPath("$.data.amountInr").value(99));
    }

    @Test
    @DisplayName("POST /api/placement-kits/{slug}/verify - Verifies payment signature and unlocks kit")
    void testVerifyPayment() throws Exception {
        PlacementKitVerifyRequestDto request = new PlacementKitVerifyRequestDto(
                "order_rzp_pk_123",
                "pay_rzp_pk_456",
                "sig_valid_789"
        );

        PlacementKitDetailDto unlockedDetail = new PlacementKitDetailDto();
        unlockedDetail.setId(1L);
        unlockedDetail.setTitle("Full Stack Developer Prep Kit");
        unlockedDetail.setSlug("full-stack-developer-kit");
        unlockedDetail.setPurchased(true);

        when(placementKitService.verifyAndFulfillKitPayment(any(), eq("full-stack-developer-kit"), any(PlacementKitVerifyRequestDto.class)))
                .thenReturn(unlockedDetail);

        mockMvc.perform(post("/api/placement-kits/full-stack-developer-kit/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.purchased").value(true));
    }

    @Test
    @DisplayName("POST /api/placement-kits/{slug}/questions/{questionId}/submit - Submits practice answer and returns evaluation")
    void testSubmitPracticeAnswer() throws Exception {
        PlacementKitPracticeSubmitDto submitDto = new PlacementKitPracticeSubmitDto(1001L, "notes");
        PlacementKitPracticeResultDto result = new PlacementKitPracticeResultDto();
        result.setQuestionId(100L);
        result.setCorrect(true);
        result.setLessonReferenceLabel("React DOM & Reconciliation");
        result.setExternalReferenceUrl("/courses/react-track/lessons/virtual-dom");

        when(placementKitService.submitPracticeAnswer(any(), eq("full-stack-developer-kit"), eq(100L), any(PlacementKitPracticeSubmitDto.class)))
                .thenReturn(result);

        mockMvc.perform(post("/api/placement-kits/full-stack-developer-kit/practice/100/submit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(submitDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.correct").value(true))
                .andExpect(jsonPath("$.data.lessonReferenceLabel").value("React DOM & Reconciliation"));
    }

    @Test
    @DisplayName("GET /api/placement-kits/my - Returns student purchased placement kits")
    void testGetMyPurchasedKits() throws Exception {
        PlacementKitSummaryDto kit = new PlacementKitSummaryDto(
                1L,
                "full-stack-developer-kit",
                "Full Stack Developer Prep Kit",
                "Full Stack Developer",
                "MERN & Java Full Stack interview questions",
                99,
                9900,
                "INR",
                null,
                "₹99 Kit",
                40,
                4,
                true
        );

        when(placementKitService.getStudentPurchasedKits(any())).thenReturn(List.of(kit));

        mockMvc.perform(get("/api/placement-kits/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].slug").value("full-stack-developer-kit"))
                .andExpect(jsonPath("$.data[0].purchased").value(true));
    }
}
