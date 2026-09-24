package com.codeorbit.repository;

import com.codeorbit.entity.UserQuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserQuizAttemptRepository extends JpaRepository<UserQuizAttempt, Long> {

    List<UserQuizAttempt> findByUserIdAndQuizIdOrderByAttemptNumberDesc(Long userId, Long quizId);

    Optional<UserQuizAttempt> findByUserIdAndQuizIdAndAttemptNumber(Long userId, Long quizId, int attemptNumber);

    @Query("SELECT MAX(a.attemptNumber) FROM UserQuizAttempt a WHERE a.user.id = :userId AND a.quiz.id = :quizId")
    Integer findMaxAttemptNumber(@Param("userId") Long userId, @Param("quizId") Long quizId);

    @Query("SELECT a FROM UserQuizAttempt a WHERE a.user.id = :userId AND a.quiz.module.course.id = :courseId ORDER BY a.submittedAt DESC")
    List<UserQuizAttempt> findRecentAttemptsByCourse(@Param("userId") Long userId, @Param("courseId") Long courseId);

    List<UserQuizAttempt> findByUserIdOrderBySubmittedAtDesc(Long userId);

    long countByUserId(Long userId);
}
