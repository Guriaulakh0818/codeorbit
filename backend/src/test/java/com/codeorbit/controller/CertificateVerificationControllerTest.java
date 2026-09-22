package com.codeorbit.controller;

import com.codeorbit.dto.*;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.service.CertificateService;
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

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CertificateVerificationController.class)
@AutoConfigureMockMvc(addFilters = false)
class CertificateVerificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CertificateService certificateService;

    @Test
    @DisplayName("GET /api/certificates/verify/{code} - Public verification for valid certificate")
    void testVerifyValidCertificate() throws Exception {
        CertificatePublicDto cert = new CertificatePublicDto(
                "CO-DSA-2026-9A7F2B",
                "Aman Sharma",
                "Data Structures & Algorithms (DSA) Master Track",
                "dsa",
                "VALID",
                true,
                null,
                LocalDateTime.now()
        );

        when(certificateService.verifyCertificate(eq("CO-DSA-2026-9A7F2B"))).thenReturn(cert);

        mockMvc.perform(get("/api/certificates/verify/CO-DSA-2026-9A7F2B"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.certificateCode").value("CO-DSA-2026-9A7F2B"))
                .andExpect(jsonPath("$.data.valid").value(true));
    }

    @Test
    @DisplayName("GET /api/certificates/verify/{code} - Non-existent certificate returns 404")
    void testVerifyNonExistentCertificate() throws Exception {
        when(certificateService.verifyCertificate(eq("CO-INVALID-999")))
                .thenThrow(new ResourceNotFoundException("Certificate not found"));

        mockMvc.perform(get("/api/certificates/verify/CO-INVALID-999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/certificates/{slug}/status - Returns certificate status and eligibility")
    void testGetCertificateStatus() throws Exception {
        CertificateStatusDto status = new CertificateStatusDto(
                "Data Structures & Algorithms",
                "dsa",
                true,
                false,
                false,
                null,
                12,
                3,
                "Eligible for certificate"
        );

        when(certificateService.getCertificateStatus(any(), eq("dsa"))).thenReturn(status);

        mockMvc.perform(get("/api/certificates/dsa/status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.eligible").value(true))
                .andExpect(jsonPath("$.data.price").value(9))
                .andExpect(jsonPath("$.data.amountInPaise").value(900));
    }

    @Test
    @DisplayName("POST /api/certificates/{slug}/order - Creates ₹9 certificate payment order")
    void testCreateCertificateOrder() throws Exception {
        CertificateOrderResponseDto order = new CertificateOrderResponseDto(
                "CERT-ORD-2026-001",
                "order_rzp_mock_123",
                900,
                "INR",
                "rzp_test_key_id",
                "dsa",
                "Data Structures & Algorithms",
                "Student Name",
                "student@codeorbit.dev",
                "Order created"
        );

        when(certificateService.createCertificateOrder(any(), eq("dsa"))).thenReturn(order);

        mockMvc.perform(post("/api/certificates/dsa/order"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderNumber").value("CERT-ORD-2026-001"))
                .andExpect(jsonPath("$.data.amountPaise").value(900));
    }

    @Test
    @DisplayName("POST /api/certificates/{slug}/verify - Verifies payment signature and issues certificate")
    void testVerifyCertificatePayment() throws Exception {
        CertificatePaymentVerifyRequestDto request = new CertificatePaymentVerifyRequestDto(
                "order_rzp_mock_123",
                "pay_rzp_mock_456",
                "sig_valid_789"
        );

        CertificatePublicDto response = new CertificatePublicDto(
                "CO-DSA-2026-X8Y9Z0",
                "Student Name",
                "Data Structures & Algorithms",
                "dsa",
                "VALID",
                true,
                null,
                LocalDateTime.now()
        );

        when(certificateService.verifyAndIssueCertificate(any(), eq("dsa"), any(CertificatePaymentVerifyRequestDto.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/certificates/dsa/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.certificateCode").value("CO-DSA-2026-X8Y9Z0"))
                .andExpect(jsonPath("$.data.valid").value(true));
    }

    @Test
    @DisplayName("GET /api/certificates/{code}/download - Streams PDF with correct headers")
    void testDownloadCertificatePdf() throws Exception {
        byte[] pdfBytes = "%PDF-1.4 Mock PDF Content".getBytes();
        when(certificateService.downloadCertificatePdf(any(), eq("CO-DSA-2026-X8Y9Z0"))).thenReturn(pdfBytes);

        mockMvc.perform(get("/api/certificates/CO-DSA-2026-X8Y9Z0/download"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/pdf"))
                .andExpect(header().string("Content-Disposition", "attachment; filename=\"CodeOrbit_Certificate_CO-DSA-2026-X8Y9Z0.pdf\""))
                .andExpect(content().bytes(pdfBytes));
    }
}
