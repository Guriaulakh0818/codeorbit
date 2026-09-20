package com.codeorbit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_questions")
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @NotBlank(message = "Question English prompt is required")
    @Column(name = "prompt_en", nullable = false, columnDefinition = "TEXT")
    private String promptEn;

    @Column(name = "prompt_hinglish", columnDefinition = "TEXT")
    private String promptHinglish;

    @Column(name = "code_context", columnDefinition = "TEXT")
    private String codeContext;

    @NotBlank(message = "Options JSON is required")
    @Column(name = "options_json", nullable = false, columnDefinition = "TEXT")
    private String optionsJson;

    @NotBlank(message = "Correct option ID is required")
    @Size(max = 32)
    @Column(name = "correct_option_id", nullable = false, length = 32)
    private String correctOptionId;

    @NotBlank(message = "Explanation is required")
    @Column(name = "explanation_en", nullable = false, columnDefinition = "TEXT")
    private String explanationEn;

    @Column(name = "explanation_hinglish", columnDefinition = "TEXT")
    private String explanationHinglish;

    @Column(name = "order_index", nullable = false)
    private int orderIndex = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public QuizQuestion() {
    }

    public QuizQuestion(Quiz quiz, String promptEn, String promptHinglish, String codeContext, String optionsJson, String correctOptionId, String explanationEn, String explanationHinglish, int orderIndex) {
        this.quiz = quiz;
        this.promptEn = promptEn;
        this.promptHinglish = promptHinglish;
        this.codeContext = codeContext;
        this.optionsJson = optionsJson;
        this.correctOptionId = correctOptionId;
        this.explanationEn = explanationEn;
        this.explanationHinglish = explanationHinglish;
        this.orderIndex = orderIndex;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
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

    public String getOptionsJson() {
        return optionsJson;
    }

    public void setOptionsJson(String optionsJson) {
        this.optionsJson = optionsJson;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
