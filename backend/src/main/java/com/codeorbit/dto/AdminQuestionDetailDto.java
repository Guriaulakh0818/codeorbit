package com.codeorbit.dto;

import java.util.ArrayList;
import java.util.List;

public class AdminQuestionDetailDto {
    private Long id;
    private Long quizId;
    private String promptEn;
    private String promptHinglish;
    private String codeContext;
    private List<QuizQuestionOptionDto> options = new ArrayList<>();
    private String correctOptionId;
    private String explanationEn;
    private String explanationHinglish;
    private int orderIndex;

    public AdminQuestionDetailDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
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
