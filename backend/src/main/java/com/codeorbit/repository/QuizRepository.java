package com.codeorbit.repository;

import com.codeorbit.entity.PublishStatus;
import com.codeorbit.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findByModuleIdAndStatus(Long moduleId, PublishStatus status);

    List<Quiz> findByModuleId(Long moduleId);

    Optional<Quiz> findByModuleIdAndSlug(Long moduleId, String slug);

    boolean existsByModuleIdAndSlug(Long moduleId, String slug);

    @Query("SELECT q FROM Quiz q WHERE q.module.course.slug = :courseSlug AND q.slug = :quizSlug AND q.status = :status")
    Optional<Quiz> findByCourseSlugAndQuizSlugAndStatus(
            @Param("courseSlug") String courseSlug,
            @Param("quizSlug") String quizSlug,
            @Param("status") PublishStatus status
    );

    @Query("SELECT q FROM Quiz q WHERE q.module.course.id = :courseId AND q.status = 'PUBLISHED'")
    List<Quiz> findPublishedQuizzesByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT COUNT(q) FROM Quiz q WHERE q.module.course.id = :courseId AND q.status = 'PUBLISHED'")
    long countPublishedQuizzesByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT COUNT(q) FROM Quiz q WHERE q.module.course.id = :courseId AND q.status = 'PUBLISHED' AND q.curriculumLevel IN (:levels)")
    long countPublishedQuizzesByCourseIdAndLevels(@Param("courseId") Long courseId, @Param("levels") java.util.Collection<com.codeorbit.entity.CurriculumLevel> levels);

    @Query("SELECT q FROM Quiz q WHERE q.module.course.id = :courseId AND q.quizType = :quizType AND q.curriculumLevel = :level AND q.status = 'PUBLISHED'")
    List<Quiz> findByCourseIdAndQuizTypeAndCurriculumLevel(
            @Param("courseId") Long courseId,
            @Param("quizType") com.codeorbit.entity.QuizType quizType,
            @Param("level") com.codeorbit.entity.CurriculumLevel level
    );

    @Query("SELECT q FROM Quiz q WHERE q.module.course.id = :courseId AND q.curriculumLevel = :level AND q.quizType = 'MODULE_QUIZ' AND q.status = 'PUBLISHED' ORDER BY q.module.orderIndex ASC")
    List<Quiz> findModuleQuizzesByCourseAndLevel(
            @Param("courseId") Long courseId,
            @Param("level") com.codeorbit.entity.CurriculumLevel level
    );
}
