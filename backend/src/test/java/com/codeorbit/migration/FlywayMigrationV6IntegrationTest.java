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

class FlywayMigrationV6IntegrationTest {

    private DataSource isolatedDataSource;
    private JdbcTemplate jdbcTemplate;
    private String dbName;

    @BeforeEach
    void setUp() {
        dbName = "flyway_v6_test_" + UUID.randomUUID().toString().replace("-", "");
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
    @DisplayName("V5 -> V6 Migration: Creates placement_ready_payments and placement_ready_entitlements tables with constraints")
    void testUpgradeFromV5ToV6_SupportsPlacementReadyPaymentsAndEntitlements() {
        // Step 1: Migrate up to V5
        Flyway flywayV5 = Flyway.configure()
                .dataSource(isolatedDataSource)
                .locations("classpath:db/migration")
                .target("5")
                .load();
        flywayV5.migrate();

        // Step 2: Seed student, course, and subcourse in V5 schema
        jdbcTemplate.update("""
            INSERT INTO users (id, full_name, email, password_hash, role, active, created_at)
            VALUES (401, 'Student For Payment', 'pay.student@codeorbit.dev', '$2a$10$hash', 'STUDENT', TRUE, CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO courses (id, title, slug, description, track, difficulty_level, estimated_hours, order_index, status, created_at)
            VALUES (10, 'Data Structures & Algorithms', 'dsa', 'DSA curriculum', 'DSA', 'BEGINNER', 35, 1, 'PUBLISHED', CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO subcourses (id, course_id, curriculum_level, title, slug, description, price_inr, is_free, order_index, status, created_at)
            VALUES (104, 10, 'PLACEMENT_READY', 'DSA Placement Ready', 'dsa-placement-ready', 'Interview questions', 29, FALSE, 4, 'PUBLISHED', CURRENT_TIMESTAMP(6))
        """);

        // Step 3: Run V6 migration
        Flyway flywayV6 = Flyway.configure()
                .dataSource(isolatedDataSource)
                .locations("classpath:db/migration")
                .target("6")
                .load();
        flywayV6.migrate();

        // Step 4: Insert placement ready payment
        jdbcTemplate.update("""
            INSERT INTO placement_ready_payments (id, order_number, user_id, course_id, subcourse_id, amount_paise, currency, status, razorpay_order_id, razorpay_payment_id, razorpay_signature, created_at)
            VALUES (501, 'PR-ORD-2026-001', 401, 10, 104, 2900, 'INR', 'PAID', 'order_rzp_123', 'pay_rzp_456', 'sig_rzp_789', CURRENT_TIMESTAMP(6))
        """);

        Map<String, Object> paymentRow = jdbcTemplate.queryForMap("SELECT * FROM placement_ready_payments WHERE id = 501");
        assertEquals("PR-ORD-2026-001", paymentRow.get("order_number"));
        assertEquals(2900, ((Number) paymentRow.get("amount_paise")).intValue());
        assertEquals("PAID", paymentRow.get("status"));
        assertEquals("order_rzp_123", paymentRow.get("razorpay_order_id"));

        // Step 5: Insert placement ready entitlement
        jdbcTemplate.update("""
            INSERT INTO placement_ready_entitlements (id, user_id, course_id, subcourse_id, payment_id, granted_at)
            VALUES (601, 401, 10, 104, 501, CURRENT_TIMESTAMP(6))
        """);

        Map<String, Object> entitlementRow = jdbcTemplate.queryForMap("SELECT * FROM placement_ready_entitlements WHERE id = 601");
        assertEquals(401L, ((Number) entitlementRow.get("user_id")).longValue());
        assertEquals(10L, ((Number) entitlementRow.get("course_id")).longValue());
        assertEquals(104L, ((Number) entitlementRow.get("subcourse_id")).longValue());

        // Step 6: Verify Unique Constraint prevents duplicate entitlement for same user & course
        assertThrows(DataIntegrityViolationException.class, () -> {
            jdbcTemplate.update("""
                INSERT INTO placement_ready_entitlements (id, user_id, course_id, subcourse_id, payment_id, granted_at)
                VALUES (602, 401, 10, 104, 501, CURRENT_TIMESTAMP(6))
            """);
        });
    }
}
