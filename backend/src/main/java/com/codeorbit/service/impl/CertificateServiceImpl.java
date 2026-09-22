package com.codeorbit.service.impl;

import com.codeorbit.dto.*;
import com.codeorbit.entity.*;
import com.codeorbit.exception.BadRequestException;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.*;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.CertificatePdfGeneratorService;
import com.codeorbit.service.CertificateService;
import com.codeorbit.service.CurriculumProgressionService;
import com.codeorbit.service.RazorpayGatewayService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CertificateServiceImpl implements CertificateService {

    private static final Logger log = LoggerFactory.getLogger(CertificateServiceImpl.class);
    private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();
    public static final int CERTIFICATE_PRICE_INR = 9;
    public static final int CERTIFICATE_PRICE_PAISE = 900;

    private final CertificateRepository certificateRepository;
    private final CertificatePaymentRepository certificatePaymentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CurriculumProgressionService progressionService;
    private final RazorpayGatewayService razorpayGatewayService;
    private final CertificatePdfGeneratorService pdfGeneratorService;

    @Autowired
    public CertificateServiceImpl(
            CertificateRepository certificateRepository,
            CertificatePaymentRepository certificatePaymentRepository,
            UserRepository userRepository,
            CourseRepository courseRepository,
            CurriculumProgressionService progressionService,
            RazorpayGatewayService razorpayGatewayService,
            CertificatePdfGeneratorService pdfGeneratorService
    ) {
        this.certificateRepository = certificateRepository;
        this.certificatePaymentRepository = certificatePaymentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.progressionService = progressionService;
        this.razorpayGatewayService = razorpayGatewayService;
        this.pdfGeneratorService = pdfGeneratorService;
    }

    // Secondary constructor for lightweight unit tests if needed
    public CertificateServiceImpl(
            CertificateRepository certificateRepository,
            UserRepository userRepository,
            CourseRepository courseRepository,
            CurriculumProgressionService progressionService
    ) {
        this(certificateRepository, null, userRepository, courseRepository, progressionService, null, null);
    }

    @Override
    @Transactional(readOnly = true)
    public CertificatePublicDto verifyCertificate(String certificateCode) {
        if (certificateCode == null || certificateCode.trim().isEmpty()) {
            throw new BadRequestException("Certificate code cannot be empty");
        }

        Certificate cert = certificateRepository.findByCertificateCode(certificateCode.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with code: " + certificateCode));

        boolean isValid = cert.getStatus() == CertificateStatus.VALID;
        return new CertificatePublicDto(
                cert.getCertificateCode(),
                cert.getStudentFullName(),
                cert.getCourseTitle(),
                cert.getCourse().getSlug(),
                cert.getStatus().name(),
                isValid,
                cert.getRevocationReason(),
                cert.getIssuedAt()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public CertificateStatusDto getCertificateStatus(UserPrincipal principal, String courseSlug) {
        Course course = courseRepository.findBySlug(courseSlug.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "slug", courseSlug));

        if (principal == null || principal.getId() == null) {
            return new CertificateStatusDto(
                    course.getTitle(),
                    course.getSlug(),
                    false,
                    false,
                    false,
                    null,
                    0,
                    0,
                    "Login required to view certificate status."
            );
        }

        Long userId = principal.getId();
        Long courseId = course.getId();

        boolean isEligible = progressionService.isEligibleForCertificate(userId, courseId);
        int completedModules = progressionService.getPassedModuleQuizCount(userId, courseId);
        int completedFinals = progressionService.getPassedFinalQuizCount(userId, courseId);

        Optional<Certificate> certOpt = certificateRepository.findByUserIdAndCourseId(userId, courseId);
        boolean isIssued = certOpt.isPresent() && certOpt.get().getStatus() == CertificateStatus.VALID;
        String certCode = certOpt.map(Certificate::getCertificateCode).orElse(null);

        boolean isPurchased = isIssued || (certificatePaymentRepository != null &&
                certificatePaymentRepository.existsByUserIdAndCourseIdAndStatus(userId, courseId, PaymentStatus.PAID));

        String message;
        if (isIssued) {
            message = "Your official certificate has been issued and is available for download!";
        } else if (isPurchased) {
            message = "Payment verified. Certificate is ready to be claimed.";
        } else if (isEligible) {
            message = "Congratulations! You have completed all curriculum requirements. Claim your certificate for ₹9.";
        } else {
            message = String.format("Complete all 12 module quizzes (%d/12) and 3 final exams (%d/3) to unlock your certificate.",
                    completedModules, completedFinals);
        }

        return new CertificateStatusDto(
                course.getTitle(),
                course.getSlug(),
                isEligible,
                isPurchased,
                isIssued,
                certCode,
                completedModules,
                completedFinals,
                message
        );
    }

    @Override
    public CertificateOrderResponseDto createCertificateOrder(UserPrincipal principal, String courseSlug) {
        if (principal == null || principal.getId() == null) {
            throw new AccessDeniedException("Authentication required to create a certificate payment order");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        Course course = courseRepository.findBySlug(courseSlug.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "slug", courseSlug));

        // Check if certificate already claimed / issued
        Optional<Certificate> existingCert = certificateRepository.findByUserIdAndCourseId(user.getId(), course.getId());
        if (existingCert.isPresent() && existingCert.get().getStatus() == CertificateStatus.VALID) {
            throw new BadRequestException("Certificate already issued for " + course.getTitle() + " (Code: " + existingCert.get().getCertificateCode() + ")");
        }

        // Server-side authoritative certificate eligibility verification
        if (!progressionService.isEligibleForCertificate(user.getId(), course.getId())) {
            int completedModules = progressionService.getPassedModuleQuizCount(user.getId(), course.getId());
            int completedFinals = progressionService.getPassedFinalQuizCount(user.getId(), course.getId());
            throw new BadRequestException(String.format(
                    "You are not eligible for a certificate yet. You have passed %d/12 module quizzes and %d/3 final exams. Placement Ready is not required.",
                    completedModules, completedFinals
            ));
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String shortId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String orderNumber = "CERT-ORD-" + timestamp + "-" + shortId;

        CertificatePayment payment = new CertificatePayment(
                orderNumber,
                user,
                course,
                CERTIFICATE_PRICE_PAISE,
                "INR",
                PaymentStatus.CREATED
        );

        String razorpayOrderId = razorpayGatewayService.createOrder(orderNumber, CERTIFICATE_PRICE_PAISE, "INR");
        payment.setRazorpayOrderId(razorpayOrderId);

        CertificatePayment savedPayment = certificatePaymentRepository.save(payment);
        log.info("Created ₹9 Certificate payment order #{} (RZP: {}) for student {} on {}",
                savedPayment.getOrderNumber(), razorpayOrderId, user.getEmail(), course.getTitle());

        return new CertificateOrderResponseDto(
                savedPayment.getOrderNumber(),
                savedPayment.getRazorpayOrderId(),
                savedPayment.getAmountPaise(),
                savedPayment.getCurrency(),
                razorpayGatewayService.getKeyId(),
                course.getSlug(),
                course.getTitle(),
                user.getFullName(),
                user.getEmail(),
                "Certificate payment order created successfully"
        );
    }

    @Override
    public CertificatePublicDto verifyAndIssueCertificate(UserPrincipal principal, String courseSlug, CertificatePaymentVerifyRequestDto request) {
        if (principal == null || principal.getId() == null) {
            throw new AccessDeniedException("Authentication required to verify certificate payment");
        }

        if (request == null || request.getRazorpayOrderId() == null || request.getRazorpayOrderId().trim().isEmpty()) {
            throw new BadRequestException("Razorpay order ID is required for verification");
        }

        CertificatePayment payment = certificatePaymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId().trim())
                .orElseThrow(() -> new ResourceNotFoundException("CertificatePayment", "razorpayOrderId", request.getRazorpayOrderId()));

        // Security check: Must belong to authenticated student
        if (!payment.getUser().getId().equals(principal.getId())) {
            log.warn("Security Alert: User #{} attempted to verify certificate payment owned by User #{}",
                    principal.getId(), payment.getUser().getId());
            throw new AccessDeniedException("You do not have permission to verify this certificate payment");
        }

        // Subject match check
        Course course = courseRepository.findBySlug(courseSlug.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "slug", courseSlug));
        if (!payment.getCourse().getId().equals(course.getId())) {
            throw new BadRequestException("Payment order does not match course: " + courseSlug);
        }

        // Amount verification
        if (payment.getAmountPaise() != CERTIFICATE_PRICE_PAISE) {
            throw new BadRequestException("Invalid certificate payment amount");
        }

        // Idempotency: If already paid and certificate exists, return existing certificate
        Optional<Certificate> existingCert = certificateRepository.findByUserIdAndCourseId(payment.getUser().getId(), course.getId());
        if (payment.getStatus() == PaymentStatus.PAID && existingCert.isPresent()) {
            Certificate c = existingCert.get();
            return new CertificatePublicDto(
                    c.getCertificateCode(),
                    c.getStudentFullName(),
                    c.getCourseTitle(),
                    c.getCourse().getSlug(),
                    c.getStatus().name(),
                    c.getStatus() == CertificateStatus.VALID,
                    c.getRevocationReason(),
                    c.getIssuedAt()
            );
        }

        // Re-verify eligibility server-side
        if (!progressionService.isEligibleForCertificate(payment.getUser().getId(), course.getId())) {
            throw new BadRequestException("Cannot issue certificate: Curriculum completion requirements not satisfied.");
        }

        // Verify Razorpay HMAC-SHA256 signature
        boolean isValidSignature = razorpayGatewayService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!isValidSignature) {
            log.error("Invalid certificate payment signature for order #{}", payment.getOrderNumber());
            payment.setStatus(PaymentStatus.FAILED);
            payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
            payment.setRazorpaySignature(request.getRazorpaySignature());
            certificatePaymentRepository.save(payment);
            throw new BadRequestException("Invalid or tampered payment signature");
        }

        // Mark payment as PAID
        payment.setStatus(PaymentStatus.PAID);
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setPaidAt(LocalDateTime.now());
        CertificatePayment updatedPayment = certificatePaymentRepository.save(payment);

        // Issue Certificate idempotently
        Certificate cert;
        if (existingCert.isPresent()) {
            cert = existingCert.get();
            cert.setPayment(updatedPayment);
            cert.setStatus(CertificateStatus.VALID);
            cert = certificateRepository.save(cert);
        } else {
            String code = generateUniqueCertificateCode(course.getTrack());
            cert = new Certificate(
                    code,
                    payment.getUser(),
                    course,
                    updatedPayment,
                    payment.getUser().getFullName(),
                    course.getTitle(),
                    CertificateStatus.VALID
            );
            cert = certificateRepository.save(cert);
            log.info("Issued Certificate {} to student {} for course {}", code, payment.getUser().getEmail(), course.getTitle());
        }

        return new CertificatePublicDto(
                cert.getCertificateCode(),
                cert.getStudentFullName(),
                cert.getCourseTitle(),
                cert.getCourse().getSlug(),
                cert.getStatus().name(),
                true,
                null,
                cert.getIssuedAt()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] downloadCertificatePdf(UserPrincipal principal, String certificateCode) {
        if (principal == null || principal.getId() == null) {
            throw new AccessDeniedException("Authentication required to download certificate");
        }

        Certificate cert = certificateRepository.findByCertificateCode(certificateCode.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with code: " + certificateCode));

        // Enforce ownership: student can only download their own certificate (Admin can download any)
        boolean isOwner = cert.getUser().getId().equals(principal.getId());
        boolean isAdmin = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isAdmin) {
            log.warn("Unauthorized download attempt: User #{} tried to download Certificate #{}",
                    principal.getId(), certificateCode);
            throw new AccessDeniedException("You do not have authorization to download this certificate.");
        }

        return pdfGeneratorService.generateCertificatePdf(cert);
    }

    @Override
    public CertificatePublicDto claimCourseCertificate(UserPrincipal principal, String courseSlug) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + principal.getId()));

        Course course = courseRepository.findBySlugAndStatus(courseSlug, PublishStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with slug: " + courseSlug));

        Optional<Certificate> existingCert = certificateRepository.findByUserIdAndCourseId(user.getId(), course.getId());
        if (existingCert.isPresent()) {
            Certificate c = existingCert.get();
            return new CertificatePublicDto(
                    c.getCertificateCode(),
                    c.getStudentFullName(),
                    c.getCourseTitle(),
                    c.getCourse().getSlug(),
                    c.getStatus().name(),
                    c.getStatus() == CertificateStatus.VALID,
                    c.getRevocationReason(),
                    c.getIssuedAt()
            );
        }

        if (!progressionService.isEligibleForCertificate(user.getId(), course.getId())) {
            throw new BadRequestException("Cannot claim certificate: You must complete all published lessons, pass all 4 module quizzes (>=80%), and pass all 25-question final exams (>=80%) across Beginner, Intermediate, and Advanced.");
        }

        String code = generateUniqueCertificateCode(course.getTrack());

        Certificate cert = new Certificate();
        cert.setCertificateCode(code);
        cert.setUser(user);
        cert.setCourse(course);
        cert.setStudentFullName(user.getFullName());
        cert.setCourseTitle(course.getTitle());
        cert.setStatus(CertificateStatus.VALID);

        cert = certificateRepository.save(cert);

        return new CertificatePublicDto(
                cert.getCertificateCode(),
                cert.getStudentFullName(),
                cert.getCourseTitle(),
                cert.getCourse().getSlug(),
                cert.getStatus().name(),
                true,
                null,
                cert.getIssuedAt()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<CertificatePublicDto> getStudentCertificates(UserPrincipal principal) {
        if (principal == null || principal.getId() == null) {
            return List.of();
        }
        return certificateRepository.findByUserIdOrderByIssuedAtDesc(principal.getId()).stream()
                .map(c -> new CertificatePublicDto(
                        c.getCertificateCode(),
                        c.getStudentFullName(),
                        c.getCourseTitle(),
                        c.getCourse().getSlug(),
                        c.getStatus().name(),
                        c.getStatus() == CertificateStatus.VALID,
                        c.getRevocationReason(),
                        c.getIssuedAt()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public void processCertificateWebhook(String eventType, Map<String, Object> payload, String signature) {
        log.info("Processing certificate webhook event: {}", eventType);
        // Additional webhook reconciliation if required
    }

    private String generateUniqueCertificateCode(String track) {
        String prefix = "CO-" + (track != null && !track.isBlank() ? track.toUpperCase() : "CSE") + "-2026-";
        for (int attempt = 0; attempt < 100; attempt++) {
            StringBuilder sb = new StringBuilder(prefix);
            for (int i = 0; i < 6; i++) {
                sb.append(CODE_CHARS.charAt(RANDOM.nextInt(CODE_CHARS.length())));
            }
            String code = sb.toString();
            if (!certificateRepository.existsByCertificateCode(code)) {
                return code;
            }
        }
        throw new IllegalStateException("Failed to generate unique certificate code");
    }
}
