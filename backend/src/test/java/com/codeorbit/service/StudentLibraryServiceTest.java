package com.codeorbit.service;

import com.codeorbit.dto.EbookResponseDto;
import com.codeorbit.dto.PdfDownloadResourceDto;
import com.codeorbit.entity.Ebook;
import com.codeorbit.entity.Role;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.EbookRepository;
import com.codeorbit.repository.OrderRepository;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.impl.StudentLibraryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentLibraryServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private EbookRepository ebookRepository;

    @Mock
    private FileStorageService fileStorageService;

    private StudentLibraryService studentLibraryService;

    private UserPrincipal studentPrincipal;
    private UserPrincipal adminPrincipal;
    private Ebook sampleEbook;

    @BeforeEach
    void setUp() {
        studentLibraryService = new StudentLibraryServiceImpl(orderRepository, ebookRepository, fileStorageService);

        studentPrincipal = new UserPrincipal(1L, "Rahul Student", "rahul@student.edu", "password", Role.STUDENT, true);
        adminPrincipal = new UserPrincipal(99L, "Store Admin", "admin@codeorbit.dev", "password", Role.ADMIN, true);

        sampleEbook = new Ebook(
                "Core Java Handbook",
                "Prof. Aditya Sharma",
                "Java",
                "Comprehensive Java guide",
                new BigDecimal("499.00"),
                340,
                "https://images.unsplash.com/cover.jpg",
                true
        );
        sampleEbook.setId(10L);
        sampleEbook.setPdfFileName("core-java.pdf");
        sampleEbook.setPdfStorageKey("uuid-123_core-java.pdf");
        sampleEbook.setPdfFileSize(1024000L);
    }

    @Test
    void testDownloadPurchasedPdf_Success_ForStudentWithPaidOrder() {
        when(ebookRepository.findById(10L)).thenReturn(Optional.of(sampleEbook));
        when(orderRepository.hasUserPurchasedEbook(1L, 10L)).thenReturn(true);
        Resource mockResource = new ByteArrayResource("dummy pdf content".getBytes());
        when(fileStorageService.loadPdfAsResource("uuid-123_core-java.pdf")).thenReturn(mockResource);

        PdfDownloadResourceDto result = studentLibraryService.downloadPurchasedPdf(studentPrincipal, 10L);

        assertNotNull(result);
        assertEquals("core-java.pdf", result.getOriginalFileName());
        assertEquals(mockResource, result.getResource());
        verify(orderRepository).hasUserPurchasedEbook(1L, 10L);
        verify(fileStorageService).loadPdfAsResource("uuid-123_core-java.pdf");
    }

    @Test
    void testDownloadPurchasedPdf_Denied_ForStudentWithoutPurchase() {
        when(ebookRepository.findById(10L)).thenReturn(Optional.of(sampleEbook));
        when(orderRepository.hasUserPurchasedEbook(1L, 10L)).thenReturn(false);

        AccessDeniedException ex = assertThrows(AccessDeniedException.class, () ->
                studentLibraryService.downloadPurchasedPdf(studentPrincipal, 10L)
        );

        assertTrue(ex.getMessage().contains("You have not purchased this e-book"));
        verify(fileStorageService, never()).loadPdfAsResource(any());
    }

    @Test
    void testDownloadPurchasedPdf_Denied_StudentACannotDownloadStudentBPurchase() {
        // Student B owns the book, but Student A (ID=1) tries to download
        when(ebookRepository.findById(10L)).thenReturn(Optional.of(sampleEbook));
        when(orderRepository.hasUserPurchasedEbook(1L, 10L)).thenReturn(false);

        assertThrows(AccessDeniedException.class, () ->
                studentLibraryService.downloadPurchasedPdf(studentPrincipal, 10L)
        );

        verify(fileStorageService, never()).loadPdfAsResource(any());
    }

    @Test
    void testDownloadPurchasedPdf_Success_ForAdmin() {
        when(ebookRepository.findById(10L)).thenReturn(Optional.of(sampleEbook));
        Resource mockResource = new ByteArrayResource("dummy admin pdf".getBytes());
        when(fileStorageService.loadPdfAsResource("uuid-123_core-java.pdf")).thenReturn(mockResource);

        PdfDownloadResourceDto result = studentLibraryService.downloadPurchasedPdf(adminPrincipal, 10L);

        assertNotNull(result);
        verify(orderRepository, never()).hasUserPurchasedEbook(any(), any());
        verify(fileStorageService).loadPdfAsResource("uuid-123_core-java.pdf");
    }

    @Test
    void testDownloadPurchasedPdf_ThrowsNotFound_WhenEbookDoesNotExist() {
        when(ebookRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                studentLibraryService.downloadPurchasedPdf(studentPrincipal, 999L)
        );
    }

    @Test
    void testDownloadPurchasedPdf_ThrowsNotFound_WhenPdfNotUploaded() {
        sampleEbook.setPdfStorageKey(null);
        when(ebookRepository.findById(10L)).thenReturn(Optional.of(sampleEbook));
        when(orderRepository.hasUserPurchasedEbook(1L, 10L)).thenReturn(true);

        ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class, () ->
                studentLibraryService.downloadPurchasedPdf(studentPrincipal, 10L)
        );

        assertTrue(ex.getMessage().contains("PDF file is not available"));
    }

    @Test
    void testGetStudentLibrary_ReturnsOnlyPaidEbooks() {
        when(orderRepository.findPurchasedEbooksByUserId(1L)).thenReturn(List.of(sampleEbook));

        List<EbookResponseDto> library = studentLibraryService.getStudentLibrary(studentPrincipal);

        assertNotNull(library);
        assertEquals(1, library.size());
        assertEquals("Core Java Handbook", library.get(0).getTitle());
        verify(orderRepository).findPurchasedEbooksByUserId(1L);
    }
}
