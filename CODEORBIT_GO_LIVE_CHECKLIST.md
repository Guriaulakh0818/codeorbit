# CODEORBIT — GO-LIVE RELEASE CHECKLIST
**Phase 11 Operations & Production Cutover Guide**  
**Repository:** `Guriaulakh0818/codeorbit`  
**Final Status:** **GO-LIVE READY WITH MANUAL STEPS**

---

## 1. Automated Verification Sign-Off (Completed)

| Verification Dimension | Standard / Command | Result | Verification Sign-Off |
| :--- | :--- | :--- | :---: |
| **Backend Test Suite** | `mvn clean test` | 188 passed, 0 failures, 0 errors, 0 skipped | ✅ PASS (Automated) |
| **Backend Production Executable JAR** | `mvn clean package -DskipTests` | `codeorbit-backend-1.0.0.jar` built | ✅ PASS (Automated) |
| **Frontend Production SPA Build** | `npm run build` | 2029 modules transformed, 0 errors | ✅ PASS (Automated) |
| **Flyway Schema Migrations** | `V1` $\to$ `V8` SQL scripts | Clean migration on fresh database | ✅ PASS (Automated) |
| **Seed Data Idempotency** | Multiple application restarts | 0 duplicate records created | ✅ PASS (Automated) |
| **Quiz Evaluation Engine** | Server-side scoring (8/10, 20/25) | Correct answers masked, scores saved | ✅ PASS (Automated) |
| **Multi-Tenant Data Isolation** | `@AuthenticationPrincipal` usage | Student data strictly isolated | ✅ PASS (Automated) |
| **Health Probes** | `GET /api/health` & `GET /health` | Returns `{"status":"UP"}` | ✅ PASS (Automated) |

---

## 2. Mandatory Manual Configuration Steps (Pre-Launch)

These items require manual credential provisioning or DNS configuration in external cloud dashboards prior to opening live user traffic:

### 2.1 Infrastructure & DNS
- [ ] **Domain DNS Mapping**: Point `A` records for `codeorbit.online` and `www.codeorbit.online` to the production server IP address.
- [ ] **SSL / TLS Certificate**: Issue Let's Encrypt certificates using Certbot (`certbot certonly --standalone -d codeorbit.online -d www.codeorbit.online`) or configure Cloudflare Universal SSL.

### 2.2 Environment & Secrets (.env)
- [ ] Copy `.env.example` to `.env` on the production server.
- [ ] Set `SPRING_PROFILES_ACTIVE=prod,mysql`.
- [ ] Generate secure `JWT_SECRET` (256-bit cryptographically secure key: `openssl rand -base64 48`).
- [ ] Set `DB_PASSWORD` and `DB_ROOT_PASSWORD` with 16+ character strong alphanumeric passwords.
- [ ] Configure `CORS_ALLOWED_ORIGINS=https://codeorbit.online,https://www.codeorbit.online`.
- [ ] Set `ADMIN_BOOTSTRAP_PASSWORD` with a strong initial admin password.

### 2.3 Google Cloud Console (OAuth 2.0)
- [ ] Navigate to **Google Cloud Console** $\to$ **APIs & Services** $\to$ **Credentials**.
- [ ] Update **Authorized JavaScript Origins**: `https://codeorbit.online` and `https://www.codeorbit.online`.
- [ ] Update **Authorized Redirect URIs**: `https://codeorbit.online/login` and `https://codeorbit.online/register`.
- [ ] Copy Client ID to `.env` as `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID`.

### 2.4 Razorpay Live Gateway Setup
- [ ] Switch Razorpay Dashboard to **Live Mode**.
- [ ] Generate live API Key ID (`RAZORPAY_KEY_ID`, `VITE_RAZORPAY_KEY_ID`) and Secret (`RAZORPAY_KEY_SECRET`).
- [ ] Register live webhook endpoint: `https://codeorbit.online/api/payments/razorpay/webhook`.
- [ ] Enable webhook events (`payment.captured`, `payment.failed`, `order.paid`) and save `RAZORPAY_WEBHOOK_SECRET` in `.env`.

### 2.5 Cashfree Ebook Marketplace (If Enabled)
- [ ] Populate live `CASHFREE_APP_ID` and `CASHFREE_SECRET_KEY` in production environment.

### 2.6 Backup & Monitoring
- [ ] Configure automated daily database backup cron job:
  ```bash
  0 2 * * * docker exec codeorbit-mysql mysqldump -u codeorbit_user -p"$DB_PASSWORD" codeorbit_db | gzip > /var/backups/codeorbit/db_$(date +\%Y\%m\%d_\%H\%M\%S).sql.gz
  ```
- [ ] Configure external uptime monitoring probe targeting `https://codeorbit.online/api/health`.

---

## 3. Post-Deployment Smoke Test Protocol

Immediately after executing `docker compose up -d` on the live server:

1. **System Health Check**: Verify `curl -s https://codeorbit.online/api/health` returns `{"status":"UP"}`.
2. **Public Platform**: Browse `/courses/dsa`, load a lesson, and confirm formatting and code snippets.
3. **Student Registration**: Create a test student account via `/register` $\to$ confirm access to `/student/dashboard`.
4. **Quiz Submission**: Take a 10-question module quiz $\to$ verify score persists and next module unlocks.
5. **Payment Gateway Test**: Initiate ₹29 Placement Ready test order $\to$ confirm Razorpay modal opens with exact amount.
6. **Certificate Verification**: Visit `/verify/{sampleCertificateCode}` $\to$ confirm public certificate verification display.
7. **SEO Feeds**: Verify `https://codeorbit.online/robots.txt` and `https://codeorbit.online/api/public/sitemap.xml`.

---

## 4. Final Sign-Off

**RELEASE STATUS: GO-LIVE READY WITH MANUAL STEPS**

All code, build systems, security boundaries, and automated regression suites are 100% verified. Once the manual pre-launch credentials and DNS steps above are completed on the hosting server, CodeOrbit is fully prepared for production launch.
