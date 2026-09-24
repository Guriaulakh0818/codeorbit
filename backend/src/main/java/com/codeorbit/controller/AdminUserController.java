package com.codeorbit.controller;

import com.codeorbit.dto.AdminUserDto;
import com.codeorbit.dto.ApiResponse;
import com.codeorbit.service.AdminUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER', 'SUPPORT')")
public class AdminUserController {

    private final AdminUserService userService;

    public AdminUserController(AdminUserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminUserDto.Summary>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<AdminUserDto.Summary>> updateUserRole(
            @PathVariable Long id,
            @RequestBody AdminUserDto.RoleUpdateRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Role updated successfully", userService.updateUserRole(id, request.getRole())));
    }
}
