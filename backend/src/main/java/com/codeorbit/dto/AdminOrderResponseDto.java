package com.codeorbit.dto;

import com.codeorbit.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AdminOrderResponseDto {

    private Long id;
    private String orderNumber;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private BigDecimal totalAmount;
    private String currency;
    private OrderStatus status;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private int itemCount;
    private List<AdminOrderItemDto> items = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;

    public AdminOrderResponseDto() {
    }

    public AdminOrderResponseDto(Long id, String orderNumber, Long studentId, String studentName, String studentEmail,
                                 BigDecimal totalAmount, String currency, OrderStatus status,
                                 String razorpayOrderId, String razorpayPaymentId,
                                 int itemCount, List<AdminOrderItemDto> items,
                                 LocalDateTime createdAt, LocalDateTime paidAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.totalAmount = totalAmount;
        this.currency = currency;
        this.status = status;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.itemCount = itemCount;
        this.items = items != null ? items : new ArrayList<>();
        this.createdAt = createdAt;
        this.paidAt = paidAt;
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

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
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

    public int getItemCount() {
        return itemCount;
    }

    public void setItemCount(int itemCount) {
        this.itemCount = itemCount;
    }

    public List<AdminOrderItemDto> getItems() {
        return items;
    }

    public void setItems(List<AdminOrderItemDto> items) {
        this.items = items;
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
}
