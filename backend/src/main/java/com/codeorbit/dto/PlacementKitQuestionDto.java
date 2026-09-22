package com.codeorbit.dto;

import java.util.List;

public class PlacementKitQuestionDto {
    private Long id;
    private String questionText;
    private String questionType; // MCQ, SHORT_ANSWER, INTERVIEW
    private String difficulty; // EASY, MEDIUM, HARD
    private String modelAnswer; // hidden if unentitled / unattempted in practice mode
    private String explanation; // hidden if unentitled
    private Long lessonId;
    private String lessonSlug;
    private String courseSlug;
    private String lessonReferenceLabel;
    private String externalReferenceUrl;
    private boolean isSample;
    private int orderIndex;
    private List<PlacementKitOptionDto> options;
    private Boolean userAttempted;
    private Boolean userCorrect;
    private Long selectedOptionId;
    private String userAnswer;

    public PlacementKitQuestionDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
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

    public boolean isSample() {
        return isSample;
    }

    public void setSample(boolean sample) {
        isSample = sample;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public List<PlacementKitOptionDto> getOptions() {
        return options;
    }

    public void setOptions(List<PlacementKitOptionDto> options) {
        this.options = options;
    }

    public Boolean getUserAttempted() {
        return userAttempted;
    }

    public void setUserAttempted(Boolean userAttempted) {
        this.userAttempted = userAttempted;
    }

    public Boolean getUserCorrect() {
        return userCorrect;
    }

    public void setUserCorrect(Boolean userCorrect) {
        this.userCorrect = userCorrect;
    }

    public Long getSelectedOptionId() {
        return selectedOptionId;
    }

    public void setSelectedOptionId(Long selectedOptionId) {
        this.selectedOptionId = selectedOptionId;
    }

    public String getUserAnswer() {
        return userAnswer;
    }

    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }
}
