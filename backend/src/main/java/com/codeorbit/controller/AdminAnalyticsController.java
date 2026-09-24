package com.codeorbit.controller;

import com.codeorbit.dto.AdminAnalyticsDto;
import com.codeorbit.dto.ApiResponse;
import com.codeorbit.service.AdminAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER', 'SUPPORT')")
public class AdminAnalyticsController {

    private final AdminAnalyticsService analyticsService;

    public AdminAnalyticsController(AdminAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/kpis")
    public ResponseEntity<ApiResponse<AdminAnalyticsDto.KpisDto>> getKpis() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getKpis()));
    }

    @GetMapping("/trends")
    public ResponseEntity<ApiResponse<List<AdminAnalyticsDto.TrendDataPointDto>>> getTrends(
            @RequestParam(defaultValue = "30D") String period
    ) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getTrends(period)));
    }

    @GetMapping("/course-performance")
    public ResponseEntity<ApiResponse<List<AdminAnalyticsDto.CoursePerformanceDto>>> getCoursePerformance() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getCoursePerformance()));
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<ApiResponse<List<AdminAnalyticsDto.RecentActivityDto>>> getRecentActivity() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getRecentActivity()));
    }
}
