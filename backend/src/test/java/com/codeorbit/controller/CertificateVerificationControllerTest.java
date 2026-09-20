package com.codeorbit.controller;

import com.codeorbit.dto.CertificatePublicDto;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.service.CertificateService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CertificateVerificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

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
}
