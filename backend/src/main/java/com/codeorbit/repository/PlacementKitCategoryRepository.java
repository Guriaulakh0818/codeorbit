package com.codeorbit.repository;

import com.codeorbit.entity.PlacementKitCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlacementKitCategoryRepository extends JpaRepository<PlacementKitCategory, Long> {

    List<PlacementKitCategory> findByPlacementKitIdOrderByOrderIndexAsc(Long placementKitId);

    Optional<PlacementKitCategory> findByPlacementKitIdAndSlug(Long placementKitId, String slug);
}
