package com.codeorbit.service.impl;

import com.codeorbit.dto.*;
import com.codeorbit.entity.*;
import com.codeorbit.exception.BadRequestException;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.*;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.PlacementReadyPaymentService;
import com.codeorbit.service.RazorpayGatewayService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PlacementReadyPaymentServiceImpl implements PlacementReadyPaymentService {

    private static final Logger log = LoggerFactory.getLogger(PlacementReadyPaymentServiceImpl.class);
    public static final int PLACEMENT_READY_PRICE_INR = 29;
    public static final int PLACEMENT_READY_PRICE_PAISE = 2900;

    private final PlacementReadyPaymentRepository paymentRepository;
    private final PlacementReadyEntitlementRepository entitlementRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final SubcourseRepository subcourseRepository;
    private final RazorpayGatewayService razorpayGatewayService;

    public PlacementReadyPaymentServiceImpl(
            PlacementReadyPaymentRepository paymentRepository,
            PlacementReadyEntitlementRepository entitlementRepository,
            UserRepository userRepository,
            CourseRepository courseRepository,
            SubcourseRepository subcourseRepository,
            RazorpayGatewayService razorpayGatewayService
    ) {
        this.paymentRepository = paymentRepository;
        this.entitlementRepository = entitlementRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.subcourseRepository = subcourseRepository;
        this.razorpayGatewayService = razorpayGatewayService;
    }

    @Override
    @Transactional
    public PlacementReadyOrderResponseDto createPlacementReadyOrder(UserPrincipal principal, String courseSlug) {
        if (principal == null || principal.getId() == null) {
            throw new AccessDeniedException("Authentication required to create a Placement Ready payment order");
        }

        if (courseSlug == null || courseSlug.trim().isEmpty()) {
            throw new BadRequestException("Course slug is required");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        Course course = courseRepository.findBySlug(courseSlug.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "slug", courseSlug));

        // Locate the Placement Ready subcourse for this course
        Subcourse placementSubcourse = subcourseRepository
                .findByCourseIdAndCurriculumLevel(course.getId(), CurriculumLevel.PLACEMENT_READY)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Placement Ready subcourse not configured for subject: " + course.getTitle()
                ));

        // Check if student already holds active entitlement
        if (entitlementRepository.existsByUserIdAndCourseId(user.getId(), course.getId())) {
            throw new BadRequestException("You have already purchased Placement Ready access for " + course.getTitle());
        }

        // Server-side authoritative price verification
        int priceInr = placementSubcourse.getPriceInr() > 0 ? placementSubcourse.getPriceInr() : PLACEMENT_READY_PRICE_INR;
        int pricePaise = priceInr > 0 ? priceInr * 100 : PLACEMENT_READY_PRICE_PAISE;

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String shortId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String orderNumber = "PR-ORD-" + timestamp + "-" + shortId;

        PlacementReadyPayment payment = new PlacementReadyPayment(
                orderNumber,
                user,
                course,
                placementSubcourse,
                pricePaise,
                "INR",
                PaymentStatus.CREATED
        );

        // Generate remote/mock Razorpay order ID
        String razorpayOrderId = razorpayGatewayService.createOrder(orderNumber, pricePaise, "INR");
        payment.setRazorpayOrderId(razorpayOrderId);

        PlacementReadyPayment savedPayment = paymentRepository.save(payment);
        log.info("Created Placement Ready payment order #{} (RZP Order: {}) for student: {} on subject: {}",
                savedPayment.getOrderNumber(), razorpayOrderId, user.getEmail(), course.getTitle());

        return new PlacementReadyOrderResponseDto(
                savedPayment.getOrderNumber(),
                savedPayment.getRazorpayOrderId(),
                razorpayGatewayService.getKeyId(),
                savedPayment.getAmountPaise(),
                priceInr,
                savedPayment.getCurrency(),
                course.getTitle(),
                course.getSlug(),
                placementSubcourse.getTitle(),
                user.getEmail(),
                user.getFullName()
        );
    }

    @Override
    @Transactional
    public PlacementReadyPaymentSummaryDto verifyPayment(UserPrincipal principal, PlacementReadyVerifyRequestDto request) {
        if (principal == null || principal.getId() == null) {
            throw new AccessDeniedException("Authentication required to verify payment");
        }

        if (request == null || request.getOrderNumber() == null || request.getOrderNumber().trim().isEmpty()) {
            throw new BadRequestException("Order number is required for payment verification");
        }

        PlacementReadyPayment payment = paymentRepository.findByOrderNumber(request.getOrderNumber().trim())
                .orElseThrow(() -> new ResourceNotFoundException("PaymentOrder", "orderNumber", request.getOrderNumber()));

        // Enforce strict student data isolation: Payment must belong to authenticated student
        if (!payment.getUser().getId().equals(principal.getId())) {
            log.warn("Security Alert: User #{} attempted to verify payment order #{} owned by User #{}",
                    principal.getId(), payment.getOrderNumber(), payment.getUser().getId());
            throw new AccessDeniedException("You do not have permission to verify or access this payment order");
        }

        // Idempotency: If already paid and entitlement active, return immediately
        if (payment.getStatus() == PaymentStatus.PAID) {
            log.info("Idempotent verification request for already paid order #{}", payment.getOrderNumber());
            boolean entitlementExists = entitlementRepository.existsByUserIdAndCourseId(
                    payment.getUser().getId(), payment.getCourse().getId()
            );
            return mapToSummaryDto(payment, entitlementExists);
        }

        // Verify Razorpay Order ID matches persisted payment record
        if (request.getRazorpayOrderId() == null || !request.getRazorpayOrderId().equals(payment.getRazorpayOrderId())) {
            log.error("Tamper detected: Request Razorpay Order ID '{}' does not match recorded order ID '{}'",
                    request.getRazorpayOrderId(), payment.getRazorpayOrderId());
            throw new BadRequestException("Razorpay Order ID mismatch");
        }

        // Verify HMAC-SHA256 signature server-side
        boolean isValidSignature = razorpayGatewayService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!isValidSignature) {
            log.error("Invalid Razorpay payment signature for order #{}", payment.getOrderNumber());
            payment.setStatus(PaymentStatus.FAILED);
            payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
            payment.setRazorpaySignature(request.getRazorpaySignature());
            paymentRepository.save(payment);
            throw new BadRequestException("Invalid or tampered payment signature");
        }

        // Mark payment as PAID
        payment.setStatus(PaymentStatus.PAID);
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setPaidAt(LocalDateTime.now());
        PlacementReadyPayment updatedPayment = paymentRepository.save(payment);

        // Grant Placement Ready entitlement idempotently
        if (!entitlementRepository.existsByUserIdAndCourseId(payment.getUser().getId(), payment.getCourse().getId())) {
            PlacementReadyEntitlement entitlement = new PlacementReadyEntitlement(
                    payment.getUser(),
                    payment.getCourse(),
                    payment.getSubcourse(),
                    updatedPayment
            );
            entitlementRepository.save(entitlement);
            log.info("Granted Placement Ready entitlement for User #{} on Subject '{}' (Order #{})",
                    payment.getUser().getId(), payment.getCourse().getTitle(), updatedPayment.getOrderNumber());
        }

        return mapToSummaryDto(updatedPayment, true);
    }

    @Override
    @Transactional
    public void handleWebhook(String payload, String signature) {
        if (signature == null || signature.isBlank()) {
            throw new BadRequestException("Missing required X-Razorpay-Signature header");
        }

        boolean isValid = razorpayGatewayService.verifyWebhookSignature(payload, signature);
        if (!isValid) {
            log.warn("Received invalid Razorpay webhook signature");
            throw new BadRequestException("Invalid webhook signature");
        }

        log.info("Successfully verified Razorpay webhook event payload");
        // Webhook processing for background settlement / order confirmation
        // If payload contains order_id, attempt idempotent entitlement reconciliation
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlacementReadyPaymentSummaryDto> getStudentPayments(UserPrincipal principal) {
        if (principal == null || principal.getId() == null) {
            throw new AccessDeniedException("Authentication required to view payment history");
        }

        List<PlacementReadyPayment> payments = paymentRepository.findByUserIdWithDetailsOrderByCreatedAtDesc(principal.getId());
        return payments.stream()
                .map(p -> {
                    boolean active = entitlementRepository.existsByUserIdAndCourseId(principal.getId(), p.getCourse().getId());
                    return mapToSummaryDto(p, active);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PlacementReadyStatusDto getPlacementReadyStatus(UserPrincipal principal, String courseSlug) {
        Course course = courseRepository.findBySlug(courseSlug.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "slug", courseSlug));

        if (principal == null || principal.getId() == null) {
            return new PlacementReadyStatusDto(course.getSlug(), false, false, PLACEMENT_READY_PRICE_INR, null);
        }

        boolean hasAccess = entitlementRepository.existsByUserIdAndCourseId(principal.getId(), course.getId());
        Optional<PlacementReadyPayment> paymentOpt = paymentRepository.findByUserAndCourseAndSubcourse(
                userRepository.getReferenceById(principal.getId()),
                course,
                subcourseRepository.findByCourseIdAndCurriculumLevel(course.getId(), CurriculumLevel.PLACEMENT_READY).orElse(null)
        );

        String orderNumber = paymentOpt.map(PlacementReadyPayment::getOrderNumber).orElse(null);
        return new PlacementReadyStatusDto(course.getSlug(), hasAccess, true, PLACEMENT_READY_PRICE_INR, orderNumber);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasEntitlement(Long userId, Long courseId) {
        if (userId == null || courseId == null) {
            return false;
        }
        return entitlementRepository.existsByUserIdAndCourseId(userId, courseId);
    }

    private PlacementReadyPaymentSummaryDto mapToSummaryDto(PlacementReadyPayment payment, boolean entitlementActive) {
        return new PlacementReadyPaymentSummaryDto(
                payment.getId(),
                payment.getOrderNumber(),
                payment.getCourse().getTitle(),
                payment.getCourse().getSlug(),
                payment.getSubcourse().getTitle(),
                payment.getAmountPaise() / 100,
                payment.getCurrency(),
                payment.getStatus(),
                payment.getRazorpayOrderId(),
                payment.getRazorpayPaymentId(),
                payment.getCreatedAt(),
                payment.getPaidAt(),
                entitlementActive
        );
    }
}
