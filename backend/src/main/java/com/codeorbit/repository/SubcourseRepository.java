package com.codeorbit.repository;

import com.codeorbit.entity.CurriculumLevel;
import com.codeorbit.entity.PublishStatus;
import com.codeorbit.entity.Subcourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubcourseRepository extends JpaRepository<Subcourse, Long> {

    List<Subcourse> findByCourseIdOrderByOrderIndexAsc(Long courseId);

    List<Subcourse> findByCourseIdAndStatusOrderByOrderIndexAsc(Long courseId, PublishStatus status);

    Optional<Subcourse> findByCourseIdAndCurriculumLevel(Long courseId, CurriculumLevel curriculumLevel);

    @Query("SELECT s FROM Subcourse s WHERE s.course.slug = :courseSlug AND s.slug = :subcourseSlug")
    Optional<Subcourse> findByCourseSlugAndSlug(@Param("courseSlug") String courseSlug, @Param("subcourseSlug") String subcourseSlug);
}
