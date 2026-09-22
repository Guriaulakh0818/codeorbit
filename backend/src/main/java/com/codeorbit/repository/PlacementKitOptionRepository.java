package com.codeorbit.repository;

import com.codeorbit.entity.PlacementKitOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementKitOptionRepository extends JpaRepository<PlacementKitOption, Long> {

    List<PlacementKitOption> findByQuestionIdOrderByOrderIndexAsc(Long questionId);
}
