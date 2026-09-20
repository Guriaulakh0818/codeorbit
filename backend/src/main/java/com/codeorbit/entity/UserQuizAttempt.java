package com.codeorbit.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_quiz_attempts", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "quiz_id", "attempt_number"}, name = "uk_user_quiz_attempt_num")
})
public class UserQuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(name = "attempt_number", nullable = false)
    private int attemptNumber;

    @Column(name = "total_questions", nullable = false)
    private int totalQuestions;

    @Column(name = "answered_questions", nullable = false)
    private int answeredQuestions;

    @Column(name = "correct_answers", nullable = false)
    private int correctAnswers;

    @Column(name = "score_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal scorePercentage;

    @Column(name = "pass_threshold_percentage", nullable = false)
    private int passThresholdPercentage;

    @Column(nullable = false)
    private boolean passed = false;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserQuizAttemptAnswer> answers = new ArrayList<>();

    public UserQuizAttempt() {
    }

    public UserQuizAttempt(User user, Quiz quiz, int attemptNumber, int totalQuestions, int answeredQuestions, int correctAnswers, BigDecimal scorePercentage, int passThresholdPercentage, boolean passed) {
        this.user = user;
        this.quiz = quiz;
        this.attemptNumber = attemptNumber;
        this.totalQuestions = totalQuestions;
        this.answeredQuestions = answeredQuestions;
        this.correctAnswers = correctAnswers;
        this.scorePercentage = scorePercentage;
        this.passThresholdPercentage = passThresholdPercentage;
        this.passed = passed;
    }

    @PrePersist
    protected void onCreate() {
        this.submittedAt = LocalDateTime.now();
    }

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

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
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

    public List<UserQuizAttemptAnswer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<UserQuizAttemptAnswer> answers) {
        this.answers = answers;
    }
}
