package com.codeorbit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "user_quiz_attempt_answers", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"attempt_id", "question_id"}, name = "uk_attempt_question")
})
public class UserQuizAttemptAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "attempt_id", nullable = false)
    private UserQuizAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private QuizQuestion question;

    @Size(max = 32)
    @Column(name = "selected_option_id", length = 32)
    private String selectedOptionId;

    @Column(name = "is_correct", nullable = false)
    private boolean correct = false;

    @NotBlank
    @Column(name = "displayed_language", nullable = false, length = 16)
    private String displayedLanguage = "en";

    @NotBlank
    @Column(name = "prompt_snapshot", nullable = false, columnDefinition = "TEXT")
    private String promptSnapshot;

    @NotBlank
    @Column(name = "options_snapshot_json", nullable = false, columnDefinition = "TEXT")
    private String optionsSnapshotJson;

    @Column(name = "selected_option_text_snapshot", columnDefinition = "TEXT")
    private String selectedOptionTextSnapshot;

    @NotBlank
    @Column(name = "correct_option_id_snapshot", nullable = false, length = 32)
    private String correctOptionIdSnapshot;

    @NotBlank
    @Column(name = "correct_option_text_snapshot", nullable = false, columnDefinition = "TEXT")
    private String correctOptionTextSnapshot;

    @NotBlank
    @Column(name = "explanation_snapshot", nullable = false, columnDefinition = "TEXT")
    private String explanationSnapshot;

    public UserQuizAttemptAnswer() {
    }

    public UserQuizAttemptAnswer(UserQuizAttempt attempt, QuizQuestion question, String selectedOptionId, boolean correct, String displayedLanguage, String promptSnapshot, String optionsSnapshotJson, String selectedOptionTextSnapshot, String correctOptionIdSnapshot, String correctOptionTextSnapshot, String explanationSnapshot) {
        this.attempt = attempt;
        this.question = question;
        this.selectedOptionId = selectedOptionId;
        this.correct = correct;
        this.displayedLanguage = displayedLanguage;
        this.promptSnapshot = promptSnapshot;
        this.optionsSnapshotJson = optionsSnapshotJson;
        this.selectedOptionTextSnapshot = selectedOptionTextSnapshot;
        this.correctOptionIdSnapshot = correctOptionIdSnapshot;
        this.correctOptionTextSnapshot = correctOptionTextSnapshot;
        this.explanationSnapshot = explanationSnapshot;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserQuizAttempt getAttempt() {
        return attempt;
    }

    public void setAttempt(UserQuizAttempt attempt) {
        this.attempt = attempt;
    }

    public QuizQuestion getQuestion() {
        return question;
    }

    public void setQuestion(QuizQuestion question) {
        this.question = question;
    }

    public String getSelectedOptionId() {
        return selectedOptionId;
    }

    public void setSelectedOptionId(String selectedOptionId) {
        this.selectedOptionId = selectedOptionId;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public String getDisplayedLanguage() {
        return displayedLanguage;
    }

    public void setDisplayedLanguage(String displayedLanguage) {
        this.displayedLanguage = displayedLanguage;
    }

    public String getPromptSnapshot() {
        return promptSnapshot;
    }

    public void setPromptSnapshot(String promptSnapshot) {
        this.promptSnapshot = promptSnapshot;
    }

    public String getOptionsSnapshotJson() {
        return optionsSnapshotJson;
    }

    public void setOptionsSnapshotJson(String optionsSnapshotJson) {
        this.optionsSnapshotJson = optionsSnapshotJson;
    }

    public String getSelectedOptionTextSnapshot() {
        return selectedOptionTextSnapshot;
    }

    public void setSelectedOptionTextSnapshot(String selectedOptionTextSnapshot) {
        this.selectedOptionTextSnapshot = selectedOptionTextSnapshot;
    }

    public String getCorrectOptionIdSnapshot() {
        return correctOptionIdSnapshot;
    }

    public void setCorrectOptionIdSnapshot(String correctOptionIdSnapshot) {
        this.correctOptionIdSnapshot = correctOptionIdSnapshot;
    }

    public String getCorrectOptionTextSnapshot() {
        return correctOptionTextSnapshot;
    }

    public void setCorrectOptionTextSnapshot(String correctOptionTextSnapshot) {
        this.correctOptionTextSnapshot = correctOptionTextSnapshot;
    }

    public String getExplanationSnapshot() {
        return explanationSnapshot;
    }

    public void setExplanationSnapshot(String explanationSnapshot) {
        this.explanationSnapshot = explanationSnapshot;
    }
}
