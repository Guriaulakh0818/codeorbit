-- =================================================================
-- CodeOrbit Migration: V6__placement_ready_payments_and_entitlements.sql
-- Description: Razorpay Payment Orders & Placement Ready Entitlements
-- Target Dialects: MySQL 8.0+ and H2 2.2+
-- =================================================================

-- 1. Create Placement Ready Payments table
CREATE TABLE placement_ready_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(64) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    subcourse_id BIGINT NOT NULL,
    amount_paise INT NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(32) NOT NULL DEFAULT 'CREATED',
    razorpay_order_id VARCHAR(100) NULL,
    razorpay_payment_id VARCHAR(100) NULL,
    razorpay_signature VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,
    CONSTRAINT fk_pr_payments_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_pr_payments_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
    CONSTRAINT fk_pr_payments_subcourse FOREIGN KEY (subcourse_id) REFERENCES subcourses (id) ON DELETE CASCADE
);

CREATE INDEX idx_pr_payments_user ON placement_ready_payments (user_id);
CREATE INDEX idx_pr_payments_course ON placement_ready_payments (course_id);
CREATE INDEX idx_pr_payments_rzp_order ON placement_ready_payments (razorpay_order_id);
CREATE INDEX idx_pr_payments_status ON placement_ready_payments (status);

-- 2. Create Placement Ready Entitlements table
CREATE TABLE placement_ready_entitlements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    subcourse_id BIGINT NOT NULL,
    payment_id BIGINT NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_entitlement_user_course UNIQUE (user_id, course_id),
    CONSTRAINT uk_entitlement_user_subcourse UNIQUE (user_id, subcourse_id),
    CONSTRAINT fk_entitlement_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_entitlement_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
    CONSTRAINT fk_entitlement_subcourse FOREIGN KEY (subcourse_id) REFERENCES subcourses (id) ON DELETE CASCADE,
    CONSTRAINT fk_entitlement_payment FOREIGN KEY (payment_id) REFERENCES placement_ready_payments (id) ON DELETE CASCADE
);

CREATE INDEX idx_entitlements_user ON placement_ready_entitlements (user_id);
CREATE INDEX idx_entitlements_course ON placement_ready_entitlements (course_id);
