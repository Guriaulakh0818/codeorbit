# CODEORBIT — PRODUCTION DEPLOYMENT RUNBOOK
**Phase 10 Production Deployment & Operations Guide**  
**Version:** 1.0.0  
**Stack:** Spring Boot 3.3.4 (Java 21) + MySQL 8.0 / PostgreSQL + React 19 / Vite + Nginx Reverse Proxy  
**Platform Architecture:** Multi-tier Containerized Microservices / Docker Compose / PaaS Compatible

---

## 1. Prerequisites & Infrastructure Requirements

Before deploying CodeOrbit to staging or production, ensure the following host dependencies and resources are provisioned:

- **Host Operating System**: Linux (Ubuntu 22.04 LTS / Debian 12 / Alpine) or Docker-enabled Container Engine.
- **Hardware Sizing**:
  - Minimum: 2 vCPU, 2 GB RAM, 20 GB SSD storage.
  - Recommended: 4 vCPU, 4 GB RAM, 50 GB SSD storage.
- **Runtimes & Tools**:
  - Docker Engine $\ge 24.0.0$ and Docker Compose $\ge 2.20.0$.
  - (Optional for Bare-Metal): OpenJDK 21 LTS, Maven 3.9+, Node.js 20 LTS.
- **Network & DNS**:
  - Public domain DNS records pointing to the host IP (e.g., `A` record for `codeorbit.online` and `www.codeorbit.online`).
  - Open inbound ports: `80` (HTTP) and `443` (HTTPS).

---

## 2. Environment Variables & Secret Configuration

Create a production `.env` file in the root directory by copying `.env.example`:
```bash
cp .env.example .env
chmod 600 .env
```

### 2.1 Critical Configuration Keys

| Category | Environment Variable | Recommended Production Value | Description |
| :--- | :--- | :--- | :--- |
| **Server** | `PORT` | `80` (or `443` with SSL termination) | Host port exposed by Nginx reverse proxy |
| **Server** | `SPRING_PROFILES_ACTIVE` | `prod,mysql` | Enforces production error masking & MySQL dialect |
| **Database** | `DB_HOST` | `mysql` (Docker) or `rds-endpoint.amazonaws.com` | Database hostname |
| **Database** | `DB_PORT` | `3306` | MySQL server port |
| **Database** | `DB_NAME` | `codeorbit_db` | Primary application database |
| **Database** | `DB_USER` | `codeorbit_user` | Dedicated unprivileged database user |
| **Database** | `DB_PASSWORD` | `<STRONG_RANDOM_PASSWORD>` | Alphanumeric database password |
| **Database** | `DB_ROOT_PASSWORD` | `<STRONG_ROOT_PASSWORD>` | MySQL root password (internal only) |
| **Database** | `JPA_DDL_AUTO` | `validate` | Strictly `validate` in production (no DDL mutations) |
| **Database** | `FLYWAY_ENABLED` | `true` | Executes database migrations automatically |
| **Security** | `JWT_SECRET` | `<256_BIT_HEX_OR_BASE64_KEY>` | Key for HMAC-SHA512 token verification |
| **Security** | `JWT_EXPIRATION_MS` | `86400000` (24 Hours) | JWT session validity duration |
| **Security** | `CORS_ALLOWED_ORIGINS` | `https://codeorbit.online,https://www.codeorbit.online` | Strict domain origin whitelist |
| **Admin** | `ADMIN_BOOTSTRAP_ENABLED` | `true` (First run only) $\to$ `false` | Seeds initial administrator account |
| **Admin** | `ADMIN_BOOTSTRAP_EMAIL` | `admin@codeorbit.online` | Initial admin account email |
| **Admin** | `ADMIN_BOOTSTRAP_PASSWORD`| `<SECURE_ADMIN_PASSWORD>` | Initial admin password (min 16 chars) |
| **OAuth** | `GOOGLE_CLIENT_ID` | `<CLIENT_ID>.apps.googleusercontent.com` | Google Cloud Console OAuth 2.0 Client ID |
| **OAuth** | `VITE_GOOGLE_CLIENT_ID` | `<CLIENT_ID>.apps.googleusercontent.com` | Frontend Google Client ID |
| **Razorpay** | `RAZORPAY_KEY_ID` | `rzp_live_...` | Live Razorpay API Key ID |
| **Razorpay** | `RAZORPAY_KEY_SECRET` | `<RAZORPAY_LIVE_SECRET>` | Live Razorpay Key Secret |
| **Razorpay** | `RAZORPAY_WEBHOOK_SECRET` | `<RAZORPAY_WEBHOOK_SECRET>` | Signature secret for payment webhooks |
| **Razorpay** | `VITE_RAZORPAY_KEY_ID` | `rzp_live_...` | Frontend Razorpay Client Key ID |
| **Storage** | `PRIVATE_PDF_STORAGE_PATH` | `/app/storage/private/pdfs` | Private storage path for handbook PDFs |
| **Frontend** | `VITE_API_BASE_URL` | `/api` | Base path for same-origin proxy |

---

## 3. Database Setup & Migration

### 3.1 Docker Compose Deployment
When launching via Docker Compose, MySQL starts automatically, creates `codeorbit_db`, and waits for healthy status before launching the Spring Boot backend:
```bash
docker compose up -d mysql
```

