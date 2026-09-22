package com.codeorbit.dto;

public class PlacementKitPracticeResultDto {
    private Long questionId;
    private boolean correct;
    private Long correctOptionId;
    private String modelAnswer;
    private String explanation;
    private Long lessonId;
    private String lessonSlug;
    private String courseSlug;
    private String lessonReferenceLabel;
    private String externalReferenceUrl;
    private int totalAttempted;
    private int totalCorrect;

    public PlacementKitPracticeResultDto() {
    }

    // Getters and Setters

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public Long getCorrectOptionId() {
        return correctOptionId;
    }

    public void setCorrectOptionId(Long correctOptionId) {
        this.correctOptionId = correctOptionId;
    }

    public String getModelAnswer() {
        return modelAnswer;
    }

    public void setModelAnswer(String modelAnswer) {
        this.modelAnswer = modelAnswer;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public String getLessonSlug() {
        return lessonSlug;
    }

    public void setLessonSlug(String lessonSlug) {
        this.lessonSlug = lessonSlug;
    }

    public String getCourseSlug() {
        return courseSlug;
    }

    public void setCourseSlug(String courseSlug) {
        this.courseSlug = courseSlug;
    }

    public String getLessonReferenceLabel() {
        return lessonReferenceLabel;
    }

    public void setLessonReferenceLabel(String lessonReferenceLabel) {
        this.lessonReferenceLabel = lessonReferenceLabel;
    }

    public String getExternalReferenceUrl() {
        return externalReferenceUrl;
    }

    public void setExternalReferenceUrl(String externalReferenceUrl) {
        this.externalReferenceUrl = externalReferenceUrl;
    }

    public int getTotalAttempted() {
        return totalAttempted;
    }

    public void setTotalAttempted(int totalAttempted) {
        this.totalAttempted = totalAttempted;
    }

    public int getTotalCorrect() {
        return totalCorrect;
    }

    public void setTotalCorrect(int totalCorrect) {
        this.totalCorrect = totalCorrect;
    }
}
