package com.codeorbit.migration;

import org.flywaydb.core.Flyway;
import org.h2.jdbcx.JdbcDataSource;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class FlywayMigrationV5IntegrationTest {

    private DataSource isolatedDataSource;
    private JdbcTemplate jdbcTemplate;
    private String dbName;

    @BeforeEach
    void setUp() {
        dbName = "flyway_v5_test_" + UUID.randomUUID().toString().replace("-", "");
        JdbcDataSource ds = new JdbcDataSource();
        ds.setURL("jdbc:h2:mem:" + dbName + ";DB_CLOSE_DELAY=-1;MODE=MySQL");
        ds.setUser("sa");
        ds.setPassword("");
        this.isolatedDataSource = ds;
        this.jdbcTemplate = new JdbcTemplate(ds);
    }

    @AfterEach
    void tearDown() {
        try (Connection conn = isolatedDataSource.getConnection()) {
            conn.createStatement().execute("SHUTDOWN");
        } catch (SQLException ignored) {
        }
    }

    @Test
    @DisplayName("V4 -> V5 Migration: Alters users table for Google auth and creates student_enrollments with unique constraint")
    void testUpgradeFromV4ToV5_SupportsGoogleAuthAndStudentEnrollments() {
        // Step 1: Migrate up to V4
        Flyway flywayV4 = Flyway.configure()
                .dataSource(isolatedDataSource)
                .locations("classpath:db/migration")
                .target("4")
                .load();
        flywayV4.migrate();

        // Step 2: Seed standard local user and course in V4
        jdbcTemplate.update("""
            INSERT INTO users (id, full_name, email, password_hash, role, active, created_at)
            VALUES (301, 'Local Student', 'local@codeorbit.dev', '$2a$10$hash', 'STUDENT', TRUE, CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO courses (id, title, slug, description, track, difficulty_level, estimated_hours, order_index, status, created_at)
            VALUES (1, 'Data Structures & Algorithms', 'dsa', 'DSA curriculum', 'DSA', 'BEGINNER', 35, 1, 'PUBLISHED', CURRENT_TIMESTAMP(6))
        """);

        // Step 3: Run V5 migration
        Flyway flywayV5 = Flyway.configure()
                .dataSource(isolatedDataSource)
                .locations("classpath:db/migration")
                .target("5")
                .load();
        flywayV5.migrate();

        // Step 4: Verify users table accepts Google user with null password_hash and auth_provider='GOOGLE'
        jdbcTemplate.update("""
            INSERT INTO users (id, full_name, email, password_hash, auth_provider, google_id, avatar_url, role, active, created_at)
            VALUES (302, 'Google Student', 'google.student@gmail.com', NULL, 'GOOGLE', 'gid-123456789', 'https://avatar.url', 'STUDENT', TRUE, CURRENT_TIMESTAMP(6))
        """);

        Map<String, Object> googleUserRow = jdbcTemplate.queryForMap("SELECT * FROM users WHERE id = 302");
        assertNull(googleUserRow.get("password_hash"));
        assertEquals("GOOGLE", googleUserRow.get("auth_provider"));
        assertEquals("gid-123456789", googleUserRow.get("google_id"));
        assertEquals("https://avatar.url", googleUserRow.get("avatar_url"));

        // Step 5: Verify student_enrollments insertion
        jdbcTemplate.update("""
            INSERT INTO student_enrollments (id, user_id, course_id, status, enrolled_at, created_at)
            VALUES (1001, 301, 1, 'ACTIVE', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6))
        """);

        Map<String, Object> enrollmentRow = jdbcTemplate.queryForMap("SELECT * FROM student_enrollments WHERE id = 1001");
        assertEquals(301L, ((Number) enrollmentRow.get("user_id")).longValue());
        assertEquals(1L, ((Number) enrollmentRow.get("course_id")).longValue());
        assertEquals("ACTIVE", enrollmentRow.get("status"));

        // Step 6: Verify Unique Constraint on (user_id, course_id) prevents duplicate enrollments
        assertThrows(DataIntegrityViolationException.class, () -> {
            jdbcTemplate.update("""
                INSERT INTO student_enrollments (id, user_id, course_id, status, enrolled_at, created_at)
                VALUES (1002, 301, 1, 'ACTIVE', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6))
            """);
        });
    }
}
