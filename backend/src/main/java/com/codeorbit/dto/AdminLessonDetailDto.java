package com.codeorbit.dto;

import com.codeorbit.entity.HinglishStatus;
import com.codeorbit.entity.PublishStatus;
import java.time.LocalDateTime;

public class AdminLessonDetailDto {
    private Long id;
    private Long moduleId;
    private String title;
    private String slug;
    private int estimatedMinutes;
    private int orderIndex;
    private PublishStatus status;
    private String contentEn;
    private String contentHinglish;
    private HinglishStatus hinglishStatus;
    private String codeSnippetJava;
    private String codeSnippetCpp;
    private String codeSnippetPython;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AdminLessonDetailDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
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
}
