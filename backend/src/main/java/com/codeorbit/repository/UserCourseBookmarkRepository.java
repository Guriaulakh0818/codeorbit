package com.codeorbit.repository;

import com.codeorbit.entity.UserCourseBookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCourseBookmarkRepository extends JpaRepository<UserCourseBookmark, Long> {

    Optional<UserCourseBookmark> findByUserIdAndLessonId(Long userId, Long lessonId);

    List<UserCourseBookmark> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT b.lesson.id FROM UserCourseBookmark b WHERE b.user.id = :userId")
    List<Long> findBookmarkedLessonIdsByUserId(@Param("userId") Long userId);

    long countByUserId(Long userId);

    void deleteByUserIdAndLessonId(Long userId, Long lessonId);
}
