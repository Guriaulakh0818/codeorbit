# 🚀 CodeOrbit — Digital E-Book & Engineering Marketplace

> **Digital learning library for CSE & IT Students.**  
> Practical coding guides, engineering notes, placement interview banks, and Capstone documentation.

---

## 🌟 Overview & Business Model

**CodeOrbit** is a full-stack educational marketplace tailored specifically for Computer Science & Information Technology engineering students. 

### Key Capabilities:
- **E-Book Storefront & Catalog**: Filter by subjects (Java 21, DSA, React/Spring Boot, SQL & Index Tuning, OS & Networks, Placement Prep, Capstone SRS Blueprints).
- **Interactive PDF Preview Modal**: Students can inspect first 3 sample pages, table of contents, and curriculum before purchasing.
- **Cart & Dynamic Discounts**: Promo code engine (e.g. `ENGINEER50` for 50% discount).
- **Cashfree Checkout**: Seamless payment order creation, UPI / QR / Card / NetBanking support, and automatic order verification.
- **Student Library & In-App Reader**: Direct access to purchased handbooks, reading progress tracking, theme options (Dark / Sepia / Light), and font resizers.
- **PDF Security & Watermarking**: DRM protection with student-specific license stamps and authorized download tokens.
- **Instructor Marketplace**: Authors submit e-books for review and earn **80% royalty** with live sales analytics.
- **Admin Desk**: Operations dashboard to approve or reject submissions, manage inventory, and track platform revenue.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, React Router DOM, Canvas Confetti |
| **Backend** | Java 21, Spring Boot 3.3, Spring Security 6 (Stateless JWT), Spring Data JPA |
| **Database** | MySQL 8.0 / Embedded H2 (for instant zero-friction local run) |
| **Payment Gateway** | Cashfree Payments PG (Order session, Webhook, and Drop UI Modal) |
| **File Storage** | Private local / cloud object storage with authorized access endpoints |

---

## ⚡ Quick Start Guide

### 1. Run the Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
> The frontend will launch at `http://localhost:3000` (or `http://localhost:5173`).

---

### 2. Run the Backend (Spring Boot 3)
```bash
cd backend
mvn spring-boot:run
```
> The REST API server will run at `http://localhost:8080`.  
> Embedded H2 Console is available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:codeorbitdb`, user: `sa`, password: empty).

---

## 🔑 Demo Accounts & 1-Click Role Switcher

The top navbar includes an instant **Demo Role Switcher** so you can test all 3 user experiences immediately:

| Role | Email | Password | Access / Permissions |
|---|---|---|---|
| **Student** | `aman.student@codeorbit.dev` | `password123` | Storefront, Cart, Checkout, My Library, In-App Reader |
| **Instructor** | `aditya.author@codeorbit.dev` | `password123` | Submit E-books, View Royalty (80%), Sales Analytics |
| **Admin** | `admin@codeorbit.dev` | `admin123` | Approve / Reject submissions, Platform Revenue, User stats |

---

## 💳 Payment & Razorpay Testing

1. Add any e-book to your cart or click **"Instant Buy Now"**.
2. Apply promo code **`ENGINEER50`** for a 50% discount.
3. Choose your payment method (UPI / QR / Card / NetBanking) and click **"Authorize & Pay"**.
4. The system cryptographically verifies the transaction, triggers celebratory confetti, and automatically unlocks the e-book inside your **My Library** dashboard.

---

## 🛡️ Security Architecture

1. **Stateless JWT**: Spring Security filter validates JWT tokens on private routes (`/api/orders/**`, `/api/instructor/**`, `/api/admin/**`).
2. **Private PDF Storage**: PDF files are never exposed to public URLs. Downloads require purchase ownership checks and generate time-limited signed tokens.
3. **DRM Stamping**: In-app reader embeds student registration email watermarks to deter piracy.

---

## 📁 Project Structure

```
CodeOrbit/
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Footer, EbookCard, CategoryPills, PdfPreviewModal, CartDrawer, RazorpayCheckoutModal
│   │   ├── context/          # AuthContext, CartContext, LibraryContext
│   │   ├── data/             # Curated CSE/IT mock data & categories
│   │   ├── pages/            # Home, Catalog, Detail, Library, Reader, Dashboards, Auth
│   │   ├── index.css         # Custom tokens, gradients, animations
│   │   └── App.jsx           # Client routes
│   └── package.json
└── backend/
    ├── src/main/java/com/codeorbit/
    │   ├── config/           # SecurityConfig, JwtAuthFilter, JwtUtils, DataInitializer
    │   ├── controller/       # AuthController, EbookController, OrderController, InstructorController, AdminController
    │   ├── dto/              # Request / Response payloads
    │   ├── entity/           # User, Role, Category, Ebook, Chapter, Order, OrderItem, Review
    │   ├── repository/       # JPA Repositories with custom query methods
    │   └── service/          # AuthService, EbookService, OrderService, RazorpayService, StorageService
    ├── src/main/resources/
    │   ├── application.yml   # Server & DB configurations
    │   └── schema.sql        # MySQL 8.0 DDL table scripts
    └── pom.xml
```

---

© 2026 CodeOrbit Inc. Built for CSE & IT Engineers worldwide.
