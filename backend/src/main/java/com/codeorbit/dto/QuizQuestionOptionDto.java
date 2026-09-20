package com.codeorbit.dto;

public class QuizQuestionOptionDto {
    private String id;
    private String text;

    public QuizQuestionOptionDto() {
    }

    public QuizQuestionOptionDto(String id, String text) {
        this.id = id;
        this.text = text;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
