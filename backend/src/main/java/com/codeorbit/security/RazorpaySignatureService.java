package com.codeorbit.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.InvalidKeyException;
import java.util.HexFormat;

@Service
public class RazorpaySignatureService {

    private static final Logger log = LoggerFactory.getLogger(RazorpaySignatureService.class);
    private static final String HMAC_SHA256_ALGORITHM = "HmacSHA256";

    /**
     * Verifies the checkout signature sent back by Razorpay modal:
     * Signature payload is order_id + "|" + payment_id
     */
    public boolean verifyPaymentSignature(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature,
            String secret
    ) {
        if (razorpayOrderId == null || razorpayPaymentId == null || razorpaySignature == null || secret == null) {
            return false;
        }

        String payload = razorpayOrderId + "|" + razorpayPaymentId;
        return verifySignature(payload, razorpaySignature.trim(), secret.trim());
    }

    /**
     * Verifies webhook signature received in X-Razorpay-Signature header:
     * Signature payload is the exact raw JSON request body
     */
    public boolean verifyWebhookSignature(
            String rawBody,
            String signature,
            String webhookSecret
    ) {
        if (rawBody == null || signature == null || webhookSecret == null) {
            return false;
        }

        return verifySignature(rawBody, signature.trim(), webhookSecret.trim());
    }

    /**
     * Verifies payload signature using constant-time comparison to prevent timing attacks.
     */
    public boolean verifySignature(String payload, String expectedSignatureHex, String secret) {
        try {
            String calculatedSignatureHex = calculateHmacSha256(payload, secret);
            byte[] calculatedBytes = calculatedSignatureHex.getBytes(StandardCharsets.UTF_8);
            byte[] expectedBytes = expectedSignatureHex.getBytes(StandardCharsets.UTF_8);

            return MessageDigest.isEqual(calculatedBytes, expectedBytes);
        } catch (Exception e) {
            log.error("Failed to verify Razorpay signature: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Computes lowercase Hex HMAC-SHA256 signature for given data string and secret key.
     */
    public String calculateHmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256_ALGORITHM);
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    secret.getBytes(StandardCharsets.UTF_8),
                    HMAC_SHA256_ALGORITHM
            );
            mac.init(secretKeySpec);
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(rawHmac);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            log.error("Crypto error during HMAC-SHA256 generation: {}", e.getMessage());
            throw new IllegalStateException("Crypto error generating HMAC-SHA256 signature", e);
        }
    }
}
