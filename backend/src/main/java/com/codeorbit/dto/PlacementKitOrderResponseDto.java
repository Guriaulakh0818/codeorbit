package com.codeorbit.dto;

public class PlacementKitOrderResponseDto {
    private String orderNumber;
    private String razorpayOrderId;
    private String razorpayKeyId;
    private int amountPaise;
    private int amountInr;
    private String currency;
    private String kitSlug;
    private String kitTitle;
    private String role;
    private String studentEmail;
    private String studentName;
    private String message;

    public PlacementKitOrderResponseDto() {
    }

    public PlacementKitOrderResponseDto(String orderNumber, String razorpayOrderId, String razorpayKeyId, int amountPaise, int amountInr, String currency, String kitSlug, String kitTitle, String role, String studentEmail, String studentName, String message) {
        this.orderNumber = orderNumber;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayKeyId = razorpayKeyId;
        this.amountPaise = amountPaise;
        this.amountInr = amountInr;
        this.currency = currency;
        this.kitSlug = kitSlug;
        this.kitTitle = kitTitle;
        this.role = role;
        this.studentEmail = studentEmail;
        this.studentName = studentName;
        this.message = message;
    }

    // Getters and Setters

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpayKeyId() {
        return razorpayKeyId;
    }

    public void setRazorpayKeyId(String razorpayKeyId) {
        this.razorpayKeyId = razorpayKeyId;
    }

    public int getAmountPaise() {
        return amountPaise;
    }

    public void setAmountPaise(int amountPaise) {
        this.amountPaise = amountPaise;
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

    public String getKitSlug() {
        return kitSlug;
    }

    public void setKitSlug(String kitSlug) {
        this.kitSlug = kitSlug;
    }

    public String getKitTitle() {
        return kitTitle;
    }

    public void setKitTitle(String kitTitle) {
        this.kitTitle = kitTitle;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
