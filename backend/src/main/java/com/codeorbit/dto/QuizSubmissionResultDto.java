package com.codeorbit.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class QuizSubmissionResultDto {
    private Long attemptId;
    private Long quizId;
    private String quizTitle;
    private int attemptNumber;
    private int totalQuestions;
    private int answeredQuestions;
    private int correctAnswers;
    private BigDecimal scorePercentage;
    private int passThresholdPercentage;
    private boolean passed;
    private LocalDateTime submittedAt;
    private List<QuestionFeedbackDto> feedback = new ArrayList<>();

    public QuizSubmissionResultDto() {
    }

    public Long getAttemptId() {
        return idOrDefault(attemptId);
    }

    private Long idOrDefault(Long id) {
        return id;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public String getQuizTitle() {
        return quizTitle;
    }

    public void setQuizTitle(String quizTitle) {
        this.quizTitle = quizTitle;
    }

    public int getAttemptNumber() {
        return attemptNumber;
    }

    public void setAttemptNumber(int attemptNumber) {
        this.attemptNumber = attemptNumber;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getAnsweredQuestions() {
        return answeredQuestions;
    }

    public void setAnsweredQuestions(int answeredQuestions) {
        this.answeredQuestions = answeredQuestions;
    }

    public int getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(int correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public BigDecimal getScorePercentage() {
        return scorePercentage;
    }

    public void setScorePercentage(BigDecimal scorePercentage) {
        this.scorePercentage = scorePercentage;
    }

    public int getPassThresholdPercentage() {
        return passThresholdPercentage;
    }

    public void setPassThresholdPercentage(int passThresholdPercentage) {
        this.passThresholdPercentage = passThresholdPercentage;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public List<QuestionFeedbackDto> getFeedback() {
        return feedback;
    }

    public void setFeedback(List<QuestionFeedbackDto> feedback) {
        this.feedback = feedback;
    }
}
