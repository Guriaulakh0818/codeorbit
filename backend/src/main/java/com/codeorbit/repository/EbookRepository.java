package com.codeorbit.repository;

import com.codeorbit.entity.Ebook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EbookRepository extends JpaRepository<Ebook, Long> {

    Optional<Ebook> findByIdAndActiveTrue(Long id);

    Page<Ebook> findByActiveTrue(Pageable pageable);

    @Query("SELECT e FROM Ebook e WHERE e.active = true AND " +
           "(:category IS NULL OR :category = '' OR LOWER(e.category) = LOWER(:category)) AND " +
           "(:search IS NULL OR :search = '' OR " +
           " LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(e.authorName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Ebook> searchActiveEbooks(
            @Param("search") String search,
            @Param("category") String category,
            Pageable pageable
    );

    @Query("SELECT DISTINCT e.category FROM Ebook e WHERE e.category IS NOT NULL AND TRIM(e.category) <> '' ORDER BY e.category ASC")
    List<String> findDistinctCategories();

    long countByActive(boolean active);

    @Query("SELECT e FROM Ebook e WHERE " +
           "(:active IS NULL OR e.active = :active) AND " +
           "(:category IS NULL OR :category = '' OR LOWER(e.category) = LOWER(:category)) AND " +
           "(:search IS NULL OR :search = '' OR " +
           " LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(e.authorName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Ebook> searchAdminEbooks(
            @Param("search") String search,
            @Param("category") String category,
            @Param("active") Boolean active,
            Pageable pageable
    );
}

