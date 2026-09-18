package com.codeorbit.dto;

import java.math.BigDecimal;

public class AdminOrderItemDto {

    private Long ebookId;
    private String ebookTitle;
    private String authorName;
    private String category;
    private BigDecimal price;
    private String coverImageUrl;

    public AdminOrderItemDto() {
    }

    public AdminOrderItemDto(Long ebookId, String ebookTitle, String authorName, String category, BigDecimal price, String coverImageUrl) {
        this.ebookId = ebookId;
        this.ebookTitle = ebookTitle;
        this.authorName = authorName;
        this.category = category;
        this.price = price;
        this.coverImageUrl = coverImageUrl;
    }

    public Long getEbookId() {
        return ebookId;
    }

    public void setEbookId(Long ebookId) {
        this.ebookId = ebookId;
    }

    public String getEbookTitle() {
        return ebookTitle;
    }

    public void setEbookTitle(String ebookTitle) {
        this.ebookTitle = ebookTitle;
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
