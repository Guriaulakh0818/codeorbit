-- ============================================================================
-- V8__placement_kits.sql
-- Flyway Migration: Role-Based Placement Preparation Kits Schema
-- ============================================================================

CREATE TABLE IF NOT EXISTS placement_kits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(120) NOT NULL,
    title VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    short_description VARCHAR(500) NOT NULL,
    full_description TEXT,
    price_inr INT NOT NULL DEFAULT 99,
    price_paise INT NOT NULL DEFAULT 9900,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    cover_image_url VARCHAR(500),
    badge_text VARCHAR(50) DEFAULT '₹99 Placement Kit',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6),
    CONSTRAINT uk_placement_kits_slug UNIQUE (slug)
);

CREATE TABLE IF NOT EXISTS placement_kit_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    placement_kit_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    description VARCHAR(500),
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_pk_category_kit FOREIGN KEY (placement_kit_id) REFERENCES placement_kits (id) ON DELETE CASCADE,
    CONSTRAINT uk_pk_category_kit_slug UNIQUE (placement_kit_id, slug)
);

CREATE TABLE IF NOT EXISTS placement_kit_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    placement_kit_category_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(32) NOT NULL DEFAULT 'MCQ', -- MCQ, SHORT_ANSWER, INTERVIEW
    difficulty VARCHAR(32) NOT NULL DEFAULT 'MEDIUM', -- EASY, MEDIUM, HARD
    model_answer TEXT,
    explanation TEXT,
    lesson_id BIGINT,
    lesson_reference_label VARCHAR(255),
    external_reference_url VARCHAR(500),
    is_sample BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_pk_question_category FOREIGN KEY (placement_kit_category_id) REFERENCES placement_kit_categories (id) ON DELETE CASCADE,
    CONSTRAINT fk_pk_question_lesson FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS placement_kit_options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    placement_kit_question_id BIGINT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    order_index INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_pk_option_question FOREIGN KEY (placement_kit_question_id) REFERENCES placement_kit_questions (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS placement_kit_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(64) NOT NULL,
    user_id BIGINT NOT NULL,
    placement_kit_id BIGINT NOT NULL,
    amount_paise INT NOT NULL DEFAULT 9900,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(32) NOT NULL DEFAULT 'CREATED',
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    paid_at TIMESTAMP(6),
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6),
    CONSTRAINT uk_pk_payments_order_number UNIQUE (order_number),
    CONSTRAINT fk_pk_payment_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_pk_payment_kit FOREIGN KEY (placement_kit_id) REFERENCES placement_kits (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS placement_kit_entitlements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    placement_kit_id BIGINT NOT NULL,
    payment_id BIGINT,
    granted_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT uk_pk_user_entitlement UNIQUE (user_id, placement_kit_id),
    CONSTRAINT fk_pk_entitlement_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_pk_entitlement_kit FOREIGN KEY (placement_kit_id) REFERENCES placement_kits (id) ON DELETE CASCADE,
    CONSTRAINT fk_pk_entitlement_payment FOREIGN KEY (payment_id) REFERENCES placement_kit_payments (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS placement_kit_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    placement_kit_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    selected_option_id BIGINT,
    user_answer TEXT,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    attempted_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT uk_pk_user_question_progress UNIQUE (user_id, question_id),
    CONSTRAINT fk_pk_progress_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_pk_progress_kit FOREIGN KEY (placement_kit_id) REFERENCES placement_kits (id) ON DELETE CASCADE,
    CONSTRAINT fk_pk_progress_question FOREIGN KEY (question_id) REFERENCES placement_kit_questions (id) ON DELETE CASCADE
);

-- Indexing for high performance lookups
CREATE INDEX IF NOT EXISTS idx_pk_category_kit ON placement_kit_categories (placement_kit_id);
CREATE INDEX IF NOT EXISTS idx_pk_question_category ON placement_kit_questions (placement_kit_category_id);
CREATE INDEX IF NOT EXISTS idx_pk_option_question ON placement_kit_options (placement_kit_question_id);
CREATE INDEX IF NOT EXISTS idx_pk_payments_user ON placement_kit_payments (user_id);
CREATE INDEX IF NOT EXISTS idx_pk_payments_rzp_order ON placement_kit_payments (razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_pk_entitlement_user ON placement_kit_entitlements (user_id);
CREATE INDEX IF NOT EXISTS idx_pk_progress_user_kit ON placement_kit_progress (user_id, placement_kit_id);
