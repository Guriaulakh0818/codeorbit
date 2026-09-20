package com.codeorbit.dto;

import com.codeorbit.entity.PublishStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AdminModuleRequestDto {

    @NotBlank(message = "Module title is required")
    @Size(max = 255, message = "Module title cannot exceed 255 characters")
    private String title;

    @NotBlank(message = "Module slug is required")
    @Size(max = 120, message = "Module slug cannot exceed 120 characters")
    private String slug;

    private String description;

    private int orderIndex = 0;

    @NotNull(message = "Publish status is required")
    private PublishStatus status = PublishStatus.DRAFT;

    public AdminModuleRequestDto() {
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
}
