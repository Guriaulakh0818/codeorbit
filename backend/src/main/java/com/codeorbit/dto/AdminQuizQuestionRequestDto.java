package com.codeorbit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

public class AdminQuizQuestionRequestDto {

    @NotBlank(message = "English prompt is required")
    private String promptEn;

    private String promptHinglish;

    private String codeContext;

    @NotEmpty(message = "At least 2 question options are required")
    private List<QuizQuestionOptionDto> options = new ArrayList<>();

    @NotBlank(message = "Correct option ID is required")
    @Size(max = 32, message = "Correct option ID cannot exceed 32 characters")
    private String correctOptionId;

    @NotBlank(message = "English explanation is required")
    private String explanationEn;

    private String explanationHinglish;

    private int orderIndex = 0;

    public AdminQuizQuestionRequestDto() {
    }

    public String getPromptEn() {
        return promptEn;
    }

    public void setPromptEn(String promptEn) {
        this.promptEn = promptEn;
    }

    public String getPromptHinglish() {
        return promptHinglish;
    }

    public void setPromptHinglish(String promptHinglish) {
        this.promptHinglish = promptHinglish;
    }

    public String getCodeContext() {
        return codeContext;
    }

    public void setCodeContext(String codeContext) {
        this.codeContext = codeContext;
    }

    public List<QuizQuestionOptionDto> getOptions() {
        return options;
    }

    public void setOptions(List<QuizQuestionOptionDto> options) {
        this.options = options;
    }

    public String getCorrectOptionId() {
        return correctOptionId;
    }

    public void setCorrectOptionId(String correctOptionId) {
        this.correctOptionId = correctOptionId;
    }

    public String getExplanationEn() {
        return explanationEn;
    }

    public void setExplanationEn(String explanationEn) {
        this.explanationEn = explanationEn;
    }

    public String getExplanationHinglish() {
        return explanationHinglish;
    }

    public void setExplanationHinglish(String explanationHinglish) {
        this.explanationHinglish = explanationHinglish;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }
}
