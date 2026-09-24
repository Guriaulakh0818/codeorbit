package com.codeorbit.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminPlacementReadyDto {

    public static class Metrics {
        private long totalPurchases;
        private BigDecimal totalRevenue;
        private double conversionRatePct;
        private long activeEntitlements;
        private BigDecimal unitPrice;

        public Metrics() {}

        public long getTotalPurchases() { return totalPurchases; }
        public void setTotalPurchases(long totalPurchases) { this.totalPurchases = totalPurchases; }
        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
        public double getConversionRatePct() { return conversionRatePct; }
        public void setConversionRatePct(double conversionRatePct) { this.conversionRatePct = conversionRatePct; }
        public long getActiveEntitlements() { return activeEntitlements; }
        public void setActiveEntitlements(long activeEntitlements) { this.activeEntitlements = activeEntitlements; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    }

    public static class EntitlementItem {
        private Long id;
        private Long userId;
        private String studentName;
        private String studentEmail;
        private Long courseId;
        private String courseTitle;
        private String subject;
        private BigDecimal amount;
        private String paymentStatus;
        private String entitlementStatus;
        private String razorpayOrderId;
        private String razorpayPaymentId;
        private LocalDateTime purchaseDate;

        public EntitlementItem() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
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
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getPaymentStatus() { return paymentStatus; }
        public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
        public String getEntitlementStatus() { return entitlementStatus; }
        public void setEntitlementStatus(String entitlementStatus) { this.entitlementStatus = entitlementStatus; }
        public String getRazorpayOrderId() { return razorpayOrderId; }
        public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
        public String getRazorpayPaymentId() { return razorpayPaymentId; }
        public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }
        public LocalDateTime getPurchaseDate() { return purchaseDate; }
        public void setPurchaseDate(LocalDateTime purchaseDate) { this.purchaseDate = purchaseDate; }
    }
}
