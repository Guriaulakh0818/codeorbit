package com.codeorbit.dto;

import java.math.BigDecimal;

public class OrderItemResponseDto {

    private Long id;
    private Long ebookId;
    private String title;
    private String authorName;
    private String category;
    private BigDecimal price;
    private String coverImageUrl;

    public OrderItemResponseDto() {
    }

    public OrderItemResponseDto(Long id, Long ebookId, String title, String authorName, String category, BigDecimal price, String coverImageUrl) {
        this.id = id;
        this.ebookId = ebookId;
        this.title = title;
        this.authorName = authorName;
        this.category = category;
        this.price = price;
        this.coverImageUrl = coverImageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEbookId() {
        return ebookId;
    }

    public void setEbookId(Long ebookId) {
        this.ebookId = ebookId;
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }
}
