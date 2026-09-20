package com.codeorbit.dto;

import java.time.LocalDateTime;

public class CertificatePublicDto {
    private String certificateCode;
    private String studentFullName;
    private String courseTitle;
    private String courseSlug;
    private String status;
    private boolean valid;
    private String revocationReason;
    private LocalDateTime issuedAt;

    public CertificatePublicDto() {
    }

    public CertificatePublicDto(String certificateCode, String studentFullName, String courseTitle, String courseSlug, String status, boolean valid, String revocationReason, LocalDateTime issuedAt) {
        this.certificateCode = certificateCode;
        this.studentFullName = studentFullName;
        this.courseTitle = courseTitle;
        this.courseSlug = courseSlug;
        this.status = status;
        this.valid = valid;
        this.revocationReason = revocationReason;
        this.issuedAt = issuedAt;
    }

    public String getCertificateCode() {
        return certificateCode;
    }

    public void setCertificateCode(String certificateCode) {
        this.certificateCode = certificateCode;
    }

    public String getStudentFullName() {
        return studentFullName;
    }

    public void setStudentFullName(String studentFullName) {
        this.studentFullName = studentFullName;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getRevocationReason() {
        return revocationReason;
    }

    public void setRevocationReason(String revocationReason) {
        this.revocationReason = revocationReason;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }
}
