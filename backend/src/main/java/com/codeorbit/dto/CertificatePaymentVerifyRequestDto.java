package com.codeorbit.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class CertificatePaymentVerifyRequestDto {

    @NotBlank(message = "Razorpay order ID is required")
    @JsonProperty("razorpay_order_id")
    private String razorpayOrderId;

    @NotBlank(message = "Razorpay payment ID is required")
    @JsonProperty("razorpay_payment_id")
    private String razorpayPaymentId;

    @NotBlank(message = "Razorpay signature is required")
    @JsonProperty("razorpay_signature")
    private String razorpaySignature;

    public CertificatePaymentVerifyRequestDto() {
    }

    public CertificatePaymentVerifyRequestDto(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpaySignature = razorpaySignature;
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

    public String getRazorpaySignature() {
        return razorpaySignature;
    }

    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
    }
}
