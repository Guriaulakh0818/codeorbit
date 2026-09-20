package com.codeorbit.dto;

public class LessonSummaryDto {
    private Long id;
    private String title;
    private String slug;
    private Long moduleId;
    private int estimatedMinutes;
    private int orderIndex;
    private boolean hasHinglish;
    private com.codeorbit.entity.PublishStatus status;
    private com.codeorbit.entity.HinglishStatus hinglishStatus;

    public LessonSummaryDto() {
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    public com.codeorbit.entity.PublishStatus getStatus() {
        return status;
    }

    public void setStatus(com.codeorbit.entity.PublishStatus status) {
        this.status = status;
    }

    public com.codeorbit.entity.HinglishStatus getHinglishStatus() {
        return hinglishStatus;
    }

    public void setHinglishStatus(com.codeorbit.entity.HinglishStatus hinglishStatus) {
        this.hinglishStatus = hinglishStatus;
    }

    public LessonSummaryDto(Long id, String title, String slug, int estimatedMinutes, int orderIndex, boolean hasHinglish) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.estimatedMinutes = estimatedMinutes;
        this.orderIndex = orderIndex;
        this.hasHinglish = hasHinglish;
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

    public int getEstimatedMinutes() {
        return estimatedMinutes;
    }

    public void setEstimatedMinutes(int estimatedMinutes) {
        this.estimatedMinutes = estimatedMinutes;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public boolean isHasHinglish() {
        return hasHinglish;
    }

    public void setHasHinglish(boolean hasHinglish) {
        this.hasHinglish = hasHinglish;
    }
}
