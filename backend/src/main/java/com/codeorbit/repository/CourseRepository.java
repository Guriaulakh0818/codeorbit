package com.codeorbit.repository;

import com.codeorbit.entity.Course;
import com.codeorbit.entity.PublishStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course> {

    Optional<Course> findBySlug(String slug);

    Optional<Course> findBySlugAndStatus(String slug, PublishStatus status);

    List<Course> findByStatusOrderByOrderIndexAsc(PublishStatus status);

    @Query("SELECT c FROM Course c WHERE c.status = :status AND " +
           "(:track IS NULL OR LOWER(c.track) = LOWER(:track)) AND " +
           "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Course> findCoursesByFilter(
            @Param("status") PublishStatus status,
            @Param("track") String track,
            @Param("search") String search,
            Pageable pageable
    );

    boolean existsBySlug(String slug);
}
