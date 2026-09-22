package com.codeorbit.dto;

import java.time.LocalDateTime;
import java.util.List;

public class EnrolledCourseCardDto {

    private Long courseId;
    private String courseTitle;
    private String courseSlug;
    private String track;
    private String coverImageUrl;
    private String shortDescription;
    private int estimatedHours;
    private String enrollmentStatus;
    private LocalDateTime enrolledAt;

    private int totalLessons;
    private int completedLessons;
    private int completionPercentage;

    private int totalQuizzes;
    private int passedQuizzes;

    private boolean eligibleForCertificate;
    private String certificateCode;

    private String nextLessonTitle;
    private String nextLessonSlug;

    private List<SubcourseProgressSummaryDto> subcourses;

    public EnrolledCourseCardDto() {
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

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public int getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(int estimatedHours) {
        this.estimatedHours = estimatedHours;
    }

    public String getEnrollmentStatus() {
        return enrollmentStatus;
    }

    public void setEnrollmentStatus(String enrollmentStatus) {
        this.enrollmentStatus = enrollmentStatus;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public int getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(int totalLessons) {
        this.totalLessons = totalLessons;
    }

    public int getCompletedLessons() {
        return completedLessons;
    }

    public void setCompletedLessons(int completedLessons) {
        this.completedLessons = completedLessons;
    }

    public int getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(int completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public int getTotalQuizzes() {
        return totalQuizzes;
    }

    public void setTotalQuizzes(int totalQuizzes) {
        this.totalQuizzes = totalQuizzes;
    }

    public int getPassedQuizzes() {
        return passedQuizzes;
    }

    public void setPassedQuizzes(int passedQuizzes) {
        this.passedQuizzes = passedQuizzes;
    }

    public boolean isEligibleForCertificate() {
        return eligibleForCertificate;
    }

    public void setEligibleForCertificate(boolean eligibleForCertificate) {
        this.eligibleForCertificate = eligibleForCertificate;
    }

    public String getCertificateCode() {
        return certificateCode;
    }

    public void setCertificateCode(String certificateCode) {
        this.certificateCode = certificateCode;
    }

    public String getNextLessonTitle() {
        return nextLessonTitle;
    }

    public void setNextLessonTitle(String nextLessonTitle) {
        this.nextLessonTitle = nextLessonTitle;
    }

    public String getNextLessonSlug() {
        return nextLessonSlug;
    }

    public void setNextLessonSlug(String nextLessonSlug) {
        this.nextLessonSlug = nextLessonSlug;
    }

    public List<SubcourseProgressSummaryDto> getSubcourses() {
        return subcourses;
    }

    public void setSubcourses(List<SubcourseProgressSummaryDto> subcourses) {
        this.subcourses = subcourses;
    }
}
