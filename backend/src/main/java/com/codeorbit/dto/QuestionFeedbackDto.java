package com.codeorbit.dto;

import java.util.ArrayList;
import java.util.List;

public class QuestionFeedbackDto {
    private Long questionId;
    private String prompt;
    private String codeContext;
    private List<QuizQuestionOptionDto> options = new ArrayList<>();
    private String selectedOptionId;
    private String correctOptionId;
    private boolean correct;
    private String explanation;

    public QuestionFeedbackDto() {
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
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

    public String getSelectedOptionId() {
        return selectedOptionId;
    }

    public void setSelectedOptionId(String selectedOptionId) {
        this.selectedOptionId = selectedOptionId;
    }

    public String getCorrectOptionId() {
        return correctOptionId;
    }

    public void setCorrectOptionId(String correctOptionId) {
        this.correctOptionId = correctOptionId;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
