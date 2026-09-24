package com.codeorbit.service.impl;

import com.codeorbit.dto.AdminUserDto;
import com.codeorbit.entity.Role;
import com.codeorbit.entity.User;
import com.codeorbit.exception.BadRequestException;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.UserRepository;
import com.codeorbit.service.AdminUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;

    public AdminUserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminUserDto.Summary> getAllUsers() {
        return userRepository.findAll().stream().map(u -> {
            AdminUserDto.Summary s = new AdminUserDto.Summary();
            s.setId(u.getId());
            s.setFullName(u.getFullName() != null ? u.getFullName() : "Learner");
            s.setEmail(u.getEmail());
            s.setRole(u.getRole() != null ? u.getRole().name() : "STUDENT");
            s.setAuthProvider(u.getProvider() != null ? u.getProvider().name() : "LOCAL");
            s.setCreatedAt(u.getCreatedAt());
            s.setStatus("ACTIVE");
            return s;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AdminUserDto.Summary updateUserRole(Long userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        try {
            Role role = Role.valueOf(newRole.toUpperCase().trim());
            user.setRole(role);
            User saved = userRepository.save(user);

            AdminUserDto.Summary s = new AdminUserDto.Summary();
            s.setId(saved.getId());
            s.setFullName(saved.getFullName() != null ? saved.getFullName() : "Learner");
            s.setEmail(saved.getEmail());
            s.setRole(saved.getRole().name());
            s.setAuthProvider(saved.getProvider() != null ? saved.getProvider().name() : "LOCAL");
            s.setCreatedAt(saved.getCreatedAt());
            s.setStatus("ACTIVE");
            return s;
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role specified: " + newRole);
        }
    }
}
