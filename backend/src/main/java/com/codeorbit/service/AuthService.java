package com.codeorbit.service;

import com.codeorbit.dto.AuthResponseDto;
import com.codeorbit.dto.LoginRequestDto;
import com.codeorbit.dto.RegisterRequestDto;
import com.codeorbit.dto.UserSummaryDto;
import com.codeorbit.security.UserPrincipal;

public interface AuthService {

    AuthResponseDto registerStudent(RegisterRequestDto registerDto);

    AuthResponseDto login(LoginRequestDto loginDto);

    UserSummaryDto getCurrentUser(UserPrincipal userPrincipal);
}
