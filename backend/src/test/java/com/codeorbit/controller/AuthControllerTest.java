package com.codeorbit.controller;

import com.codeorbit.dto.AuthResponseDto;
import com.codeorbit.dto.LoginRequestDto;
import com.codeorbit.dto.RegisterRequestDto;
import com.codeorbit.dto.UserSummaryDto;
import com.codeorbit.entity.Role;
import com.codeorbit.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    private AuthResponseDto sampleAuthResponse;

    @BeforeEach
    void setUp() {
        UserSummaryDto userSummary = new UserSummaryDto(
                1L,
                "Aman Sharma",
                "aman.student@codeorbit.dev",
                Role.STUDENT,
                LocalDateTime.now()
        );
        sampleAuthResponse = new AuthResponseDto("jwt_sample_token_123", userSummary);
    }

    @Test
    void testRegisterStudent_Success_Returns201() throws Exception {
        RegisterRequestDto registerDto = new RegisterRequestDto(
                "Aman Sharma",
                "aman.student@codeorbit.dev",
                "Password123!"
        );

        when(authService.registerStudent(any(RegisterRequestDto.class)))
                .thenReturn(sampleAuthResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("jwt_sample_token_123"))
                .andExpect(jsonPath("$.data.user.email").value("aman.student@codeorbit.dev"));
    }

    @Test
    void testRegisterStudent_ValidationFailure_Returns400() throws Exception {
        RegisterRequestDto invalidDto = new RegisterRequestDto(
                "", // Blank name
                "invalid-email-format", // Invalid email
                "123" // Too short password
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }

    @Test
    void testLogin_Success_Returns200() throws Exception {
        LoginRequestDto loginDto = new LoginRequestDto(
                "aman.student@codeorbit.dev",
                "Password123!"
        );

        when(authService.login(any(LoginRequestDto.class)))
                .thenReturn(sampleAuthResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("jwt_sample_token_123"));
    }

    @Test
    void testLogin_BadCredentials_Returns401() throws Exception {
        LoginRequestDto loginDto = new LoginRequestDto(
                "aman.student@codeorbit.dev",
                "WrongPassword"
        );

        when(authService.login(any(LoginRequestDto.class)))
                .thenThrow(new BadCredentialsException("Invalid email or password. Please check your credentials."));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid email or password. Please check your credentials."));
    }


    @Test
    @WithMockUser(username = "aman.student@codeorbit.dev", roles = {"STUDENT"})
    void testGetMe_Authenticated_Returns200() throws Exception {
        UserSummaryDto userSummary = new UserSummaryDto(
                1L,
                "Aman Sharma",
                "aman.student@codeorbit.dev",
                Role.STUDENT,
                LocalDateTime.now()
        );

        when(authService.getCurrentUser(any())).thenReturn(userSummary);

        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("Aman Sharma"));
    }
}
