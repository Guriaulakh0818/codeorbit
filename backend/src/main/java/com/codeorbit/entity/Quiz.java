package com.codeorbit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizzes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"module_id", "slug"}, name = "uk_quizzes_module_slug")
})
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "module_id", nullable = false)
    private CourseModule module;

    @NotBlank(message = "Quiz title is required")
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String title;

    @NotBlank(message = "Quiz slug is required")
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "min_pass_score_percentage", nullable = false)
    private int minPassScorePercentage = 75;

    @Column(name = "max_attempts")
    private Integer maxAttempts;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "quiz_type", nullable = false, length = 32)
    private QuizType quizType = QuizType.MODULE_QUIZ;

    @Enumerated(EnumType.STRING)
    @Column(name = "curriculum_level", length = 32)
    private CurriculumLevel curriculumLevel;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private PublishStatus status = PublishStatus.DRAFT;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<QuizQuestion> questions = new ArrayList<>();

    public Quiz() {
    }

    public Quiz(CourseModule module, String title, String slug, String description, int minPassScorePercentage, Integer maxAttempts, PublishStatus status) {
        this.module = module;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.minPassScorePercentage = minPassScorePercentage;
        this.maxAttempts = maxAttempts;
        this.status = status;
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

    public CourseModule getModule() {
        return module;
    }

    public void setModule(CourseModule module) {
        this.module = module;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getMinPassScorePercentage() {
        return minPassScorePercentage;
    }

    public void setMinPassScorePercentage(int minPassScorePercentage) {
        this.minPassScorePercentage = minPassScorePercentage;
    }

    public Integer getMaxAttempts() {
        return maxAttempts;
    }

    public void setMaxAttempts(Integer maxAttempts) {
        this.maxAttempts = maxAttempts;
    }

    public QuizType getQuizType() {
        return quizType;
    }

    public void setQuizType(QuizType quizType) {
        this.quizType = quizType != null ? quizType : QuizType.MODULE_QUIZ;
    }

    public CurriculumLevel getCurriculumLevel() {
        return curriculumLevel;
    }

    public void setCurriculumLevel(CurriculumLevel curriculumLevel) {
        this.curriculumLevel = curriculumLevel;
    }

    public PublishStatus getStatus() {
        return status;
    }

    public void setStatus(PublishStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<QuizQuestion> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuizQuestion> questions) {
        this.questions = questions;
    }
}
