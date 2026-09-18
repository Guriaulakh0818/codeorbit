package com.codeorbit.service.impl;

import com.codeorbit.dto.StoredFileMetadata;
import com.codeorbit.exception.FileStorageException;
import com.codeorbit.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class LocalFileStorageServiceImpl implements FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(LocalFileStorageServiceImpl.class);
    private static final long MAX_PDF_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

    private final Path storageDirectory;

    public LocalFileStorageServiceImpl(
            @Value("${app.storage.private-pdf-path:./storage/private/pdfs}") String storagePathStr
    ) {
        this.storageDirectory = Paths.get(storagePathStr).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.storageDirectory);
            log.info("Private PDF file storage directory initialized at: {}", this.storageDirectory);
        } catch (IOException e) {
            throw new FileStorageException("Could not initialize private PDF storage directory at: " + this.storageDirectory, e);
        }
    }

    @Override
    public StoredFileMetadata storePdfFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileStorageException("Cannot upload an empty or missing file.");
        }

        if (file.getSize() > MAX_PDF_SIZE_BYTES) {
            throw new FileStorageException("File size exceeds the 50 MB limit. Provided: " + (file.getSize() / (1024 * 1024)) + " MB");
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNullElse(file.getOriginalFilename(), "unnamed.pdf"));

        // Security check: Reject path traversal
        if (originalFilename.contains("..")) {
            throw new FileStorageException("Filename contains invalid path sequence: " + originalFilename);
        }

        // Restrict strictly to PDF files
        if (!originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new FileStorageException("Invalid file format. Only PDF (.pdf) files are permitted.");
        }

        // Generate private storage key: UUID_cleanedname.pdf
        String cleanBaseName = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        String storageKey = UUID.randomUUID() + "_" + cleanBaseName;
        Path targetLocation = this.storageDirectory.resolve(storageKey).normalize();

        // Extra guard: Ensure target stays inside storageDirectory
        if (!targetLocation.startsWith(this.storageDirectory)) {
            throw new FileStorageException("Cannot store file outside current storage directory.");
        }

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            log.info("Successfully stored private PDF file: {} with key: {}", originalFilename, storageKey);
            return new StoredFileMetadata(originalFilename, storageKey, file.getSize());
        } catch (IOException e) {
            throw new FileStorageException("Failed to store private PDF file: " + originalFilename, e);
        }
    }

    @Override
    public boolean deleteFile(String storageKey) {
        if (!StringUtils.hasText(storageKey)) {
            return false;
        }
        try {
            Path targetLocation = this.storageDirectory.resolve(storageKey).normalize();
            if (!targetLocation.startsWith(this.storageDirectory)) {
                log.warn("Attempted to delete file outside storage directory: {}", storageKey);
                return false;
            }
            return Files.deleteIfExists(targetLocation);
        } catch (IOException e) {
            log.error("Failed to delete private file with key: {}", storageKey, e);
            return false;
        }
    }

    @Override
    public org.springframework.core.io.Resource loadPdfAsResource(String storageKey) {
        if (!StringUtils.hasText(storageKey)) {
            throw new com.codeorbit.exception.ResourceNotFoundException("PDF file not configured for this e-book");
        }

        // Security check: Reject path traversal sequences in storage key
        if (storageKey.contains("..") || storageKey.contains("/") || storageKey.contains("\\")) {
            log.warn("Path traversal sequence detected in storageKey: {}", storageKey);
            throw new FileStorageException("Invalid file key format: " + storageKey);
        }

        Path filePath = this.storageDirectory.resolve(storageKey).normalize();

        // Extra guard: Ensure resolved path stays strictly within the private storage directory
        if (!filePath.startsWith(this.storageDirectory)) {
            log.error("Security violation: Attempted access outside private storage directory: {}", filePath);
            throw new FileStorageException("Access denied: File outside storage directory.");
        }

        try {
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                log.warn("Requested PDF file resource does not exist or is not readable: {}", storageKey);
                throw new com.codeorbit.exception.ResourceNotFoundException("PDF file not found or unreadable on server");
            }
        } catch (java.net.MalformedURLException e) {
            log.error("Malformed URL while creating resource for storage key: {}", storageKey, e);
            throw new FileStorageException("Could not read file from storage path", e);
        }
    }
}
