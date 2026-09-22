-- =================================================================
-- CodeOrbit Migration: V7__certificate_payments.sql
-- Description: Razorpay Payment Orders & Foreign Keys for ₹9 Certificates
-- Target Dialects: MySQL 8.0+ and H2 2.2+
-- =================================================================

-- 1. Create Certificate Payments table
CREATE TABLE certificate_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(64) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    amount_paise INT NOT NULL DEFAULT 900,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(32) NOT NULL DEFAULT 'CREATED',
    razorpay_order_id VARCHAR(100) NULL,
    razorpay_payment_id VARCHAR(100) NULL,
    razorpay_signature VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,
    CONSTRAINT fk_cert_payments_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_cert_payments_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
);

CREATE INDEX idx_cert_payments_user ON certificate_payments (user_id);
CREATE INDEX idx_cert_payments_course ON certificate_payments (course_id);
CREATE INDEX idx_cert_payments_rzp_order ON certificate_payments (razorpay_order_id);
CREATE INDEX idx_cert_payments_status ON certificate_payments (status);

-- 2. Link payment_id to existing certificates table
ALTER TABLE certificates ADD COLUMN payment_id BIGINT NULL;
ALTER TABLE certificates ADD CONSTRAINT fk_certificates_payment FOREIGN KEY (payment_id) REFERENCES certificate_payments (id) ON DELETE SET NULL;
