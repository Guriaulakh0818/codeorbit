package com.codeorbit.dto;

import jakarta.validation.constraints.NotNull;

public class LessonProgressUpdateDto {

    @NotNull(message = "Lesson ID is required")
    private Long lessonId;

    private boolean completed = true;

    public LessonProgressUpdateDto() {
    }

    public LessonProgressUpdateDto(Long lessonId, boolean completed) {
        this.lessonId = lessonId;
        this.completed = completed;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
