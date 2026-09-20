package com.codeorbit.repository;

import com.codeorbit.entity.Certificate;
import com.codeorbit.entity.CertificateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    Optional<Certificate> findByCertificateCode(String certificateCode);

    Optional<Certificate> findByUserIdAndCourseId(Long userId, Long courseId);

    List<Certificate> findByUserIdOrderByIssuedAtDesc(Long userId);

    List<Certificate> findByStatusOrderByIssuedAtDesc(CertificateStatus status);

    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    boolean existsByCertificateCode(String certificateCode);
}
