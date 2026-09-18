package com.codeorbit.service.impl;

import com.codeorbit.dto.AuthResponseDto;
import com.codeorbit.dto.LoginRequestDto;
import com.codeorbit.dto.RegisterRequestDto;
import com.codeorbit.dto.UserSummaryDto;
import com.codeorbit.entity.Role;
import com.codeorbit.entity.User;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.UserRepository;
import com.codeorbit.security.JwtUtils;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtUtils jwtUtils
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public AuthResponseDto registerStudent(RegisterRequestDto registerDto) {
        String cleanEmail = registerDto.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new IllegalArgumentException("An account with email '" + cleanEmail + "' already exists. Please log in.");
        }

        // Public registration STRICTLY assigns Role.STUDENT
        User user = new User(
                registerDto.getFullName().trim(),
                cleanEmail,
                passwordEncoder.encode(registerDto.getPassword()),
                Role.STUDENT
        );

        User savedUser = userRepository.save(user);

        UserPrincipal principal = UserPrincipal.create(savedUser);
        String token = jwtUtils.generateToken(principal);

        UserSummaryDto userSummary = new UserSummaryDto(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getCreatedAt()
        );

        return new AuthResponseDto(token, userSummary);
    }

    @Override
    public AuthResponseDto login(LoginRequestDto loginDto) {
        String cleanEmail = loginDto.getEmail().trim().toLowerCase();

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(cleanEmail, loginDto.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid email or password. Please check your credentials.");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtUtils.generateToken(principal);

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        UserSummaryDto userSummary = new UserSummaryDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );

        return new AuthResponseDto(token, userSummary);
    }

    @Override
    @Transactional(readOnly = true)
    public UserSummaryDto getCurrentUser(UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            throw new IllegalArgumentException("No authenticated user found.");
        }

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        return new UserSummaryDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
