package com.codeorbit.service;

import com.codeorbit.dto.AdminUserDto;
import java.util.List;

public interface AdminUserService {
    List<AdminUserDto.Summary> getAllUsers();
    AdminUserDto.Summary updateUserRole(Long userId, String newRole);
}
