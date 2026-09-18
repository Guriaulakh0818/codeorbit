package com.codeorbit.controller;

import com.codeorbit.dto.AdminDashboardMetricsDto;
import com.codeorbit.dto.AdminEbookRequestDto;
import com.codeorbit.dto.AdminEbookResponseDto;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.service.AdminEbookService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
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

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminEbookController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminEbookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AdminEbookService adminEbookService;

    private AdminEbookResponseDto sampleDto;

    @BeforeEach
    void setUp() {
        sampleDto = new AdminEbookResponseDto(
                1L,
                "Core Java Master Handbook",
                "Prof. Aditya Sharma",
                "java",
                "Complete guide to Core Java",
                new BigDecimal("199.00"),
                310,
                "https://example.com/java.jpg",
                true,
                "core-java.pdf",
                "uuid_core-java.pdf",
                1048576L,
                LocalDateTime.now(),
                LocalDateTime.now()
        );
    }

    @Test
    void testGetAllAdminEbooks_Returns200() throws Exception {
        PagedResponseDto<AdminEbookResponseDto> pagedResponse = new PagedResponseDto<>(
                List.of(sampleDto), 0, 10, 1, 1, true
        );

        when(adminEbookService.getAllAdminEbooks(isNull(), isNull(), isNull(), eq(0), eq(10), eq("id"), eq("desc")))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/api/admin/ebooks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].title").value("Core Java Master Handbook"))
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }

    @Test
    void testGetAdminMetrics_Returns200() throws Exception {
        AdminDashboardMetricsDto metrics = new AdminDashboardMetricsDto(
                8L, 7L, 1L, 38L, new BigDecimal("8420.00")
        );

        when(adminEbookService.getAdminMetrics()).thenReturn(metrics);

        mockMvc.perform(get("/api/admin/ebooks/metrics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalEbooks").value(8))
                .andExpect(jsonPath("$.data.publishedEbooks").value(7))
                .andExpect(jsonPath("$.data.unpublishedEbooks").value(1));
    }

    @Test
    void testCreateEbookJson_Success_Returns201() throws Exception {
        AdminEbookRequestDto requestDto = new AdminEbookRequestDto(
                "New Python Guide",
                "Pooja Nair",
                "python",
                "Python description",
                new BigDecimal("199.00"),
                200,
                "https://example.com/python.jpg",
                true
        );

        when(adminEbookService.createEbook(any(AdminEbookRequestDto.class), isNull()))
                .thenReturn(sampleDto);

        mockMvc.perform(post("/api/admin/ebooks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Core Java Master Handbook"));
    }

    @Test
    void testCreateEbook_ValidationError_Returns400() throws Exception {
        AdminEbookRequestDto invalidDto = new AdminEbookRequestDto();
        invalidDto.setTitle(""); // Blank title violates validation
        invalidDto.setPrice(new BigDecimal("-10.00")); // Negative price violates validation

        mockMvc.perform(post("/api/admin/ebooks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }

    @Test
    void testUpdateEbookStatus_Returns200() throws Exception {
        when(adminEbookService.updateEbookStatus(eq(1L), eq(false)))
                .thenReturn(sampleDto);

        mockMvc.perform(patch("/api/admin/ebooks/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"active\": false}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testDeleteEbook_Returns200() throws Exception {
        doNothing().when(adminEbookService).deleteEbook(1L);

        mockMvc.perform(delete("/api/admin/ebooks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testDeleteEbook_NotFound_Returns404() throws Exception {
        doThrow(new ResourceNotFoundException("E-Book", "id", 999L))
                .when(adminEbookService).deleteEbook(999L);

        mockMvc.perform(delete("/api/admin/ebooks/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }
}
