package com.codeorbit.service;

import com.codeorbit.dto.EbookResponseDto;
import com.codeorbit.dto.PagedResponseDto;

import java.util.List;

public interface EbookService {

    PagedResponseDto<EbookResponseDto> getActiveEbooks(
            String search,
            String category,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    EbookResponseDto getActiveEbookById(Long id);

    List<String> getActiveCategories();
}
