package com.codeorbit.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminPaymentDto {

    public static class Metrics {
        private BigDecimal totalRevenue;
        private BigDecimal placementReadyRevenue;
        private BigDecimal certificateRevenue;
        private BigDecimal placementKitRevenue;
        private BigDecimal ebookRevenue;
        private long totalTransactions;
        private long successfulPayments;
        private long pendingPayments;
        private long failedPayments;

        public Metrics() {}

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
        public long getTotalTransactions() { return totalTransactions; }
        public void setTotalTransactions(long totalTransactions) { this.totalTransactions = totalTransactions; }
        public long getSuccessfulPayments() { return successfulPayments; }
        public void setSuccessfulPayments(long successfulPayments) { this.successfulPayments = successfulPayments; }
        public long getPendingPayments() { return pendingPayments; }
        public void setPendingPayments(long pendingPayments) { this.pendingPayments = pendingPayments; }
        public long getFailedPayments() { return failedPayments; }
        public void setFailedPayments(long failedPayments) { this.failedPayments = failedPayments; }
    }

    public static class TransactionItem {
        private String id;
        private String orderNumber;
        private Long userId;
        private String studentName;
        private String studentEmail;
        private String productType; // PLACEMENT_READY, CERTIFICATE, PLACEMENT_KIT, EBOOK
        private String productTitle;
        private BigDecimal amount;
        private String currency;
        private String razorpayOrderId;
        private String razorpayPaymentId;
        private String status;
        private String entitlementStatus;
        private LocalDateTime createdAt;

        public TransactionItem() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getOrderNumber() { return orderNumber; }
        public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }
        public String getStudentEmail() { return studentEmail; }
        public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
        public String getProductType() { return productType; }
        public void setProductType(String productType) { this.productType = productType; }
        public String getProductTitle() { return productTitle; }
        public void setProductTitle(String productTitle) { this.productTitle = productTitle; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        public String getRazorpayOrderId() { return razorpayOrderId; }
        public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
        public String getRazorpayPaymentId() { return razorpayPaymentId; }
        public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getEntitlementStatus() { return entitlementStatus; }
        public void setEntitlementStatus(String entitlementStatus) { this.entitlementStatus = entitlementStatus; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
