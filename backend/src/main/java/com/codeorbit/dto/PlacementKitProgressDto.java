package com.codeorbit.dto;

public class PlacementKitProgressDto {
    private String kitSlug;
    private int totalQuestions;
    private int attemptedQuestions;
    private int correctQuestions;
    private double percentageComplete;

    public PlacementKitProgressDto() {
    }

    public PlacementKitProgressDto(String kitSlug, int totalQuestions, int attemptedQuestions, int correctQuestions) {
        this.kitSlug = kitSlug;
        this.totalQuestions = totalQuestions;
        this.attemptedQuestions = attemptedQuestions;
        this.correctQuestions = correctQuestions;
        this.percentageComplete = totalQuestions > 0 ? ((double) attemptedQuestions / totalQuestions) * 100.0 : 0.0;
    }

    public String getKitSlug() {
        return kitSlug;
    }

    public void setKitSlug(String kitSlug) {
        this.kitSlug = kitSlug;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getAttemptedQuestions() {
        return attemptedQuestions;
    }

    public void setAttemptedQuestions(int attemptedQuestions) {
        this.attemptedQuestions = attemptedQuestions;
    }

    public int getCorrectQuestions() {
        return correctQuestions;
    }

    public void setCorrectQuestions(int correctQuestions) {
        this.correctQuestions = correctQuestions;
    }

    public double getPercentageComplete() {
        return percentageComplete;
    }

    public void setPercentageComplete(double percentageComplete) {
        this.percentageComplete = percentageComplete;
    }
}
