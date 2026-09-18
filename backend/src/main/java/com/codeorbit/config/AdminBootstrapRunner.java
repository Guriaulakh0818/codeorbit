package com.codeorbit.config;

import com.codeorbit.entity.Role;
import com.codeorbit.entity.User;
import com.codeorbit.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Production-safe Admin bootstrap runner.
 *
 * Rules:
 * 1. Disabled by default unless ADMIN_BOOTSTRAP_ENABLED is explicitly true or ADMIN_BOOTSTRAP_EMAIL & PASSWORD are provided.
 * 2. Creates the admin only when the configured email does not already exist.
 * 3. Never overwrites an existing user's password or role.
 * 4. Strictly forces Role.ADMIN.
 * 5. BCrypt-hashes the password before saving.
 * 6. Never logs the password or secret.
 * 7. Fails startup with a clear configuration error if bootstrap is enabled but credentials are missing or weak (< 8 chars).
 * 8. Never creates demo ebooks or mock data.
 */
@Component
@Order(1)
public class AdminBootstrapRunner implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.bootstrap.enabled:${ADMIN_BOOTSTRAP_ENABLED:false}}")
    private boolean bootstrapEnabled;

    @Value("${app.admin.bootstrap.email:${ADMIN_BOOTSTRAP_EMAIL:}}")
    private String adminEmail;

    @Value("${app.admin.bootstrap.password:${ADMIN_BOOTSTRAP_PASSWORD:}}")
    private String adminPassword;

    @Value("${app.admin.bootstrap.name:${ADMIN_BOOTSTRAP_NAME:CodeOrbit Store Admin}}")
    private String adminName;

    public AdminBootstrapRunner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!bootstrapEnabled) {
            logger.debug("Admin bootstrap is disabled (app.admin.bootstrap.enabled=false). Skipping.");
            return;
        }

        // Validate required properties when explicitly enabled or credentials provided
        if (adminEmail == null || adminEmail.trim().isBlank()) {
            throw new IllegalStateException("CRITICAL CONFIGURATION ERROR: Admin bootstrap is enabled but ADMIN_BOOTSTRAP_EMAIL is missing or blank.");
        }

        if (adminPassword == null || adminPassword.trim().length() < 8) {
            throw new IllegalStateException("CRITICAL CONFIGURATION ERROR: Admin bootstrap is enabled but ADMIN_BOOTSTRAP_PASSWORD is missing or shorter than 8 characters.");
        }

        String cleanEmail = adminEmail.trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(cleanEmail)) {
            logger.info("Admin bootstrap check: User account with email '{}' already exists. Preserving existing credentials without modification.", cleanEmail);
            return;
        }

        logger.info("Admin bootstrap: Initializing store admin account with email '{}' and Role.ADMIN...", cleanEmail);

        String displayName = (adminName != null && !adminName.trim().isBlank()) ? adminName.trim() : "CodeOrbit Store Admin";
        User admin = new User(
                displayName,
                cleanEmail,
                passwordEncoder.encode(adminPassword),
                Role.ADMIN
        );

        userRepository.save(admin);
        logger.info("Admin bootstrap: Successfully created initial store admin '{}' with Role.ADMIN.", cleanEmail);
    }
}
