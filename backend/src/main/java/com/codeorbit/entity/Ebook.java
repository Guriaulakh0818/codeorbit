package com.codeorbit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ebooks")
public class Ebook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    @Column(nullable = false, length = 255)
    private String title;

    @NotBlank(message = "Author name is required")
    @Size(max = 255, message = "Author name cannot exceed 255 characters")
    @Column(name = "author_name", nullable = false, length = 255)
    private String authorName;

    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category cannot exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be non-negative")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Min(value = 1, message = "Page count must be at least 1")
    @Column(name = "page_count")
    private Integer pageCount;

    @Column(name = "cover_image_url", length = 1000)
    private String coverImageUrl;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "pdf_file_name", length = 255)
    private String pdfFileName;

    @Column(name = "pdf_storage_key", length = 500)
    private String pdfStorageKey;

    @Column(name = "pdf_file_size")
    private Long pdfFileSize;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Ebook() {
    }

    public Ebook(String title, String authorName, String category, String description,
                 BigDecimal price, Integer pageCount, String coverImageUrl, boolean active) {
        this.title = title;
        this.authorName = authorName;
        this.category = category;
        this.description = description;
        this.price = price;
        this.pageCount = pageCount;
        this.coverImageUrl = coverImageUrl;
        this.active = active;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
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

