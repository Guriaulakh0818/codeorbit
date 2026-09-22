package com.codeorbit.dto;

import com.codeorbit.entity.Role;
import java.time.LocalDateTime;

public class UserSummaryDto {

    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private String authProvider;
    private String avatarUrl;
    private LocalDateTime createdAt;

    public UserSummaryDto() {
    }

    public UserSummaryDto(Long id, String fullName, String email, Role role, LocalDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.authProvider = "LOCAL";
        this.createdAt = createdAt;
    }

    public UserSummaryDto(Long id, String fullName, String email, Role role, String authProvider, String avatarUrl, LocalDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.authProvider = authProvider;
        this.avatarUrl = avatarUrl;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getAuthProvider() {
        return authProvider;
    }

    public void setAuthProvider(String authProvider) {
        this.authProvider = authProvider;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
