package com.codeorbit.service.impl;

import com.codeorbit.dto.AdminPaymentDto;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.entity.*;
import com.codeorbit.repository.*;
import com.codeorbit.service.AdminPaymentService;
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
public class AdminPaymentServiceImpl implements AdminPaymentService {

    private final OrderRepository orderRepository;
    private final PlacementReadyPaymentRepository placementReadyPaymentRepository;
    private final CertificatePaymentRepository certificatePaymentRepository;
    private final PlacementKitPaymentRepository placementKitPaymentRepository;

    public AdminPaymentServiceImpl(
            OrderRepository orderRepository,
            PlacementReadyPaymentRepository placementReadyPaymentRepository,
            CertificatePaymentRepository certificatePaymentRepository,
            PlacementKitPaymentRepository placementKitPaymentRepository
    ) {
        this.orderRepository = orderRepository;
        this.placementReadyPaymentRepository = placementReadyPaymentRepository;
        this.certificatePaymentRepository = certificatePaymentRepository;
        this.placementKitPaymentRepository = placementKitPaymentRepository;
    }

    @Override
    public AdminPaymentDto.Metrics getMetrics() {
        AdminPaymentDto.Metrics m = new AdminPaymentDto.Metrics();

        BigDecimal ebookRev = orderRepository.calculateTotalPaidRevenue();
        if (ebookRev == null) ebookRev = BigDecimal.ZERO;

        List<PlacementReadyPayment> prPaid = placementReadyPaymentRepository.findByStatus(PaymentStatus.PAID);
        BigDecimal prRev = prPaid.stream()
                .map(p -> BigDecimal.valueOf(p.getAmountPaise()).divide(BigDecimal.valueOf(100)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CertificatePayment> certPaid = certificatePaymentRepository.findByStatus(PaymentStatus.PAID);
        BigDecimal certRev = certPaid.stream()
                .map(p -> BigDecimal.valueOf(p.getAmountPaise()).divide(BigDecimal.valueOf(100)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<PlacementKitPayment> kitPaid = placementKitPaymentRepository.findByStatus(PaymentStatus.PAID);
        BigDecimal kitRev = kitPaid.stream()
                .map(p -> BigDecimal.valueOf(p.getAmountPaise()).divide(BigDecimal.valueOf(100)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        m.setEbookRevenue(ebookRev);
        m.setPlacementReadyRevenue(prRev);
        m.setCertificateRevenue(certRev);
        m.setPlacementKitRevenue(kitRev);
        m.setTotalRevenue(ebookRev.add(prRev).add(certRev).add(kitRev));

        long prSuccess = prPaid.size();
        long certSuccess = certPaid.size();
        long kitSuccess = kitPaid.size();
        long orderSuccess = orderRepository.countByStatus(OrderStatus.PAID);

        long prPending = placementReadyPaymentRepository.countByStatus(PaymentStatus.CREATED);
        long certPending = certificatePaymentRepository.countByStatus(PaymentStatus.CREATED);
        long kitPending = placementKitPaymentRepository.countByStatus(PaymentStatus.CREATED);
        long orderPending = orderRepository.countByStatus(OrderStatus.PENDING);

        long prFailed = placementReadyPaymentRepository.countByStatus(PaymentStatus.FAILED);
        long certFailed = certificatePaymentRepository.countByStatus(PaymentStatus.FAILED);
        long kitFailed = placementKitPaymentRepository.countByStatus(PaymentStatus.FAILED);
        long orderFailed = orderRepository.countByStatus(OrderStatus.CANCELLED);

        m.setSuccessfulPayments(prSuccess + certSuccess + kitSuccess + orderSuccess);
        m.setPendingPayments(prPending + certPending + kitPending + orderPending);
        m.setFailedPayments(prFailed + certFailed + kitFailed + orderFailed);
        m.setTotalTransactions(m.getSuccessfulPayments() + m.getPendingPayments() + m.getFailedPayments());

        return m;
    }

    @Override
    public PagedResponseDto<AdminPaymentDto.TransactionItem> getTransactions(String search, String productType, String status, Pageable pageable) {
        List<AdminPaymentDto.TransactionItem> all = new ArrayList<>();

        // 1. Placement Ready Payments
        List<PlacementReadyPayment> prList = placementReadyPaymentRepository.findAll();
        for (PlacementReadyPayment pr : prList) {
            AdminPaymentDto.TransactionItem item = new AdminPaymentDto.TransactionItem();
            item.setId("PR-" + pr.getId());
            item.setOrderNumber(pr.getOrderNumber());
            if (pr.getUser() != null) {
                item.setUserId(pr.getUser().getId());
                item.setStudentName(pr.getUser().getFullName() != null ? pr.getUser().getFullName() : "Learner");
                item.setStudentEmail(pr.getUser().getEmail());
            }
            item.setProductType("PLACEMENT_READY");
            item.setProductTitle("Placement Ready — " + (pr.getCourse() != null ? pr.getCourse().getTitle() : "Subject"));
            item.setAmount(BigDecimal.valueOf(pr.getAmountPaise()).divide(BigDecimal.valueOf(100)));
            item.setCurrency(pr.getCurrency());
            item.setRazorpayOrderId(pr.getRazorpayOrderId());
            item.setRazorpayPaymentId(pr.getRazorpayPaymentId());
            item.setStatus(pr.getStatus().name());
            item.setEntitlementStatus(pr.getStatus() == PaymentStatus.PAID ? "ACTIVE" : "LOCKED");
            item.setCreatedAt(pr.getCreatedAt());
            all.add(item);
        }

        // 2. Certificate Payments
        List<CertificatePayment> certList = certificatePaymentRepository.findAll();
        for (CertificatePayment cp : certList) {
            AdminPaymentDto.TransactionItem item = new AdminPaymentDto.TransactionItem();
            item.setId("CERT-" + cp.getId());
            item.setOrderNumber(cp.getOrderNumber());
            if (cp.getUser() != null) {
                item.setUserId(cp.getUser().getId());
                item.setStudentName(cp.getUser().getFullName() != null ? cp.getUser().getFullName() : "Learner");
                item.setStudentEmail(cp.getUser().getEmail());
            }
            item.setProductType("CERTIFICATE");
            item.setProductTitle("Verified Certificate — " + (cp.getCourse() != null ? cp.getCourse().getTitle() : "Course"));
            item.setAmount(BigDecimal.valueOf(cp.getAmountPaise()).divide(BigDecimal.valueOf(100)));
            item.setCurrency(cp.getCurrency());
            item.setRazorpayOrderId(cp.getRazorpayOrderId());
            item.setRazorpayPaymentId(cp.getRazorpayPaymentId());
            item.setStatus(cp.getStatus().name());
            item.setEntitlementStatus(cp.getStatus() == PaymentStatus.PAID ? "ISSUED" : "PENDING");
            item.setCreatedAt(cp.getCreatedAt());
            all.add(item);
        }

        // 3. Placement Kit Payments
        List<PlacementKitPayment> kitList = placementKitPaymentRepository.findAll();
        for (PlacementKitPayment kp : kitList) {
            AdminPaymentDto.TransactionItem item = new AdminPaymentDto.TransactionItem();
            item.setId("KIT-" + kp.getId());
            item.setOrderNumber(kp.getOrderNumber());
            if (kp.getUser() != null) {
                item.setUserId(kp.getUser().getId());
                item.setStudentName(kp.getUser().getFullName() != null ? kp.getUser().getFullName() : "Learner");
                item.setStudentEmail(kp.getUser().getEmail());
            }
            item.setProductType("PLACEMENT_KIT");
            item.setProductTitle("Placement Preparation Kit");
            item.setAmount(BigDecimal.valueOf(kp.getAmountPaise()).divide(BigDecimal.valueOf(100)));
            item.setCurrency(kp.getCurrency());
            item.setRazorpayOrderId(kp.getRazorpayOrderId());
            item.setRazorpayPaymentId(kp.getRazorpayPaymentId());
            item.setStatus(kp.getStatus().name());
            item.setEntitlementStatus(kp.getStatus() == PaymentStatus.PAID ? "UNLOCKED" : "LOCKED");
            item.setCreatedAt(kp.getCreatedAt());
            all.add(item);
        }

        // 4. Ebook Orders
        List<Order> orders = orderRepository.findAll();
        for (Order o : orders) {
            AdminPaymentDto.TransactionItem item = new AdminPaymentDto.TransactionItem();
            item.setId("ORD-" + o.getId());
            item.setOrderNumber(o.getOrderNumber());
            if (o.getUser() != null) {
                item.setUserId(o.getUser().getId());
                item.setStudentName(o.getUser().getFullName() != null ? o.getUser().getFullName() : "Learner");
                item.setStudentEmail(o.getUser().getEmail());
            }
            item.setProductType("EBOOK");
            item.setProductTitle("E-Book Order (" + (o.getItems() != null ? o.getItems().size() : 0) + " items)");
            item.setAmount(o.getTotalAmount());
            item.setCurrency(o.getCurrency());
            item.setRazorpayOrderId(o.getRazorpayOrderId());
            item.setRazorpayPaymentId(o.getRazorpayPaymentId());
            item.setStatus(o.getStatus().name());
            item.setEntitlementStatus(o.getStatus() == OrderStatus.PAID ? "DELIVERED" : "UNPAID");
            item.setCreatedAt(o.getCreatedAt());
            all.add(item);
        }

        // Apply filters
        List<AdminPaymentDto.TransactionItem> filtered = all.stream().filter(item -> {
            if (productType != null && !productType.trim().isEmpty() && !productType.equalsIgnoreCase("ALL")) {
                if (!item.getProductType().equalsIgnoreCase(productType)) return false;
            }
            if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
                if (!item.getStatus().equalsIgnoreCase(status)) return false;
            }
            if (search != null && !search.trim().isEmpty()) {
                String q = search.trim().toLowerCase();
                boolean matches = (item.getOrderNumber() != null && item.getOrderNumber().toLowerCase().contains(q))
                        || (item.getStudentName() != null && item.getStudentName().toLowerCase().contains(q))
                        || (item.getStudentEmail() != null && item.getStudentEmail().toLowerCase().contains(q))
                        || (item.getRazorpayOrderId() != null && item.getRazorpayOrderId().toLowerCase().contains(q))
                        || (item.getRazorpayPaymentId() != null && item.getRazorpayPaymentId().toLowerCase().contains(q));
                if (!matches) return false;
            }
            return true;
        }).sorted((a, b) -> {
            if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
            return b.getCreatedAt().compareTo(a.getCreatedAt());
        }).collect(Collectors.toList());

        int totalElements = filtered.size();
        int fromIndex = Math.min((int) pageable.getOffset(), totalElements);
        int toIndex = Math.min(fromIndex + pageable.getPageSize(), totalElements);
        List<AdminPaymentDto.TransactionItem> paged = filtered.subList(fromIndex, toIndex);

        Page<AdminPaymentDto.TransactionItem> page = new PageImpl<>(paged, pageable, totalElements);
        return new PagedResponseDto<>(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }
}
