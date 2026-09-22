package com.codeorbit.dto;

public class CertificateOrderResponseDto {
    private String orderNumber;
    private String razorpayOrderId;
    private int amountPaise;
    private String currency;
    private String razorpayKeyId;
    private String courseSlug;
    private String courseTitle;
    private String studentName;
    private String studentEmail;
    private String message;

    public CertificateOrderResponseDto() {
    }

    public CertificateOrderResponseDto(String orderNumber, String razorpayOrderId, int amountPaise, String currency, String razorpayKeyId, String courseSlug, String courseTitle, String studentName, String studentEmail, String message) {
        this.orderNumber = orderNumber;
        this.razorpayOrderId = razorpayOrderId;
        this.amountPaise = amountPaise;
        this.currency = currency;
        this.razorpayKeyId = razorpayKeyId;
        this.courseSlug = courseSlug;
        this.courseTitle = courseTitle;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.message = message;
    }

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

    public int getAmountPaise() {
        return amountPaise;
    }

    public void setAmountPaise(int amountPaise) {
        this.amountPaise = amountPaise;
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

    public String getCourseSlug() {
        return courseSlug;
    }

    public void setCourseSlug(String courseSlug) {
        this.courseSlug = courseSlug;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
