package com.codeorbit.controller;

import com.codeorbit.dto.ApiResponse;
import com.codeorbit.dto.EbookResponseDto;
import com.codeorbit.dto.PdfDownloadResourceDto;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.StudentLibraryService;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentLibraryController {

    private final StudentLibraryService studentLibraryService;

    public StudentLibraryController(StudentLibraryService studentLibraryService) {
        this.studentLibraryService = studentLibraryService;
    }

    /**
     * GET /api/student/library
     * Returns all e-books purchased by the authenticated student via PAID orders.
     */
    @GetMapping("/library")
    public ResponseEntity<ApiResponse<List<EbookResponseDto>>> getStudentLibrary(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<EbookResponseDto> library = studentLibraryService.getStudentLibrary(principal);
        return ResponseEntity.ok(ApiResponse.success("Student library retrieved successfully", library));
    }

    /**
     * GET /api/student/ebooks/{ebookId}/download
     * Securely streams/downloads the master PDF file for a purchased e-book.
     */
    @GetMapping("/ebooks/{ebookId}/download")
    public ResponseEntity<Resource> downloadPurchasedPdf(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long ebookId
    ) {
        PdfDownloadResourceDto downloadDto = studentLibraryService.downloadPurchasedPdf(principal, ebookId);

        ContentDisposition contentDisposition = ContentDisposition.attachment()
                .filename(downloadDto.getOriginalFileName())
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(contentDisposition);
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.add(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate");
        headers.add(HttpHeaders.PRAGMA, "no-cache");
        headers.add(HttpHeaders.EXPIRES, "0");

        if (downloadDto.getFileSize() != null && downloadDto.getFileSize() > 0) {
            headers.setContentLength(downloadDto.getFileSize());
        }

        return ResponseEntity.ok()
                .headers(headers)
                .body(downloadDto.getResource());
    }

    /**
     * GET /api/student/ebooks/{ebookId}/access
     * Checks if current student has purchased and paid for the specified e-book.
     */
    @GetMapping("/ebooks/{ebookId}/access")
    public ResponseEntity<ApiResponse<Boolean>> checkEbookAccess(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long ebookId
    ) {
        boolean hasAccess = studentLibraryService.isEbookPurchased(principal, ebookId);
        return ResponseEntity.ok(ApiResponse.success(hasAccess));
    }
}
