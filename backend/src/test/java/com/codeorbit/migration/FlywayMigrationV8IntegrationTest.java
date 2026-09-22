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

class FlywayMigrationV8IntegrationTest {

    private DataSource isolatedDataSource;
    private JdbcTemplate jdbcTemplate;
    private String dbName;

    @BeforeEach
    void setUp() {
        dbName = "flyway_v8_test_" + UUID.randomUUID().toString().replace("-", "");
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
    @DisplayName("V7 -> V8 Migration: Creates placement_kits, categories, questions, options, payments, entitlements, progress tables")
    void testUpgradeFromV7ToV8_SupportsPlacementPrepKits() {
        // Step 1: Migrate up to V7
        Flyway flywayV7 = Flyway.configure()
                .dataSource(isolatedDataSource)
                .locations("classpath:db/migration")
                .target("7")
                .load();
        flywayV7.migrate();

        // Step 2: Seed user and course
        jdbcTemplate.update("""
            INSERT INTO users (id, full_name, email, password_hash, role, active, created_at)
            VALUES (101, 'Kit Student', 'student.kit@codeorbit.dev', '$2a$10$hash', 'STUDENT', TRUE, CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO courses (id, title, slug, description, track, difficulty_level, estimated_hours, order_index, status, created_at)
            VALUES (10, 'DSA Mastery', 'dsa', 'Complete DSA', 'DSA', 'BEGINNER', 60, 1, 'PUBLISHED', CURRENT_TIMESTAMP(6))
        """);

        // Step 3: Migrate to V8
        Flyway flywayV8 = Flyway.configure()
                .dataSource(isolatedDataSource)
                .locations("classpath:db/migration")
                .target("8")
                .load();
        flywayV8.migrate();

        // Step 4: Insert placement kit matching V8 columns
        jdbcTemplate.update("""
            INSERT INTO placement_kits (id, slug, title, role, short_description, full_description, price_inr, price_paise, currency, is_active, order_index, created_at)
            VALUES (1, 'full-stack-developer-kit', 'Full Stack Developer Prep Kit', 'Full Stack Developer', 'Ace MERN & Java full stack interviews', 'Full curriculum', 99, 9900, 'INR', TRUE, 1, CURRENT_TIMESTAMP(6))
        """);

        Map<String, Object> kitRow = jdbcTemplate.queryForMap("SELECT * FROM placement_kits WHERE id = 1");
        assertEquals("full-stack-developer-kit", kitRow.get("slug"));
        assertEquals(9900, ((Number) kitRow.get("price_paise")).intValue());
        assertEquals(99, ((Number) kitRow.get("price_inr")).intValue());

        // Step 5: Insert category, question, options matching V8 columns
        jdbcTemplate.update("""
            INSERT INTO placement_kit_categories (id, placement_kit_id, title, slug, description, order_index, created_at)
            VALUES (1, 1, 'Frontend Core', 'frontend-core', 'HTML/CSS/JS/React', 1, CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO placement_kit_questions (id, placement_kit_category_id, question_text, question_type, difficulty, model_answer, explanation, is_sample, is_active, order_index, created_at)
            VALUES (1, 1, 'What is the Virtual DOM in React?', 'MCQ', 'MEDIUM', 'It is a virtual representation', 'Virtual DOM explanation', TRUE, TRUE, 1, CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO placement_kit_options (id, placement_kit_question_id, option_text, is_correct, order_index)
            VALUES (1, 1, 'An in-memory representation of real DOM', TRUE, 1)
        """);
        jdbcTemplate.update("""
            INSERT INTO placement_kit_options (id, placement_kit_question_id, option_text, is_correct, order_index)
            VALUES (2, 1, 'A direct browser API', FALSE, 2)
        """);

        // Step 6: Insert payment and entitlement
        jdbcTemplate.update("""
            INSERT INTO placement_kit_payments (id, order_number, user_id, placement_kit_id, amount_paise, currency, status, razorpay_order_id, razorpay_payment_id, razorpay_signature, created_at)
            VALUES (1, 'PK-ORD-2026-001', 101, 1, 9900, 'INR', 'PAID', 'order_pk_123', 'pay_pk_456', 'sig_pk_789', CURRENT_TIMESTAMP(6))
        """);

        jdbcTemplate.update("""
            INSERT INTO placement_kit_entitlements (id, user_id, placement_kit_id, payment_id, granted_at)
            VALUES (1, 101, 1, 1, CURRENT_TIMESTAMP(6))
        """);

        Map<String, Object> entRow = jdbcTemplate.queryForMap("SELECT * FROM placement_kit_entitlements WHERE id = 1");
        assertEquals(101L, ((Number) entRow.get("user_id")).longValue());
        assertEquals(1L, ((Number) entRow.get("placement_kit_id")).longValue());

        // Step 7: Insert practice progress
        jdbcTemplate.update("""
            INSERT INTO placement_kit_progress (id, user_id, placement_kit_id, question_id, is_correct, selected_option_id, attempted_at)
            VALUES (1, 101, 1, 1, TRUE, 1, CURRENT_TIMESTAMP(6))
        """);

        Map<String, Object> progRow = jdbcTemplate.queryForMap("SELECT * FROM placement_kit_progress WHERE id = 1");
        assertEquals(true, progRow.get("is_correct"));
        assertEquals(1L, ((Number) progRow.get("selected_option_id")).longValue());
    }
}
