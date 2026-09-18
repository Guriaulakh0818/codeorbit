package com.codeorbit.controller;

import com.codeorbit.dto.ApiResponse;
import com.codeorbit.dto.EbookResponseDto;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.service.EbookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ebooks")
public class EbookController {

    private final EbookService ebookService;

    public EbookController(EbookService ebookService) {
        this.ebookService = ebookService;
    }

    /**
     * GET /api/ebooks
     * Returns a paginated list of active e-books with optional search, category filter, and sorting.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponseDto<EbookResponseDto>>> getActiveEbooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PagedResponseDto<EbookResponseDto> response = ebookService.getActiveEbooks(
                search, category, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * GET /api/ebooks/categories
     * Returns a list of distinct categories from active e-books.
     */
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getAvailableCategories() {
        List<String> categories = ebookService.getActiveCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    /**
     * GET /api/ebooks/{id}
     * Returns details for a single active e-book or 404 if not found / inactive.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EbookResponseDto>> getEbookById(@PathVariable Long id) {
        EbookResponseDto ebook = ebookService.getActiveEbookById(id);
        return ResponseEntity.ok(ApiResponse.success(ebook));
    }
}
