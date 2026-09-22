package com.codeorbit.dto;

import com.codeorbit.entity.PaymentStatus;
import java.time.LocalDateTime;

public class PlacementReadyPaymentSummaryDto {

    private Long id;
    private String orderNumber;
    private String courseTitle;
    private String courseSlug;
    private String subcourseTitle;
    private int amountInr;
    private String currency;
    private PaymentStatus status;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private boolean entitlementActive;

    public PlacementReadyPaymentSummaryDto() {
    }

    public PlacementReadyPaymentSummaryDto(Long id, String orderNumber, String courseTitle, String courseSlug,
                                          String subcourseTitle, int amountInr, String currency,
                                          PaymentStatus status, String razorpayOrderId, String razorpayPaymentId,
                                          LocalDateTime createdAt, LocalDateTime paidAt, boolean entitlementActive) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.courseTitle = courseTitle;
        this.courseSlug = courseSlug;
        this.subcourseTitle = subcourseTitle;
        this.amountInr = amountInr;
        this.currency = currency;
        this.status = status;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.createdAt = createdAt;
        this.paidAt = paidAt;
        this.entitlementActive = entitlementActive;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
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

    public String getSubcourseTitle() {
        return subcourseTitle;
    }

    public void setSubcourseTitle(String subcourseTitle) {
        this.subcourseTitle = subcourseTitle;
    }

    public int getAmountInr() {
        return amountInr;
    }

    public void setAmountInr(int amountInr) {
        this.amountInr = amountInr;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    public boolean isEntitlementActive() {
        return entitlementActive;
    }

    public void setEntitlementActive(boolean entitlementActive) {
        this.entitlementActive = entitlementActive;
    }
}
