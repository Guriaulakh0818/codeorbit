package com.codeorbit.repository;

import com.codeorbit.entity.PlacementKitQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementKitQuestionRepository extends JpaRepository<PlacementKitQuestion, Long> {

    List<PlacementKitQuestion> findByCategoryIdAndActiveTrueOrderByOrderIndexAsc(Long categoryId);

    @Query("SELECT q FROM PlacementKitQuestion q WHERE q.category.placementKit.id = :kitId AND q.active = TRUE ORDER BY q.category.orderIndex ASC, q.orderIndex ASC")
    List<PlacementKitQuestion> findByKitId(@Param("kitId") Long kitId);

    @Query("SELECT q FROM PlacementKitQuestion q WHERE q.category.placementKit.id = :kitId AND q.sample = TRUE AND q.active = TRUE ORDER BY q.orderIndex ASC")
    List<PlacementKitQuestion> findSampleQuestionsByKitId(@Param("kitId") Long kitId);

    @Query("SELECT COUNT(q) FROM PlacementKitQuestion q WHERE q.category.placementKit.id = :kitId AND q.active = TRUE")
    long countByKitId(@Param("kitId") Long kitId);
}
