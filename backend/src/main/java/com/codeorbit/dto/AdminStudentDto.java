package com.codeorbit.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class AdminStudentDto {

    public static class Summary {
        private Long id;
        private String fullName;
        private String email;
        private String role;
        private LocalDateTime joinedAt;
        private long enrolledCoursesCount;
        private long completedLessonsCount;
        private long quizAttemptsCount;
        private long certificatesCount;
        private BigDecimal totalSpent;
        private String status;

        public Summary() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public LocalDateTime getJoinedAt() { return joinedAt; }
        public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
        public long getEnrolledCoursesCount() { return enrolledCoursesCount; }
        public void setEnrolledCoursesCount(long enrolledCoursesCount) { this.enrolledCoursesCount = enrolledCoursesCount; }
        public long getCompletedLessonsCount() { return completedLessonsCount; }
        public void setCompletedLessonsCount(long completedLessonsCount) { this.completedLessonsCount = completedLessonsCount; }
        public long getQuizAttemptsCount() { return quizAttemptsCount; }
        public void setQuizAttemptsCount(long quizAttemptsCount) { this.quizAttemptsCount = quizAttemptsCount; }
        public long getCertificatesCount() { return certificatesCount; }
        public void setCertificatesCount(long certificatesCount) { this.certificatesCount = certificatesCount; }
        public BigDecimal getTotalSpent() { return totalSpent; }
        public void setTotalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class Detail {
        private Long id;
        private String fullName;
        private String email;
        private String role;
        private LocalDateTime joinedAt;
        private String authProvider;
        private String status;
        private BigDecimal totalSpent;
        private List<StudentCourseProgressDto> enrolledCourses;
        private List<StudentQuizAttemptDto> quizAttempts;
        private List<StudentPaymentRecordDto> payments;
        private List<StudentCertificateRecordDto> certificates;

        public Detail() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public LocalDateTime getJoinedAt() { return joinedAt; }
        public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
        public String getAuthProvider() { return authProvider; }
        public void setAuthProvider(String authProvider) { this.authProvider = authProvider; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public BigDecimal getTotalSpent() { return totalSpent; }
        public void setTotalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; }
        public List<StudentCourseProgressDto> getEnrolledCourses() { return enrolledCourses; }
        public void setEnrolledCourses(List<StudentCourseProgressDto> enrolledCourses) { this.enrolledCourses = enrolledCourses; }
        public List<StudentQuizAttemptDto> getQuizAttempts() { return quizAttempts; }
        public void setQuizAttempts(List<StudentQuizAttemptDto> quizAttempts) { this.quizAttempts = quizAttempts; }
        public List<StudentPaymentRecordDto> getPayments() { return payments; }
        public void setPayments(List<StudentPaymentRecordDto> payments) { this.payments = payments; }
        public List<StudentCertificateRecordDto> getCertificates() { return certificates; }
        public void setCertificates(List<StudentCertificateRecordDto> certificates) { this.certificates = certificates; }
    }

    public static class StudentCourseProgressDto {
        private Long courseId;
        private String title;
        private String track;
        private String level;
        private int totalLessons;
        private int completedLessons;
        private double progressPercentage;
        private LocalDateTime enrolledAt;

        public StudentCourseProgressDto() {}

        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getTrack() { return track; }
        public void setTrack(String track) { this.track = track; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public int getTotalLessons() { return totalLessons; }
        public void setTotalLessons(int totalLessons) { this.totalLessons = totalLessons; }
        public int getCompletedLessons() { return completedLessons; }
        public void setCompletedLessons(int completedLessons) { this.completedLessons = completedLessons; }
        public double getProgressPercentage() { return progressPercentage; }
        public void setProgressPercentage(double progressPercentage) { this.progressPercentage = progressPercentage; }
        public LocalDateTime getEnrolledAt() { return enrolledAt; }
        public void setEnrolledAt(LocalDateTime enrolledAt) { this.enrolledAt = enrolledAt; }
    }

    public static class StudentQuizAttemptDto {
        private Long attemptId;
        private Long quizId;
        private String quizTitle;
        private String courseTitle;
        private int score;
        private int totalQuestions;
        private double percentage;
        private boolean passed;
        private LocalDateTime submittedAt;

        public StudentQuizAttemptDto() {}

        public Long getAttemptId() { return attemptId; }
        public void setAttemptId(Long attemptId) { this.attemptId = attemptId; }
        public Long getQuizId() { return quizId; }
        public void setQuizId(Long quizId) { this.quizId = quizId; }
        public String getQuizTitle() { return quizTitle; }
        public void setQuizTitle(String quizTitle) { this.quizTitle = quizTitle; }
        public String getCourseTitle() { return courseTitle; }
        public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }
        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }
        public int getTotalQuestions() { return totalQuestions; }
        public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
        public double getPercentage() { return percentage; }
        public void setPercentage(double percentage) { this.percentage = percentage; }
        public boolean isPassed() { return passed; }
        public void setPassed(boolean passed) { this.passed = passed; }
        public LocalDateTime getSubmittedAt() { return submittedAt; }
        public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    }

    public static class StudentPaymentRecordDto {
        private String id;
        private String type;
        private String description;
        private BigDecimal amount;
        private String currency;
        private String status;
        private String orderId;
        private String paymentId;
        private LocalDateTime createdAt;

        public StudentPaymentRecordDto() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }
        public String getPaymentId() { return paymentId; }
        public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class StudentCertificateRecordDto {
        private Long id;
        private String certificateCode;
        private String courseTitle;
        private String subject;
        private String status;
        private LocalDateTime issuedAt;
        private String pdfUrl;
        private String verificationUrl;

        public StudentCertificateRecordDto() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getCertificateCode() { return certificateCode; }
        public void setCertificateCode(String certificateCode) { this.certificateCode = certificateCode; }
        public String getCourseTitle() { return courseTitle; }
        public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public LocalDateTime getIssuedAt() { return issuedAt; }
        public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }
        public String getPdfUrl() { return pdfUrl; }
        public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }
        public String getVerificationUrl() { return verificationUrl; }
        public void setVerificationUrl(String verificationUrl) { this.verificationUrl = verificationUrl; }
    }
}
