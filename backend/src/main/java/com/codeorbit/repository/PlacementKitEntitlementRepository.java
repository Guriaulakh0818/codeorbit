package com.codeorbit.repository;

import com.codeorbit.entity.PlacementKitEntitlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlacementKitEntitlementRepository extends JpaRepository<PlacementKitEntitlement, Long> {

    Optional<PlacementKitEntitlement> findByUserIdAndPlacementKitId(Long userId, Long placementKitId);

    boolean existsByUserIdAndPlacementKitId(Long userId, Long placementKitId);

    List<PlacementKitEntitlement> findByUserIdOrderByGrantedAtDesc(Long userId);
}
