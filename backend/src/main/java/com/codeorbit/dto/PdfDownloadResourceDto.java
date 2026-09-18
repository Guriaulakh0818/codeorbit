package com.codeorbit.dto;

import org.springframework.core.io.Resource;

public class PdfDownloadResourceDto {

    private final Resource resource;
    private final String originalFileName;
    private final Long fileSize;

    public PdfDownloadResourceDto(Resource resource, String originalFileName, Long fileSize) {
        this.resource = resource;
        this.originalFileName = originalFileName;
        this.fileSize = fileSize;
    }

    public Resource getResource() {
        return resource;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public Long getFileSize() {
        return fileSize;
    }
}
