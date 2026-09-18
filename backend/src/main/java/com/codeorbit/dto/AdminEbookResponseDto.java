package com.codeorbit.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminEbookResponseDto {

    private Long id;
    private String title;
    private String authorName;
    private String category;
    private String description;
    private BigDecimal price;
    private Integer pageCount;
    private String coverImageUrl;
    private boolean active;
    private String pdfFileName;
    private String pdfStorageKey;
    private Long pdfFileSize;
    private boolean hasPdf;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AdminEbookResponseDto() {
    }

    public AdminEbookResponseDto(Long id, String title, String authorName, String category,
                                 String description, BigDecimal price, Integer pageCount,
                                 String coverImageUrl, boolean active, String pdfFileName,
                                 String pdfStorageKey, Long pdfFileSize,
                                 LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.authorName = authorName;
        this.category = category;
        this.description = description;
        this.price = price;
        this.pageCount = pageCount;
        this.coverImageUrl = coverImageUrl;
        this.active = active;
        this.pdfFileName = pdfFileName;
        this.pdfStorageKey = pdfStorageKey;
        this.pdfFileSize = pdfFileSize;
        this.hasPdf = pdfStorageKey != null && !pdfStorageKey.trim().isEmpty();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getPageCount() {
        return pageCount;
    }

    public void setPageCount(Integer pageCount) {
        this.pageCount = pageCount;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getPdfFileName() {
        return pdfFileName;
    }

    public void setPdfFileName(String pdfFileName) {
        this.pdfFileName = pdfFileName;
    }

    public String getPdfStorageKey() {
        return pdfStorageKey;
    }

    public void setPdfStorageKey(String pdfStorageKey) {
        this.pdfStorageKey = pdfStorageKey;
    }

    public Long getPdfFileSize() {
        return pdfFileSize;
    }

    public void setPdfFileSize(Long pdfFileSize) {
        this.pdfFileSize = pdfFileSize;
    }

    public boolean isHasPdf() {
        return hasPdf;
    }

    public void setHasPdf(boolean hasPdf) {
        this.hasPdf = hasPdf;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
