package com.codeorbit.controller;

import com.codeorbit.dto.EbookResponseDto;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.service.EbookService;
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

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EbookController.class)
@AutoConfigureMockMvc(addFilters = false)
class EbookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EbookService ebookService;

    @Test
    @DisplayName("GET /api/ebooks should return 200 OK and paged e-books")
    void shouldReturnActiveEbooks() throws Exception {
        EbookResponseDto dto = new EbookResponseDto(
                1L,
                "Core Java Masterclass",
                "Prof. Sharma",
                "Java",
                "Complete guide",
                new BigDecimal("499.00"),
                340,
                "https://example.com/cover.jpg",
                true,
                LocalDateTime.now()
        );

        PagedResponseDto<EbookResponseDto> pagedResponse = new PagedResponseDto<>(
                List.of(dto), 0, 10, 1, 1, true
        );

        when(ebookService.getActiveEbooks(any(), any(), anyInt(), anyInt(), anyString(), anyString()))
                .thenReturn(pagedResponse);

        mockMvc.perform(get("/api/ebooks")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].id").value(1))
                .andExpect(jsonPath("$.data.content[0].title").value("Core Java Masterclass"))
                .andExpect(jsonPath("$.data.content[0].category").value("Java"))
                .andExpect(jsonPath("$.data.content[0].price").value(499.00));
    }

    @Test
    @DisplayName("GET /api/ebooks/{id} should return 200 OK when e-book exists")
    void shouldReturnEbookById() throws Exception {
        EbookResponseDto dto = new EbookResponseDto(
                1L,
                "Data Structures in C++",
                "Vikram Roy",
                "DSA",
                "DSA Handbook",
                new BigDecimal("599.00"),
                450,
                "https://example.com/dsa.jpg",
                true,
                LocalDateTime.now()
        );

        when(ebookService.getActiveEbookById(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/ebooks/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.title").value("Data Structures in C++"))
                .andExpect(jsonPath("$.data.category").value("DSA"))
                .andExpect(jsonPath("$.data.price").value(599.00));
    }

    @Test
    @DisplayName("GET /api/ebooks/{id} should return 404 NOT FOUND when e-book does not exist")
    void shouldReturn404WhenEbookNotFound() throws Exception {
        when(ebookService.getActiveEbookById(999L))
                .thenThrow(new ResourceNotFoundException("E-book not found with id: 999"));

        mockMvc.perform(get("/api/ebooks/999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("E-book not found with id: 999"));
    }

    @Test
    @DisplayName("GET /api/ebooks/categories should return 200 OK and categories list")
    void shouldReturnAvailableCategories() throws Exception {
        List<String> categories = List.of("Computer Networks", "DBMS", "DSA", "Java", "Python");
        when(ebookService.getActiveCategories()).thenReturn(categories);

        mockMvc.perform(get("/api/ebooks/categories")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0]").value("Computer Networks"))
                .andExpect(jsonPath("$.data[1]").value("DBMS"))
                .andExpect(jsonPath("$.data[2]").value("DSA"));
    }
}
