package com.codeorbit.dto;

import java.util.ArrayList;
import java.util.List;

public class SubcourseDto {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private String curriculumLevel = "BEGINNER";
    private int priceInr = 0;
    private boolean isFree = true;
    private int orderIndex = 1;
    private List<CourseModuleDto> modules = new ArrayList<>();
    private QuizSummaryDto finalQuiz;

    public SubcourseDto() {
    }

    public SubcourseDto(Long id, String title, String slug, String description, String curriculumLevel, int priceInr, boolean isFree, int orderIndex) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.curriculumLevel = curriculumLevel;
        this.priceInr = priceInr;
        this.isFree = isFree;
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

    public String getCurriculumLevel() {
        return curriculumLevel;
    }

    public void setCurriculumLevel(String curriculumLevel) {
        this.curriculumLevel = curriculumLevel;
    }

    public int getPriceInr() {
        return priceInr;
    }

    public void setPriceInr(int priceInr) {
        this.priceInr = priceInr;
    }

    public boolean isFree() {
        return isFree;
    }

    public void setFree(boolean free) {
        isFree = free;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public List<CourseModuleDto> getModules() {
        return modules;
    }

    public void setModules(List<CourseModuleDto> modules) {
        this.modules = modules;
    }

    public QuizSummaryDto getFinalQuiz() {
        return finalQuiz;
    }

    public void setFinalQuiz(QuizSummaryDto finalQuiz) {
        this.finalQuiz = finalQuiz;
    }
}
