package com.codeorbit.repository;

import com.codeorbit.entity.UserQuizTracker;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserQuizTrackerRepository extends JpaRepository<UserQuizTracker, Long> {

    Optional<UserQuizTracker> findByUserIdAndQuizId(Long userId, Long quizId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM UserQuizTracker t WHERE t.user.id = :userId AND t.quiz.id = :quizId")
    Optional<UserQuizTracker> findByUserIdAndQuizIdForUpdate(@Param("userId") Long userId, @Param("quizId") Long quizId);

    @Query("SELECT t FROM UserQuizTracker t WHERE t.user.id = :userId AND t.quiz.module.course.id = :courseId")
    List<UserQuizTracker> findByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") Long courseId);

    @Query("SELECT COUNT(t) FROM UserQuizTracker t WHERE t.user.id = :userId AND t.quiz.module.course.id = :courseId AND t.hasPassed = true AND t.quiz.status = 'PUBLISHED'")
    long countPassedPublishedQuizzesByCourse(@Param("userId") Long userId, @Param("courseId") Long courseId);
}
