package com.codeorbit.dto;

import java.math.BigDecimal;

public class RazorpayOrderResponseDto {

    private String razorpayOrderId;
    private Long internalOrderId;
    private String orderNumber;
    private BigDecimal amountInRupees;
    private Long amountInPaise;
    private String currency;
    private String razorpayKeyId;

    public RazorpayOrderResponseDto() {
    }

    public RazorpayOrderResponseDto(
            String razorpayOrderId,
            Long internalOrderId,
            String orderNumber,
            BigDecimal amountInRupees,
            Long amountInPaise,
            String currency,
            String razorpayKeyId
    ) {
        this.razorpayOrderId = razorpayOrderId;
        this.internalOrderId = internalOrderId;
        this.orderNumber = orderNumber;
        this.amountInRupees = amountInRupees;
        this.amountInPaise = amountInPaise;
        this.currency = currency;
        this.razorpayKeyId = razorpayKeyId;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public Long getInternalOrderId() {
        return internalOrderId;
    }

    public void setInternalOrderId(Long internalOrderId) {
        this.internalOrderId = internalOrderId;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public BigDecimal getAmountInRupees() {
        return amountInRupees;
    }

    public void setAmountInRupees(BigDecimal amountInRupees) {
        this.amountInRupees = amountInRupees;
    }

    public Long getAmountInPaise() {
        return amountInPaise;
    }

    public void setAmountInPaise(Long amountInPaise) {
        this.amountInPaise = amountInPaise;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getRazorpayKeyId() {
        return razorpayKeyId;
    }

    public void setRazorpayKeyId(String razorpayKeyId) {
        this.razorpayKeyId = razorpayKeyId;
    }
}
