package com.codeorbit.dto;

import java.time.LocalDateTime;

public class AdminUserDto {

    public static class Summary {
        private Long id;
        private String fullName;
        private String email;
        private String role;
        private String authProvider;
        private LocalDateTime createdAt;
        private String status;

        public Summary() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getAuthProvider() { return authProvider; }
        public void setAuthProvider(String authProvider) { this.authProvider = authProvider; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class RoleUpdateRequest {
        private String role;

        public RoleUpdateRequest() {}
        public RoleUpdateRequest(String role) { this.role = role; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}
