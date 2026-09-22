package com.codeorbit.dto;

public class CertificateStatusDto {
    private String subject;
    private String subjectSlug;
    private boolean eligible;
    private int price = 9;
    private int amountInPaise = 900;
    private String currency = "INR";
    private boolean paymentRequired = true;
    private boolean purchased;
    private boolean issued;
    private String certificateCode;
    private int completedModuleQuizzes;
    private int requiredModuleQuizzes = 12;
    private int completedFinalQuizzes;
    private int requiredFinalQuizzes = 3;
    private String statusMessage;

    public CertificateStatusDto() {
    }

    public CertificateStatusDto(String subject, String subjectSlug, boolean eligible, boolean purchased, boolean issued, String certificateCode, int completedModuleQuizzes, int completedFinalQuizzes, String statusMessage) {
        this.subject = subject;
        this.subjectSlug = subjectSlug;
        this.eligible = eligible;
        this.price = 9;
        this.amountInPaise = 900;
        this.currency = "INR";
        this.paymentRequired = true;
        this.purchased = purchased;
        this.issued = issued;
        this.certificateCode = certificateCode;
        this.completedModuleQuizzes = completedModuleQuizzes;
        this.requiredModuleQuizzes = 12;
        this.completedFinalQuizzes = completedFinalQuizzes;
        this.requiredFinalQuizzes = 3;
        this.statusMessage = statusMessage;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getSubjectSlug() {
        return subjectSlug;
    }

    public void setSubjectSlug(String subjectSlug) {
        this.subjectSlug = subjectSlug;
    }

    public boolean isEligible() {
        return eligible;
    }

    public void setEligible(boolean eligible) {
        this.eligible = eligible;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getAmountInPaise() {
        return amountInPaise;
    }

    public void setAmountInPaise(int amountInPaise) {
        this.amountInPaise = amountInPaise;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public boolean isPaymentRequired() {
        return paymentRequired;
    }

    public void setPaymentRequired(boolean paymentRequired) {
        this.paymentRequired = paymentRequired;
    }

    public boolean isPurchased() {
        return purchased;
    }

    public void setPurchased(boolean purchased) {
        this.purchased = purchased;
    }

    public boolean isIssued() {
        return issued;
    }

    public void setIssued(boolean issued) {
        this.issued = issued;
    }

    public String getCertificateCode() {
        return certificateCode;
    }

    public void setCertificateCode(String certificateCode) {
        this.certificateCode = certificateCode;
    }

    public int getCompletedModuleQuizzes() {
        return completedModuleQuizzes;
    }

    public void setCompletedModuleQuizzes(int completedModuleQuizzes) {
        this.completedModuleQuizzes = completedModuleQuizzes;
    }

    public int getRequiredModuleQuizzes() {
        return requiredModuleQuizzes;
    }

    public void setRequiredModuleQuizzes(int requiredModuleQuizzes) {
        this.requiredModuleQuizzes = requiredModuleQuizzes;
    }

    public int getCompletedFinalQuizzes() {
        return completedFinalQuizzes;
    }

    public void setCompletedFinalQuizzes(int completedFinalQuizzes) {
        this.completedFinalQuizzes = completedFinalQuizzes;
    }

    public int getRequiredFinalQuizzes() {
        return requiredFinalQuizzes;
    }

    public void setRequiredFinalQuizzes(int requiredFinalQuizzes) {
        this.requiredFinalQuizzes = requiredFinalQuizzes;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public void setStatusMessage(String statusMessage) {
        this.statusMessage = statusMessage;
    }
}
