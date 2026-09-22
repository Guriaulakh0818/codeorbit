package com.codeorbit.repository;

import com.codeorbit.entity.PlacementKitProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlacementKitProgressRepository extends JpaRepository<PlacementKitProgress, Long> {

    Optional<PlacementKitProgress> findByUserIdAndQuestionId(Long userId, Long questionId);

    List<PlacementKitProgress> findByUserIdAndPlacementKitId(Long userId, Long placementKitId);

    @Query("SELECT COUNT(p) FROM PlacementKitProgress p WHERE p.user.id = :userId AND p.placementKit.id = :kitId")
    long countAttemptedByUserIdAndKitId(@Param("userId") Long userId, @Param("kitId") Long kitId);

    @Query("SELECT COUNT(p) FROM PlacementKitProgress p WHERE p.user.id = :userId AND p.placementKit.id = :kitId AND p.correct = TRUE")
    long countCorrectByUserIdAndKitId(@Param("userId") Long userId, @Param("kitId") Long kitId);
}
