package com.codeorbit.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleLoginRequestDto {

    @NotBlank(message = "Google ID token is required")
    private String idToken;

    public GoogleLoginRequestDto() {
    }

    public GoogleLoginRequestDto(String idToken) {
        this.idToken = idToken;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }
}
