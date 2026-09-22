package com.codeorbit.controller;

import com.codeorbit.dto.SitemapEntryDto;
import com.codeorbit.service.SitemapService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SitemapController.class)
@AutoConfigureMockMvc(addFilters = false)
class SitemapControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SitemapService sitemapService;

    @Test
    @DisplayName("GET /api/public/sitemap.xml - Returns XML sitemap with application/xml media type")
    void testGetSitemapXml() throws Exception {
        String mockXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"><url><loc>https://www.codeorbit.online/</loc></url></urlset>";
        when(sitemapService.generateSitemapXml()).thenReturn(mockXml);

        mockMvc.perform(get("/api/public/sitemap.xml"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_XML))
                .andExpect(content().string(mockXml));
    }

    @Test
    @DisplayName("GET /api/public/sitemap - Returns JSON array of sitemap entries")
    void testGetSitemapJson() throws Exception {
        List<SitemapEntryDto> entries = List.of(
                new SitemapEntryDto("https://www.codeorbit.online/", "daily", 1.0),
                new SitemapEntryDto("https://www.codeorbit.online/courses", "daily", 0.9)
        );

        when(sitemapService.getPublicSitemapEntries()).thenReturn(entries);

        mockMvc.perform(get("/api/public/sitemap"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].loc").value("https://www.codeorbit.online/"))
                .andExpect(jsonPath("$.data[0].priority").value(1.0))
                .andExpect(jsonPath("$.data[1].loc").value("https://www.codeorbit.online/courses"));
    }
}
