package com.codeorbit.service.impl;

import com.codeorbit.dto.EbookResponseDto;
import com.codeorbit.dto.PdfDownloadResourceDto;
import com.codeorbit.entity.Ebook;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.EbookRepository;
import com.codeorbit.repository.OrderRepository;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.FileStorageService;
import com.codeorbit.service.StudentLibraryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class StudentLibraryServiceImpl implements StudentLibraryService {

    private static final Logger log = LoggerFactory.getLogger(StudentLibraryServiceImpl.class);

    private final OrderRepository orderRepository;
    private final EbookRepository ebookRepository;
    private final FileStorageService fileStorageService;

    public StudentLibraryServiceImpl(
            OrderRepository orderRepository,
            EbookRepository ebookRepository,
            FileStorageService fileStorageService
    ) {
        this.orderRepository = orderRepository;
        this.ebookRepository = ebookRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EbookResponseDto> getStudentLibrary(UserPrincipal principal) {
        if (principal == null || principal.getId() == null) {
            throw new AccessDeniedException("User must be authenticated to access student library.");
        }

        List<Ebook> purchasedEbooks = orderRepository.findPurchasedEbooksByUserId(principal.getId());
        log.info("Retrieved {} purchased e-book(s) in library for student ID: {}", purchasedEbooks.size(), principal.getId());

        return purchasedEbooks.stream()
                .map(this::mapToEbookResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PdfDownloadResourceDto downloadPurchasedPdf(UserPrincipal principal, Long ebookId) {
        if (principal == null || principal.getId() == null) {
            throw new AccessDeniedException("User must be authenticated to download e-book PDF.");
        }

        if (ebookId == null) {
            throw new IllegalArgumentException("E-Book ID cannot be null.");
        }

        Ebook ebook = ebookRepository.findById(ebookId)
                .orElseThrow(() -> new ResourceNotFoundException("E-Book", "id", ebookId));

        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        // Verify purchase ownership for students
        if (!isAdmin) {
            boolean hasPurchased = orderRepository.hasUserPurchasedEbook(principal.getId(), ebookId);
            if (!hasPurchased) {
                log.warn("Unauthorized download attempt: Student ID {} attempted to download unpurchased/unpaid E-Book #{} ('{}')",
                        principal.getId(), ebookId, ebook.getTitle());
                throw new AccessDeniedException("Access denied. You have not purchased this e-book or your payment is not completed.");
            }
        }

        if (!StringUtils.hasText(ebook.getPdfStorageKey())) {
            log.warn("E-Book #{} ('{}') does not have a PDF storage key configured", ebookId, ebook.getTitle());
            throw new ResourceNotFoundException("PDF file is not available for this e-book.");
        }

        Resource resource = fileStorageService.loadPdfAsResource(ebook.getPdfStorageKey());

        String safeFileName = StringUtils.hasText(ebook.getPdfFileName())
                ? ebook.getPdfFileName()
                : ebook.getTitle().replaceAll("[^a-zA-Z0-9.-]", "_") + ".pdf";

        log.info("Authorized PDF download for user ID: {} ('{}') - E-Book #{}: '{}'",
                principal.getId(), principal.getEmail(), ebookId, safeFileName);

        return new PdfDownloadResourceDto(resource, safeFileName, ebook.getPdfFileSize());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isEbookPurchased(UserPrincipal principal, Long ebookId) {
        if (principal == null || principal.getId() == null || ebookId == null) {
            return false;
        }

        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return true;
        }

        return orderRepository.hasUserPurchasedEbook(principal.getId(), ebookId);
    }

    private EbookResponseDto mapToEbookResponseDto(Ebook ebook) {
        return new EbookResponseDto(
                ebook.getId(),
                ebook.getTitle(),
                ebook.getAuthorName(),
                ebook.getCategory(),
                ebook.getDescription(),
                ebook.getPrice(),
                ebook.getPageCount(),
                ebook.getCoverImageUrl(),
                ebook.isActive(),
                ebook.getCreatedAt()
        );
    }
}
