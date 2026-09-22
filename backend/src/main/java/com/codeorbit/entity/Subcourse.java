package com.codeorbit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "subcourses", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"course_id", "curriculum_level"}, name = "uk_subcourses_course_level")
})
public class Subcourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "curriculum_level", nullable = false, length = 32)
    private CurriculumLevel curriculumLevel = CurriculumLevel.BEGINNER;

    @NotBlank(message = "Subcourse title is required")
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String title;

    @NotBlank(message = "Subcourse slug is required")
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "price_inr", nullable = false)
    private int priceInr = 0;

    @Column(name = "is_free", nullable = false)
    private boolean isFree = true;

    @Column(name = "order_index", nullable = false)
    private int orderIndex = 1;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private PublishStatus status = PublishStatus.PUBLISHED;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "subcourse", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<CourseModule> modules = new ArrayList<>();

    @OneToMany(mappedBy = "subcourse", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Quiz> quizzes = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Subcourse() {
    }

    public Subcourse(Course course, CurriculumLevel curriculumLevel, String title, String slug, String description, int priceInr, boolean isFree, int orderIndex, PublishStatus status) {
        this.course = course;
        this.curriculumLevel = curriculumLevel;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.priceInr = priceInr;
        this.isFree = isFree;
        this.orderIndex = orderIndex;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public CurriculumLevel getCurriculumLevel() {
        return curriculumLevel;
    }

    public void setCurriculumLevel(CurriculumLevel curriculumLevel) {
        this.curriculumLevel = curriculumLevel;
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

    public int getPriceInr() {
        return priceInr;
    }

    public void setPriceInr(int priceInr) {
        this.priceInr = priceInr;
    }

    public boolean isFree() {
        return isFree;
    }

    public void setFree(boolean free) {
        isFree = free;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<CourseModule> getModules() {
        return modules;
    }

    public void setModules(List<CourseModule> modules) {
        this.modules = modules;
    }

    public List<Quiz> getQuizzes() {
        return quizzes;
    }

    public void setQuizzes(List<Quiz> quizzes) {
        this.quizzes = quizzes;
    }
}
