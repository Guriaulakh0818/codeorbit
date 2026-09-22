package com.codeorbit.dto;

import java.util.List;

public class PlacementKitDetailDto {
    private Long id;
    private String slug;
    private String title;
    private String role;
    private String shortDescription;
    private String fullDescription;
    private int priceInr;
    private int pricePaise;
    private String currency;
    private String coverImageUrl;
    private String badgeText;
    private boolean isPurchased;
    private int totalQuestions;
    private int totalCategories;
    private List<PlacementKitCategoryDto> categories;
    private List<PlacementKitQuestionDto> sampleQuestions; // returned when unentitled
    private PlacementKitProgressDto progress;

    public PlacementKitDetailDto() {
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

    public String getFullDescription() {
        return fullDescription;
    }

    public void setFullDescription(String fullDescription) {
        this.fullDescription = fullDescription;
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

    public boolean isPurchased() {
        return isPurchased;
    }

    public void setPurchased(boolean purchased) {
        isPurchased = purchased;
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

    public List<PlacementKitCategoryDto> getCategories() {
        return categories;
    }

    public void setCategories(List<PlacementKitCategoryDto> categories) {
        this.categories = categories;
    }

    public List<PlacementKitQuestionDto> getSampleQuestions() {
        return sampleQuestions;
    }

    public void setSampleQuestions(List<PlacementKitQuestionDto> sampleQuestions) {
        this.sampleQuestions = sampleQuestions;
    }

    public PlacementKitProgressDto getProgress() {
        return progress;
    }

    public void setProgress(PlacementKitProgressDto progress) {
        this.progress = progress;
    }
}
