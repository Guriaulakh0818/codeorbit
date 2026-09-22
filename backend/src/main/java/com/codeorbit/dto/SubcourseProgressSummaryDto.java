package com.codeorbit.dto;

import com.codeorbit.entity.CurriculumLevel;

public class SubcourseProgressSummaryDto {

    private Long subcourseId;
    private CurriculumLevel level;
    private String title;
    private String slug;
    private int orderIndex;
    private boolean isFree;
    private int priceInr;
    private boolean isUnlocked;
    private int totalModules;
    private int completedModules;
    private int totalLessons;
    private int completedLessons;
    private int totalModuleQuizzes;
    private int passedModuleQuizzes;
    private boolean hasLevelFinalQuiz;
    private boolean levelFinalPassed;
    private Integer levelFinalScorePercentage;

    public SubcourseProgressSummaryDto() {
    }

    public Long getSubcourseId() {
        return subcourseId;
    }

    public void setSubcourseId(Long subcourseId) {
        this.subcourseId = subcourseId;
    }

    public CurriculumLevel getLevel() {
        return level;
    }

    public void setLevel(CurriculumLevel level) {
        this.level = level;
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

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public boolean isFree() {
        return isFree;
    }

    public void setFree(boolean free) {
        isFree = free;
    }

    public int getPriceInr() {
        return priceInr;
    }

    public void setPriceInr(int priceInr) {
        this.priceInr = priceInr;
    }

    public boolean isUnlocked() {
        return isUnlocked;
    }

    public void setUnlocked(boolean unlocked) {
        isUnlocked = unlocked;
    }

    public int getTotalModules() {
        return totalModules;
    }

    public void setTotalModules(int totalModules) {
        this.totalModules = totalModules;
    }

    public int getCompletedModules() {
        return completedModules;
    }

    public void setCompletedModules(int completedModules) {
        this.completedModules = completedModules;
    }

    public int getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(int totalLessons) {
        this.totalLessons = totalLessons;
    }

    public int getCompletedLessons() {
        return completedLessons;
    }

    public void setCompletedLessons(int completedLessons) {
        this.completedLessons = completedLessons;
    }

    public int getTotalModuleQuizzes() {
        return totalModuleQuizzes;
    }

    public void setTotalModuleQuizzes(int totalModuleQuizzes) {
        this.totalModuleQuizzes = totalModuleQuizzes;
    }

    public int getPassedModuleQuizzes() {
        return passedModuleQuizzes;
    }

    public void setPassedModuleQuizzes(int passedModuleQuizzes) {
        this.passedModuleQuizzes = passedModuleQuizzes;
    }

    public boolean isHasLevelFinalQuiz() {
        return hasLevelFinalQuiz;
    }

    public void setHasLevelFinalQuiz(boolean hasLevelFinalQuiz) {
        this.hasLevelFinalQuiz = hasLevelFinalQuiz;
    }

    public boolean isLevelFinalPassed() {
        return levelFinalPassed;
    }

    public void setLevelFinalPassed(boolean levelFinalPassed) {
        this.levelFinalPassed = levelFinalPassed;
    }

    public Integer getLevelFinalScorePercentage() {
        return levelFinalScorePercentage;
    }

    public void setLevelFinalScorePercentage(Integer levelFinalScorePercentage) {
        this.levelFinalScorePercentage = levelFinalScorePercentage;
    }
}
