package com.codeorbit.service;

import com.codeorbit.dto.AuthResponseDto;
import com.codeorbit.dto.GoogleLoginRequestDto;

public interface GoogleAuthService {

    AuthResponseDto loginWithGoogle(GoogleLoginRequestDto request);

    AuthResponseDto authenticateWithGoogle(String idToken);
}
