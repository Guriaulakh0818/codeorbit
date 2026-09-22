package com.codeorbit.controller;

import com.codeorbit.dto.ApiResponse;
import com.codeorbit.dto.AuthResponseDto;
import com.codeorbit.dto.LoginRequestDto;
import com.codeorbit.dto.RegisterRequestDto;
import com.codeorbit.dto.UserSummaryDto;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final com.codeorbit.service.GoogleAuthService googleAuthService;

    public AuthController(AuthService authService, com.codeorbit.service.GoogleAuthService googleAuthService) {
        this.authService = authService;
        this.googleAuthService = googleAuthService;
    }

    /**
     * POST /api/auth/register
     * Public registration for STUDENT accounts only.
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDto>> register(
            @Valid @RequestBody RegisterRequestDto registerDto
    ) {
        AuthResponseDto response = authService.registerStudent(registerDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student registration successful", response));
    }

    /**
     * POST /api/auth/login
     * Authenticates student or admin and returns JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDto>> login(
            @Valid @RequestBody LoginRequestDto loginDto
    ) {
        AuthResponseDto response = authService.login(loginDto);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    /**
     * POST /api/auth/google
     * Authenticates or auto-registers a STUDENT using a Google ID token.
     */
    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponseDto>> googleLogin(
            @Valid @RequestBody com.codeorbit.dto.GoogleLoginRequestDto requestDto
    ) {
        AuthResponseDto response = googleAuthService.authenticateWithGoogle(requestDto.getIdToken());
        return ResponseEntity.ok(ApiResponse.success("Google login successful", response));
    }

    /**
     * GET /api/auth/me
     * Returns profile of current authenticated user from SecurityContext.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserSummaryDto>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        UserSummaryDto userSummary = authService.getCurrentUser(userPrincipal);
        return ResponseEntity.ok(ApiResponse.success(userSummary));
    }
}
