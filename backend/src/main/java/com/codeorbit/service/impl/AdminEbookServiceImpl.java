package com.codeorbit.service.impl;

import com.codeorbit.dto.*;
import com.codeorbit.entity.Ebook;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.EbookRepository;
import com.codeorbit.service.AdminEbookService;
import com.codeorbit.service.FileStorageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminEbookServiceImpl implements AdminEbookService {

    private final EbookRepository ebookRepository;
    private final FileStorageService fileStorageService;
    private final com.codeorbit.repository.OrderRepository orderRepository;
    private final com.codeorbit.repository.UserRepository userRepository;

    public AdminEbookServiceImpl(
            EbookRepository ebookRepository,
            FileStorageService fileStorageService,
            com.codeorbit.repository.OrderRepository orderRepository,
            com.codeorbit.repository.UserRepository userRepository
    ) {
        this.ebookRepository = ebookRepository;
        this.fileStorageService = fileStorageService;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Override
    public AdminEbookResponseDto createEbook(AdminEbookRequestDto dto, MultipartFile pdfFile) {
        Ebook ebook = new Ebook();
        ebook.setTitle(dto.getTitle().trim());
        ebook.setAuthorName(dto.getAuthorName().trim());
        ebook.setCategory(dto.getCategory().trim());
        ebook.setDescription(dto.getDescription());
        ebook.setPrice(dto.getPrice());
        ebook.setPageCount(dto.getPageCount());
        ebook.setCoverImageUrl(dto.getCoverImageUrl());
        ebook.setActive(dto.getActive() != null ? dto.getActive() : true);

        // Process PDF upload if present
        if (pdfFile != null && !pdfFile.isEmpty()) {
            StoredFileMetadata fileMeta = fileStorageService.storePdfFile(pdfFile);
            ebook.setPdfFileName(fileMeta.getOriginalFileName());
            ebook.setPdfStorageKey(fileMeta.getStorageKey());
            ebook.setPdfFileSize(fileMeta.getFileSize());
        } else if (StringUtils.hasText(dto.getPdfStorageKey())) {
            ebook.setPdfFileName(dto.getPdfFileName());
            ebook.setPdfStorageKey(dto.getPdfStorageKey());
            ebook.setPdfFileSize(dto.getPdfFileSize());
        }

        Ebook saved = ebookRepository.save(ebook);
        return mapToAdminDto(saved);
    }

    @Override
    public AdminEbookResponseDto updateEbook(Long id, AdminEbookRequestDto dto, MultipartFile pdfFile) {
        Ebook ebook = ebookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("E-Book", "id", id));

        ebook.setTitle(dto.getTitle().trim());
        ebook.setAuthorName(dto.getAuthorName().trim());
        ebook.setCategory(dto.getCategory().trim());
        ebook.setDescription(dto.getDescription());
        ebook.setPrice(dto.getPrice());
        ebook.setPageCount(dto.getPageCount());
        ebook.setCoverImageUrl(dto.getCoverImageUrl());
        if (dto.getActive() != null) {
            ebook.setActive(dto.getActive());
        }

        // Process new PDF upload if provided
        if (pdfFile != null && !pdfFile.isEmpty()) {
            if (StringUtils.hasText(ebook.getPdfStorageKey())) {
                fileStorageService.deleteFile(ebook.getPdfStorageKey());
            }
            StoredFileMetadata fileMeta = fileStorageService.storePdfFile(pdfFile);
            ebook.setPdfFileName(fileMeta.getOriginalFileName());
            ebook.setPdfStorageKey(fileMeta.getStorageKey());
            ebook.setPdfFileSize(fileMeta.getFileSize());
        } else if (StringUtils.hasText(dto.getPdfStorageKey())) {
            ebook.setPdfFileName(dto.getPdfFileName());
            ebook.setPdfStorageKey(dto.getPdfStorageKey());
            ebook.setPdfFileSize(dto.getPdfFileSize());
        }

        Ebook updated = ebookRepository.save(ebook);
        return mapToAdminDto(updated);
    }

    @Override
    public AdminEbookResponseDto updateEbookStatus(Long id, boolean active) {
        Ebook ebook = ebookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("E-Book", "id", id));

        ebook.setActive(active);
        Ebook saved = ebookRepository.save(ebook);
        return mapToAdminDto(saved);
    }

    @Override
    public void deleteEbook(Long id) {
        Ebook ebook = ebookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("E-Book", "id", id));

        if (StringUtils.hasText(ebook.getPdfStorageKey())) {
            fileStorageService.deleteFile(ebook.getPdfStorageKey());
        }

        ebookRepository.delete(ebook);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminEbookResponseDto getAdminEbookById(Long id) {
        Ebook ebook = ebookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("E-Book", "id", id));
        return mapToAdminDto(ebook);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponseDto<AdminEbookResponseDto> getAllAdminEbooks(
            String search,
            String category,
            Boolean active,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        String validatedSortBy = switch (sortBy != null ? sortBy.toLowerCase() : "id") {
            case "title" -> "title";
            case "price" -> "price";
            case "category" -> "category";
            case "createdat" -> "createdAt";
            default -> "id";
        };

        Sort sort = "desc".equalsIgnoreCase(sortDir)
                ? Sort.by(validatedSortBy).descending()
                : Sort.by(validatedSortBy).ascending();

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sort);

        Page<Ebook> ebookPage = ebookRepository.searchAdminEbooks(search, category, active, pageable);

        List<AdminEbookResponseDto> content = ebookPage.getContent()
                .stream()
                .map(this::mapToAdminDto)
                .collect(Collectors.toList());

        return new PagedResponseDto<>(
                content,
                ebookPage.getNumber(),
                ebookPage.getSize(),
                ebookPage.getTotalElements(),
                ebookPage.getTotalPages(),
                ebookPage.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardMetricsDto getAdminMetrics() {
        long totalEbooks = ebookRepository.count();
        long publishedEbooks = ebookRepository.countByActive(true);
        long unpublishedEbooks = ebookRepository.countByActive(false);

        long totalOrders = orderRepository.count();
        long paidOrders = orderRepository.countByStatus(com.codeorbit.entity.OrderStatus.PAID);
        long pendingOrders = orderRepository.countByStatus(com.codeorbit.entity.OrderStatus.PENDING);
        long failedOrders = orderRepository.countByStatus(com.codeorbit.entity.OrderStatus.FAILED);

        BigDecimal totalRevenue = orderRepository.calculateTotalPaidRevenue();
        long totalStudents = userRepository.countByRole(com.codeorbit.entity.Role.STUDENT);

        return new AdminDashboardMetricsDto(
                totalEbooks,
                publishedEbooks,
                unpublishedEbooks,
                totalOrders,
                paidOrders,
                pendingOrders,
                failedOrders,
                totalRevenue,
                totalStudents
        );
    }

    private AdminEbookResponseDto mapToAdminDto(Ebook ebook) {
        return new AdminEbookResponseDto(
                ebook.getId(),
                ebook.getTitle(),
                ebook.getAuthorName(),
                ebook.getCategory(),
                ebook.getDescription(),
                ebook.getPrice(),
                ebook.getPageCount(),
                ebook.getCoverImageUrl(),
                ebook.isActive(),
                ebook.getPdfFileName(),
                ebook.getPdfStorageKey(),
                ebook.getPdfFileSize(),
                ebook.getCreatedAt(),
                ebook.getUpdatedAt()
        );
    }
}
