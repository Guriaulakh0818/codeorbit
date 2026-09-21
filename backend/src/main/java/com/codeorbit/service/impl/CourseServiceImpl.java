package com.codeorbit.service.impl;

import com.codeorbit.dto.*;
import com.codeorbit.entity.*;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.*;
import com.codeorbit.service.CourseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseModuleRepository courseModuleRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;

    public CourseServiceImpl(CourseRepository courseRepository,
                             CourseModuleRepository courseModuleRepository,
                             LessonRepository lessonRepository,
                             QuizRepository quizRepository,
                             QuizQuestionRepository quizQuestionRepository) {
        this.courseRepository = courseRepository;
        this.courseModuleRepository = courseModuleRepository;
        this.lessonRepository = lessonRepository;
        this.quizRepository = quizRepository;
        this.quizQuestionRepository = quizQuestionRepository;
    }

    @Override
    public PagedResponseDto<CourseSummaryDto> getPublishedCourses(String track, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderIndex").ascending());
        Page<Course> coursePage = courseRepository.findCoursesByFilter(
                PublishStatus.PUBLISHED,
                (track != null && !track.isBlank()) ? track : null,
                (search != null && !search.isBlank()) ? search : null,
                pageable
        );

        List<CourseSummaryDto> dtos = coursePage.getContent().stream()
                .map(this::mapToCourseSummaryDto)
                .collect(Collectors.toList());

        return new PagedResponseDto<>(
                dtos,
                coursePage.getNumber(),
                coursePage.getSize(),
                coursePage.getTotalElements(),
                coursePage.getTotalPages(),
                coursePage.isLast()
        );
    }

    @Override
    public List<CourseSummaryDto> getAllPublishedCoursesList() {
        return courseRepository.findByStatusOrderByOrderIndexAsc(PublishStatus.PUBLISHED).stream()
                .map(this::mapToCourseSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDetailDto getCourseDetailBySlug(String courseSlug) {
        Course course = courseRepository.findBySlugAndStatus(courseSlug, PublishStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with slug: " + courseSlug));

        CourseDetailDto dto = new CourseDetailDto();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setSlug(course.getSlug());
        dto.setDescription(course.getDescription());
        dto.setShortDescription(course.getShortDescription());
        dto.setTrack(course.getTrack());
        dto.setDifficultyLevel(course.getDifficultyLevel());
        dto.setCoverImageUrl(course.getCoverImageUrl());
        dto.setEstimatedHours(course.getEstimatedHours());

        List<CourseModule> publishedModules = courseModuleRepository
                .findByCourseIdAndStatusOrderByOrderIndexAsc(course.getId(), PublishStatus.PUBLISHED);

        List<CourseModuleDto> moduleDtos = new ArrayList<>();
        for (CourseModule module : publishedModules) {
            CourseModuleDto modDto = new CourseModuleDto();
            modDto.setId(module.getId());
            modDto.setTitle(module.getTitle());
            modDto.setSlug(module.getSlug());
            modDto.setDescription(module.getDescription());
            modDto.setOrderIndex(module.getOrderIndex());
            modDto.setCurriculumLevel(module.getCurriculumLevel() != null ? module.getCurriculumLevel().name() : "BEGINNER");

            // Published Lessons
            List<Lesson> lessons = lessonRepository
                    .findByModuleIdAndStatusOrderByOrderIndexAsc(module.getId(), PublishStatus.PUBLISHED);
            List<LessonSummaryDto> lessonDtos = lessons.stream()
                    .map(l -> new LessonSummaryDto(
                            l.getId(),
                            l.getTitle(),
                            l.getSlug(),
                            l.getEstimatedMinutes(),
                            l.getOrderIndex(),
                            l.getHinglishStatus() == HinglishStatus.PUBLISHED
                    ))
                    .collect(Collectors.toList());
            modDto.setLessons(lessonDtos);

            // Published Quizzes
            List<Quiz> quizzes = quizRepository.findByModuleIdAndStatus(module.getId(), PublishStatus.PUBLISHED);
            List<QuizSummaryDto> quizDtos = quizzes.stream()
                    .map(q -> {
                        QuizSummaryDto qDto = new QuizSummaryDto(
                                q.getId(),
                                q.getTitle(),
                                q.getSlug(),
                                q.getMinPassScorePercentage(),
                                q.getMaxAttempts(),
                                (int) quizQuestionRepository.countByQuizId(q.getId())
                        );
                        qDto.setModuleId(module.getId());
                        qDto.setStatus(q.getStatus());
                        qDto.setQuizType(q.getQuizType() != null ? q.getQuizType().name() : "MODULE_QUIZ");
                        qDto.setCurriculumLevel(q.getCurriculumLevel() != null ? q.getCurriculumLevel().name() : (module.getCurriculumLevel() != null ? module.getCurriculumLevel().name() : "BEGINNER"));
                        return qDto;
                    })
                    .collect(Collectors.toList());
            modDto.setQuizzes(quizDtos);

            moduleDtos.add(modDto);
        }

        dto.setModules(moduleDtos);
        return dto;
    }

    @Override
    public LessonPublicDto getLessonByCourseAndSlug(String courseSlug, String lessonSlug, String requestedLanguage) {
        Lesson lesson = lessonRepository.findByCourseSlugAndLessonSlugAndStatus(courseSlug, lessonSlug, PublishStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found: " + lessonSlug + " in course: " + courseSlug));

        LessonPublicDto dto = new LessonPublicDto();
        dto.setId(lesson.getId());
        dto.setModuleId(lesson.getModule().getId());
        dto.setModuleTitle(lesson.getModule().getTitle());
        dto.setCourseSlug(lesson.getModule().getCourse().getSlug());
        dto.setCourseTitle(lesson.getModule().getCourse().getTitle());
        dto.setTitle(lesson.getTitle());
        dto.setSlug(lesson.getSlug());
        dto.setEstimatedMinutes(lesson.getEstimatedMinutes());
        dto.setOrderIndex(lesson.getOrderIndex());
        dto.setCodeSnippetJava(lesson.getCodeSnippetJava());
        dto.setCodeSnippetCpp(lesson.getCodeSnippetCpp());
        dto.setCodeSnippetPython(lesson.getCodeSnippetPython());
        dto.setCodeSnippetJs(lesson.getCodeSnippetJs());
        dto.setHinglishStatus(lesson.getHinglishStatus().name());

        // Language resolution & fallback logic
        boolean isHinglishRequested = "hinglish".equalsIgnoreCase(requestedLanguage);
        boolean isHinglishPublished = lesson.getHinglishStatus() == HinglishStatus.PUBLISHED
                && lesson.getContentHinglish() != null
                && !lesson.getContentHinglish().isBlank();

        if (isHinglishRequested && isHinglishPublished) {
            dto.setContent(lesson.getContentHinglish());
            dto.setActiveLanguageServed("hinglish");
            dto.setFallback(false);
        } else {
            dto.setContent(lesson.getContentEn());
            dto.setActiveLanguageServed("en");
            dto.setFallback(isHinglishRequested && !isHinglishPublished);
        }

        // Navigation resolution (previous & next lesson slugs)
        List<Lesson> allCourseLessons = lessonRepository.findPublishedLessonsByCourseId(lesson.getModule().getCourse().getId());
        int currentIndex = -1;
        for (int i = 0; i < allCourseLessons.size(); i++) {
            if (allCourseLessons.get(i).getId().equals(lesson.getId())) {
                currentIndex = i;
                break;
            }
        }
        if (currentIndex > 0) {
            dto.setPreviousLessonSlug(allCourseLessons.get(currentIndex - 1).getSlug());
        }
        if (currentIndex >= 0 && currentIndex < allCourseLessons.size() - 1) {
            dto.setNextLessonSlug(allCourseLessons.get(currentIndex + 1).getSlug());
        }

        return dto;
    }

    private CourseSummaryDto mapToCourseSummaryDto(Course course) {
        CourseSummaryDto dto = new CourseSummaryDto();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setSlug(course.getSlug());
        dto.setDescription(course.getDescription());
        dto.setShortDescription(course.getShortDescription());
        dto.setTrack(course.getTrack());
        dto.setDifficultyLevel(course.getDifficultyLevel());
        dto.setCoverImageUrl(course.getCoverImageUrl());
        dto.setEstimatedHours(course.getEstimatedHours());

        List<CourseModule> modules = courseModuleRepository.findByCourseIdAndStatusOrderByOrderIndexAsc(course.getId(), PublishStatus.PUBLISHED);
        dto.setModuleCount(modules.size());

        long lessonCount = lessonRepository.countPublishedLessonsByCourseId(course.getId());
        dto.setLessonCount((int) lessonCount);

        // Check if any lesson has published Hinglish
        List<Lesson> lessons = lessonRepository.findPublishedLessonsByCourseId(course.getId());
        boolean hasHinglish = lessons.stream().anyMatch(l -> l.getHinglishStatus() == HinglishStatus.PUBLISHED);
        dto.setHasHinglish(hasHinglish);

        return dto;
    }
}
