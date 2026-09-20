package com.codeorbit.dto;

import com.codeorbit.entity.PublishStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AdminQuizRequestDto {

    @NotBlank(message = "Quiz title is required")
    @Size(max = 255, message = "Quiz title cannot exceed 255 characters")
    private String title;

    @NotBlank(message = "Quiz slug is required")
    @Size(max = 120, message = "Quiz slug cannot exceed 120 characters")
    private String slug;

    private String description;

    @Min(value = 50, message = "Passing threshold percentage must be at least 50%")
    @Max(value = 100, message = "Passing threshold percentage cannot exceed 100%")
    private int minPassScorePercentage = 80;

    private Integer maxAttempts;

    @NotNull(message = "Publish status is required")
    private PublishStatus status = PublishStatus.DRAFT;

    public AdminQuizRequestDto() {
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

    public PublishStatus getStatus() {
        return status;
    }

    public void setStatus(PublishStatus status) {
        this.status = status;
    }
}
