package com.codeorbit.repository;

import com.codeorbit.entity.Order;
import com.codeorbit.entity.OrderStatus;
import com.codeorbit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserOrderByCreatedAtDesc(User user);

    Optional<Order> findByUserAndId(User user, Long id);

    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);

    Optional<Order> findByOrderNumber(String orderNumber);

    long countByStatus(OrderStatus status);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.ebook WHERE o.id = :id")
    Optional<Order> findByIdWithItems(@Param("id") Long id);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.user u LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.ebook WHERE o.id = :id")
    Optional<Order> findByIdWithUserAndItems(@Param("id") Long id);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.ebook WHERE o.user = :user ORDER BY o.createdAt DESC")
    List<Order> findByUserWithItemsOrderByCreatedAtDesc(@Param("user") User user);

    @Query("SELECT COUNT(o) > 0 FROM Order o JOIN o.items i WHERE o.user.id = :userId AND o.status = com.codeorbit.entity.OrderStatus.PAID AND i.ebook.id = :ebookId")
    boolean hasUserPurchasedEbook(@Param("userId") Long userId, @Param("ebookId") Long ebookId);

    @Query("SELECT DISTINCT i.ebook FROM Order o JOIN o.items i WHERE o.user.id = :userId AND o.status = com.codeorbit.entity.OrderStatus.PAID ORDER BY i.ebook.title ASC")
    List<com.codeorbit.entity.Ebook> findPurchasedEbooksByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.status = com.codeorbit.entity.OrderStatus.PAID")
    java.math.BigDecimal calculateTotalPaidRevenue();

    @Query("SELECT COUNT(DISTINCT o.user.id) FROM Order o")
    long countDistinctStudentsWithOrders();

    @Query(
        value = "SELECT o FROM Order o WHERE " +
                "(:status IS NULL OR o.status = :status) AND " +
                "(:startDate IS NULL OR o.createdAt >= :startDate) AND " +
                "(:endDate IS NULL OR o.createdAt <= :endDate) AND " +
                "(:search IS NULL OR LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :search, '%')) " +
                " OR LOWER(o.user.fullName) LIKE LOWER(CONCAT('%', :search, '%')) " +
                " OR LOWER(o.user.email) LIKE LOWER(CONCAT('%', :search, '%')))",
        countQuery = "SELECT COUNT(o) FROM Order o WHERE " +
                "(:status IS NULL OR o.status = :status) AND " +
                "(:startDate IS NULL OR o.createdAt >= :startDate) AND " +
                "(:endDate IS NULL OR o.createdAt <= :endDate) AND " +
                "(:search IS NULL OR LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :search, '%')) " +
                " OR LOWER(o.user.fullName) LIKE LOWER(CONCAT('%', :search, '%')) " +
                " OR LOWER(o.user.email) LIKE LOWER(CONCAT('%', :search, '%')))"
    )
    org.springframework.data.domain.Page<Order> searchAdminOrders(
            @Param("search") String search,
            @Param("status") OrderStatus status,
            @Param("startDate") java.time.LocalDateTime startDate,
            @Param("endDate") java.time.LocalDateTime endDate,
            org.springframework.data.domain.Pageable pageable
    );
}
