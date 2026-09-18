package com.codeorbit.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class AdminEbookRequestDto {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @NotBlank(message = "Author name is required")
    @Size(max = 255, message = "Author name cannot exceed 255 characters")
    private String authorName;

    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category cannot exceed 100 characters")
    private String category;

    @Size(max = 5000, message = "Description cannot exceed 5000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be non-negative")
    private BigDecimal price;

    @NotNull(message = "Page count is required")
    @Min(value = 1, message = "Page count must be at least 1")
    private Integer pageCount;

    @Size(max = 1000, message = "Cover image URL cannot exceed 1000 characters")
    private String coverImageUrl;

    private Boolean active = true;

    private String pdfFileName;
    private String pdfStorageKey;
    private Long pdfFileSize;

    public AdminEbookRequestDto() {
    }

    public AdminEbookRequestDto(String title, String authorName, String category, String description,
                                BigDecimal price, Integer pageCount, String coverImageUrl, Boolean active) {
        this.title = title;
        this.authorName = authorName;
        this.category = category;
        this.description = description;
        this.price = price;
        this.pageCount = pageCount;
        this.coverImageUrl = coverImageUrl;
        this.active = active != null ? active : true;
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

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
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
}
