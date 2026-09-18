package com.codeorbit.dto;

import jakarta.validation.constraints.NotNull;

public class RazorpayOrderCreationDto {

    @NotNull(message = "Internal Order ID is required")
    private Long orderId;

    public RazorpayOrderCreationDto() {
    }

    public RazorpayOrderCreationDto(Long orderId) {
        this.orderId = orderId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
}
