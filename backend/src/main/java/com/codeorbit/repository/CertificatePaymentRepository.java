package com.codeorbit.repository;

import com.codeorbit.entity.CertificatePayment;
import com.codeorbit.entity.Course;
import com.codeorbit.entity.PaymentStatus;
import com.codeorbit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificatePaymentRepository extends JpaRepository<CertificatePayment, Long> {

    Optional<CertificatePayment> findByOrderNumber(String orderNumber);

    Optional<CertificatePayment> findByRazorpayOrderId(String razorpayOrderId);

    List<CertificatePayment> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT p FROM CertificatePayment p JOIN FETCH p.course WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
    List<CertificatePayment> findByUserIdWithDetailsOrderByCreatedAtDesc(@Param("userId") Long userId);

    Optional<CertificatePayment> findByUserAndCourse(User user, Course course);

    Optional<CertificatePayment> findByUserIdAndCourseIdAndStatus(Long userId, Long courseId, PaymentStatus status);

    boolean existsByUserIdAndCourseIdAndStatus(Long userId, Long courseId, PaymentStatus status);
}
