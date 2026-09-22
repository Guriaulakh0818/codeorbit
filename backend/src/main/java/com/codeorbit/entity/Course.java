package com.codeorbit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses", uniqueConstraints = {
    @UniqueConstraint(columnNames = "slug", name = "uk_courses_slug")
})
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Course title is required")
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String title;

    @NotBlank(message = "Course slug is required")
    @Size(max = 120)
    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @NotBlank(message = "Course description is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Size(max = 500)
    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String track = "DSA";

    @NotBlank
    @Column(name = "difficulty_level", nullable = false, length = 50)
    private String difficultyLevel = "BEGINNER";

    @Column(name = "cover_image_url", length = 1000)
    private String coverImageUrl;

    @Column(name = "estimated_hours", nullable = false)
    private int estimatedHours = 35;

    @Column(name = "order_index", nullable = false)
    private int orderIndex = 0;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private PublishStatus status = PublishStatus.DRAFT;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<Subcourse> subcourses = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<CourseModule> modules = new ArrayList<>();

    public Course() {
    }

    public Course(String title, String slug, String description, String shortDescription, String track, String difficultyLevel, int estimatedHours, int orderIndex, PublishStatus status) {
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.shortDescription = shortDescription;
        this.track = track;
        this.difficultyLevel = difficultyLevel;
        this.estimatedHours = estimatedHours;
        this.orderIndex = orderIndex;
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

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getTrack() {
        return track;
    }

    public void setTrack(String track) {
        this.track = track;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public int getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(int estimatedHours) {
        this.estimatedHours = estimatedHours;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<Subcourse> getSubcourses() {
        return subcourses;
    }

    public void setSubcourses(List<Subcourse> subcourses) {
        this.subcourses = subcourses;
    }

    public List<CourseModule> getModules() {
        return modules;
    }

    public void setModules(List<CourseModule> modules) {
        this.modules = modules;
    }
}
