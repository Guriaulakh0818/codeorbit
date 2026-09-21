package com.codeorbit.dto;

import java.util.ArrayList;
import java.util.List;

public class QuizPublicDto {
    private Long id;
    private Long moduleId;
    private String moduleTitle;
    private String courseSlug;
    private String title;
    private String slug;
    private String description;
    private int minPassScorePercentage;
    private Integer maxAttempts;
    private String quizType = "MODULE_QUIZ";
    private String curriculumLevel;
    private String displayedLanguage; // 'en' or 'hinglish'
    private List<QuizQuestionPublicDto> questions = new ArrayList<>();

    public QuizPublicDto() {
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

    public String getModuleTitle() {
        return moduleTitle;
    }

    public void setModuleTitle(String moduleTitle) {
        this.moduleTitle = moduleTitle;
    }

    public String getCourseSlug() {
        return courseSlug;
    }

    public void setCourseSlug(String courseSlug) {
        this.courseSlug = courseSlug;
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

    public String getDisplayedLanguage() {
        return displayedLanguage;
    }

    public void setDisplayedLanguage(String displayedLanguage) {
        this.displayedLanguage = displayedLanguage;
    }

    public List<QuizQuestionPublicDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuizQuestionPublicDto> questions) {
        this.questions = questions;
    }
}
