package com.codeorbit.controller;

import com.codeorbit.dto.EbookResponseDto;
import com.codeorbit.dto.PdfDownloadResourceDto;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.service.StudentLibraryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudentLibraryController.class)
@AutoConfigureMockMvc(addFilters = false)
class StudentLibraryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentLibraryService studentLibraryService;

    @Test
    @DisplayName("GET /api/student/library should return 200 OK and student purchased books")
    void testGetStudentLibrary_Success() throws Exception {
        EbookResponseDto ebookDto = new EbookResponseDto(
                10L, "Core Java Handbook", "Prof. Sharma", "Java",
                "Description", new BigDecimal("499.00"), 340, "cover.jpg", true, LocalDateTime.now()
        );

        when(studentLibraryService.getStudentLibrary(any())).thenReturn(List.of(ebookDto));

        mockMvc.perform(get("/api/student/library"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(10))
                .andExpect(jsonPath("$.data[0].title").value("Core Java Handbook"));
    }

    @Test
    @DisplayName("GET /api/student/ebooks/{id}/download should return 200 OK with application/pdf and attachment header")
    void testDownloadPurchasedPdf_Success() throws Exception {
        Resource pdfResource = new ByteArrayResource("%PDF-1.4 test binary data".getBytes());
        PdfDownloadResourceDto downloadDto = new PdfDownloadResourceDto(pdfResource, "core-java-handbook.pdf", (long) "%PDF-1.4 test binary data".length());

        when(studentLibraryService.downloadPurchasedPdf(any(), eq(10L))).thenReturn(downloadDto);

        mockMvc.perform(get("/api/student/ebooks/10/download"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, org.hamcrest.Matchers.containsString("core-java-handbook.pdf")))
                .andExpect(content().bytes("%PDF-1.4 test binary data".getBytes()));
    }

    @Test
    @DisplayName("GET /api/student/ebooks/{id}/download should return 403 Forbidden when unpurchased or unpaid")
    void testDownloadPurchasedPdf_Unpurchased_Forbidden() throws Exception {
        when(studentLibraryService.downloadPurchasedPdf(any(), eq(20L)))
                .thenThrow(new AccessDeniedException("Access denied. You have not purchased this e-book or your payment is not completed."));

        mockMvc.perform(get("/api/student/ebooks/20/download"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Access denied. You have not purchased this e-book or your payment is not completed."));
    }

    @Test
    @DisplayName("GET /api/student/ebooks/{id}/download should return 404 Not Found when ebook or PDF does not exist")
    void testDownloadPurchasedPdf_NotFound() throws Exception {
        when(studentLibraryService.downloadPurchasedPdf(any(), eq(999L)))
                .thenThrow(new ResourceNotFoundException("E-Book", "id", 999L));

        mockMvc.perform(get("/api/student/ebooks/999/download"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("E-Book not found with id: '999'"));
    }

    @Test
    @DisplayName("GET /api/student/ebooks/{id}/access should return true/false ownership")
    void testCheckEbookAccess() throws Exception {
        when(studentLibraryService.isEbookPurchased(any(), eq(10L))).thenReturn(true);
        when(studentLibraryService.isEbookPurchased(any(), eq(20L))).thenReturn(false);

        mockMvc.perform(get("/api/student/ebooks/10/access"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value(true));

        mockMvc.perform(get("/api/student/ebooks/20/access"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value(false));
    }
}
