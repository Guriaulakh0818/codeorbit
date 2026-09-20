package com.codeorbit.repository;

import com.codeorbit.entity.Lesson;
import com.codeorbit.entity.PublishStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByModuleIdAndStatusOrderByOrderIndexAsc(Long moduleId, PublishStatus status);

    List<Lesson> findByModuleIdOrderByOrderIndexAsc(Long moduleId);

    Optional<Lesson> findByModuleIdAndSlug(Long moduleId, String slug);

    boolean existsByModuleIdAndSlug(Long moduleId, String slug);

    @Query("SELECT l FROM Lesson l WHERE l.module.course.slug = :courseSlug AND l.slug = :lessonSlug AND l.status = :status")
    Optional<Lesson> findByCourseSlugAndLessonSlugAndStatus(
            @Param("courseSlug") String courseSlug,
            @Param("lessonSlug") String lessonSlug,
            @Param("status") PublishStatus status
    );

    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.module.course.id = :courseId AND l.status = 'PUBLISHED'")
    long countPublishedLessonsByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT l FROM Lesson l WHERE l.module.course.id = :courseId AND l.status = 'PUBLISHED' ORDER BY l.module.orderIndex ASC, l.orderIndex ASC")
    List<Lesson> findPublishedLessonsByCourseId(@Param("courseId") Long courseId);
}
