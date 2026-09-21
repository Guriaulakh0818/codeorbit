package com.codeorbit.service.impl;

import com.codeorbit.dto.*;
import com.codeorbit.entity.*;
import com.codeorbit.exception.BadRequestException;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.*;
import com.codeorbit.service.AdminCurriculumService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminCurriculumServiceImpl implements AdminCurriculumService {

    private final CourseRepository courseRepository;
    private final CourseModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final QuizQuestionRepository questionRepository;
    private final ObjectMapper objectMapper;

    public AdminCurriculumServiceImpl(CourseRepository courseRepository,
                                      CourseModuleRepository moduleRepository,
                                      LessonRepository lessonRepository,
                                      QuizRepository quizRepository,
                                      QuizQuestionRepository questionRepository,
                                      ObjectMapper objectMapper) {
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
        this.lessonRepository = lessonRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.objectMapper = objectMapper;
    }

    // ==========================================
    // COURSES
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public PagedResponseDto<CourseSummaryDto> getAllAdminCourses(String search, String track, PublishStatus status, Pageable pageable) {
        Page<Course> coursePage = courseRepository.findAll((root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("slug")), pattern)
                ));
            }
            if (track != null && !track.trim().isEmpty() && !"ALL".equalsIgnoreCase(track)) {
                predicates.add(cb.equal(cb.lower(root.get("track")), track.trim().toLowerCase()));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        }, pageable);

        List<CourseSummaryDto> content = coursePage.getContent().stream()
                .map(this::mapCourseToSummaryDto)
                .collect(Collectors.toList());

        return new PagedResponseDto<>(
                content,
                coursePage.getNumber(),
                coursePage.getSize(),
                coursePage.getTotalElements(),
                coursePage.getTotalPages(),
                coursePage.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public AdminCourseDetailDto getAdminCourseById(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        return mapCourseToAdminDetailDto(course);
    }

    @Override
    public AdminCourseDetailDto createCourse(AdminCourseRequestDto request) {
        String slug = request.getSlug().trim().toLowerCase();
        if (courseRepository.existsBySlug(slug)) {
            throw new BadRequestException("Course with slug '" + slug + "' already exists");
        }

        Course course = new Course();
        course.setTitle(request.getTitle().trim());
        course.setSlug(slug);
        course.setDescription(request.getDescription().trim());
        course.setShortDescription(request.getShortDescription() != null ? request.getShortDescription().trim() : null);
        course.setTrack(request.getTrack() != null ? request.getTrack().trim() : "DSA");
        course.setDifficultyLevel(request.getDifficultyLevel() != null ? request.getDifficultyLevel().trim() : "BEGINNER");
        course.setCoverImageUrl(request.getCoverImageUrl());
        course.setEstimatedHours(request.getEstimatedHours());
        course.setOrderIndex(request.getOrderIndex());
        course.setStatus(request.getStatus() != null ? request.getStatus() : PublishStatus.DRAFT);

        course = courseRepository.save(course);
        return mapCourseToAdminDetailDto(course);
    }

    @Override
    public AdminCourseDetailDto updateCourse(Long courseId, AdminCourseRequestDto request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        String slug = request.getSlug().trim().toLowerCase();
        if (!course.getSlug().equalsIgnoreCase(slug) && courseRepository.existsBySlug(slug)) {
            throw new BadRequestException("Course with slug '" + slug + "' already exists");
        }

        course.setTitle(request.getTitle().trim());
        course.setSlug(slug);
        course.setDescription(request.getDescription().trim());
        course.setShortDescription(request.getShortDescription() != null ? request.getShortDescription().trim() : null);
        course.setTrack(request.getTrack() != null ? request.getTrack().trim() : "DSA");
        course.setDifficultyLevel(request.getDifficultyLevel() != null ? request.getDifficultyLevel().trim() : "BEGINNER");
        course.setCoverImageUrl(request.getCoverImageUrl());
        course.setEstimatedHours(request.getEstimatedHours());
        course.setOrderIndex(request.getOrderIndex());
        if (request.getStatus() != null) {
            course.setStatus(request.getStatus());
        }

        course = courseRepository.save(course);
        return mapCourseToAdminDetailDto(course);
    }

    @Override
    public AdminCourseDetailDto updateCourseStatus(Long courseId, PublishStatus status) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        course.setStatus(status);
        course = courseRepository.save(course);
        return mapCourseToAdminDetailDto(course);
    }

    @Override
    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        courseRepository.delete(course);
    }

    // ==========================================
    // MODULES
    // ==========================================

    @Override
    public AdminModuleDetailDto createModule(Long courseId, AdminModuleRequestDto request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        String slug = request.getSlug().trim().toLowerCase();
        if (moduleRepository.existsByCourseIdAndSlug(courseId, slug)) {
            throw new BadRequestException("Module with slug '" + slug + "' already exists in this course");
        }

        CourseModule module = new CourseModule();
        module.setCourse(course);
        module.setTitle(request.getTitle().trim());
        module.setSlug(slug);
        module.setDescription(request.getDescription());
        module.setOrderIndex(request.getOrderIndex());
        if (request.getCurriculumLevel() != null && !request.getCurriculumLevel().isBlank()) {
            try {
                module.setCurriculumLevel(CurriculumLevel.valueOf(request.getCurriculumLevel().trim().toUpperCase()));
            } catch (Exception ignored) {
                module.setCurriculumLevel(CurriculumLevel.BEGINNER);
            }
        }
        module.setStatus(request.getStatus() != null ? request.getStatus() : PublishStatus.DRAFT);

        module = moduleRepository.save(module);
        return mapModuleToDetailDto(module);
    }

    @Override
    public AdminModuleDetailDto updateModule(Long moduleId, AdminModuleRequestDto request) {
        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + moduleId));

        String slug = request.getSlug().trim().toLowerCase();
        if (!module.getSlug().equalsIgnoreCase(slug) && moduleRepository.existsByCourseIdAndSlug(module.getCourse().getId(), slug)) {
            throw new BadRequestException("Module with slug '" + slug + "' already exists in this course");
        }

        module.setTitle(request.getTitle().trim());
        module.setSlug(slug);
        module.setDescription(request.getDescription());
        module.setOrderIndex(request.getOrderIndex());
        if (request.getCurriculumLevel() != null && !request.getCurriculumLevel().isBlank()) {
            try {
                module.setCurriculumLevel(CurriculumLevel.valueOf(request.getCurriculumLevel().trim().toUpperCase()));
            } catch (Exception ignored) {}
        }
        if (request.getStatus() != null) {
            module.setStatus(request.getStatus());
        }

        module = moduleRepository.save(module);
        return mapModuleToDetailDto(module);
    }

    @Override
    public AdminModuleDetailDto updateModuleStatus(Long moduleId, PublishStatus status) {
        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + moduleId));
        module.setStatus(status);
        module = moduleRepository.save(module);
        return mapModuleToDetailDto(module);
    }

    @Override
    public void deleteModule(Long moduleId) {
        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + moduleId));
        moduleRepository.delete(module);
    }

    // ==========================================
    // LESSONS
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public AdminLessonDetailDto getLessonById(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));
        return mapLessonToDetailDto(lesson);
    }

    @Override
    public AdminLessonDetailDto createLesson(Long moduleId, AdminLessonRequestDto request) {
        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + moduleId));

        String slug = request.getSlug().trim().toLowerCase();
        if (lessonRepository.existsByModuleIdAndSlug(moduleId, slug)) {
            throw new BadRequestException("Lesson with slug '" + slug + "' already exists in this module");
        }

        Lesson lesson = new Lesson();
        lesson.setModule(module);
        lesson.setTitle(request.getTitle().trim());
        lesson.setSlug(slug);
        lesson.setEstimatedMinutes(request.getEstimatedMinutes());
        lesson.setOrderIndex(request.getOrderIndex());
        lesson.setStatus(request.getStatus() != null ? request.getStatus() : PublishStatus.DRAFT);
        lesson.setContentEn(request.getContentEn());
        lesson.setContentHinglish(request.getContentHinglish());
        lesson.setHinglishStatus(request.getHinglishStatus() != null ? request.getHinglishStatus() : HinglishStatus.MISSING);
        lesson.setCodeSnippetJava(request.getCodeSnippetJava());
        lesson.setCodeSnippetCpp(request.getCodeSnippetCpp());
        lesson.setCodeSnippetPython(request.getCodeSnippetPython());

        lesson = lessonRepository.save(lesson);
        return mapLessonToDetailDto(lesson);
    }

    @Override
    public AdminLessonDetailDto updateLesson(Long lessonId, AdminLessonRequestDto request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        String slug = request.getSlug().trim().toLowerCase();
        if (!lesson.getSlug().equalsIgnoreCase(slug) && lessonRepository.existsByModuleIdAndSlug(lesson.getModule().getId(), slug)) {
            throw new BadRequestException("Lesson with slug '" + slug + "' already exists in this module");
        }

        lesson.setTitle(request.getTitle().trim());
        lesson.setSlug(slug);
        lesson.setEstimatedMinutes(request.getEstimatedMinutes());
        lesson.setOrderIndex(request.getOrderIndex());
        if (request.getStatus() != null) {
            lesson.setStatus(request.getStatus());
        }
        lesson.setContentEn(request.getContentEn());
        lesson.setContentHinglish(request.getContentHinglish());
        if (request.getHinglishStatus() != null) {
            lesson.setHinglishStatus(request.getHinglishStatus());
        }
        lesson.setCodeSnippetJava(request.getCodeSnippetJava());
        lesson.setCodeSnippetCpp(request.getCodeSnippetCpp());
        lesson.setCodeSnippetPython(request.getCodeSnippetPython());

        lesson = lessonRepository.save(lesson);
        return mapLessonToDetailDto(lesson);
    }

    @Override
    public AdminLessonDetailDto updateLessonStatus(Long lessonId, PublishStatus status) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));
        lesson.setStatus(status);
        lesson = lessonRepository.save(lesson);
        return mapLessonToDetailDto(lesson);
    }

    @Override
    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));
        lessonRepository.delete(lesson);
    }

    // ==========================================
    // QUIZZES & QUESTIONS
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public AdminQuizDetailDto getQuizById(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));
        return mapQuizToDetailDto(quiz);
    }

    @Override
    public AdminQuizDetailDto createQuiz(Long moduleId, AdminQuizRequestDto request) {
        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + moduleId));

        String slug = request.getSlug().trim().toLowerCase();
        if (quizRepository.existsByModuleIdAndSlug(moduleId, slug)) {
            throw new BadRequestException("Quiz with slug '" + slug + "' already exists in this module");
        }

        Quiz quiz = new Quiz();
        quiz.setModule(module);
        quiz.setTitle(request.getTitle().trim());
        quiz.setSlug(slug);
        quiz.setDescription(request.getDescription());
        quiz.setMinPassScorePercentage(request.getMinPassScorePercentage());
        quiz.setMaxAttempts(request.getMaxAttempts());
        if (request.getQuizType() != null && !request.getQuizType().isBlank()) {
            try {
                quiz.setQuizType(QuizType.valueOf(request.getQuizType().trim().toUpperCase()));
            } catch (Exception ignored) {
                quiz.setQuizType(QuizType.MODULE_QUIZ);
            }
        }
        if (request.getCurriculumLevel() != null && !request.getCurriculumLevel().isBlank()) {
            try {
                quiz.setCurriculumLevel(CurriculumLevel.valueOf(request.getCurriculumLevel().trim().toUpperCase()));
            } catch (Exception ignored) {}
        }
        quiz.setStatus(request.getStatus() != null ? request.getStatus() : PublishStatus.DRAFT);

        quiz = quizRepository.save(quiz);
        return mapQuizToDetailDto(quiz);
    }

    @Override
    public AdminQuizDetailDto updateQuiz(Long quizId, AdminQuizRequestDto request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        String slug = request.getSlug().trim().toLowerCase();
        if (!quiz.getSlug().equalsIgnoreCase(slug) && quizRepository.existsByModuleIdAndSlug(quiz.getModule().getId(), slug)) {
            throw new BadRequestException("Quiz with slug '" + slug + "' already exists in this module");
        }

        quiz.setTitle(request.getTitle().trim());
        quiz.setSlug(slug);
        quiz.setDescription(request.getDescription());
        quiz.setMinPassScorePercentage(request.getMinPassScorePercentage());
        quiz.setMaxAttempts(request.getMaxAttempts());
        if (request.getQuizType() != null && !request.getQuizType().isBlank()) {
            try {
                quiz.setQuizType(QuizType.valueOf(request.getQuizType().trim().toUpperCase()));
            } catch (Exception ignored) {}
        }
        if (request.getCurriculumLevel() != null && !request.getCurriculumLevel().isBlank()) {
            try {
                quiz.setCurriculumLevel(CurriculumLevel.valueOf(request.getCurriculumLevel().trim().toUpperCase()));
            } catch (Exception ignored) {}
        }
        if (request.getStatus() != null) {
            quiz.setStatus(request.getStatus());
        }

        quiz = quizRepository.save(quiz);
        return mapQuizToDetailDto(quiz);
    }

    @Override
    public AdminQuizDetailDto updateQuizStatus(Long quizId, PublishStatus status) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));
        quiz.setStatus(status);
        quiz = quizRepository.save(quiz);
        return mapQuizToDetailDto(quiz);
    }

    @Override
    public void deleteQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));
        quizRepository.delete(quiz);
    }

    @Override
    public AdminQuestionDetailDto addQuestion(Long quizId, AdminQuizQuestionRequestDto request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        validateQuestionRequest(request);

        QuizQuestion question = new QuizQuestion();
        question.setQuiz(quiz);
        question.setPromptEn(request.getPromptEn().trim());
        question.setPromptHinglish(request.getPromptHinglish() != null ? request.getPromptHinglish().trim() : null);
        question.setCodeContext(request.getCodeContext());
        question.setOptionsJson(serializeOptions(request.getOptions()));
        question.setCorrectOptionId(request.getCorrectOptionId().trim());
        question.setExplanationEn(request.getExplanationEn().trim());
        question.setExplanationHinglish(request.getExplanationHinglish() != null ? request.getExplanationHinglish().trim() : null);
        question.setOrderIndex(request.getOrderIndex());

        question = questionRepository.save(question);
        return mapQuestionToDetailDto(question);
    }

    @Override
    public AdminQuestionDetailDto updateQuestion(Long questionId, AdminQuizQuestionRequestDto request) {
        QuizQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));

        validateQuestionRequest(request);

        question.setPromptEn(request.getPromptEn().trim());
        question.setPromptHinglish(request.getPromptHinglish() != null ? request.getPromptHinglish().trim() : null);
        question.setCodeContext(request.getCodeContext());
        question.setOptionsJson(serializeOptions(request.getOptions()));
        question.setCorrectOptionId(request.getCorrectOptionId().trim());
        question.setExplanationEn(request.getExplanationEn().trim());
        question.setExplanationHinglish(request.getExplanationHinglish() != null ? request.getExplanationHinglish().trim() : null);
        question.setOrderIndex(request.getOrderIndex());

        question = questionRepository.save(question);
        return mapQuestionToDetailDto(question);
    }

    @Override
    public void deleteQuestion(Long questionId) {
        QuizQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));
        questionRepository.delete(question);
    }

    // ==========================================
    // HELPER MAPPERS & VALIDATORS
    // ==========================================

    private void validateQuestionRequest(AdminQuizQuestionRequestDto request) {
        if (request.getOptions() == null || request.getOptions().size() < 2) {
            throw new BadRequestException("At least 2 options are required for each question");
        }
        boolean hasCorrect = request.getOptions().stream()
                .anyMatch(o -> o.getId() != null && o.getId().equals(request.getCorrectOptionId()));
        if (!hasCorrect) {
            throw new BadRequestException("Correct option ID '" + request.getCorrectOptionId() + "' does not match any provided options");
        }
    }

    private String serializeOptions(List<QuizQuestionOptionDto> options) {
        try {
            List<Map<String, String>> list = options.stream().map(o -> {
                Map<String, String> map = new HashMap<>();
                map.put("id", o.getId());
                map.put("text_en", o.getText());
                map.put("text_hinglish", o.getText());
                return map;
            }).collect(Collectors.toList());
            return objectMapper.writeValueAsString(list);
        } catch (Exception e) {
            throw new BadRequestException("Failed to serialize question options to JSON");
        }
    }

    private CourseSummaryDto mapCourseToSummaryDto(Course c) {
        CourseSummaryDto dto = new CourseSummaryDto();
        dto.setId(c.getId());
        dto.setTitle(c.getTitle());
        dto.setSlug(c.getSlug());
        dto.setDescription(c.getDescription());
        dto.setShortDescription(c.getShortDescription());
        dto.setTrack(c.getTrack());
        dto.setDifficultyLevel(c.getDifficultyLevel());
        dto.setCoverImageUrl(c.getCoverImageUrl());
        dto.setEstimatedHours(c.getEstimatedHours());
        dto.setStatus(c.getStatus());
        dto.setModuleCount(c.getModules() != null ? c.getModules().size() : 0);
        return dto;
    }

    private AdminCourseDetailDto mapCourseToAdminDetailDto(Course c) {
        AdminCourseDetailDto dto = new AdminCourseDetailDto();
        dto.setId(c.getId());
        dto.setTitle(c.getTitle());
        dto.setSlug(c.getSlug());
        dto.setDescription(c.getDescription());
        dto.setShortDescription(c.getShortDescription());
        dto.setTrack(c.getTrack());
        dto.setDifficultyLevel(c.getDifficultyLevel());
        dto.setCoverImageUrl(c.getCoverImageUrl());
        dto.setEstimatedHours(c.getEstimatedHours());
        dto.setOrderIndex(c.getOrderIndex());
        dto.setStatus(c.getStatus());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());

        List<AdminModuleDetailDto> moduleDtos = (c.getModules() != null ? c.getModules() : Collections.<CourseModule>emptyList())
                .stream()
                .map(this::mapModuleToDetailDto)
                .collect(Collectors.toList());
        dto.setModules(moduleDtos);

        return dto;
    }

    private AdminModuleDetailDto mapModuleToDetailDto(CourseModule m) {
        AdminModuleDetailDto dto = new AdminModuleDetailDto();
        dto.setId(m.getId());
        dto.setCourseId(m.getCourse().getId());
        dto.setTitle(m.getTitle());
        dto.setSlug(m.getSlug());
        dto.setDescription(m.getDescription());
        dto.setOrderIndex(m.getOrderIndex());
        dto.setCurriculumLevel(m.getCurriculumLevel() != null ? m.getCurriculumLevel().name() : "BEGINNER");
        dto.setStatus(m.getStatus());

        List<LessonSummaryDto> lessonDtos = (m.getLessons() != null ? m.getLessons() : Collections.<Lesson>emptyList())
                .stream()
                .map(l -> {
                    LessonSummaryDto lDto = new LessonSummaryDto();
                    lDto.setId(l.getId());
                    lDto.setModuleId(m.getId());
                    lDto.setTitle(l.getTitle());
                    lDto.setSlug(l.getSlug());
                    lDto.setEstimatedMinutes(l.getEstimatedMinutes());
                    lDto.setOrderIndex(l.getOrderIndex());
                    lDto.setStatus(l.getStatus());
                    lDto.setHinglishStatus(l.getHinglishStatus());
                    return lDto;
                }).collect(Collectors.toList());
        dto.setLessons(lessonDtos);

        List<QuizSummaryDto> quizDtos = (m.getQuizzes() != null ? m.getQuizzes() : Collections.<Quiz>emptyList())
                .stream()
                .map(q -> {
                    QuizSummaryDto qDto = new QuizSummaryDto();
                    qDto.setId(q.getId());
                    qDto.setModuleId(m.getId());
                    qDto.setTitle(q.getTitle());
                    qDto.setSlug(q.getSlug());
                    qDto.setMinPassScorePercentage(q.getMinPassScorePercentage());
                    qDto.setMaxAttempts(q.getMaxAttempts());
                    qDto.setQuizType(q.getQuizType() != null ? q.getQuizType().name() : "MODULE_QUIZ");
                    qDto.setCurriculumLevel(q.getCurriculumLevel() != null ? q.getCurriculumLevel().name() : (m.getCurriculumLevel() != null ? m.getCurriculumLevel().name() : "BEGINNER"));
                    qDto.setStatus(q.getStatus());
                    qDto.setQuestionCount(q.getQuestions() != null ? q.getQuestions().size() : 0);
                    return qDto;
                }).collect(Collectors.toList());
        dto.setQuizzes(quizDtos);

        return dto;
    }

    private AdminLessonDetailDto mapLessonToDetailDto(Lesson l) {
        AdminLessonDetailDto dto = new AdminLessonDetailDto();
        dto.setId(l.getId());
        dto.setModuleId(l.getModule().getId());
        dto.setTitle(l.getTitle());
        dto.setSlug(l.getSlug());
        dto.setEstimatedMinutes(l.getEstimatedMinutes());
        dto.setOrderIndex(l.getOrderIndex());
        dto.setStatus(l.getStatus());
        dto.setContentEn(l.getContentEn());
        dto.setContentHinglish(l.getContentHinglish());
        dto.setHinglishStatus(l.getHinglishStatus());
        dto.setCodeSnippetJava(l.getCodeSnippetJava());
        dto.setCodeSnippetCpp(l.getCodeSnippetCpp());
        dto.setCodeSnippetPython(l.getCodeSnippetPython());
        dto.setCreatedAt(l.getCreatedAt());
        dto.setUpdatedAt(l.getUpdatedAt());
        return dto;
    }

    private AdminQuizDetailDto mapQuizToDetailDto(Quiz q) {
        AdminQuizDetailDto dto = new AdminQuizDetailDto();
        dto.setId(q.getId());
        dto.setModuleId(q.getModule().getId());
        dto.setTitle(q.getTitle());
        dto.setSlug(q.getSlug());
        dto.setDescription(q.getDescription());
        dto.setMinPassScorePercentage(q.getMinPassScorePercentage());
        dto.setMaxAttempts(q.getMaxAttempts());
        dto.setQuizType(q.getQuizType() != null ? q.getQuizType().name() : "MODULE_QUIZ");
        dto.setCurriculumLevel(q.getCurriculumLevel() != null ? q.getCurriculumLevel().name() : (q.getModule().getCurriculumLevel() != null ? q.getModule().getCurriculumLevel().name() : "BEGINNER"));
        dto.setStatus(q.getStatus());
        dto.setCreatedAt(q.getCreatedAt());
        dto.setUpdatedAt(q.getUpdatedAt());

        List<AdminQuestionDetailDto> qDtos = (q.getQuestions() != null ? q.getQuestions() : Collections.<QuizQuestion>emptyList())
                .stream()
                .map(this::mapQuestionToDetailDto)
                .collect(Collectors.toList());
        dto.setQuestions(qDtos);

        return dto;
    }

    private AdminQuestionDetailDto mapQuestionToDetailDto(QuizQuestion qq) {
        AdminQuestionDetailDto dto = new AdminQuestionDetailDto();
        dto.setId(qq.getId());
        dto.setQuizId(qq.getQuiz().getId());
        dto.setPromptEn(qq.getPromptEn());
        dto.setPromptHinglish(qq.getPromptHinglish());
        dto.setCodeContext(qq.getCodeContext());
        dto.setCorrectOptionId(qq.getCorrectOptionId());
        dto.setExplanationEn(qq.getExplanationEn());
        dto.setExplanationHinglish(qq.getExplanationHinglish());
        dto.setOrderIndex(qq.getOrderIndex());

        try {
            List<Map<String, String>> parsed = objectMapper.readValue(qq.getOptionsJson(), new TypeReference<List<Map<String, String>>>() {});
            List<QuizQuestionOptionDto> options = parsed.stream()
                    .map(o -> new QuizQuestionOptionDto(o.get("id"), o.get("text_en")))
                    .collect(Collectors.toList());
            dto.setOptions(options);
        } catch (Exception e) {
            dto.setOptions(Collections.emptyList());
        }

        return dto;
    }
}
