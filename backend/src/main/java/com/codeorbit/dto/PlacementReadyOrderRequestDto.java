package com.codeorbit.dto;

import jakarta.validation.constraints.NotBlank;

public class PlacementReadyOrderRequestDto {

    @NotBlank(message = "Course slug is required")
    private String courseSlug;

    public PlacementReadyOrderRequestDto() {
    }

    public PlacementReadyOrderRequestDto(String courseSlug) {
        this.courseSlug = courseSlug;
    }

    public String getCourseSlug() {
        return courseSlug;
    }

    public void setCourseSlug(String courseSlug) {
        this.courseSlug = courseSlug;
    }
}
