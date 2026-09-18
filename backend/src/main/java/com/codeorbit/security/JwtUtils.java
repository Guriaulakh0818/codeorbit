package com.codeorbit.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtils {

    private static final Logger log = LoggerFactory.getLogger(JwtUtils.class);

    private final SecretKey key;
    private final long jwtExpirationMs;

    public JwtUtils(
            @Value("${app.jwt.secret:CodeOrbitSecureDefaultSecretKeyForJwtSigningMustBeAtLeast256BitsLong2026!}") String secret,
            @Value("${app.jwt.expiration-ms:86400000}") long jwtExpirationMs
    ) {
        this(secret, jwtExpirationMs, null);
    }

    @Autowired
    public JwtUtils(
            @Value("${app.jwt.secret:CodeOrbitSecureDefaultSecretKeyForJwtSigningMustBeAtLeast256BitsLong2026!}") String secret,
            @Value("${app.jwt.expiration-ms:86400000}") long jwtExpirationMs,
            @Autowired(required = false) Environment environment
    ) {
        if (environment != null && environment.matchesProfiles("prod")) {
            if (secret == null || secret.trim().isEmpty() || secret.contains("DefaultSecretKey") || secret.contains("placeholder") || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
                throw new IllegalStateException("CRITICAL SECURITY ERROR: A strong, non-default JWT_SECRET of at least 256 bits (32+ bytes) must be configured via environment variable when the 'prod' profile is active.");
            }
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpirationMs = jwtExpirationMs;
    }

    public String generateToken(UserPrincipal userPrincipal) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(userPrincipal.getUsername())
                .claim("userId", userPrincipal.getId())
                .claim("fullName", userPrincipal.getFullName())
                .claim("role", userPrincipal.getRole().name())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token format: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token has expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        } catch (Exception e) {
            log.error("JWT token validation error: {}", e.getMessage());
        }
        return false;
    }
}
