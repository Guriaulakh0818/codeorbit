package com.codeorbit.controller;

import com.codeorbit.dto.ApiResponse;
import com.codeorbit.dto.SitemapEntryDto;
import com.codeorbit.service.SitemapService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class SitemapController {

    private final SitemapService sitemapService;

    public SitemapController(SitemapService sitemapService) {
        this.sitemapService = sitemapService;
    }

    /**
     * GET /api/public/sitemap
     * Returns JSON list of public indexable sitemap URLs.
     */
    @GetMapping("/sitemap")
    public ResponseEntity<ApiResponse<List<SitemapEntryDto>>> getSitemapJson() {
        List<SitemapEntryDto> entries = sitemapService.getPublicSitemapEntries();
        return ResponseEntity.ok(ApiResponse.success("Public sitemap entries retrieved", entries));
    }

    /**
     * GET /api/public/sitemap.xml
     * Returns standard XML sitemap for search engine crawlers.
     */
    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> getSitemapXml() {
        String xml = sitemapService.generateSitemapXml();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "application/xml; charset=UTF-8")
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                .body(xml);
    }
}
