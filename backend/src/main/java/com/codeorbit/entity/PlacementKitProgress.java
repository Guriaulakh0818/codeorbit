package com.codeorbit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "placement_kit_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "question_id"}, name = "uk_pk_user_question_progress")
}, indexes = {
    @Index(name = "idx_pk_progress_user_kit", columnList = "user_id, placement_kit_id")
})
public class PlacementKitProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "placement_kit_id", nullable = false)
    private PlacementKit placementKit;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private PlacementKitQuestion question;

    @Column(name = "selected_option_id")
    private Long selectedOptionId;

    @Lob
    @Column(name = "user_answer", columnDefinition = "TEXT")
    private String userAnswer;

    @Column(name = "is_correct", nullable = false)
    private boolean correct = false;

    @Column(name = "attempted_at", nullable = false)
    private LocalDateTime attemptedAt;

    public PlacementKitProgress() {
    }

    public PlacementKitProgress(User user, PlacementKit placementKit, PlacementKitQuestion question, Long selectedOptionId, String userAnswer, boolean correct) {
        this.user = user;
        this.placementKit = placementKit;
        this.question = question;
        this.selectedOptionId = selectedOptionId;
        this.userAnswer = userAnswer;
        this.correct = correct;
        this.attemptedAt = LocalDateTime.now();
    }

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.attemptedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public PlacementKit getPlacementKit() {
        return placementKit;
    }

    public void setPlacementKit(PlacementKit placementKit) {
        this.placementKit = placementKit;
    }

    public PlacementKitQuestion getQuestion() {
        return question;
    }

    public void setQuestion(PlacementKitQuestion question) {
        this.question = question;
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

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public LocalDateTime getAttemptedAt() {
        return attemptedAt;
    }

    public void setAttemptedAt(LocalDateTime attemptedAt) {
        this.attemptedAt = attemptedAt;
    }
}