### 3.2 External MySQL / AWS RDS Setup
If using an external managed database instance:
1. Log into your MySQL database server as administrator:
   ```sql
   CREATE DATABASE codeorbit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'codeorbit_user'@'%' IDENTIFIED BY 'your_strong_password_here';
   GRANT ALL PRIVILEGES ON codeorbit_db.* TO 'codeorbit_user'@'%';
   FLUSH PRIVILEGES;
   ```
2. Verify Flyway migrations (`V1` through `V8`) execute automatically upon Spring Boot backend startup.

---

## 4. Building Production Artifacts

### 4.1 Backend Build (Java 21 JAR)
```bash
cd backend
mvn clean package -DskipTests
# Resulting binary: backend/target/codeorbit-backend-1.0.0.jar
```

### 4.2 Frontend Build (Vite SPA Distribution)
```bash
cd frontend
npm ci
npm run build
# Resulting bundle: frontend/dist/
```

---

## 5. Deployment Procedures

### 5.1 Standard Docker Compose Deployment (Recommended)
1. Ensure `.env` is configured with production secrets.
2. Build and start all services in detached mode:
   ```bash
   docker compose down
   docker compose build --no-cache
   docker compose up -d
   ```
3. Verify running containers:
   ```bash
   docker compose ps
   ```
   Output should indicate:
   - `codeorbit-mysql`: Up (healthy)
   - `codeorbit-backend`: Up
   - `codeorbit-frontend`: Up (port 80/443 mapped)

### 5.2 Inspecting Service Logs
```bash
# Backend Spring Boot logs
docker compose logs -f backend

# Frontend Nginx access/error logs
docker compose logs -f frontend

# MySQL database logs
docker compose logs -f mysql
```

---

## 6. Reverse Proxy, HTTPS & SSL Termination

For bare-metal or VPS deployments, configure SSL certificates via Let's Encrypt / Certbot:

### 6.1 Certbot SSL Provisioning
```bash
sudo apt update && sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --standalone -d codeorbit.online -d www.codeorbit.online
```

### 6.2 Nginx SSL Proxy Configuration (`/etc/nginx/sites-available/codeorbit`)
```nginx
server {
    listen 80;
    server_name codeorbit.online www.codeorbit.online;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name codeorbit.online www.codeorbit.online;

    ssl_certificate /etc/letsencrypt/live/codeorbit.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/codeorbit.online/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

---

## 7. Google OAuth & Third-Party Gateway Setup

### 7.1 Google Cloud Console Configuration
1. Navigate to **Google Cloud Console** $\to$ **APIs & Services** $\to$ **Credentials**.
2. Create/Edit **OAuth 2.0 Client ID** (Web application).
3. Set **Authorized JavaScript origins**:
   - `https://codeorbit.online`
   - `https://www.codeorbit.online`
4. Set **Authorized redirect URIs**:
   - `https://codeorbit.online/login`
   - `https://codeorbit.online/register`
5. Copy Client ID into `.env` as `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID`.

### 7.2 Razorpay Live Activation
1. In Razorpay Dashboard, generate **Live API Keys**.
2. Set webhook endpoint to `https://codeorbit.online/api/payments/razorpay/webhook`.
3. Select webhook events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
4. Configure secret in `.env` (`RAZORPAY_WEBHOOK_SECRET`).

---

## 8. Health Checks & Verification

### 8.1 Automated Health Probes
- **Backend Service Health**:
  ```bash
  curl -s -i https://codeorbit.online/api/health
  # HTTP/1.1 200 OK
  # {"status":"UP","service":"codeorbit-backend","timestamp":"2026-09-22T..."}
  ```
- **Public Sitemap Verification**:
  ```bash
  curl -s -i https://codeorbit.online/api/public/sitemap.xml
  # HTTP/1.1 200 OK (Content-Type: application/xml)
  ```
- **Robots.txt Verification**:
  ```bash
  curl -s -i https://codeorbit.online/robots.txt
  # HTTP/1.1 200 OK
  ```

---

## 9. Backup & Disaster Recovery Procedures

### 9.1 Automated Daily Database Backup
Add a cron job on the production host (`crontab -e`):
```bash
0 2 * * * docker exec codeorbit-mysql mysqldump -u codeorbit_user -p"$DB_PASSWORD" codeorbit_db | gzip > /var/backups/codeorbit/db_$(date +\%Y\%m\%d_\%H\%M\%S).sql.gz
```

### 9.2 Database Restoration
```bash
gunzip < /var/backups/codeorbit/db_20260922_020000.sql.gz | docker exec -i codeorbit-mysql mysql -u codeorbit_user -p"$DB_PASSWORD" codeorbit_db
```

### 9.3 Persistent Volume Backup
Backup the private PDF handbook storage volume:
```bash
tar -czvf /var/backups/codeorbit/pdf_storage_$(date +\%Y\%m\%d).tar.gz /var/lib/docker/volumes/codeorbit_pdf_storage/_data
```

---

## 10. Rollback Procedure

In the event of an unexpected release regression:
1. Re-tag or revert to the prior stable Git commit / Docker image:
   ```bash
   git checkout <PREVIOUS_STABLE_TAG>
   ```
2. Rebuild and restart containers:
   ```bash
   docker compose build --no-cache
   docker compose up -d
   ```
3. Check application logs and verify `/api/health`.
