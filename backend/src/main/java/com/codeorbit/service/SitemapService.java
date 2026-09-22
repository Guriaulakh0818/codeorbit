package com.codeorbit.service;

import com.codeorbit.dto.SitemapEntryDto;

import java.util.List;

public interface SitemapService {

    List<SitemapEntryDto> getPublicSitemapEntries();

    String generateSitemapXml();
}
