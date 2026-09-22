package com.codeorbit.dto;

public class PlacementKitSummaryDto {
    private Long id;
    private String slug;
    private String title;
    private String role;
    private String shortDescription;
    private int priceInr;
    private int pricePaise;
    private String currency;
    private String coverImageUrl;
    private String badgeText;
    private int totalQuestions;
    private int totalCategories;
    private boolean isPurchased;

    public PlacementKitSummaryDto() {
    }

    public PlacementKitSummaryDto(Long id, String slug, String title, String role, String shortDescription, int priceInr, int pricePaise, String currency, String coverImageUrl, String badgeText, int totalQuestions, int totalCategories, boolean isPurchased) {
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.role = role;
        this.shortDescription = shortDescription;
        this.priceInr = priceInr;
        this.pricePaise = pricePaise;
        this.currency = currency;
        this.coverImageUrl = coverImageUrl;
        this.badgeText = badgeText;
        this.totalQuestions = totalQuestions;
        this.totalCategories = totalCategories;
        this.isPurchased = isPurchased;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public int getPriceInr() {
        return priceInr;
    }

    public void setPriceInr(int priceInr) {
        this.priceInr = priceInr;
    }

    public int getPricePaise() {
        return pricePaise;
    }

    public void setPricePaise(int pricePaise) {
        this.pricePaise = pricePaise;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public String getBadgeText() {
        return badgeText;
    }

    public void setBadgeText(String badgeText) {
        this.badgeText = badgeText;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(int totalCategories) {
        this.totalCategories = totalCategories;
    }

    public boolean isPurchased() {
        return isPurchased;
    }

    public void setPurchased(boolean purchased) {
        isPurchased = purchased;
    }
}
