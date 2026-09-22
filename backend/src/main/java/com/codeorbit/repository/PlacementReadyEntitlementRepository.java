package com.codeorbit.repository;

import com.codeorbit.entity.PlacementReadyEntitlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlacementReadyEntitlementRepository extends JpaRepository<PlacementReadyEntitlement, Long> {

    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    boolean existsByUserIdAndSubcourseId(Long userId, Long subcourseId);

    Optional<PlacementReadyEntitlement> findByUserIdAndCourseId(Long userId, Long courseId);

    Optional<PlacementReadyEntitlement> findByUserIdAndSubcourseId(Long userId, Long subcourseId);

    List<PlacementReadyEntitlement> findByUserId(Long userId);
}
