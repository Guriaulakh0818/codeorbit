package com.codeorbit.service.impl;

import com.codeorbit.dto.AdminPlacementReadyDto;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.entity.*;
import com.codeorbit.repository.*;
import com.codeorbit.service.AdminPlacementReadyService;
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
public class AdminPlacementReadyServiceImpl implements AdminPlacementReadyService {

    private final PlacementReadyPaymentRepository paymentRepository;
    private final PlacementReadyEntitlementRepository entitlementRepository;
    private final UserRepository userRepository;

    public AdminPlacementReadyServiceImpl(
            PlacementReadyPaymentRepository paymentRepository,
            PlacementReadyEntitlementRepository entitlementRepository,
            UserRepository userRepository
    ) {
        this.paymentRepository = paymentRepository;
        this.entitlementRepository = entitlementRepository;
        this.userRepository = userRepository;
    }

    @Override
    public AdminPlacementReadyDto.Metrics getMetrics() {
        AdminPlacementReadyDto.Metrics m = new AdminPlacementReadyDto.Metrics();
        m.setUnitPrice(new BigDecimal("29.00"));

        List<PlacementReadyPayment> paidList = paymentRepository.findByStatus(PaymentStatus.PAID);
        m.setTotalPurchases(paidList.size());

        BigDecimal totalRev = paidList.stream()
                .map(p -> BigDecimal.valueOf(p.getAmountPaise()).divide(BigDecimal.valueOf(100)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        m.setTotalRevenue(totalRev);

        long totalEntitlements = entitlementRepository.count();
        m.setActiveEntitlements(totalEntitlements);

        long totalUsers = userRepository.count();
        double convRate = totalUsers > 0 ? (totalEntitlements * 100.0 / totalUsers) : 0.0;
        m.setConversionRatePct(Math.round(convRate * 10.0) / 10.0);

        return m;
    }

    @Override
    public PagedResponseDto<AdminPlacementReadyDto.EntitlementItem> getEntitlements(String search, Pageable pageable) {
        List<PlacementReadyPayment> payments = paymentRepository.findAll();

        List<AdminPlacementReadyDto.EntitlementItem> items = new ArrayList<>();
        for (PlacementReadyPayment p : payments) {
            AdminPlacementReadyDto.EntitlementItem item = new AdminPlacementReadyDto.EntitlementItem();
            item.setId(p.getId());
            if (p.getUser() != null) {
                item.setUserId(p.getUser().getId());
                item.setStudentName(p.getUser().getFullName() != null ? p.getUser().getFullName() : "Learner");
                item.setStudentEmail(p.getUser().getEmail());
            }
            if (p.getCourse() != null) {
                item.setCourseId(p.getCourse().getId());
                item.setCourseTitle(p.getCourse().getTitle());
                item.setSubject(p.getCourse().getTrack() != null ? p.getCourse().getTrack() : "Tech");
            }
            item.setAmount(BigDecimal.valueOf(p.getAmountPaise()).divide(BigDecimal.valueOf(100)));
            item.setPaymentStatus(p.getStatus().name());
            item.setEntitlementStatus(p.getStatus() == PaymentStatus.PAID ? "ACTIVE" : "LOCKED");
            item.setRazorpayOrderId(p.getRazorpayOrderId());
            item.setRazorpayPaymentId(p.getRazorpayPaymentId());
            item.setPurchaseDate(p.getPaidAt() != null ? p.getPaidAt() : p.getCreatedAt());
            items.add(item);
        }

        List<AdminPlacementReadyDto.EntitlementItem> filtered = items.stream().filter(item -> {
            if (search != null && !search.trim().isEmpty()) {
                String q = search.trim().toLowerCase();
                boolean matches = (item.getStudentName() != null && item.getStudentName().toLowerCase().contains(q))
                        || (item.getStudentEmail() != null && item.getStudentEmail().toLowerCase().contains(q))
                        || (item.getCourseTitle() != null && item.getCourseTitle().toLowerCase().contains(q))
                        || (item.getSubject() != null && item.getSubject().toLowerCase().contains(q));
                if (!matches) return false;
            }
            return true;
        }).sorted((a, b) -> {
            if (a.getPurchaseDate() == null || b.getPurchaseDate() == null) return 0;
            return b.getPurchaseDate().compareTo(a.getPurchaseDate());
        }).collect(Collectors.toList());

        int totalElements = filtered.size();
        int fromIndex = Math.min((int) pageable.getOffset(), totalElements);
        int toIndex = Math.min(fromIndex + pageable.getPageSize(), totalElements);
        List<AdminPlacementReadyDto.EntitlementItem> paged = filtered.subList(fromIndex, toIndex);

        Page<AdminPlacementReadyDto.EntitlementItem> page = new PageImpl<>(paged, pageable, totalElements);
        return new PagedResponseDto<>(page);
    }
}
