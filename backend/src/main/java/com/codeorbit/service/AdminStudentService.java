package com.codeorbit.service;

import com.codeorbit.dto.AdminStudentDto;
import com.codeorbit.dto.PagedResponseDto;
import org.springframework.data.domain.Pageable;

public interface AdminStudentService {
    PagedResponseDto<AdminStudentDto.Summary> getStudents(String search, String status, Pageable pageable);
    AdminStudentDto.Detail getStudentDetail(Long id);
}
