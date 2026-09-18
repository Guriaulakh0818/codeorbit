package com.codeorbit.controller;

import com.codeorbit.dto.*;
import com.codeorbit.service.AdminEbookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST Controller for Store Owner / Admin E-Book Management.
 * 
 * NOTE (Pre-Auth Milestone):
 * Authentication and role authorization will be enforced at the API gateway / Spring Security
 * layer in the upcoming milestone. This controller provides validated administrative operations.
 */
@RestController
@RequestMapping("/api/admin/ebooks")
public class AdminEbookController {

    private final AdminEbookService adminEbookService;

    public AdminEbookController(AdminEbookService adminEbookService) {
        this.adminEbookService = adminEbookService;
    }

    /**
     * GET /api/admin/ebooks
     * Returns a paginated list of all e-books for admin management (including drafts/inactive).
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponseDto<AdminEbookResponseDto>>> getAllAdminEbooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PagedResponseDto<AdminEbookResponseDto> response = adminEbookService.getAllAdminEbooks(
                search, category, active, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * GET /api/admin/ebooks/metrics
     * Returns admin dashboard metrics (total e-books, published, unpublished, orders).
     */
    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<AdminDashboardMetricsDto>> getAdminMetrics() {
        AdminDashboardMetricsDto metrics = adminEbookService.getAdminMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }

    /**
     * GET /api/admin/ebooks/{id}
     * Returns single e-book details for admin view/editing.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminEbookResponseDto>> getAdminEbookById(@PathVariable Long id) {
        AdminEbookResponseDto response = adminEbookService.getAdminEbookById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * POST /api/admin/ebooks (JSON)
     * Creates a new e-book with JSON metadata.
     */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<AdminEbookResponseDto>> createEbookJson(
            @Valid @RequestBody AdminEbookRequestDto dto
    ) {
        AdminEbookResponseDto response = adminEbookService.createEbook(dto, null);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("E-Book created successfully", response));
    }

    /**
     * POST /api/admin/ebooks (Multipart)
     * Creates a new e-book with metadata and an uploaded master PDF file.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<AdminEbookResponseDto>> createEbookMultipart(
            @Valid @RequestPart("data") AdminEbookRequestDto dto,
            @RequestPart(value = "pdf", required = false) MultipartFile pdfFile
    ) {
        AdminEbookResponseDto response = adminEbookService.createEbook(dto, pdfFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("E-Book created with PDF successfully", response));
    }

    /**
     * PUT /api/admin/ebooks/{id} (JSON)
     * Updates an existing e-book.
     */
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<AdminEbookResponseDto>> updateEbookJson(
            @PathVariable Long id,
            @Valid @RequestBody AdminEbookRequestDto dto
    ) {
        AdminEbookResponseDto response = adminEbookService.updateEbook(id, dto, null);
        return ResponseEntity.ok(ApiResponse.success("E-Book updated successfully", response));
    }

    /**
     * PUT /api/admin/ebooks/{id} (Multipart)
     * Updates an existing e-book and optionally replaces its master PDF file.
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<AdminEbookResponseDto>> updateEbookMultipart(
            @PathVariable Long id,
            @Valid @RequestPart("data") AdminEbookRequestDto dto,
            @RequestPart(value = "pdf", required = false) MultipartFile pdfFile
    ) {
        AdminEbookResponseDto response = adminEbookService.updateEbook(id, dto, pdfFile);
        return ResponseEntity.ok(ApiResponse.success("E-Book updated with PDF successfully", response));
    }

    /**
     * PATCH /api/admin/ebooks/{id}/status
     * Toggles the active/published status of an e-book.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AdminEbookResponseDto>> updateEbookStatus(
            @PathVariable Long id,
            @Valid @RequestBody AdminEbookStatusRequestDto statusDto
    ) {
        AdminEbookResponseDto response = adminEbookService.updateEbookStatus(id, statusDto.getActive());
        String msg = statusDto.getActive() ? "E-Book published successfully" : "E-Book unpublished successfully";
        return ResponseEntity.ok(ApiResponse.success(msg, response));
    }

    /**
     * DELETE /api/admin/ebooks/{id}
     * Deletes an e-book and its private PDF storage.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEbook(@PathVariable Long id) {
        adminEbookService.deleteEbook(id);
        return ResponseEntity.ok(ApiResponse.success("E-Book deleted successfully", null));
    }
}
