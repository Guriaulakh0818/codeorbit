package com.codeorbit.config;

import com.codeorbit.entity.Role;
import com.codeorbit.entity.User;
import com.codeorbit.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminBootstrapRunnerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AdminBootstrapRunner runner;

    @BeforeEach
    void setUp() {
        runner = new AdminBootstrapRunner(userRepository, passwordEncoder);
    }

    @Test
    @DisplayName("Should skip bootstrap when disabled and credentials not provided")
    void testSkipWhenDisabled() {
        ReflectionTestUtils.setField(runner, "bootstrapEnabled", false);
        ReflectionTestUtils.setField(runner, "adminEmail", "");
        ReflectionTestUtils.setField(runner, "adminPassword", "");

        runner.run();

        verify(userRepository, never()).existsByEmailIgnoreCase(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should create admin with Role.ADMIN and hashed password when enabled")
    void testBootstrapAdminSuccess() {
        ReflectionTestUtils.setField(runner, "bootstrapEnabled", true);
        ReflectionTestUtils.setField(runner, "adminEmail", "prodadmin@codeorbit.com");
        ReflectionTestUtils.setField(runner, "adminPassword", "SecureProdPassword2026!");
        ReflectionTestUtils.setField(runner, "adminName", "Super Store Admin");

        when(userRepository.existsByEmailIgnoreCase("prodadmin@codeorbit.com")).thenReturn(false);
        when(passwordEncoder.encode("SecureProdPassword2026!")).thenReturn("$2a$10$HashedProdPassword");

        runner.run();

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User saved = userCaptor.getValue();
        assertThat(saved.getEmail()).isEqualTo("prodadmin@codeorbit.com");
        assertThat(saved.getFullName()).isEqualTo("Super Store Admin");
        assertThat(saved.getRole()).isEqualTo(Role.ADMIN);
        assertThat(saved.getPasswordHash()).isEqualTo("$2a$10$HashedProdPassword");
        assertThat(saved.isActive()).isTrue();
    }

    @Test
    @DisplayName("Should not overwrite existing admin user")
    void testDoNotOverwriteExistingAdmin() {
        ReflectionTestUtils.setField(runner, "bootstrapEnabled", true);
        ReflectionTestUtils.setField(runner, "adminEmail", "existing@codeorbit.com");
        ReflectionTestUtils.setField(runner, "adminPassword", "SecureProdPassword2026!");

        when(userRepository.existsByEmailIgnoreCase("existing@codeorbit.com")).thenReturn(true);

        runner.run();

        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    @DisplayName("Should fail startup if bootstrap is enabled but email is missing")
    void testFailWhenEmailMissing() {
        ReflectionTestUtils.setField(runner, "bootstrapEnabled", true);
        ReflectionTestUtils.setField(runner, "adminEmail", "   ");
        ReflectionTestUtils.setField(runner, "adminPassword", "ValidPassword123!");

        assertThatThrownBy(() -> runner.run())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("ADMIN_BOOTSTRAP_EMAIL is missing or blank");
    }

    @Test
    @DisplayName("Should fail startup if bootstrap is enabled but password is shorter than 8 characters")
    void testFailWhenPasswordTooShort() {
        ReflectionTestUtils.setField(runner, "bootstrapEnabled", true);
        ReflectionTestUtils.setField(runner, "adminEmail", "admin@codeorbit.com");
        ReflectionTestUtils.setField(runner, "adminPassword", "short");

        assertThatThrownBy(() -> runner.run())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("ADMIN_BOOTSTRAP_PASSWORD is missing or shorter than 8 characters");
    }
}
