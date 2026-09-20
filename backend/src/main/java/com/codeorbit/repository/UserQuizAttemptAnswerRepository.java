package com.codeorbit.repository;

import com.codeorbit.entity.UserQuizAttemptAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserQuizAttemptAnswerRepository extends JpaRepository<UserQuizAttemptAnswer, Long> {

    List<UserQuizAttemptAnswer> findByAttemptId(Long attemptId);
}
