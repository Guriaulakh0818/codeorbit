package com.codeorbit.dto;

public class CourseSummaryDto {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private String shortDescription;
    private String track;
    private String difficultyLevel;
    private String coverImageUrl;
    private int estimatedHours;
    private int moduleCount;
    private int lessonCount;
    private boolean hasHinglish;
    private int orderIndex;
    private com.codeorbit.entity.PublishStatus status;

    public CourseSummaryDto() {
    }

    public com.codeorbit.entity.PublishStatus getStatus() {
        return status;
    }

    public void setStatus(com.codeorbit.entity.PublishStatus status) {
        this.status = status;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
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

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getTrack() {
        return track;
    }

    public void setTrack(String track) {
        this.track = track;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public int getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(int estimatedHours) {
        this.estimatedHours = estimatedHours;
    }

    public int getModuleCount() {
        return moduleCount;
    }

    public void setModuleCount(int moduleCount) {
        this.moduleCount = moduleCount;
    }

    public int getLessonCount() {
        return lessonCount;
    }

    public void setLessonCount(int lessonCount) {
        this.lessonCount = lessonCount;
    }

    public boolean isHasHinglish() {
        return hasHinglish;
    }

    public void setHasHinglish(boolean hasHinglish) {
        this.hasHinglish = hasHinglish;
    }
}
