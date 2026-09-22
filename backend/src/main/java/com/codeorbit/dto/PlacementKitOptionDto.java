package com.codeorbit.dto;

public class PlacementKitOptionDto {
    private Long id;
    private String optionText;
    private Boolean isCorrect; // null when unentitled or unsubmitted to prevent cheating
    private int orderIndex;

    public PlacementKitOptionDto() {
    }

    public PlacementKitOptionDto(Long id, String optionText, Boolean isCorrect, int orderIndex) {
        this.id = id;
        this.optionText = optionText;
        this.isCorrect = isCorrect;
        this.orderIndex = orderIndex;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean correct) {
        isCorrect = correct;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }
}
