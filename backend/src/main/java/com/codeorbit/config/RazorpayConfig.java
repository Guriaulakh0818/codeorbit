package com.codeorbit.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayConfig {

    @Value("${app.razorpay.key-id:rzp_test_dummy_key_id}")
    private String keyId;

    @Value("${app.razorpay.key-secret:dummy_razorpay_secret_key_2026}")
    private String keySecret;

    @Value("${app.razorpay.webhook-secret:dummy_razorpay_webhook_secret_2026}")
    private String webhookSecret;

    public String getKeyId() {
        return keyId;
    }

    public String getKeySecret() {
        return keySecret;
    }

    public String getWebhookSecret() {
        return webhookSecret;
    }

    public boolean isConfigured() {
        return keyId != null && !keyId.isBlank() && !keyId.contains("dummy") &&
               keySecret != null && !keySecret.isBlank() && !keySecret.contains("dummy");
    }
}
