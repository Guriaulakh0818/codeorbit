package com.codeorbit.dto;

import com.codeorbit.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDto {

    private Long id;
    private String orderNumber;
    private BigDecimal totalAmount;
    private String currency;
    private OrderStatus status;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private List<OrderItemResponseDto> items;

    public OrderResponseDto() {
    }

    public OrderResponseDto(
            Long id,
            String orderNumber,
            BigDecimal totalAmount,
            String currency,
            OrderStatus status,
            String razorpayOrderId,
            String razorpayPaymentId,
            LocalDateTime createdAt,
            LocalDateTime paidAt,
            List<OrderItemResponseDto> items
    ) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.totalAmount = totalAmount;
        this.currency = currency;
        this.status = status;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.createdAt = createdAt;
        this.paidAt = paidAt;
        this.items = items;
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

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
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

    public List<OrderItemResponseDto> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponseDto> items) {
        this.items = items;
    }
}
