package com.codeorbit.repository;

import com.codeorbit.entity.PaymentStatus;
import com.codeorbit.entity.PlacementKitPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlacementKitPaymentRepository extends JpaRepository<PlacementKitPayment, Long> {

    Optional<PlacementKitPayment> findByRazorpayOrderId(String razorpayOrderId);

    Optional<PlacementKitPayment> findByOrderNumber(String orderNumber);

    List<PlacementKitPayment> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<PlacementKitPayment> findByUserIdAndPlacementKitIdAndStatus(Long userId, Long placementKitId, PaymentStatus status);

    boolean existsByUserIdAndPlacementKitIdAndStatus(Long userId, Long placementKitId, PaymentStatus status);
}
