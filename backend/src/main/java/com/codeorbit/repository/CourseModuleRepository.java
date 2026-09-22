package com.codeorbit.repository;

import com.codeorbit.entity.CourseModule;
import com.codeorbit.entity.PublishStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseModuleRepository extends JpaRepository<CourseModule, Long> {

    List<CourseModule> findByCourseIdAndStatusOrderByOrderIndexAsc(Long courseId, PublishStatus status);

    List<CourseModule> findByCourseIdOrderByOrderIndexAsc(Long courseId);

    List<CourseModule> findBySubcourseIdAndStatusOrderByOrderIndexAsc(Long subcourseId, PublishStatus status);

    List<CourseModule> findBySubcourseIdOrderByOrderIndexAsc(Long subcourseId);

    Optional<CourseModule> findByCourseIdAndSlug(Long courseId, String slug);

    boolean existsByCourseIdAndSlug(Long courseId, String slug);

    Optional<CourseModule> findByCourseIdAndCurriculumLevelAndOrderIndex(Long courseId, com.codeorbit.entity.CurriculumLevel curriculumLevel, int orderIndex);
}
