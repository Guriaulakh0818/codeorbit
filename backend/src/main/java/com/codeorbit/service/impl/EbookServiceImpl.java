package com.codeorbit.service.impl;

import com.codeorbit.dto.EbookResponseDto;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.entity.Ebook;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.EbookRepository;
import com.codeorbit.service.EbookService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class EbookServiceImpl implements EbookService {

    private final EbookRepository ebookRepository;

    public EbookServiceImpl(EbookRepository ebookRepository) {
        this.ebookRepository = ebookRepository;
    }

    @Override
    public PagedResponseDto<EbookResponseDto> getActiveEbooks(
            String search,
            String category,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        // Enforce safe pagination boundaries
        int pageNumber = Math.max(0, page);
        int pageSize = (size > 0 && size <= 100) ? size : 10;

        String safeSortBy = sanitizeSortField(sortBy);
        Sort sort = "desc".equalsIgnoreCase(sortDir)
                ? Sort.by(safeSortBy).descending()
                : Sort.by(safeSortBy).ascending();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        String trimmedSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String trimmedCategory = (category != null && !category.trim().isEmpty()) ? category.trim() : null;

        Page<Ebook> ebookPage = ebookRepository.searchActiveEbooks(trimmedSearch, trimmedCategory, pageable);

        List<EbookResponseDto> dtoList = ebookPage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new PagedResponseDto<>(
                dtoList,
                ebookPage.getNumber(),
                ebookPage.getSize(),
                ebookPage.getTotalElements(),
                ebookPage.getTotalPages(),
                ebookPage.isLast()
        );
    }

    @Override
    public EbookResponseDto getActiveEbookById(Long id) {
        Ebook ebook = ebookRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("E-book not found with id: " + id));
        return mapToDto(ebook);
    }

    @Override
    public List<String> getActiveCategories() {
        return ebookRepository.findDistinctCategories();
    }

    private String sanitizeSortField(String sortBy) {
        if (sortBy == null) return "createdAt";
        return switch (sortBy.toLowerCase()) {
            case "price" -> "price";
            case "title" -> "title";
            case "pagecount", "pages" -> "pageCount";
            case "authorname", "author" -> "authorName";
            default -> "createdAt";
        };
    }

    private EbookResponseDto mapToDto(Ebook ebook) {
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
