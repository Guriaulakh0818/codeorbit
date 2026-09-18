# CodeOrbit Backend — Spring Boot Digital Learning Platform

Spring Boot 3 REST API backend for **CodeOrbit**, a single-owner e-book store tailored for CSE & IT engineering students.

---

## 🛠️ Architecture & Business Model

- **Business Model**: Direct Single-Owner E-book Store (Not a multi-vendor marketplace).
- **Roles**:
  - **Admin**: Store owner who uploads e-books, manages catalog metadata, sets pricing, uploads private PDF documents, and audits student orders.
  - **Student**: Customer who browses catalog, purchases e-books, views order history, and accesses purchased PDFs via verified download tokens in My Library.
- **Security**: Private PDF storage with backend-verified DRM access tokens.

---

## 📁 Layered Structure

```
backend/
├── pom.xml
├── .env.example
├── README.md
└── src/
    ├── main/
    │   ├── java/com/codeorbit/
    │   │   ├── CodeOrbitApplication.java
    │   │   ├── config/
    │   │   │   ├── CorsConfig.java           # Configurable CORS for React dev origins
    │   │   │   └── DataInitializer.java       # Dev-only seed mechanism for sample CSE/IT e-books
    │   │   ├── controller/
    │   │   │   └── EbookController.java       # REST endpoints: /api/ebooks, /api/ebooks/{id}, /api/ebooks/categories
    │   │   ├── dto/
    │   │   │   ├── ApiResponse.java          # Uniform API response wrapper
    │   │   │   ├── EbookResponseDto.java     # Safe client-facing DTO
    │   │   │   └── PagedResponseDto.java     # Generic pagination metadata container
    │   │   ├── entity/
    │   │   │   └── Ebook.java                 # JPA Entity (title, author, category, price, pages, etc.)
    │   │   ├── exception/
    │   │   │   ├── GlobalExceptionHandler.java# Centralized 404, 400, 500 error handler
    │   │   │   └── ResourceNotFoundException.java
    │   │   ├── repository/
    │   │   │   └── EbookRepository.java       # JPA repository with search & category query methods
    │   │   └── service/
    │   │       ├── EbookService.java          # Service interface
    │   │       └── impl/EbookServiceImpl.java # Service implementation (filtering, paging, DTO mapping)
    │   └── resources/
    │       ├── application.yml                # Dev (H2) and MySQL profiles with environment variables
    │       └── schema-mysql.sql               # Single-owner store MySQL DDL schema
    └── test/
        └── java/com/codeorbit/
            ├── CodeOrbitApplicationTests.java # Context loading test
            ├── controller/
            │   └── EbookControllerTest.java   # MockMvc REST endpoint integration tests
            └── service/
                └── EbookServiceTest.java      # Mockito unit tests for service layer
```

---

## 🚀 API Endpoints

| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/ebooks` | Get active e-books (paginated) | `search`, `category`, `page` (default 0), `size` (default 10), `sortBy` (default `createdAt`), `sortDir` (`asc`/`desc`) |
| `GET` | `/api/ebooks/{id}` | Get single active e-book by ID | None (returns 404 if not found or inactive) |
| `GET` | `/api/ebooks/categories` | Get all distinct categories | None |

---

## 🏃 Running the Application

### Option 1: Quick Run (Default H2 In-Memory)
```bash
cd backend
mvnw.cmd spring-boot:run
# or on Linux/macOS:
# ./mvnw spring-boot:run
```

H2 Console is accessible at: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:codeorbit_db`).

### Option 2: Run with MySQL
```powershell
$env:SPRING_PROFILES_ACTIVE="mysql"
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_NAME="codeorbit_db"
$env:DB_USER="root"
$env:DB_PASSWORD="your_password"
mvnw.cmd spring-boot:run
```

---

## 🧪 Running Tests

```bash
cd backend
mvnw.cmd clean test
```
