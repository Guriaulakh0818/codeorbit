package com.codeorbit.service;

import com.codeorbit.dto.*;
import com.codeorbit.entity.Ebook;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.EbookRepository;
import com.codeorbit.service.impl.AdminEbookServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminEbookServiceTest {

    @Mock
    private EbookRepository ebookRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private com.codeorbit.repository.OrderRepository orderRepository;

    @Mock
    private com.codeorbit.repository.UserRepository userRepository;

    @InjectMocks
    private AdminEbookServiceImpl adminEbookService;

    private Ebook sampleEbook;

    @BeforeEach
    void setUp() {
        sampleEbook = new Ebook(
                "Mastering Spring Boot",
                "CodeOrbit Team",
                "web-dev",
                "Complete guide to Spring Boot 3",
                new BigDecimal("299.00"),
                350,
                "https://example.com/cover.jpg",
                true
        );
        sampleEbook.setId(1L);
    }

    @Test
    void testCreateEbook_WithPdfUpload_Success() {
        AdminEbookRequestDto dto = new AdminEbookRequestDto(
                "Mastering Spring Boot",
                "CodeOrbit Team",
                "web-dev",
                "Complete guide to Spring Boot 3",
                new BigDecimal("299.00"),
                350,
                "https://example.com/cover.jpg",
                true
        );

        MockMultipartFile file = new MockMultipartFile(
                "pdf",
                "spring-boot.pdf",
                "application/pdf",
                "dummy pdf content".getBytes()
        );

        when(fileStorageService.storePdfFile(file))
                .thenReturn(new StoredFileMetadata("spring-boot.pdf", "uuid_spring-boot.pdf", 1024L));
        when(ebookRepository.save(any(Ebook.class)))
                .thenReturn(sampleEbook);

        AdminEbookResponseDto response = adminEbookService.createEbook(dto, file);

        assertNotNull(response);
        assertEquals(sampleEbook.getTitle(), response.getTitle());
        verify(fileStorageService, times(1)).storePdfFile(file);
        verify(ebookRepository, times(1)).save(any(Ebook.class));
    }

    @Test
    void testUpdateEbookStatus_Success() {
        when(ebookRepository.findById(1L)).thenReturn(Optional.of(sampleEbook));
        when(ebookRepository.save(any(Ebook.class))).thenReturn(sampleEbook);

        AdminEbookResponseDto response = adminEbookService.updateEbookStatus(1L, false);

        assertNotNull(response);
        assertFalse(sampleEbook.isActive());
        verify(ebookRepository, times(1)).save(sampleEbook);
    }

    @Test
    void testDeleteEbook_Success() {
        sampleEbook.setPdfStorageKey("test_key.pdf");
        when(ebookRepository.findById(1L)).thenReturn(Optional.of(sampleEbook));

        adminEbookService.deleteEbook(1L);

        verify(fileStorageService, times(1)).deleteFile("test_key.pdf");
        verify(ebookRepository, times(1)).delete(sampleEbook);
    }

    @Test
    void testDeleteEbook_NotFound_ThrowsException() {
        when(ebookRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> adminEbookService.deleteEbook(999L));
    }

    @Test
    void testGetAllAdminEbooks_Success() {
        Page<Ebook> page = new PageImpl<>(List.of(sampleEbook));
        when(ebookRepository.searchAdminEbooks(isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        PagedResponseDto<AdminEbookResponseDto> response = adminEbookService.getAllAdminEbooks(
                null, null, null, 0, 10, "id", "desc"
        );

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals(sampleEbook.getTitle(), response.getContent().get(0).getTitle());
    }

    @Test
    void testGetAdminMetrics_Success() {
        when(ebookRepository.count()).thenReturn(10L);
        when(ebookRepository.countByActive(true)).thenReturn(8L);
        when(ebookRepository.countByActive(false)).thenReturn(2L);
        when(orderRepository.count()).thenReturn(25L);
        when(orderRepository.countByStatus(com.codeorbit.entity.OrderStatus.PAID)).thenReturn(20L);
        when(orderRepository.countByStatus(com.codeorbit.entity.OrderStatus.PENDING)).thenReturn(3L);
        when(orderRepository.countByStatus(com.codeorbit.entity.OrderStatus.FAILED)).thenReturn(2L);
        when(orderRepository.calculateTotalPaidRevenue()).thenReturn(new BigDecimal("9980.00"));
        when(userRepository.countByRole(com.codeorbit.entity.Role.STUDENT)).thenReturn(50L);

        AdminDashboardMetricsDto metrics = adminEbookService.getAdminMetrics();

        assertNotNull(metrics);
        assertEquals(10L, metrics.getTotalEbooks());
        assertEquals(8L, metrics.getPublishedEbooks());
        assertEquals(2L, metrics.getUnpublishedEbooks());
        assertEquals(25L, metrics.getTotalOrders());
        assertEquals(20L, metrics.getPaidOrders());
        assertEquals(3L, metrics.getPendingOrders());
        assertEquals(2L, metrics.getFailedOrders());
        assertEquals(new BigDecimal("9980.00"), metrics.getTotalRevenue());
        assertEquals(50L, metrics.getTotalStudents());
    }
}
