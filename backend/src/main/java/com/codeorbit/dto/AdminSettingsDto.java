package com.codeorbit.dto;

import java.math.BigDecimal;

public class AdminSettingsDto {

    private String platformName;
    private String domain;
    private String supportEmail;
    private BigDecimal placementReadyPrice;
    private BigDecimal certificatePrice;
    private BigDecimal placementKitPrice;
    private String currency;
    private String paymentGateway;
    private String razorpayKeyId;
    private boolean serverEnforcedPricing;
    private String defaultLanguage;
    private String allowedRoles;

    public AdminSettingsDto() {
        this.platformName = "CodeOrbit";
        this.domain = "codeorbit.online";
        this.supportEmail = "support@codeorbit.online";
        this.placementReadyPrice = new BigDecimal("29.00");
        this.certificatePrice = new BigDecimal("9.00");
        this.placementKitPrice = new BigDecimal("99.00");
        this.currency = "INR";
        this.paymentGateway = "Razorpay";
        this.serverEnforcedPricing = true;
        this.defaultLanguage = "en";
        this.allowedRoles = "SUPER_ADMIN, ADMIN, CONTENT_MANAGER, SUPPORT";
    }

    public String getPlatformName() { return platformName; }
    public void setPlatformName(String platformName) { this.platformName = platformName; }
    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }
    public String getSupportEmail() { return supportEmail; }
    public void setSupportEmail(String supportEmail) { this.supportEmail = supportEmail; }
    public BigDecimal getPlacementReadyPrice() { return placementReadyPrice; }
    public void setPlacementReadyPrice(BigDecimal placementReadyPrice) { this.placementReadyPrice = placementReadyPrice; }
    public BigDecimal getCertificatePrice() { return certificatePrice; }
    public void setCertificatePrice(BigDecimal certificatePrice) { this.certificatePrice = certificatePrice; }
    public BigDecimal getPlacementKitPrice() { return placementKitPrice; }
    public void setPlacementKitPrice(BigDecimal placementKitPrice) { this.placementKitPrice = placementKitPrice; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getPaymentGateway() { return paymentGateway; }
    public void setPaymentGateway(String paymentGateway) { this.paymentGateway = paymentGateway; }
    public String getRazorpayKeyId() { return razorpayKeyId; }
    public void setRazorpayKeyId(String razorpayKeyId) { this.razorpayKeyId = razorpayKeyId; }
    public boolean isServerEnforcedPricing() { return serverEnforcedPricing; }
    public void setServerEnforcedPricing(boolean serverEnforcedPricing) { this.serverEnforcedPricing = serverEnforcedPricing; }
    public String getDefaultLanguage() { return defaultLanguage; }
    public void setDefaultLanguage(String defaultLanguage) { this.defaultLanguage = defaultLanguage; }
    public String getAllowedRoles() { return allowedRoles; }
    public void setAllowedRoles(String allowedRoles) { this.allowedRoles = allowedRoles; }
}
