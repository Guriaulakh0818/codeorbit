package com.codeorbit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "lessons", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"module_id", "slug"}, name = "uk_lessons_module_slug")
})
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "module_id", nullable = false)
    private CourseModule module;

    @NotBlank(message = "Lesson title is required")
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String title;

    @NotBlank(message = "Lesson slug is required")
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String slug;

    @Column(name = "estimated_minutes", nullable = false)
    private int estimatedMinutes = 15;

    @Column(name = "order_index", nullable = false)
    private int orderIndex = 0;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private PublishStatus status = PublishStatus.DRAFT;

    @NotBlank(message = "English content is required")
    @Column(name = "content_en", nullable = false, columnDefinition = "MEDIUMTEXT")
    private String contentEn;

    @Column(name = "content_hinglish", columnDefinition = "MEDIUMTEXT")
    private String contentHinglish;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "hinglish_status", nullable = false, length = 32)
    private HinglishStatus hinglishStatus = HinglishStatus.MISSING;

    @Column(name = "code_snippet_java", columnDefinition = "TEXT")
    private String codeSnippetJava;

    @Column(name = "code_snippet_cpp", columnDefinition = "TEXT")
    private String codeSnippetCpp;

    @Column(name = "code_snippet_python", columnDefinition = "TEXT")
    private String codeSnippetPython;

    @Column(name = "code_snippet_js", columnDefinition = "TEXT")
    private String codeSnippetJs;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Lesson() {
    }

    public Lesson(CourseModule module, String title, String slug, int estimatedMinutes, int orderIndex, PublishStatus status, String contentEn, String contentHinglish, HinglishStatus hinglishStatus) {
        this.module = module;
        this.title = title;
        this.slug = slug;
        this.estimatedMinutes = estimatedMinutes;
        this.orderIndex = orderIndex;
        this.status = status;
        this.contentEn = contentEn;
        this.contentHinglish = contentHinglish;
        this.hinglishStatus = hinglishStatus;
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

    public int getEstimatedMinutes() {
        return estimatedMinutes;
    }

    public void setEstimatedMinutes(int estimatedMinutes) {
        this.estimatedMinutes = estimatedMinutes;
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

    public String getContentEn() {
        return contentEn;
    }

    public void setContentEn(String contentEn) {
        this.contentEn = contentEn;
    }

    public String getContentHinglish() {
        return contentHinglish;
    }

    public void setContentHinglish(String contentHinglish) {
        this.contentHinglish = contentHinglish;
    }

    public HinglishStatus getHinglishStatus() {
        return hinglishStatus;
    }

    public void setHinglishStatus(HinglishStatus hinglishStatus) {
        this.hinglishStatus = hinglishStatus;
    }

    public String getCodeSnippetJava() {
        return codeSnippetJava;
    }

    public void setCodeSnippetJava(String codeSnippetJava) {
        this.codeSnippetJava = codeSnippetJava;
    }

    public String getCodeSnippetCpp() {
        return codeSnippetCpp;
    }

    public void setCodeSnippetCpp(String codeSnippetCpp) {
        this.codeSnippetCpp = codeSnippetCpp;
    }

    public String getCodeSnippetPython() {
        return codeSnippetPython;
    }

    public void setCodeSnippetPython(String codeSnippetPython) {
        this.codeSnippetPython = codeSnippetPython;
    }

    public String getCodeSnippetJs() {
        return codeSnippetJs;
    }

    public void setCodeSnippetJs(String codeSnippetJs) {
        this.codeSnippetJs = codeSnippetJs;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
