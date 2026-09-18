package com.codeorbit.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class EbookResponseDto {

    private Long id;
    private String title;
    private String authorName;
    private String category;
    private String description;
    private BigDecimal price;
    private Integer pageCount;
    private String coverImageUrl;
    private boolean active;
    private LocalDateTime createdAt;

    public EbookResponseDto() {
    }

    public EbookResponseDto(Long id, String title, String authorName, String category,
                            String description, BigDecimal price, Integer pageCount,
                            String coverImageUrl, boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.authorName = authorName;
        this.category = category;
        this.description = description;
        this.price = price;
        this.pageCount = pageCount;
        this.coverImageUrl = coverImageUrl;
        this.active = active;
        this.createdAt = createdAt;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
