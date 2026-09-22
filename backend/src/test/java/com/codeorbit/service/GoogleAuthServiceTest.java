package com.codeorbit.service;

import com.codeorbit.dto.AuthResponseDto;
import com.codeorbit.entity.AuthProvider;
import com.codeorbit.entity.Role;
import com.codeorbit.entity.User;
import com.codeorbit.exception.BadRequestException;
import com.codeorbit.repository.UserRepository;
import com.codeorbit.security.JwtUtils;
import com.codeorbit.service.impl.GoogleAuthServiceImpl;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GoogleAuthServiceTest {

    @Mock
    private UserRepository userRepository;

    private JwtUtils jwtUtils;

    private GoogleIdToken.Payload mockPayload;

    private GoogleAuthService googleAuthService;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils("CodeOrbitSecureDefaultSecretKeyForJwtSigningMustBeAtLeast256BitsLong2026!", 86400000L);
        googleAuthService = new GoogleAuthServiceImpl(userRepository, jwtUtils, "dummy-client-id") {
            @Override
            protected GoogleIdToken.Payload verifyGoogleIdToken(String idTokenString) {
                if ("malformed.or.expired.token".equals(idTokenString)) {
                    return null;
                }
                return mockPayload;
            }
        };
    }

    @Test
    @DisplayName("authenticateWithGoogle: Automatically registers new user with Role.STUDENT upon valid Google token")
    void testAuthenticateWithGoogle_AutoRegistersNewStudent() {
        String idTokenString = "valid.google.id.token";

        mockPayload = new GoogleIdToken.Payload();
        mockPayload.setEmail("newstudent@gmail.com");
        mockPayload.setEmailVerified(true);
        mockPayload.setSubject("google-sub-12345");
        mockPayload.set("name", "New Student");
        mockPayload.set("picture", "https://photo.url/pic.jpg");

        when(userRepository.findByEmailIgnoreCase("newstudent@gmail.com")).thenReturn(Optional.empty());

        User savedUser = new User();
        savedUser.setId(101L);
        savedUser.setEmail("newstudent@gmail.com");
        savedUser.setFullName("New Student");
        savedUser.setRole(Role.STUDENT);
        savedUser.setAuthProvider(AuthProvider.GOOGLE);
        savedUser.setGoogleId("google-sub-12345");
        savedUser.setAvatarUrl("https://photo.url/pic.jpg");
        savedUser.setActive(true);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        AuthResponseDto result = googleAuthService.authenticateWithGoogle(idTokenString);

        assertNotNull(result);
        assertNotNull(result.getToken());
        assertEquals("newstudent@gmail.com", result.getUser().getEmail());
        assertEquals(Role.STUDENT, result.getUser().getRole());
        assertEquals("GOOGLE", result.getUser().getAuthProvider());
        assertEquals("https://photo.url/pic.jpg", result.getUser().getAvatarUrl());

        verify(userRepository).save(argThat(user ->
                user.getEmail().equals("newstudent@gmail.com") &&
                user.getRole() == Role.STUDENT &&
                user.getAuthProvider() == AuthProvider.GOOGLE &&
                user.getGoogleId().equals("google-sub-12345")
        ));
    }

    @Test
    @DisplayName("authenticateWithGoogle: Links with existing local account and preserves existing role without privilege escalation")
    void testAuthenticateWithGoogle_LinksExistingAccountAndPreservesRole() {
        String idTokenString = "valid.google.id.token.existing";

        mockPayload = new GoogleIdToken.Payload();
        mockPayload.setEmail("existingadmin@codeorbit.dev");
        mockPayload.setEmailVerified(true);
        mockPayload.setSubject("google-sub-99999");
        mockPayload.set("name", "Admin Existing");
        mockPayload.set("picture", "https://photo.url/admin.jpg");

        User existingAdmin = new User();
        existingAdmin.setId(1L);
        existingAdmin.setEmail("existingadmin@codeorbit.dev");
        existingAdmin.setFullName("Original Admin");
        existingAdmin.setPasswordHash("$2a$10$hashed");
        existingAdmin.setRole(Role.ADMIN);
        existingAdmin.setAuthProvider(AuthProvider.LOCAL);
        existingAdmin.setActive(true);

        when(userRepository.findByEmailIgnoreCase("existingadmin@codeorbit.dev")).thenReturn(Optional.of(existingAdmin));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AuthResponseDto result = googleAuthService.authenticateWithGoogle(idTokenString);

        assertNotNull(result);
        assertNotNull(result.getToken());
        assertEquals(Role.ADMIN, result.getUser().getRole(), "Existing ADMIN role must be preserved");
        assertEquals("google-sub-99999", existingAdmin.getGoogleId());
        assertEquals("https://photo.url/admin.jpg", existingAdmin.getAvatarUrl());
    }

    @Test
    @DisplayName("authenticateWithGoogle: Rejects invalid or unverified Google token")
    void testAuthenticateWithGoogle_RejectsInvalidToken() {
        String invalidToken = "malformed.or.expired.token";

        assertThrows(BadRequestException.class, () -> googleAuthService.authenticateWithGoogle(invalidToken));
    }
}
