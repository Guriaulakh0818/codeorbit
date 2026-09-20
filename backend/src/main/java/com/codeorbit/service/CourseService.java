package com.codeorbit.service;

import com.codeorbit.dto.CourseDetailDto;
import com.codeorbit.dto.CourseSummaryDto;
import com.codeorbit.dto.LessonPublicDto;
import com.codeorbit.dto.PagedResponseDto;

import java.util.List;

public interface CourseService {

    PagedResponseDto<CourseSummaryDto> getPublishedCourses(String track, String search, int page, int size);

    CourseDetailDto getCourseDetailBySlug(String courseSlug);

    LessonPublicDto getLessonByCourseAndSlug(String courseSlug, String lessonSlug, String language);

    List<CourseSummaryDto> getAllPublishedCoursesList();
}
