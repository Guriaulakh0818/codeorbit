# =================================================================
# Stage 1: Build React / Vite Application
# =================================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Cache npm dependencies layer
COPY package.json package-lock.json ./
RUN npm ci

# Copy frontend source code and build production bundle
COPY . .
RUN npm run build

# =================================================================
# Stage 2: Serve via Nginx
# =================================================================
FROM nginx:alpine

# Remove default Nginx website configuration
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom Nginx configuration with SPA fallback & API proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production build artifacts
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
