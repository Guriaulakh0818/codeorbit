package com.codeorbit.dto;

public class QuizSummaryDto {
    private Long id;
    private String title;
    private String slug;
    private Long moduleId;
    private int minPassScorePercentage;
    private Integer maxAttempts;
    private int questionCount;
    private String quizType = "MODULE_QUIZ";
    private String curriculumLevel;
    private com.codeorbit.entity.PublishStatus status;

    public QuizSummaryDto() {
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

    public QuizSummaryDto(Long id, String title, String slug, int minPassScorePercentage, Integer maxAttempts, int questionCount) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.minPassScorePercentage = minPassScorePercentage;
        this.maxAttempts = maxAttempts;
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

    public int getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(int questionCount) {
        this.questionCount = questionCount;
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
}
