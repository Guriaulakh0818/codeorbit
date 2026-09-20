package com.codeorbit.repository;

import com.codeorbit.entity.UserLessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgress, Long> {

    Optional<UserLessonProgress> findByUserIdAndLessonId(Long userId, Long lessonId);

    List<UserLessonProgress> findByUserId(Long userId);

    @Query("SELECT p FROM UserLessonProgress p WHERE p.user.id = :userId AND p.lesson.module.course.id = :courseId")
    List<UserLessonProgress> findByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") Long courseId);

    @Query("SELECT COUNT(p) FROM UserLessonProgress p WHERE p.user.id = :userId AND p.lesson.module.course.id = :courseId AND p.status = 'COMPLETED' AND p.lesson.status = 'PUBLISHED'")
    long countCompletedPublishedLessons(@Param("userId") Long userId, @Param("courseId") Long courseId);

    @Query("SELECT p.lesson.id FROM UserLessonProgress p WHERE p.user.id = :userId AND p.lesson.module.course.id = :courseId AND p.status = 'COMPLETED'")
    List<Long> findCompletedLessonIdsByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") Long courseId);
}
