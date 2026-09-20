package com.codeorbit.dto;

import jakarta.validation.constraints.NotNull;

public class QuizAnswerSubmissionDto {

    @NotNull(message = "Question ID is required")
    private Long questionId;

    private String selectedOptionId; // Null if skipped/unanswered

    public QuizAnswerSubmissionDto() {
    }

    public QuizAnswerSubmissionDto(Long questionId, String selectedOptionId) {
        this.questionId = questionId;
        this.selectedOptionId = selectedOptionId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getSelectedOptionId() {
        return selectedOptionId;
    }

    public void setSelectedOptionId(String selectedOptionId) {
        this.selectedOptionId = selectedOptionId;
    }
}
