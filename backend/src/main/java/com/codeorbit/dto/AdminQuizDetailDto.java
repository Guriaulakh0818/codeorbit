package com.codeorbit.dto;

import com.codeorbit.entity.PublishStatus;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AdminQuizDetailDto {
    private Long id;
    private Long moduleId;
    private String title;
    private String slug;
    private String description;
    private int minPassScorePercentage;
    private Integer maxAttempts;
    private String quizType = "MODULE_QUIZ";
    private String curriculumLevel;
    private PublishStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<AdminQuestionDetailDto> questions = new ArrayList<>();

    public AdminQuizDetailDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
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

    public int getMinPassScorePercentage() {
        return minPassScorePercentage;
    }

    public void setMinPassScorePercentage(int minPassScorePercentage) {
        this.minPassScorePercentage = minPassScorePercentage;
    }

    public Integer getMaxAttempts() {
        return maxAttempts;
    }

    public void setMaxAttempts(Integer maxAttempts) {
        this.maxAttempts = maxAttempts;
    }

    public String getQuizType() {
        return quizType;
    }

    public void setQuizType(String quizType) {
        this.quizType = quizType;
    }

    public String getCurriculumLevel() {
        return curriculumLevel;
    }

    public void setCurriculumLevel(String curriculumLevel) {
        this.curriculumLevel = curriculumLevel;
    }

    public PublishStatus getStatus() {
        return status;
    }

    public void setStatus(PublishStatus status) {
        this.status = status;
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

    public List<AdminQuestionDetailDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<AdminQuestionDetailDto> questions) {
        this.questions = questions;
    }
}
