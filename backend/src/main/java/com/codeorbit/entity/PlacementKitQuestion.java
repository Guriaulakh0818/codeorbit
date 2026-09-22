package com.codeorbit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "placement_kit_questions")
public class PlacementKitQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "placement_kit_category_id", nullable = false)
    private PlacementKitCategory category;

    @NotBlank
    @Lob
    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false, length = 32)
    private PlacementKitQuestionType questionType = PlacementKitQuestionType.MCQ;

    @NotNull
    @Column(nullable = false, length = 32)
    private String difficulty = "MEDIUM"; // EASY, MEDIUM, HARD

    @Lob
    @Column(name = "model_answer", columnDefinition = "TEXT")
    private String modelAnswer;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String explanation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @Size(max = 255)
    @Column(name = "lesson_reference_label", length = 255)
    private String lessonReferenceLabel;

    @Size(max = 500)
    @Column(name = "external_reference_url", length = 500)
    private String externalReferenceUrl;

    @Column(name = "is_sample", nullable = false)
    private boolean sample = false;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "order_index", nullable = false)
    private int orderIndex = 1;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<PlacementKitOption> options = new ArrayList<>();

    public PlacementKitQuestion() {
    }

    public PlacementKitQuestion(PlacementKitCategory category, String questionText, PlacementKitQuestionType questionType, String difficulty, String modelAnswer, String explanation, int orderIndex, boolean isSample) {
        this.category = category;
        this.questionText = questionText;
        this.questionType = questionType;
        this.difficulty = difficulty;
        this.modelAnswer = modelAnswer;
        this.explanation = explanation;
        this.orderIndex = orderIndex;
        this.sample = isSample;
        this.active = true;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PlacementKitCategory getCategory() {
        return category;
    }

    public void setCategory(PlacementKitCategory category) {
        this.category = category;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public PlacementKitQuestionType getQuestionType() {
        return questionType;
    }

    public void setQuestionType(PlacementKitQuestionType questionType) {
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

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
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
        return sample;
    }

    public void setSample(boolean sample) {
        this.sample = sample;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
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

    public List<PlacementKitOption> getOptions() {
        return options;
    }

    public void setOptions(List<PlacementKitOption> options) {
        this.options = options;
    }

    public void addOption(PlacementKitOption option) {
        this.options.add(option);
        option.setQuestion(this);
    }
}
