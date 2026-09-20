package com.codeorbit.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class QuizSubmissionRequestDto {

    private String language = "en"; // 'en' or 'hinglish'

    @NotNull(message = "Answers list cannot be null")
    @Valid
    private List<QuizAnswerSubmissionDto> answers = new ArrayList<>();

    public QuizSubmissionRequestDto() {
    }

    public QuizSubmissionRequestDto(String language, List<QuizAnswerSubmissionDto> answers) {
        this.language = language;
        this.answers = answers;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public List<QuizAnswerSubmissionDto> getAnswers() {
        return answers;
    }

    public void setAnswers(List<QuizAnswerSubmissionDto> answers) {
        this.answers = answers;
    }
}
