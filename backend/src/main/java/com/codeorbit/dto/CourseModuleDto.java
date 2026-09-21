package com.codeorbit.dto;

import java.util.ArrayList;
import java.util.List;

public class CourseModuleDto {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private int orderIndex;
    private String curriculumLevel = "BEGINNER";
    private List<LessonSummaryDto> lessons = new ArrayList<>();
    private List<QuizSummaryDto> quizzes = new ArrayList<>();

    public CourseModuleDto() {
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

    public String getCurriculumLevel() {
        return curriculumLevel;
    }

    public void setCurriculumLevel(String curriculumLevel) {
        this.curriculumLevel = curriculumLevel;
    }

    public List<LessonSummaryDto> getLessons() {
        return lessons;
    }

    public void setLessons(List<LessonSummaryDto> lessons) {
        this.lessons = lessons;
    }

    public List<QuizSummaryDto> getQuizzes() {
        return quizzes;
    }

    public void setQuizzes(List<QuizSummaryDto> quizzes) {
        this.quizzes = quizzes;
    }
}
