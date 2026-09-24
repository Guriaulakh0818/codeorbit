package com.codeorbit.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class AdminAnalyticsDto {

    public static class KpisDto {
        private long totalStudents;
        private long activeLearners;
        private long courseCompletions;
        private BigDecimal totalRevenue;
        private BigDecimal placementReadyRevenue;
        private BigDecimal certificateRevenue;
        private BigDecimal placementKitRevenue;
        private BigDecimal ebookRevenue;
        private double studentGrowthPct;
        private double activeLearnersGrowthPct;
        private double completionGrowthPct;
        private double revenueGrowthPct;

        public KpisDto() {}

        public long getTotalStudents() { return totalStudents; }
        public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }
        public long getActiveLearners() { return activeLearners; }
        public void setActiveLearners(long activeLearners) { this.activeLearners = activeLearners; }
        public long getCourseCompletions() { return courseCompletions; }
        public void setCourseCompletions(long courseCompletions) { this.courseCompletions = courseCompletions; }
        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
        public BigDecimal getPlacementReadyRevenue() { return placementReadyRevenue; }
        public void setPlacementReadyRevenue(BigDecimal placementReadyRevenue) { this.placementReadyRevenue = placementReadyRevenue; }
        public BigDecimal getCertificateRevenue() { return certificateRevenue; }
        public void setCertificateRevenue(BigDecimal certificateRevenue) { this.certificateRevenue = certificateRevenue; }
        public BigDecimal getPlacementKitRevenue() { return placementKitRevenue; }
        public void setPlacementKitRevenue(BigDecimal placementKitRevenue) { this.placementKitRevenue = placementKitRevenue; }
        public BigDecimal getEbookRevenue() { return ebookRevenue; }
        public void setEbookRevenue(BigDecimal ebookRevenue) { this.ebookRevenue = ebookRevenue; }
        public double getStudentGrowthPct() { return studentGrowthPct; }
        public void setStudentGrowthPct(double studentGrowthPct) { this.studentGrowthPct = studentGrowthPct; }
        public double getActiveLearnersGrowthPct() { return activeLearnersGrowthPct; }
        public void setActiveLearnersGrowthPct(double activeLearnersGrowthPct) { this.activeLearnersGrowthPct = activeLearnersGrowthPct; }
        public double getCompletionGrowthPct() { return completionGrowthPct; }
        public void setCompletionGrowthPct(double completionGrowthPct) { this.completionGrowthPct = completionGrowthPct; }
        public double getRevenueGrowthPct() { return revenueGrowthPct; }
        public void setRevenueGrowthPct(double revenueGrowthPct) { this.revenueGrowthPct = revenueGrowthPct; }
    }

    public static class TrendDataPointDto {
        private String label;
        private String date;
        private long enrollments;
        private long completions;
        private BigDecimal revenue;

        public TrendDataPointDto() {}
        public TrendDataPointDto(String label, String date, long enrollments, long completions, BigDecimal revenue) {
            this.label = label;
            this.date = date;
            this.enrollments = enrollments;
            this.completions = completions;
            this.revenue = revenue;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public long getEnrollments() { return enrollments; }
        public void setEnrollments(long enrollments) { this.enrollments = enrollments; }
        public long getCompletions() { return completions; }
        public void setCompletions(long completions) { this.completions = completions; }
        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
    }

    public static class CoursePerformanceDto {
        private Long id;
        private String title;
        private String track;
        private String level;
        private long enrolledStudents;
        private double completionRatePct;
        private double avgQuizScorePct;
        private String status;

        public CoursePerformanceDto() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getTrack() { return track; }
        public void setTrack(String track) { this.track = track; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public long getEnrolledStudents() { return enrolledStudents; }
        public void setEnrolledStudents(long enrolledStudents) { this.enrolledStudents = enrolledStudents; }
        public double getCompletionRatePct() { return completionRatePct; }
        public void setCompletionRatePct(double completionRatePct) { this.completionRatePct = completionRatePct; }
        public double getAvgQuizScorePct() { return avgQuizScorePct; }
        public void setAvgQuizScorePct(double avgQuizScorePct) { this.avgQuizScorePct = avgQuizScorePct; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class RecentActivityDto {
        private String id;
        private String type; // REGISTRATION, COMPLETION, PLACEMENT_READY, CERTIFICATE, QUIZ_ATTEMPT, ORDER
        private String title;
        private String description;
        private String userEmail;
        private String userName;
        private LocalDateTime timestamp;
        private String status;
        private BigDecimal amount;

        public RecentActivityDto() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getUserEmail() { return userEmail; }
        public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
    }
}
