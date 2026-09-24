package com.codeorbit.repository;

import com.codeorbit.entity.StudentEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, Long> {

    Optional<StudentEnrollment> findByUserIdAndCourseId(Long userId, Long courseId);

    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    @Query("SELECT se FROM StudentEnrollment se JOIN FETCH se.course WHERE se.user.id = :userId ORDER BY se.enrolledAt DESC")
    List<StudentEnrollment> findByUserIdWithCourseOrderByEnrolledAtDesc(@Param("userId") Long userId);

    long countByUserId(Long userId);

    long countByCourseId(Long courseId);
}
