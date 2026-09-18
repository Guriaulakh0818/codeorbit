package com.codeorbit.service;

import com.codeorbit.dto.EbookResponseDto;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.entity.Ebook;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.EbookRepository;
import com.codeorbit.service.impl.EbookServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EbookServiceTest {

    @Mock
    private EbookRepository ebookRepository;

    @InjectMocks
    private EbookServiceImpl ebookService;

    private Ebook sampleEbook;

    @BeforeEach
    void setUp() {
        sampleEbook = new Ebook(
                "Core Java Masterclass",
                "Prof. Sharma",
                "Java",
                "Complete Java handbook",
                new BigDecimal("499.00"),
                340,
                "https://example.com/cover.jpg",
                true
        );
        sampleEbook.setId(1L);
        sampleEbook.setCreatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("Should return paginated active e-books")
    void shouldReturnPaginatedActiveEbooks() {
        Page<Ebook> page = new PageImpl<>(List.of(sampleEbook));
        when(ebookRepository.searchActiveEbooks(eq(null), eq(null), any(Pageable.class)))
                .thenReturn(page);

        PagedResponseDto<EbookResponseDto> response = ebookService.getActiveEbooks(
                null, null, 0, 10, "createdAt", "desc"
        );

        assertThat(response).isNotNull();
        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getContent().get(0).getTitle()).isEqualTo("Core Java Masterclass");
        assertThat(response.getContent().get(0).getCategory()).isEqualTo("Java");
        assertThat(response.getTotalElements()).isEqualTo(1);
    }

    @Test
    @DisplayName("Should return e-book by valid active ID")
    void shouldReturnEbookByValidId() {
        when(ebookRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(sampleEbook));

        EbookResponseDto response = ebookService.getActiveEbookById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Core Java Masterclass");
        assertThat(response.getPrice()).isEqualTo(new BigDecimal("499.00"));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when e-book ID is not found")
    void shouldThrowExceptionWhenEbookNotFound() {
        when(ebookRepository.findByIdAndActiveTrue(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> ebookService.getActiveEbookById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("E-book not found with id: 99");
    }

    @Test
    @DisplayName("Should return distinct active categories list")
    void shouldReturnDistinctCategories() {
        List<String> categories = List.of("DBMS", "DSA", "Java", "Python");
        when(ebookRepository.findDistinctCategories()).thenReturn(categories);

        List<String> result = ebookService.getActiveCategories();

        assertThat(result).containsExactly("DBMS", "DSA", "Java", "Python");
    }
}
