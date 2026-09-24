package com.codeorbit.service;

import com.codeorbit.dto.AdminAnalyticsDto;
import java.util.List;

public interface AdminAnalyticsService {
    AdminAnalyticsDto.KpisDto getKpis();
    List<AdminAnalyticsDto.TrendDataPointDto> getTrends(String period);
    List<AdminAnalyticsDto.CoursePerformanceDto> getCoursePerformance();
    List<AdminAnalyticsDto.RecentActivityDto> getRecentActivity();
}
