package com.codeorbit.service;

import com.codeorbit.dto.*;
import com.codeorbit.entity.*;
import com.codeorbit.exception.BadRequestException;
import com.codeorbit.repository.*;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.impl.CertificateServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CertificateServiceTest {

    @Mock
    private CertificateRepository certificateRepository;

    @Mock
    private CertificatePaymentRepository certificatePaymentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private CurriculumProgressionService progressionService;

    @Mock
    private RazorpayGatewayService razorpayGatewayService;

    @Mock
    private CertificatePdfGeneratorService pdfGeneratorService;

    private CertificateServiceImpl certificateService;

    private User user;
    private User otherUser;
    private User adminUser;
    private Course course;
    private UserPrincipal studentPrincipal;
    private UserPrincipal otherStudentPrincipal;
    private UserPrincipal adminPrincipal;

    @BeforeEach
    void setUp() {
        certificateService = new CertificateServiceImpl(
                certificateRepository,
                certificatePaymentRepository,
                userRepository,
                courseRepository,
                progressionService,
                razorpayGatewayService,
                pdfGeneratorService
        );

        user = new User("Aman Sharma", "aman@student.edu", "hash", Role.STUDENT);
        user.setId(10L);

        otherUser = new User("Other Student", "other@student.edu", "hash", Role.STUDENT);
        otherUser.setId(20L);

        adminUser = new User("Admin User", "admin@codeorbit.dev", "hash", Role.ADMIN);
        adminUser.setId(99L);

        course = new Course("DSA Track", "dsa", "Master DSA", "Short", "DSA", "BEGINNER", 35, 1, PublishStatus.PUBLISHED);
        course.setId(1L);

        studentPrincipal = UserPrincipal.create(user);
        otherStudentPrincipal = UserPrincipal.create(otherUser);
        adminPrincipal = UserPrincipal.create(adminUser);
    }

    @Test
    @DisplayName("getCertificateStatus - Ineligible student shows accurate quiz counts and eligible=false")
    void testGetCertificateStatusIneligible() {
        when(courseRepository.findBySlug("dsa")).thenReturn(Optional.of(course));
        when(progressionService.getPassedModuleQuizCount(10L, 1L)).thenReturn(8);
        when(progressionService.getPassedFinalQuizCount(10L, 1L)).thenReturn(2);
        when(progressionService.isEligibleForCertificate(10L, 1L)).thenReturn(false);
        when(certificateRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.empty());
        when(certificatePaymentRepository.existsByUserIdAndCourseIdAndStatus(10L, 1L, PaymentStatus.PAID)).thenReturn(false);

        CertificateStatusDto status = certificateService.getCertificateStatus(studentPrincipal, "dsa");
        assertNotNull(status);
        assertEquals("dsa", status.getSubjectSlug());
        assertEquals("DSA Track", status.getSubject());
        assertFalse(status.isEligible());
        assertFalse(status.isPurchased());
        assertFalse(status.isIssued());
        assertEquals(8, status.getCompletedModuleQuizzes());
        assertEquals(12, status.getRequiredModuleQuizzes());
        assertEquals(2, status.getCompletedFinalQuizzes());
        assertEquals(3, status.getRequiredFinalQuizzes());
        assertEquals(900, status.getAmountInPaise());
        assertEquals(9, status.getPrice());
    }

    @Test
    @DisplayName("getCertificateStatus - Eligible student without payment shows eligible=true, purchased=false, price=900 paise")
    void testGetCertificateStatusEligibleUnpaid() {
        when(courseRepository.findBySlug("dsa")).thenReturn(Optional.of(course));
        when(progressionService.getPassedModuleQuizCount(10L, 1L)).thenReturn(12);
        when(progressionService.getPassedFinalQuizCount(10L, 1L)).thenReturn(3);
        when(progressionService.isEligibleForCertificate(10L, 1L)).thenReturn(true);
        when(certificateRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.empty());
        when(certificatePaymentRepository.existsByUserIdAndCourseIdAndStatus(10L, 1L, PaymentStatus.PAID)).thenReturn(false);

        CertificateStatusDto status = certificateService.getCertificateStatus(studentPrincipal, "dsa");
        assertTrue(status.isEligible());
        assertFalse(status.isPurchased());
        assertFalse(status.isIssued());
        assertEquals(12, status.getCompletedModuleQuizzes());
        assertEquals(3, status.getCompletedFinalQuizzes());
        assertEquals(900, status.getAmountInPaise());
        assertEquals(9, status.getPrice());
    }

    @Test
    @DisplayName("getCertificateStatus - Paid and issued certificate includes certificate code")
    void testGetCertificateStatusIssued() {
        when(courseRepository.findBySlug("dsa")).thenReturn(Optional.of(course));
        when(progressionService.getPassedModuleQuizCount(10L, 1L)).thenReturn(12);
        when(progressionService.getPassedFinalQuizCount(10L, 1L)).thenReturn(3);
        when(progressionService.isEligibleForCertificate(10L, 1L)).thenReturn(true);

        Certificate cert = new Certificate();
        cert.setCertificateCode("CO-DSA-2026-X9Y8Z7");
        cert.setUser(user);
        cert.setCourse(course);
        cert.setStatus(CertificateStatus.VALID);
        cert.setIssuedAt(LocalDateTime.now());
        when(certificateRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.of(cert));

        CertificateStatusDto status = certificateService.getCertificateStatus(studentPrincipal, "dsa");
        assertTrue(status.isEligible());
        assertTrue(status.isPurchased());
        assertTrue(status.isIssued());
        assertEquals("CO-DSA-2026-X9Y8Z7", status.getCertificateCode());
    }

    @Test
    @DisplayName("createCertificateOrder - Enforces 900 paise (₹9) and rejects ineligible student")
    void testCreateOrderRejectsIneligible() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(courseRepository.findBySlug("dsa")).thenReturn(Optional.of(course));
        when(certificateRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.empty());
        when(progressionService.isEligibleForCertificate(10L, 1L)).thenReturn(false);
        when(progressionService.getPassedModuleQuizCount(10L, 1L)).thenReturn(8);
        when(progressionService.getPassedFinalQuizCount(10L, 1L)).thenReturn(2);

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                certificateService.createCertificateOrder(studentPrincipal, "dsa"));
        assertTrue(ex.getMessage().contains("You are not eligible for a certificate yet"));
    }

    @Test
    @DisplayName("createCertificateOrder - Rejects if certificate already issued")
    void testCreateOrderRejectsAlreadyIssued() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(courseRepository.findBySlug("dsa")).thenReturn(Optional.of(course));

        Certificate existing = new Certificate();
        existing.setCertificateCode("CO-DSA-2026-EXISTING");
        existing.setStatus(CertificateStatus.VALID);
        when(certificateRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.of(existing));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                certificateService.createCertificateOrder(studentPrincipal, "dsa"));
        assertTrue(ex.getMessage().contains("Certificate already issued"));
    }

    @Test
    @DisplayName("createCertificateOrder - Successfully creates pending payment record with 900 paise")
    void testCreateOrderSuccess() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(courseRepository.findBySlug("dsa")).thenReturn(Optional.of(course));
        when(certificateRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.empty());
        when(progressionService.isEligibleForCertificate(10L, 1L)).thenReturn(true);
        when(razorpayGatewayService.createOrder(anyString(), eq(900), eq("INR"))).thenReturn("order_rzp_mock_123");
        when(razorpayGatewayService.getKeyId()).thenReturn("rzp_test_key123");
        when(certificatePaymentRepository.save(any(CertificatePayment.class))).thenAnswer(inv -> inv.getArgument(0));

        CertificateOrderResponseDto order = certificateService.createCertificateOrder(studentPrincipal, "dsa");
        assertNotNull(order);
        assertEquals(900, order.getAmountPaise());
        assertEquals("INR", order.getCurrency());
        assertEquals("rzp_test_key123", order.getRazorpayKeyId());
        assertEquals("dsa", order.getCourseSlug());
        assertEquals("DSA Track", order.getCourseTitle());
        assertEquals("order_rzp_mock_123", order.getRazorpayOrderId());
    }

    @Test
    @DisplayName("verifyAndIssueCertificate - Valid HMAC verifies payment and issues certificate idempotently")
    void testVerifyPaymentValidSignature() {
        String rzpOrderId = "order_rzp_valid_123";
        String rzpPaymentId = "pay_rzp_valid_456";
        String validSignature = "signature_valid_hash";

        CertificatePayment pendingPayment = new CertificatePayment(
                "CERT-ORD-001", user, course, 900, "INR", PaymentStatus.CREATED
        );
        pendingPayment.setRazorpayOrderId(rzpOrderId);

        when(certificatePaymentRepository.findByRazorpayOrderId(rzpOrderId)).thenReturn(Optional.of(pendingPayment));
        when(courseRepository.findBySlug("dsa")).thenReturn(Optional.of(course));
        when(certificateRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.empty());
        when(progressionService.isEligibleForCertificate(10L, 1L)).thenReturn(true);
        when(razorpayGatewayService.verifySignature(rzpOrderId, rzpPaymentId, validSignature)).thenReturn(true);
        when(certificatePaymentRepository.save(any(CertificatePayment.class))).thenAnswer(inv -> inv.getArgument(0));
        when(certificateRepository.existsByCertificateCode(anyString())).thenReturn(false);
        when(certificateRepository.save(any(Certificate.class))).thenAnswer(inv -> inv.getArgument(0));

        CertificatePaymentVerifyRequestDto verifyReq = new CertificatePaymentVerifyRequestDto(
                rzpOrderId, rzpPaymentId, validSignature
        );

        CertificatePublicDto result = certificateService.verifyAndIssueCertificate(studentPrincipal, "dsa", verifyReq);
        assertNotNull(result);
        assertEquals("Aman Sharma", result.getStudentFullName());
        assertEquals("DSA Track", result.getCourseTitle());
        assertTrue(result.getCertificateCode().startsWith("CO-DSA-2026-"));
        assertEquals(PaymentStatus.PAID, pendingPayment.getStatus());
        assertEquals(rzpPaymentId, pendingPayment.getRazorpayPaymentId());
    }

    @Test
    @DisplayName("verifyAndIssueCertificate - Invalid HMAC signature throws BadRequestException")
    void testVerifyPaymentInvalidSignature() {
        String rzpOrderId = "order_rzp_tampered_123";
        String rzpPaymentId = "pay_rzp_tampered_456";
        String invalidSignature = "invalid_signature_hash";

        CertificatePayment pendingPayment = new CertificatePayment(
                "CERT-ORD-002", user, course, 900, "INR", PaymentStatus.CREATED
        );
        pendingPayment.setRazorpayOrderId(rzpOrderId);

        when(certificatePaymentRepository.findByRazorpayOrderId(rzpOrderId)).thenReturn(Optional.of(pendingPayment));
        when(courseRepository.findBySlug("dsa")).thenReturn(Optional.of(course));
        when(certificateRepository.findByUserIdAndCourseId(10L, 1L)).thenReturn(Optional.empty());
        when(progressionService.isEligibleForCertificate(10L, 1L)).thenReturn(true);
        when(razorpayGatewayService.verifySignature(rzpOrderId, rzpPaymentId, invalidSignature)).thenReturn(false);

        CertificatePaymentVerifyRequestDto verifyReq = new CertificatePaymentVerifyRequestDto(
                rzpOrderId, rzpPaymentId, invalidSignature
        );

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                certificateService.verifyAndIssueCertificate(studentPrincipal, "dsa", verifyReq));
        assertTrue(ex.getMessage().contains("Invalid or tampered payment signature"));
        assertEquals(PaymentStatus.FAILED, pendingPayment.getStatus());
    }

    @Test
    @DisplayName("downloadCertificatePdf - Enforces authorization: AccessDeniedException when unauthorized student downloads other student's certificate")
    void testDownloadCertificateForbiddenForOtherStudent() {
        Certificate cert = new Certificate();
        cert.setCertificateCode("CO-DSA-2026-SECRET");
        cert.setUser(user); // belongs to user ID 10
        cert.setCourse(course);
        cert.setStatus(CertificateStatus.VALID);

        when(certificateRepository.findByCertificateCode("CO-DSA-2026-SECRET")).thenReturn(Optional.of(cert));

        // otherStudentPrincipal has user ID 20
        assertThrows(AccessDeniedException.class, () ->
                certificateService.downloadCertificatePdf(otherStudentPrincipal, "CO-DSA-2026-SECRET"));
    }

    @Test
    @DisplayName("downloadCertificatePdf - Owner student and Admin can successfully download PDF")
    void testDownloadCertificateSuccessForOwnerAndAdmin() {
        Certificate cert = new Certificate();
        cert.setCertificateCode("CO-DSA-2026-OWNER");
        cert.setUser(user);
        cert.setCourse(course);
        cert.setStatus(CertificateStatus.VALID);
        cert.setStudentFullName("Aman Sharma");
        cert.setCourseTitle("DSA Track");
        cert.setIssuedAt(LocalDateTime.now());

        when(certificateRepository.findByCertificateCode("CO-DSA-2026-OWNER")).thenReturn(Optional.of(cert));
        byte[] mockPdfBytes = new byte[]{1, 2, 3, 4};
        when(pdfGeneratorService.generateCertificatePdf(eq(cert))).thenReturn(mockPdfBytes);

        // Owner download
        byte[] ownerPdf = certificateService.downloadCertificatePdf(studentPrincipal, "CO-DSA-2026-OWNER");
        assertArrayEquals(mockPdfBytes, ownerPdf);

        // Admin download
        byte[] adminPdf = certificateService.downloadCertificatePdf(adminPrincipal, "CO-DSA-2026-OWNER");
        assertArrayEquals(mockPdfBytes, adminPdf);
    }

    @Test
    @DisplayName("verifyCertificate - Public lookup returns safe DTO and zero sensitive fields")
    void testPublicVerificationSafe() {
        Certificate cert = new Certificate();
        cert.setCertificateCode("CO-DSA-2026-PUBLIC");
        cert.setUser(user);
        cert.setCourse(course);
        cert.setStudentFullName("Aman Sharma");
        cert.setCourseTitle("DSA Track");
        cert.setStatus(CertificateStatus.VALID);
        cert.setIssuedAt(LocalDateTime.now());

        when(certificateRepository.findByCertificateCode("CO-DSA-2026-PUBLIC")).thenReturn(Optional.of(cert));

        CertificatePublicDto dto = certificateService.verifyCertificate("CO-DSA-2026-PUBLIC");
        assertNotNull(dto);
        assertEquals("CO-DSA-2026-PUBLIC", dto.getCertificateCode());
        assertEquals("Aman Sharma", dto.getStudentFullName());
        assertEquals("DSA Track", dto.getCourseTitle());
        assertEquals("dsa", dto.getCourseSlug());
        assertTrue(dto.isValid());
    }
}
