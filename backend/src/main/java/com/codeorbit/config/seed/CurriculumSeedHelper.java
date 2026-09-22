package com.codeorbit.config.seed;

import com.codeorbit.entity.*;
import com.codeorbit.repository.*;
import org.springframework.stereotype.Component;

@Component
public class CurriculumSeedHelper {

    private final SubcourseRepository subcourseRepository;
    private final CourseModuleRepository courseModuleRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;

    public CurriculumSeedHelper(
            SubcourseRepository subcourseRepository,
            CourseModuleRepository courseModuleRepository,
            LessonRepository lessonRepository,
            QuizRepository quizRepository,
            QuizQuestionRepository quizQuestionRepository
    ) {
        this.subcourseRepository = subcourseRepository;
        this.courseModuleRepository = courseModuleRepository;
        this.lessonRepository = lessonRepository;
        this.quizRepository = quizRepository;
        this.quizQuestionRepository = quizQuestionRepository;
    }

    public Subcourse createSubcourse(Course course, CurriculumLevel level, String title, String slug, String desc, int priceInr, boolean isFree, int orderIndex) {
        Subcourse sc = new Subcourse(course, level, title, slug, desc, priceInr, isFree, orderIndex, PublishStatus.PUBLISHED);
        return subcourseRepository.save(sc);
    }

    public CourseModule createModule(Course course, Subcourse subcourse, CurriculumLevel level, String title, String slug, String desc, int orderIndex) {
        CourseModule module = new CourseModule(course, title, slug, desc, orderIndex, PublishStatus.PUBLISHED);
        module.setCurriculumLevel(level);
        module.setSubcourse(subcourse);
        return courseModuleRepository.save(module);
    }

    public Lesson createLesson(CourseModule module, String title, String slug, int estimatedMinutes, int orderIndex,
                               String contentEn, String contentHinglish, String javaSnippet, String cppSnippet, String pythonSnippet) {
        Lesson lesson = new Lesson(module, title, slug, estimatedMinutes, orderIndex, PublishStatus.PUBLISHED,
                contentEn, contentHinglish, HinglishStatus.PUBLISHED);
        lesson.setCodeSnippetJava(javaSnippet);
        lesson.setCodeSnippetCpp(cppSnippet);
        lesson.setCodeSnippetPython(pythonSnippet);
        return lessonRepository.save(lesson);
    }

    public Quiz createModuleQuiz(CourseModule module, Subcourse subcourse, CurriculumLevel level, String title, String slug, String desc, int minPassPercent) {
        Quiz quiz = new Quiz(module, title, slug, desc, minPassPercent, null, PublishStatus.PUBLISHED);
        quiz.setQuizType(QuizType.MODULE_QUIZ);
        quiz.setCurriculumLevel(level);
        quiz.setSubcourse(subcourse);
        return quizRepository.save(quiz);
    }

    public Quiz createFinalQuiz(CourseModule module, Subcourse subcourse, CurriculumLevel level, String title, String slug, String desc, int minPassPercent) {
        Quiz quiz = new Quiz(module, title, slug, desc, minPassPercent, null, PublishStatus.PUBLISHED);
        quiz.setQuizType(QuizType.LEVEL_FINAL_QUIZ);
        quiz.setCurriculumLevel(level);
        quiz.setSubcourse(subcourse);
        return quizRepository.save(quiz);
    }

    public QuizQuestion createQuestion(Quiz quiz, String promptEn, String promptHinglish, String codeContext,
                                       String optionsJson, String correctOptionId, String explanationEn, String explanationHinglish, int orderIndex) {
        QuizQuestion question = new QuizQuestion(quiz, promptEn, promptHinglish, codeContext, optionsJson, correctOptionId,
                explanationEn, explanationHinglish, orderIndex);
        return quizQuestionRepository.save(question);
    }

    public String buildOptionsJson(String optA, String optAHinglish,
                                   String optB, String optBHinglish,
                                   String optC, String optCHinglish,
                                   String optD, String optDHinglish) {
        return String.format(
                "[{\"id\":\"opt_a\",\"text_en\":\"%s\",\"text_hinglish\":\"%s\"}," +
                "{\"id\":\"opt_b\",\"text_en\":\"%s\",\"text_hinglish\":\"%s\"}," +
                "{\"id\":\"opt_c\",\"text_en\":\"%s\",\"text_hinglish\":\"%s\"}," +
                "{\"id\":\"opt_d\",\"text_en\":\"%s\",\"text_hinglish\":\"%s\"}]",
                escape(optA), escape(optAHinglish),
                escape(optB), escape(optBHinglish),
                escape(optC), escape(optCHinglish),
                escape(optD), escape(optDHinglish)
        );
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\"", "\\\"").replace("\n", " ");
    }
}
