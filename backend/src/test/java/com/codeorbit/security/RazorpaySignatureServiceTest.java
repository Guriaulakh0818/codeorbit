package com.codeorbit.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RazorpaySignatureServiceTest {

    private RazorpaySignatureService signatureService;
    private final String testSecret = "TestRazorpayKeySecretForSigning2026";
    private final String webhookSecret = "TestWebhookSecret2026";

    @BeforeEach
    void setUp() {
        signatureService = new RazorpaySignatureService();
    }

    @Test
    @DisplayName("Should correctly generate and verify valid payment signature")
    void testValidPaymentSignature() {
        String orderId = "order_N1234567890123";
        String paymentId = "pay_N9876543210987";
        String payload = orderId + "|" + paymentId;

        String validSignature = signatureService.calculateHmacSha256(payload, testSecret);

        boolean isValid = signatureService.verifyPaymentSignature(orderId, paymentId, validSignature, testSecret);
        assertTrue(isValid, "Valid signature must return true");
    }

    @Test
    @DisplayName("Should reject forged or tampered payment signature")
    void testInvalidPaymentSignature() {
        String orderId = "order_N1234567890123";
        String paymentId = "pay_N9876543210987";
        String tamperedSignature = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

        boolean isValid = signatureService.verifyPaymentSignature(orderId, paymentId, tamperedSignature, testSecret);
        assertFalse(isValid, "Tampered signature must return false");
    }

    @Test
    @DisplayName("Should correctly verify valid webhook signature")
    void testValidWebhookSignature() {
        String rawBody = "{\"event\":\"payment.captured\",\"payload\":{\"payment\":{\"entity\":{\"id\":\"pay_123\",\"order_id\":\"order_456\"}}}}";
        String validSignature = signatureService.calculateHmacSha256(rawBody, webhookSecret);

        boolean isValid = signatureService.verifyWebhookSignature(rawBody, validSignature, webhookSecret);
        assertTrue(isValid, "Valid webhook signature must return true");
    }

    @Test
    @DisplayName("Should reject invalid webhook signature")
    void testInvalidWebhookSignature() {
        String rawBody = "{\"event\":\"payment.captured\"}";
        String invalidSignature = "invalid_hex_signature";

        boolean isValid = signatureService.verifyWebhookSignature(rawBody, invalidSignature, webhookSecret);
        assertFalse(isValid, "Invalid webhook signature must return false");
    }

    @Test
    @DisplayName("Should handle null inputs gracefully without throwing exceptions")
    void testNullInputs() {
        assertFalse(signatureService.verifyPaymentSignature(null, "pay_1", "sig_1", testSecret));
        assertFalse(signatureService.verifyPaymentSignature("order_1", null, "sig_1", testSecret));
        assertFalse(signatureService.verifyPaymentSignature("order_1", "pay_1", null, testSecret));
        assertFalse(signatureService.verifyPaymentSignature("order_1", "pay_1", "sig_1", null));

        assertFalse(signatureService.verifyWebhookSignature(null, "sig", webhookSecret));
        assertFalse(signatureService.verifyWebhookSignature("body", null, webhookSecret));
        assertFalse(signatureService.verifyWebhookSignature("body", "sig", null));
    }
}
