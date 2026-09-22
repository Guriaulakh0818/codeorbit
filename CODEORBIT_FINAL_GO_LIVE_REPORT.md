# CODEORBIT — FINAL GO-LIVE DEPLOYMENT REPORT
**Target Domain:** `https://codeorbit.online`  
**Phase 13 Cutover Sign-Off**  
**Date:** September 22, 2026  
**Repository:** `Guriaulakh0818/codeorbit`  
**Deployment Evaluator:** Antigravity Engineering Release System  
**Status:** **READY WITH MANUAL CONFIGURATION**

---

### 1. Deployment
- **Frontend URL**: `https://codeorbit.online` (and `https://www.codeorbit.online`)
- **Backend URL**: `https://codeorbit.online/api` (Proxied via Nginx)
- **Database**: MySQL 8.0 with Flyway migrations (`V1`–`V8`) and strict JPA DDL validation (`validate` mode)
- **Nginx**: Reverse proxy handling `/api/**` routing, single-page application fallback, static asset caching, and security headers
- **HTTPS**: TLS 1.2 / 1.3 reverse proxy integration (Certbot Let's Encrypt / Cloudflare Full SSL)

---

### 2. Authentication
- **Email / Password**: BCrypt-hashed password storage, input validation, duplicate account prevention, stateless JWT session tokens (`86400000 ms` validity)
- **Google OAuth 2.0**: Google Identity Services integration with backend token verification in `GoogleAuthServiceImpl.java` (Requires live Google Cloud Console credentials in `.env`)

---

### 3. Payments
- **Razorpay**: Server-side amount enforcement with HMAC-SHA256 signature verification (`order_id|payment_id`):
  - **Placement Ready**: ₹29 (2900 paise)
  - **Certificate Issuance**: ₹9 (900 paise)
  - **Placement Kits**: ₹99 (9900 paise)
- **Cashfree**: Ebook marketplace order creation and PDF handbook library entitlement verified

---

### 4. Learning Platform & Curriculum
- **Courses**: 4 Core CS Courses (DSA, OS, DBMS, Computer Networks)
- **Subcourses**: 16 Subcourses across 4 Tiers (Beginner, Intermediate, Advanced, Placement Ready)
- **Modules & Lessons**: 64 Modules, 128 Lessons with interactive multi-language code snippets (Java, C++, Python)
- **Quizzes**: 64 Module Quizzes (10 questions each, 8/10 passing threshold)
- **Final Quizzes**: 12 Level Final Quizzes (25 questions each, 20/25 passing threshold)
- **Progression**: Strictly enforced sequential progression preventing locked module access

---

### 5. Certificates
- **Eligibility**: Requires completion of all 12 free module quizzes and 3 level final quizzes; Placement Ready purchase is **not** required
- **Fee**: ₹9 per verified certificate
- **PDF & QR Code**: Vector PDF streaming via OpenPDF with dynamic QR pointing to `https://codeorbit.online/verify/{certificateCode}`
- **Public Verification**: Public verification at `/verify/{code}` displaying student initials, course title, and issuance date without leaking private PII

---

### 6. Placement Kits
- **Catalog**: 10 Subject-Specific Placement Kits at ₹99 each
- **Entitlement Isolation**: 3 free public sample questions; 50-question deep bank gated by user entitlement
- **Practice Mode**: Authoritative server-side evaluation with user progress tracking

---

### 7. Security & Hardening
- **Authentication**: Stateless HMAC-SHA512 JWT tokens
- **Authorization**: `@AuthenticationPrincipal UserPrincipal` eliminates IDOR across all student endpoints
- **Quiz Protection**: Correct answer keys omitted from public question DTOs
- **Payment Security**: Idempotent order verification, server-side pricing constants, and cross-resource entitlement isolation
- **Nginx Security Headers**: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`
- **Content Security Policy**: Permitting Razorpay (`checkout.razorpay.com`) and Google OAuth (`accounts.google.com`) CDNs

---

### 8. SEO & Public Discoverability
- **Robots.txt**: Restricts `/student/` and `/admin/` while allowing search indexers on educational routes
- **Sitemap**: Dynamic XML feed at `https://codeorbit.online/api/public/sitemap.xml` rendering all published curriculum URLs
- **Metadata**: Structured OpenGraph, Twitter card, and Schema.org JSON-LD tags rendered on public course and lesson pages

---

### 9. Operations & Observability
- **Health Probes**: `GET /api/health` and `GET /health` returning `{"status":"UP","service":"codeorbit-backend"}`
- **Logs**: Zero secrets, passwords, or raw tokens logged; structured error logging
- **Backups**: Automated daily `mysqldump` and volume backup procedures documented in deployment runbook
- **Monitoring**: External uptime probe targeting `https://codeorbit.online/api/health`

---

### 10. Final Verification Metrics
- **Backend Maven Tests**: `188 passed, 0 failures, 0 errors, 0 skipped` (`BUILD SUCCESS` in `58.389 s`)
- **Backend Production Package**: `codeorbit-backend-1.0.0.jar` (`BUILD SUCCESS`)
- **Frontend Production Build**: `2029 modules transformed`, `dist/` generated with 0 errors in `10.09 s`

---

### 11. Final Cutover & Go-Live Decision

**FINAL STATUS: READY WITH MANUAL CONFIGURATION**

All application code, automated test suites, database migration scripts, container packaging, and reverse proxy configurations are 100% verified. Live production launch on `https://codeorbit.online` will be active as soon as the project owner completes the final manual credential entries in the hosting server `.env` file (live database password, live Razorpay API keys, and Google Cloud Console OAuth Client ID).
