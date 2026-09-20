package com.codeorbit.controller;

import com.codeorbit.dto.*;
import com.codeorbit.entity.PublishStatus;
import com.codeorbit.service.AdminCurriculumService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AdminCurriculumControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AdminCurriculumService curriculumService;

    @Test
    @DisplayName("GET /api/admin/curriculum/courses - Unauthorized without token should return 401/403")
    void testGetAdminCoursesUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/curriculum/courses"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "student@codeorbit.dev", roles = {"STUDENT"})
    @DisplayName("GET /api/admin/curriculum/courses - Student role should return 403 Forbidden")
    void testGetAdminCoursesStudentForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/curriculum/courses"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@codeorbit.dev", roles = {"ADMIN"})
    @DisplayName("GET /api/admin/curriculum/courses - Admin role should return courses list")
    void testGetAdminCoursesSuccess() throws Exception {
        CourseSummaryDto course = new CourseSummaryDto();
        course.setId(1L);
        course.setTitle("System Design Track");
        course.setSlug("system-design");
        course.setStatus(PublishStatus.DRAFT);

        PagedResponseDto<CourseSummaryDto> paged = new PagedResponseDto<>(List.of(course), 0, 10, 1L, 1, true);
        when(curriculumService.getAllAdminCourses(any(), any(), any(), any())).thenReturn(paged);

        mockMvc.perform(get("/api/admin/curriculum/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].slug").value("system-design"))
                .andExpect(jsonPath("$.data.content[0].status").value("DRAFT"));
    }

    @Test
    @WithMockUser(username = "admin@codeorbit.dev", roles = {"ADMIN"})
    @DisplayName("POST /api/admin/curriculum/courses - Admin creates new course")
    void testCreateCourseSuccess() throws Exception {
        AdminCourseRequestDto request = new AdminCourseRequestDto();
        request.setTitle("Operating Systems Masterclass");
        request.setSlug("operating-systems");
        request.setDescription("Processes, Threads, Deadlocks, Memory Management, and File Systems.");
        request.setTrack("OS");
        request.setDifficultyLevel("INTERMEDIATE");
        request.setEstimatedHours(25);
        request.setStatus(PublishStatus.DRAFT);

        AdminCourseDetailDto created = new AdminCourseDetailDto();
        created.setId(10L);
        created.setTitle("Operating Systems Masterclass");
        created.setSlug("operating-systems");
        created.setStatus(PublishStatus.DRAFT);

        when(curriculumService.createCourse(any(AdminCourseRequestDto.class))).thenReturn(created);

        mockMvc.perform(post("/api/admin/curriculum/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(10))
                .andExpect(jsonPath("$.data.slug").value("operating-systems"));
    }

    @Test
    @WithMockUser(username = "admin@codeorbit.dev", roles = {"ADMIN"})
    @DisplayName("PATCH /api/admin/curriculum/courses/{id}/status - Admin updates publish status")
    void testUpdateCourseStatusSuccess() throws Exception {
        AdminCourseDetailDto updated = new AdminCourseDetailDto();
        updated.setId(10L);
        updated.setStatus(PublishStatus.PUBLISHED);

        when(curriculumService.updateCourseStatus(eq(10L), eq(PublishStatus.PUBLISHED))).thenReturn(updated);

        mockMvc.perform(patch("/api/admin/curriculum/courses/10/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "PUBLISHED"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PUBLISHED"));
    }
}
