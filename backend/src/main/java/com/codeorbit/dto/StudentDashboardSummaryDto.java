package com.codeorbit.dto;

import java.util.List;

public class StudentDashboardSummaryDto {

    private Long studentId;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String role;

    private int totalEnrolledCourses;
    private int totalCompletedLessons;
    private int totalBookmarks;
    private int totalCertificatesEarned;

    private List<EnrolledCourseCardDto> enrolledCourses;
    private List<CertificatePublicDto> certificates;

    public StudentDashboardSummaryDto() {
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getTotalEnrolledCourses() {
        return totalEnrolledCourses;
    }

    public void setTotalEnrolledCourses(int totalEnrolledCourses) {
        this.totalEnrolledCourses = totalEnrolledCourses;
    }

    public int getTotalCompletedLessons() {
        return totalCompletedLessons;
    }

    public void setTotalCompletedLessons(int totalCompletedLessons) {
        this.totalCompletedLessons = totalCompletedLessons;
    }

    public int getTotalBookmarks() {
        return totalBookmarks;
    }

    public void setTotalBookmarks(int totalBookmarks) {
        this.totalBookmarks = totalBookmarks;
    }

    public int getTotalCertificatesEarned() {
        return totalCertificatesEarned;
    }

    public void setTotalCertificatesEarned(int totalCertificatesEarned) {
        this.totalCertificatesEarned = totalCertificatesEarned;
    }

    public List<EnrolledCourseCardDto> getEnrolledCourses() {
        return enrolledCourses;
    }

    public void setEnrolledCourses(List<EnrolledCourseCardDto> enrolledCourses) {
        this.enrolledCourses = enrolledCourses;
    }

    public List<CertificatePublicDto> getCertificates() {
        return certificates;
    }

    public void setCertificates(List<CertificatePublicDto> certificates) {
        this.certificates = certificates;
    }
}
