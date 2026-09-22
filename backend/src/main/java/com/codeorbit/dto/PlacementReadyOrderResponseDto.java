package com.codeorbit.dto;

public class PlacementReadyOrderResponseDto {

    private String orderNumber;
    private String razorpayOrderId;
    private String keyId;
    private int amountPaise;
    private int amountInr;
    private String currency;
    private String courseTitle;
    private String courseSlug;
    private String subcourseTitle;
    private String userEmail;
    private String userName;

    public PlacementReadyOrderResponseDto() {
    }

    public PlacementReadyOrderResponseDto(String orderNumber, String razorpayOrderId, String keyId,
                                          int amountPaise, int amountInr, String currency,
                                          String courseTitle, String courseSlug, String subcourseTitle,
                                          String userEmail, String userName) {
        this.orderNumber = orderNumber;
        this.razorpayOrderId = razorpayOrderId;
        this.keyId = keyId;
        this.amountPaise = amountPaise;
        this.amountInr = amountInr;
        this.currency = currency;
        this.courseTitle = courseTitle;
        this.courseSlug = courseSlug;
        this.subcourseTitle = subcourseTitle;
        this.userEmail = userEmail;
        this.userName = userName;
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

    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
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

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
