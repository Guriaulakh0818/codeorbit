package com.codeorbit.security;

import com.codeorbit.dto.*;
import com.codeorbit.service.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PublicContentSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SitemapService sitemapService;

    @MockBean
    private CourseService courseService;

    @MockBean
    private PlacementKitService placementKitService;

    @MockBean
    private CertificateService certificateService;

    @Test
    @DisplayName("Sitemap XML & JSON endpoints are publicly accessible without authentication")
    void testPublicSitemap_WithoutAuth_Allowed() throws Exception {
        when(sitemapService.generateSitemapXml()).thenReturn("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset></urlset>");
        when(sitemapService.getPublicSitemapEntries()).thenReturn(List.of());

        mockMvc.perform(get("/api/public/sitemap.xml"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/public/sitemap"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Public course catalog and course detail endpoints are accessible without authentication")
    void testPublicCourses_WithoutAuth_Allowed() throws Exception {
        when(courseService.getPublishedCourses(any(), any(), anyInt(), anyInt()))
                .thenReturn(new PagedResponseDto<>(List.of(), 0, 10, 0, 0, true));
        when(courseService.getCourseDetailBySlug("dsa")).thenReturn(new CourseDetailDto());

        mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/courses/dsa"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Public placement kits catalog and detail endpoints are accessible without authentication")
    void testPublicPlacementKits_WithoutAuth_Allowed() throws Exception {
        when(placementKitService.getAllActiveKits(nullable(UserPrincipal.class))).thenReturn(List.of());
        when(placementKitService.getKitBySlug(eq("sde1-kit"), nullable(UserPrincipal.class))).thenReturn(new PlacementKitDetailDto());

        mockMvc.perform(get("/api/placement-kits"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/placement-kits/sde1-kit"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Public certificate verification endpoint is accessible without authentication")
    void testPublicCertificateVerification_WithoutAuth_Allowed() throws Exception {
        CertificatePublicDto cert = new CertificatePublicDto(
                "CO-DSA-2026-X8Y9Z0",
                "Student Name",
                "DSA Track",
                "dsa",
                "VALID",
                true,
                null,
                LocalDateTime.now()
        );
        when(certificateService.verifyCertificate(eq("CO-DSA-2026-X8Y9Z0"))).thenReturn(cert);

        mockMvc.perform(get("/api/certificates/verify/CO-DSA-2026-X8Y9Z0"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Private student and admin endpoints strictly reject unauthenticated requests")
    void testPrivateEndpoints_WithoutAuth_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/student/dashboard"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/student/enrollments"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/admin/courses"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/admin/placement-kits"))
                .andExpect(status().isUnauthorized());
    }
}
