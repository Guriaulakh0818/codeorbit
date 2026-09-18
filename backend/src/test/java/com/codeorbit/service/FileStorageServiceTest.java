package com.codeorbit.service;

import com.codeorbit.dto.StoredFileMetadata;
import com.codeorbit.exception.FileStorageException;
import com.codeorbit.service.impl.LocalFileStorageServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class FileStorageServiceTest {

    @TempDir
    Path tempDir;

    private FileStorageService fileStorageService;

    @BeforeEach
    void setUp() {
        fileStorageService = new LocalFileStorageServiceImpl(tempDir.toString());
    }

    @Test
    void testStoreValidPdfFile_Success() {
        MockMultipartFile file = new MockMultipartFile(
                "pdf",
                "core-java-handbook.pdf",
                "application/pdf",
                "Sample PDF Content for Testing".getBytes()
        );

        StoredFileMetadata meta = fileStorageService.storePdfFile(file);

        assertNotNull(meta);
        assertEquals("core-java-handbook.pdf", meta.getOriginalFileName());
        assertNotNull(meta.getStorageKey());
        assertTrue(meta.getStorageKey().endsWith(".pdf"));
        assertTrue(meta.getFileSize() > 0);
    }

    @Test
    void testStoreNonPdfFile_ThrowsException() {
        MockMultipartFile file = new MockMultipartFile(
                "pdf",
                "malicious.exe",
                "application/x-msdownload",
                "binary content".getBytes()
        );

        FileStorageException ex = assertThrows(FileStorageException.class, () ->
                fileStorageService.storePdfFile(file)
        );

        assertTrue(ex.getMessage().contains("Only PDF (.pdf) files are permitted"));
    }

    @Test
    void testStoreEmptyFile_ThrowsException() {
        MockMultipartFile file = new MockMultipartFile(
                "pdf",
                "empty.pdf",
                "application/pdf",
                new byte[0]
        );

        FileStorageException ex = assertThrows(FileStorageException.class, () ->
                fileStorageService.storePdfFile(file)
        );

        assertTrue(ex.getMessage().contains("Cannot upload an empty or missing file"));
    }

    @Test
    void testDeleteFile_Success() {
        MockMultipartFile file = new MockMultipartFile(
                "pdf",
                "test-delete.pdf",
                "application/pdf",
                "delete test content".getBytes()
        );

        StoredFileMetadata meta = fileStorageService.storePdfFile(file);
        boolean deleted = fileStorageService.deleteFile(meta.getStorageKey());

        assertTrue(deleted);
    }

    @Test
    void testLoadPdfAsResource_Success() {
        MockMultipartFile file = new MockMultipartFile(
                "pdf",
                "sample-ebook.pdf",
                "application/pdf",
                "Sample PDF Content for Download Testing".getBytes()
        );

        StoredFileMetadata meta = fileStorageService.storePdfFile(file);
        org.springframework.core.io.Resource resource = fileStorageService.loadPdfAsResource(meta.getStorageKey());

        assertNotNull(resource);
        assertTrue(resource.exists());
        assertTrue(resource.isReadable());
    }

    @Test
    void testLoadPdfAsResource_NonExistentFile_ThrowsNotFound() {
        assertThrows(com.codeorbit.exception.ResourceNotFoundException.class, () ->
                fileStorageService.loadPdfAsResource("non-existent-uuid_file.pdf")
        );
    }

    @Test
    void testLoadPdfAsResource_PathTraversalAttacks_Rejected() {
        assertThrows(FileStorageException.class, () ->
                fileStorageService.loadPdfAsResource("../secret.pdf")
        );

        assertThrows(FileStorageException.class, () ->
                fileStorageService.loadPdfAsResource("../../windows/system32/cmd.exe")
        );

        assertThrows(FileStorageException.class, () ->
                fileStorageService.loadPdfAsResource("subfolder/other.pdf")
        );

        assertThrows(FileStorageException.class, () ->
                fileStorageService.loadPdfAsResource("subfolder\\other.pdf")
        );
    }
}
