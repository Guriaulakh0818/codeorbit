package com.codeorbit.dto;

import java.util.List;

public class PlacementKitCategoryDto {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private int orderIndex;
    private int questionCount;
    private List<PlacementKitQuestionDto> questions;

    public PlacementKitCategoryDto() {
    }

    public PlacementKitCategoryDto(Long id, String title, String slug, String description, int orderIndex, int questionCount) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.orderIndex = orderIndex;
        this.questionCount = questionCount;
    }

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

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public int getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(int questionCount) {
        this.questionCount = questionCount;
    }

    public List<PlacementKitQuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<PlacementKitQuestionDto> questions) {
        this.questions = questions;
    }
}
