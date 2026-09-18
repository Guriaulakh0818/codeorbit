# =================================================================
# Stage 1: Build Spring Boot Application
# =================================================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Cache Maven dependencies layer
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy application source code and compile production JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# =================================================================
# Stage 2: Minimal Production Runtime
# =================================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create dedicated non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create directory for private PDF storage and set ownership
RUN mkdir -p /app/storage/private/pdfs && \
    chown -R appuser:appgroup /app

# Copy executable JAR from builder stage
COPY --from=builder --chown=appuser:appgroup /build/target/*.jar /app/app.jar

# Run as unprivileged non-root user
USER appuser:appgroup

# Expose backend application port
EXPOSE 8080

# Environment defaults
ENV PORT=8080 \
    SPRING_PROFILES_ACTIVE=prod,mysql \
    PRIVATE_PDF_STORAGE_PATH=/app/storage/private/pdfs \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
