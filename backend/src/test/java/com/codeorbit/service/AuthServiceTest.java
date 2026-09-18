package com.codeorbit.service;

import com.codeorbit.dto.AuthResponseDto;
import com.codeorbit.dto.LoginRequestDto;
import com.codeorbit.dto.RegisterRequestDto;
import com.codeorbit.dto.UserSummaryDto;
import com.codeorbit.entity.Role;
import com.codeorbit.entity.User;
import com.codeorbit.repository.UserRepository;
import com.codeorbit.security.JwtUtils;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    private JwtUtils jwtUtils;
    private AuthServiceImpl authService;
    private User studentUser;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils("CodeOrbitSecureDefaultSecretKeyForJwtSigningMustBeAtLeast256BitsLong2026!", 86400000L);
        authService = new AuthServiceImpl(userRepository, passwordEncoder, authenticationManager, jwtUtils);

        studentUser = new User(
                "Aman Sharma",
                "aman.student@codeorbit.dev",
                "hashed_password",
                Role.STUDENT
        );
        studentUser.setId(1L);
    }

    @Test
    void testRegisterStudent_Success() {
        RegisterRequestDto registerDto = new RegisterRequestDto(
                "Aman Sharma",
                "aman.student@codeorbit.dev",
                "Password123!"
        );

        when(userRepository.existsByEmailIgnoreCase("aman.student@codeorbit.dev")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(studentUser);

        AuthResponseDto response = authService.registerStudent(registerDto);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals("Aman Sharma", response.getUser().getFullName());
        assertEquals(Role.STUDENT, response.getUser().getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }


    @Test
    void testRegisterStudent_DuplicateEmail_ThrowsException() {
        RegisterRequestDto registerDto = new RegisterRequestDto(
                "Duplicate User",
                "aman.student@codeorbit.dev",
                "Password123!"
        );

        when(userRepository.existsByEmailIgnoreCase("aman.student@codeorbit.dev")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                authService.registerStudent(registerDto)
        );

        assertTrue(ex.getMessage().contains("already exists"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLogin_Success() {
        LoginRequestDto loginDto = new LoginRequestDto(
                "aman.student@codeorbit.dev",
                "Password123!"
        );

        UserPrincipal principal = UserPrincipal.create(studentUser);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findById(1L)).thenReturn(Optional.of(studentUser));

        AuthResponseDto response = authService.login(loginDto);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("Aman Sharma", response.getUser().getFullName());
    }


    @Test
    void testLogin_InvalidPassword_ThrowsBadCredentials() {
        LoginRequestDto loginDto = new LoginRequestDto(
                "aman.student@codeorbit.dev",
                "WrongPassword"
        );

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(loginDto));
    }

    @Test
    void testGetCurrentUser_Success() {
        UserPrincipal principal = UserPrincipal.create(studentUser);
        when(userRepository.findById(1L)).thenReturn(Optional.of(studentUser));

        UserSummaryDto userSummary = authService.getCurrentUser(principal);

        assertNotNull(userSummary);
        assertEquals(studentUser.getEmail(), userSummary.getEmail());
        assertEquals(Role.STUDENT, userSummary.getRole());
    }
}
