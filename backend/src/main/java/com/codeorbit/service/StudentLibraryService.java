package com.codeorbit.service;

import com.codeorbit.dto.EbookResponseDto;
import com.codeorbit.dto.PdfDownloadResourceDto;
import com.codeorbit.security.UserPrincipal;

import java.util.List;

public interface StudentLibraryService {

    /**
     * Retrieves all e-books purchased by the authenticated student via completed (PAID) orders.
     *
     * @param principal authenticated user principal
     * @return list of purchased e-books
     */
    List<EbookResponseDto> getStudentLibrary(UserPrincipal principal);

    /**
     * Securely downloads the private PDF of a purchased e-book for the authenticated student.
     * Verifies purchase ownership and loads the Spring Resource safely.
     *
     * @param principal authenticated user principal
     * @param ebookId the e-book ID
     * @return PdfDownloadResourceDto with readable Resource and original filename
     */
    PdfDownloadResourceDto downloadPurchasedPdf(UserPrincipal principal, Long ebookId);

    /**
     * Checks if the student has a paid order containing the specified e-book.
     *
     * @param principal authenticated user principal
     * @param ebookId the e-book ID
     * @return true if purchased and paid, false otherwise
     */
    boolean isEbookPurchased(UserPrincipal principal, Long ebookId);
}
