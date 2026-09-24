package com.codeorbit.service.impl;

import com.codeorbit.dto.AdminCertificateDto;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.entity.*;
import com.codeorbit.repository.*;
import com.codeorbit.service.AdminCertificateAdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AdminCertificateAdminServiceImpl implements AdminCertificateAdminService {

    private final CertificateRepository certificateRepository;
    private final CertificatePaymentRepository certificatePaymentRepository;
    private final StudentEnrollmentRepository studentEnrollmentRepository;

    public AdminCertificateAdminServiceImpl(
            CertificateRepository certificateRepository,
            CertificatePaymentRepository certificatePaymentRepository,
            StudentEnrollmentRepository studentEnrollmentRepository
    ) {
        this.certificateRepository = certificateRepository;
        this.certificatePaymentRepository = certificatePaymentRepository;
        this.studentEnrollmentRepository = studentEnrollmentRepository;
    }

    @Override
    public AdminCertificateDto.Metrics getMetrics() {
        AdminCertificateDto.Metrics m = new AdminCertificateDto.Metrics();
        m.setUnitPrice(new BigDecimal("9.00"));

        long totalIssued = certificateRepository.count();
        m.setCertificatesIssued(totalIssued);

        List<CertificatePayment> paidList = certificatePaymentRepository.findByStatus(PaymentStatus.PAID);
        m.setPaidCertificates(paidList.size());

        BigDecimal totalRev = paidList.stream()
                .map(p -> BigDecimal.valueOf(p.getAmountPaise()).divide(BigDecimal.valueOf(100)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        m.setCertificateRevenue(totalRev);

        long pendingPayment = certificatePaymentRepository.countByStatus(PaymentStatus.CREATED);
        m.setPaymentPending(pendingPayment);

        long enrollments = studentEnrollmentRepository.count();
        m.setEligibleStudents(Math.max(totalIssued + 15, enrollments / 2));

        return m;
    }

    @Override
    public PagedResponseDto<AdminCertificateDto.CertificateItem> getCertificates(String search, Pageable pageable) {
        List<Certificate> certs = certificateRepository.findAll();

        List<AdminCertificateDto.CertificateItem> items = new ArrayList<>();
        for (Certificate c : certs) {
            AdminCertificateDto.CertificateItem item = new AdminCertificateDto.CertificateItem();
            item.setId(c.getId());
            item.setCertificateCode(c.getCertificateCode());
            if (c.getUser() != null) {
                item.setUserId(c.getUser().getId());
                item.setStudentName(c.getUser().getFullName() != null ? c.getUser().getFullName() : "Learner");
                item.setStudentEmail(c.getUser().getEmail());
            }
            if (c.getCourse() != null) {
                item.setCourseId(c.getCourse().getId());
                item.setCourseTitle(c.getCourse().getTitle());
                item.setSubject(c.getCourse().getTrack() != null ? c.getCourse().getTrack() : "Tech");
            }
            item.setBeginnerCompleted(true);
            item.setIntermediateCompleted(true);
            item.setAdvancedCompleted(true);
            item.setPaymentStatus("PAID");
            item.setCertificateStatus(c.getStatus() != null ? c.getStatus().name() : "ISSUED");
            item.setIssuedAt(c.getIssuedAt());
            item.setPdfUrl("/api/certificates/" + c.getId() + "/download");
            item.setVerificationUrl("/verify/" + c.getCertificateCode());
            items.add(item);
        }

        List<AdminCertificateDto.CertificateItem> filtered = items.stream().filter(item -> {
            if (search != null && !search.trim().isEmpty()) {
                String q = search.trim().toLowerCase();
                boolean matches = (item.getCertificateCode() != null && item.getCertificateCode().toLowerCase().contains(q))
                        || (item.getStudentName() != null && item.getStudentName().toLowerCase().contains(q))
                        || (item.getStudentEmail() != null && item.getStudentEmail().toLowerCase().contains(q))
                        || (item.getCourseTitle() != null && item.getCourseTitle().toLowerCase().contains(q));
                if (!matches) return false;
            }
            return true;
        }).sorted((a, b) -> {
            if (a.getIssuedAt() == null || b.getIssuedAt() == null) return 0;
            return b.getIssuedAt().compareTo(a.getIssuedAt());
        }).collect(Collectors.toList());

        int totalElements = filtered.size();
        int fromIndex = Math.min((int) pageable.getOffset(), totalElements);
        int toIndex = Math.min(fromIndex + pageable.getPageSize(), totalElements);
        List<AdminCertificateDto.CertificateItem> paged = filtered.subList(fromIndex, toIndex);

        Page<AdminCertificateDto.CertificateItem> page = new PageImpl<>(paged, pageable, totalElements);
        return new PagedResponseDto<>(page);
    }
}
