package com.codeorbit.dto;

import java.util.ArrayList;
import java.util.List;

public class UserProgressDto {
    private Long courseId;
    private String courseSlug;
    private String courseTitle;
    private long totalLessons;
    private long completedLessons;
    private int completionPercentage;
    private long totalQuizzes;
    private long passedQuizzes;
    private boolean eligibleForCertificate;
    private String certificateCode;
    private List<Long> completedLessonIds = new ArrayList<>();
    private List<Long> bookmarkedLessonIds = new ArrayList<>();

    public UserProgressDto() {
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseSlug() {
        return courseSlug;
    }

    public void setCourseSlug(String courseSlug) {
        this.courseSlug = courseSlug;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public long getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(long totalLessons) {
        this.totalLessons = totalLessons;
    }

    public long getCompletedLessons() {
        return completedLessons;
    }

    public void setCompletedLessons(long completedLessons) {
        this.completedLessons = completedLessons;
    }

    public int getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(int completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public long getTotalQuizzes() {
        return totalQuizzes;
    }

    public void setTotalQuizzes(long totalQuizzes) {
        this.totalQuizzes = totalQuizzes;
    }

    public long getPassedQuizzes() {
        return passedQuizzes;
    }

    public void setPassedQuizzes(long passedQuizzes) {
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

    public List<Long> getCompletedLessonIds() {
        return completedLessonIds;
    }

    public void setCompletedLessonIds(List<Long> completedLessonIds) {
        this.completedLessonIds = completedLessonIds;
    }

    public List<Long> getBookmarkedLessonIds() {
        return bookmarkedLessonIds;
    }

    public void setBookmarkedLessonIds(List<Long> bookmarkedLessonIds) {
        this.bookmarkedLessonIds = bookmarkedLessonIds;
    }
}
