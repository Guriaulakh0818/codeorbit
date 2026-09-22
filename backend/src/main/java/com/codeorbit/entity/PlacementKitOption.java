package com.codeorbit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "placement_kit_options")
public class PlacementKitOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "placement_kit_question_id", nullable = false)
    private PlacementKitQuestion question;

    @NotBlank
    @Lob
    @Column(name = "option_text", nullable = false, columnDefinition = "TEXT")
    private String optionText;

    @Column(name = "is_correct", nullable = false)
    private boolean correct = false;

    @Column(name = "order_index", nullable = false)
    private int orderIndex = 1;

    public PlacementKitOption() {
    }

    public PlacementKitOption(String optionText, boolean correct, int orderIndex) {
        this.optionText = optionText;
        this.correct = correct;
        this.orderIndex = orderIndex;
    }

    public PlacementKitOption(PlacementKitQuestion question, String optionText, boolean correct, int orderIndex) {
        this.question = question;
        this.optionText = optionText;
        this.correct = correct;
        this.orderIndex = orderIndex;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PlacementKitQuestion getQuestion() {
        return question;
    }

    public void setQuestion(PlacementKitQuestion question) {
        this.question = question;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }
}
