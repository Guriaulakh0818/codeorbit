package com.codeorbit.repository;

import com.codeorbit.entity.Course;
import com.codeorbit.entity.PlacementReadyPayment;
import com.codeorbit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlacementReadyPaymentRepository extends JpaRepository<PlacementReadyPayment, Long> {

    Optional<PlacementReadyPayment> findByOrderNumber(String orderNumber);

    Optional<PlacementReadyPayment> findByRazorpayOrderId(String razorpayOrderId);

    List<PlacementReadyPayment> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT p FROM PlacementReadyPayment p JOIN FETCH p.course JOIN FETCH p.subcourse WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
    List<PlacementReadyPayment> findByUserIdWithDetailsOrderByCreatedAtDesc(@Param("userId") Long userId);

    Optional<PlacementReadyPayment> findByUserAndCourseAndSubcourse(User user, Course course, com.codeorbit.entity.Subcourse subcourse);

    long countByStatus(com.codeorbit.entity.PaymentStatus status);

    List<PlacementReadyPayment> findByStatus(com.codeorbit.entity.PaymentStatus status);
}
