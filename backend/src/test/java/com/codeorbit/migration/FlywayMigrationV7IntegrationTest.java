package com.codeorbit.migration;

import org.flywaydb.core.Flyway;
import org.h2.jdbcx.JdbcDataSource;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class FlywayMigrationV7IntegrationTest {

    private DataSource isolatedDataSource;
    private JdbcTemplate jdbcTemplate;
    private String dbName;

    @BeforeEach
    void setUp() {
        dbName = "flyway_v7_test_" + UUID.randomUUID().toString().replace("-", "");
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
    @DisplayName("V6 -> V7 Migration: Creates certificate_payments table and adds payment_id to certificates")
    void testUpgradeFromV6ToV7_SupportsCertificatePayments() {
        // Step 1: Migrate up to V6
        Flyway flywayV6 = Flyway.configure()
                .dataSource(isolatedDataSource)
                .locations("classpath:db/migration")
                .target("6")
                .load();
        flywayV6.migrate();

        // Step 2: Seed student and course in V6 schema
        jdbcTemplate.update("""
            INSERT INTO users (id, full_name, email, password_hash, role, active, created_at)
            VALUES (701, 'Student For Cert', 'cert.student@codeorbit.dev', '$2a$10$hash', 'STUDENT', TRUE, CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO courses (id, title, slug, description, track, difficulty_level, estimated_hours, order_index, status, created_at)
            VALUES (20, 'Java Programming', 'java', 'Complete Java', 'JAVA', 'BEGINNER', 40, 2, 'PUBLISHED', CURRENT_TIMESTAMP(6))
        """);

        // Step 3: Run V7 migration
        Flyway flywayV7 = Flyway.configure()
                .dataSource(isolatedDataSource)
                .locations("classpath:db/migration")
                .target("7")
                .load();
        flywayV7.migrate();

        // Step 4: Insert certificate payment
        jdbcTemplate.update("""
            INSERT INTO certificate_payments (id, order_number, user_id, course_id, amount_paise, currency, status, razorpay_order_id, razorpay_payment_id, razorpay_signature, created_at)
            VALUES (801, 'CERT-ORD-2026-001', 701, 20, 900, 'INR', 'PAID', 'order_cert_123', 'pay_cert_456', 'sig_cert_789', CURRENT_TIMESTAMP(6))
        """);

        Map<String, Object> paymentRow = jdbcTemplate.queryForMap("SELECT * FROM certificate_payments WHERE id = 801");
        assertEquals("CERT-ORD-2026-001", paymentRow.get("order_number"));
        assertEquals(900, ((Number) paymentRow.get("amount_paise")).intValue());
        assertEquals("PAID", paymentRow.get("status"));
        assertEquals("order_cert_123", paymentRow.get("razorpay_order_id"));

        // Step 5: Insert certificate linked to payment
        jdbcTemplate.update("""
            INSERT INTO certificates (id, certificate_code, user_id, course_id, payment_id, student_full_name, course_title, issued_at, status)
            VALUES (901, 'CO-JAVA-2026-ABCDEF', 701, 20, 801, 'Student For Cert', 'Java Programming', CURRENT_TIMESTAMP(6), 'VALID')
        """);

        Map<String, Object> certRow = jdbcTemplate.queryForMap("SELECT * FROM certificates WHERE id = 901");
        assertEquals("CO-JAVA-2026-ABCDEF", certRow.get("certificate_code"));
        assertEquals(801L, ((Number) certRow.get("payment_id")).longValue());
        assertEquals("VALID", certRow.get("status"));
    }
}
