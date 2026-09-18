package com.codeorbit.service;

import com.codeorbit.dto.StoredFileMetadata;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    /**
     * Validates and stores a PDF file in private storage.
     *
     * @param file the uploaded multipart file
     * @return metadata containing original filename, storage key, and size
     */
    StoredFileMetadata storePdfFile(MultipartFile file);

    /**
     * Deletes a stored file by its storage key.
     *
     * @param storageKey the private storage key
     * @return true if deleted, false otherwise
     */
    boolean deleteFile(String storageKey);

    /**
     * Loads a stored private PDF as a Spring Resource for secure streaming/downloading.
     *
     * @param storageKey the private storage key
     * @return the readable Resource
     */
    org.springframework.core.io.Resource loadPdfAsResource(String storageKey);
}
