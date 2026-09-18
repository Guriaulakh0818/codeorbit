package com.codeorbit.security;

import com.codeorbit.dto.AdminEbookResponseDto;
import com.codeorbit.dto.EbookResponseDto;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.service.AdminEbookService;
import com.codeorbit.service.EbookService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EbookService ebookService;

    @MockBean
    private AdminEbookService adminEbookService;

    @Test
    void testPublicCatalog_WithoutAuth_Allowed() throws Exception {
        PagedResponseDto<EbookResponseDto> pagedResponse = new PagedResponseDto<>(
                List.of(new EbookResponseDto(1L, "Java", "Author", "java", "desc", new BigDecimal("199"), 100, "url", true, LocalDateTime.now())),
                0, 10, 1, 1, true
        );
        when(ebookService.getActiveEbooks(any(), any(), anyInt(), anyInt(), any(), any()))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/api/ebooks"))
                .andExpect(status().isOk());
    }

    @Test
    void testAdminEndpoint_WithoutAuth_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/ebooks"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "student@codeorbit.dev", roles = {"STUDENT"})
    void testAdminEndpoint_WithStudentRole_Forbidden() throws Exception {
        mockMvc.perform(get("/api/admin/ebooks"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@codeorbit.dev", roles = {"ADMIN"})
    void testAdminEndpoint_WithAdminRole_Success() throws Exception {
        PagedResponseDto<AdminEbookResponseDto> adminPaged = new PagedResponseDto<>(
                List.of(new AdminEbookResponseDto(1L, "Java", "Author", "java", "desc", new BigDecimal("199"), 100, "url", true, "f.pdf", "k.pdf", 100L, LocalDateTime.now(), LocalDateTime.now())),
                0, 10, 1, 1, true
        );
        when(adminEbookService.getAllAdminEbooks(any(), any(), any(), anyInt(), anyInt(), any(), any()))
                .thenReturn(adminPaged);

        mockMvc.perform(get("/api/admin/ebooks"))
                .andExpect(status().isOk());
    }

    @Test
    void testStudentEndpoint_WithoutAuth_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/student/orders"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/student/library"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/student/ebooks/1/download"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/admin/orders"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "student@codeorbit.dev", roles = {"STUDENT"})
    void testAdminOrdersEndpoint_WithStudentRole_Forbidden() throws Exception {
        mockMvc.perform(get("/api/admin/orders"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testWebhookEndpoint_WithoutAuth_AllowedByFilter() throws Exception {
        // Webhook is permitAll in security filter chain; missing signature header returns 400 from controller
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/payments/webhook")
                        .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                        .content("{\"event\":\"test\"}"))
                .andExpect(status().isBadRequest());
    }
}
