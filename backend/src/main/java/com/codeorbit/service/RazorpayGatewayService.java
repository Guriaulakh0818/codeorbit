package com.codeorbit.service;

public interface RazorpayGatewayService {

    String createOrder(String receipt, int amountPaise, String currency);

    boolean verifySignature(String orderId, String paymentId, String signature);

    boolean verifyWebhookSignature(String payload, String signature);

    String getKeyId();
}
