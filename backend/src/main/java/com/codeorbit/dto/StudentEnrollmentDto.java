package com.codeorbit.dto;

import java.time.LocalDateTime;

public class StudentEnrollmentDto {

    private Long id;
    private Long courseId;
    private String courseTitle;
    private String courseSlug;
    private String track;
    private String status;
    private LocalDateTime enrolledAt;

    public StudentEnrollmentDto() {
    }

    public StudentEnrollmentDto(Long id, Long courseId, String courseTitle, String courseSlug, String track, String status, LocalDateTime enrolledAt) {
        this.id = id;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.courseSlug = courseSlug;
        this.track = track;
        this.status = status;
        this.enrolledAt = enrolledAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public String getCourseSlug() {
        return courseSlug;
    }

    public void setCourseSlug(String courseSlug) {
        this.courseSlug = courseSlug;
    }

    public String getTrack() {
        return track;
    }

    public void setTrack(String track) {
        this.track = track;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }
}
