package com.codeorbit.dto;

public class PlacementKitPracticeSubmitDto {
    private Long selectedOptionId;
    private String userAnswer;

    public PlacementKitPracticeSubmitDto() {
    }

    public PlacementKitPracticeSubmitDto(Long selectedOptionId, String userAnswer) {
        this.selectedOptionId = selectedOptionId;
        this.userAnswer = userAnswer;
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
