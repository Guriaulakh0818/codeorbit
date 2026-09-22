package com.codeorbit.repository;

import com.codeorbit.entity.PlacementKit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlacementKitRepository extends JpaRepository<PlacementKit, Long> {

    List<PlacementKit> findByActiveTrueOrderByOrderIndexAsc();

    Optional<PlacementKit> findBySlugAndActiveTrue(String slug);

    Optional<PlacementKit> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
