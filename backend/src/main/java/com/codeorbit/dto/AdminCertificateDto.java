package com.codeorbit.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminCertificateDto {

    public static class Metrics {
        private long certificatesIssued;
        private long eligibleStudents;
        private long paymentPending;
        private long paidCertificates;
        private BigDecimal certificateRevenue;
        private BigDecimal unitPrice;

        public Metrics() {}

        public long getCertificatesIssued() { return certificatesIssued; }
        public void setCertificatesIssued(long certificatesIssued) { this.certificatesIssued = certificatesIssued; }
        public long getEligibleStudents() { return eligibleStudents; }
        public void setEligibleStudents(long eligibleStudents) { this.eligibleStudents = eligibleStudents; }
        public long getPaymentPending() { return paymentPending; }
        public void setPaymentPending(long paymentPending) { this.paymentPending = paymentPending; }
        public long getPaidCertificates() { return paidCertificates; }
        public void setPaidCertificates(long paidCertificates) { this.paidCertificates = paidCertificates; }
        public BigDecimal getCertificateRevenue() { return certificateRevenue; }
        public void setCertificateRevenue(BigDecimal certificateRevenue) { this.certificateRevenue = certificateRevenue; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    }

    public static class CertificateItem {
        private Long id;
        private String certificateCode;
        private Long userId;
        private String studentName;
        private String studentEmail;
        private Long courseId;
        private String courseTitle;
        private String subject;
        private boolean beginnerCompleted;
        private boolean intermediateCompleted;
        private boolean advancedCompleted;
        private String paymentStatus;
        private String certificateStatus;
        private LocalDateTime issuedAt;
        private String pdfUrl;
        private String verificationUrl;

        public CertificateItem() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getCertificateCode() { return certificateCode; }
        public void setCertificateCode(String certificateCode) { this.certificateCode = certificateCode; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }
        public String getStudentEmail() { return studentEmail; }
        public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }
        public String getCourseTitle() { return courseTitle; }
        public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public boolean isBeginnerCompleted() { return beginnerCompleted; }
        public void setBeginnerCompleted(boolean beginnerCompleted) { this.beginnerCompleted = beginnerCompleted; }
        public boolean isIntermediateCompleted() { return intermediateCompleted; }
        public void setIntermediateCompleted(boolean intermediateCompleted) { this.intermediateCompleted = intermediateCompleted; }
        public boolean isAdvancedCompleted() { return advancedCompleted; }
        public void setAdvancedCompleted(boolean advancedCompleted) { this.advancedCompleted = advancedCompleted; }
        public String getPaymentStatus() { return paymentStatus; }
        public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
        public String getCertificateStatus() { return certificateStatus; }
        public void setCertificateStatus(String certificateStatus) { this.certificateStatus = certificateStatus; }
        public LocalDateTime getIssuedAt() { return issuedAt; }
        public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }
        public String getPdfUrl() { return pdfUrl; }
        public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }
        public String getVerificationUrl() { return verificationUrl; }
        public void setVerificationUrl(String verificationUrl) { this.verificationUrl = verificationUrl; }
    }
}
