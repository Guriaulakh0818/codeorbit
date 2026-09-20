package com.codeorbit.dto;

import com.codeorbit.entity.HinglishStatus;
import com.codeorbit.entity.PublishStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AdminLessonRequestDto {

    @NotBlank(message = "Lesson title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @NotBlank(message = "Lesson slug is required")
    @Size(max = 120, message = "Slug cannot exceed 120 characters")
    private String slug;

    @Min(value = 1, message = "Estimated minutes must be at least 1")
    private int estimatedMinutes = 15;

    private int orderIndex = 0;

    @NotNull(message = "Publish status is required")
    private PublishStatus status = PublishStatus.DRAFT;

    @NotBlank(message = "English content is required")
    private String contentEn;

    private String contentHinglish;

    @NotNull(message = "Hinglish status is required")
    private HinglishStatus hinglishStatus = HinglishStatus.MISSING;

    private String codeSnippetJava;
    private String codeSnippetCpp;
    private String codeSnippetPython;

    public AdminLessonRequestDto() {
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
}
