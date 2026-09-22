# CODEORBIT — PRODUCTION DEPLOYMENT & LIVE CHECKLIST
**Phase 10 Operations & Release Sign-Off Matrix**  
**Repository:** `Guriaulakh0818/codeorbit`  
**Status:** READY WITH MANUAL CONFIGURATION REQUIRED

---

## 1. Automated Build & Verification Gate

| Verification Item | Command / Standard | Result | Sign-Off |
| :--- | :--- | :--- | :---: |
| **Backend Unit & Integration Tests** | `mvn clean test` | 188 passed, 0 failures, 0 errors, 0 skipped | ✅ PASS |
| **Backend Production Executable JAR** | `mvn clean package -DskipTests` | `codeorbit-backend-1.0.0.jar` created | ✅ PASS |
| **Frontend Production Build** | `npm run build` | 2029 modules transformed, 0 errors | ✅ PASS |
| **Clean Static Type / Lint Validation** | ESLint / Java compiler checks | 0 compiler warnings/errors | ✅ PASS |

---

## 2. Production Security & Configuration Matrix

| Category | Checklist Item | Status | Verification Notes |
| :--- | :--- | :---: | :--- |
| **Environment Variables** | Externalized via `.env.example` | ✅ PASS | Zero committed production secrets in git |
| **Database Credentials** | MySQL unprivileged user & strong root password | ⚙️ REQUIRED | Must be supplied in production `.env` |
| **JWT Secret** | 256-bit cryptographically secure secret | ⚙️ REQUIRED | Must generate random key for production |
| **CORS Whitelist** | Strict domain origin restriction | ✅ PASS | Restricts to configured `CORS_ALLOWED_ORIGINS` |
| **Content Security Policy** | Configured in `nginx.conf` | ✅ PASS | Permits Razorpay (`checkout.razorpay.com`) and Google GIS |
| **Security Headers** | `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` | ✅ PASS | Enabled in both Spring Security & Nginx reverse proxy |
| **Health Probes** | `GET /api/health` and `GET /health` | ✅ PASS | Returns `{"status":"UP"}` without leaking internals |

---

## 3. Business Rule & Access Control Verification

| Rule # | Business Rule Description | Verified Status |
| :---: | :--- | :---: |
| 1 | 4 CS subjects $\times$ 4 subcourses (Beginner, Intermediate, Advanced, Placement Ready) | ✅ PASS |
| 2 | Beginner, Intermediate, Advanced levels are 100% free | ✅ PASS |
| 3 | Placement Ready subcourses priced strictly at ₹29 (2900 paise) | ✅ PASS |
| 4 | 64 modules, 64 module quizzes, 640 questions | ✅ PASS |
| 5 | Module quiz passing threshold = 8/10 (80%) | ✅ PASS |
| 6 | 12 level final quizzes, 300 questions, passing threshold = 20/25 (80%) | ✅ PASS |
| 7 | Certificate eligibility requires 12 module quizzes + 3 final quizzes passed | ✅ PASS |
| 8 | Certificate issuance fee priced strictly at ₹9 (900 paise) | ✅ PASS |
| 9 | Placement Ready is **not** required for certificate eligibility | ✅ PASS |
| 10 | 10 Placement Kits priced strictly at ₹99 each (9900 paise) | ✅ PASS |
| 11 | Cashfree ebook marketplace and library entitlement intact | ✅ PASS |
| 12 | Student multi-tenant isolation strictly enforced via `@AuthenticationPrincipal` | ✅ PASS |

---

## 4. Live Production Smoke Test Plan

Execute this test plan immediately following production container startup:

### 4.1 Public Endpoints
- [ ] Verify `GET /api/health` returns `HTTP 200 OK` with `status: "UP"`.
- [ ] Verify Homepage (`/`) loads with hero banner, subject catalog, and placement kit preview.
- [ ] Verify Course Detail (`/courses/dsa`) displays 4 subcourses with correct pricing tags (Free vs ₹29).
- [ ] Verify Module & Lesson viewer (`/courses/dsa/modules/.../lessons/...`) renders markdown and multi-language code snippets.
- [ ] Verify Public Sitemap (`/api/public/sitemap.xml`) returns XML feed with all published courses and lessons.
- [ ] Verify `robots.txt` disallows `/student/` and `/admin/` while allowing public curriculum paths.

### 4.2 Authentication & Student Portal
- [ ] Register new student account via `/register` (or log in via Google OAuth).
- [ ] Navigate to Student Dashboard (`/student/dashboard`) and confirm empty/enrolled course state.
- [ ] Log out and attempt direct navigation to `/student/dashboard` (must redirect to `/login`).

### 4.3 Quiz & Progression
- [ ] Launch Module 1 Quiz (`/quiz/...`), select options, and submit.
- [ ] Verify passing score unlocks Module 2.
- [ ] Confirm answer keys are never present in the initial question payload.

### 4.4 Payment Gateways (Razorpay Live Mode)
- [ ] Initiate Placement Ready checkout for ₹29 $\to$ verify Razorpay modal opens with 2900 paise.
- [ ] Complete payment and verify immediate entitlement grant.
- [ ] Test Certificate payment for ₹9 upon passing 12 module quizzes and 3 level quizzes.
- [ ] Verify Placement Kit checkout for ₹99.

### 4.5 Certificate Verification
- [ ] Download certificate PDF and verify authenticity.
- [ ] Scan QR code $\to$ verify `https://codeorbit.online/certificate/verify/{code}` validates the issued certificate.

---

## 5. Deployment Sign-Off Decision

- **Test Suite**: 188 / 188 Passing (`BUILD SUCCESS`).
- **Production Packages**: Both Backend JAR and Frontend SPA built cleanly.
- **Critical & High Defect Count**: **0**.
- **Deployment Status**: **READY WITH MANUAL CONFIGURATION REQUIRED** (Production secrets and domain TLS certificates must be populated in the hosting environment).
