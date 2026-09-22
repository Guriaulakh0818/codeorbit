package com.codeorbit.service.impl;

import com.codeorbit.dto.AuthResponseDto;
import com.codeorbit.dto.GoogleLoginRequestDto;
import com.codeorbit.dto.UserSummaryDto;
import com.codeorbit.entity.AuthProvider;
import com.codeorbit.entity.Role;
import com.codeorbit.entity.User;
import com.codeorbit.exception.BadRequestException;
import com.codeorbit.repository.UserRepository;
import com.codeorbit.security.JwtUtils;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.GoogleAuthService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;

@Service
@Transactional
public class GoogleAuthServiceImpl implements GoogleAuthService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleAuthServiceImpl.class);

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final String googleClientId;
    private final GoogleIdTokenVerifier tokenVerifier;

    @org.springframework.beans.factory.annotation.Autowired
    public GoogleAuthServiceImpl(
            UserRepository userRepository,
            JwtUtils jwtUtils,
            @Value("${app.oauth.google.client-id:dummy-client-id.apps.googleusercontent.com}") String googleClientId
    ) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.googleClientId = googleClientId;
        this.tokenVerifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(googleClientId))
                .build();
        logger.info("GoogleAuthServiceImpl initialized for audience: {}", this.googleClientId);
    }

    // Secondary constructor for unit testing with mock verifier
    public GoogleAuthServiceImpl(
            UserRepository userRepository,
            JwtUtils jwtUtils,
            String googleClientId,
            GoogleIdTokenVerifier tokenVerifier
    ) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.googleClientId = googleClientId;
        this.tokenVerifier = tokenVerifier;
    }

    @Override
    public AuthResponseDto authenticateWithGoogle(String idToken) {
        return loginWithGoogle(new GoogleLoginRequestDto(idToken));
    }

    @Override
    public AuthResponseDto loginWithGoogle(GoogleLoginRequestDto request) {
        if (request == null || request.getIdToken() == null || request.getIdToken().trim().isEmpty()) {
            throw new BadRequestException("Google ID token cannot be empty");
        }

        GoogleIdToken.Payload payload = verifyGoogleIdToken(request.getIdToken().trim());
        if (payload == null) {
            throw new BadRequestException("Invalid or expired Google ID token");
        }

        String email = payload.getEmail();
        Boolean emailVerified = payload.getEmailVerified();
        if (email == null || email.trim().isEmpty() || !Boolean.TRUE.equals(emailVerified)) {
            throw new BadRequestException("Google account email is unverified or missing");
        }

        String cleanEmail = email.trim().toLowerCase();
        String googleId = payload.getSubject();
        String name = (String) payload.get("name");
        String pictureUrl = (String) payload.get("picture");
        String displayName = (name != null && !name.trim().isEmpty()) ? name.trim() : cleanEmail.split("@")[0];

        Optional<User> existingUserOpt = userRepository.findByEmailIgnoreCase(cleanEmail);
        User user;

        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();
            // Safe linking: update Google metadata without altering existing security role or ID
            if (user.getGoogleId() == null || user.getGoogleId().isBlank()) {
                user.setGoogleId(googleId);
            }
            if (user.getAvatarUrl() == null || user.getAvatarUrl().isBlank()) {
                user.setAvatarUrl(pictureUrl);
            }
            if (user.getAuthProvider() == null) {
                user.setAuthProvider(AuthProvider.GOOGLE);
            }
            user = userRepository.save(user);
            logger.info("Successfully linked Google login for existing user: {} (Role: {})", cleanEmail, user.getRole());
        } else {
            // New user registration strictly gets Role.STUDENT
            user = new User(displayName, cleanEmail, googleId, pictureUrl, Role.STUDENT);
            user = userRepository.save(user);
            logger.info("Created new student account via Google login: {}", cleanEmail);
        }

        UserPrincipal principal = UserPrincipal.create(user);
        String token = jwtUtils.generateToken(principal);

        UserSummaryDto userSummary = new UserSummaryDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getAuthProvider() != null ? user.getAuthProvider().name() : "GOOGLE",
                user.getAvatarUrl(),
                user.getCreatedAt()
        );

        return new AuthResponseDto(token, userSummary);
    }

    protected GoogleIdToken.Payload verifyGoogleIdToken(String idTokenString) {
        try {
            GoogleIdToken idToken = tokenVerifier.verify(idTokenString);
            if (idToken != null) {
                return idToken.getPayload();
            }
        } catch (Exception e) {
            logger.warn("Google ID token verification failed: {}", e.getMessage());
        }
        return null;
    }
}
