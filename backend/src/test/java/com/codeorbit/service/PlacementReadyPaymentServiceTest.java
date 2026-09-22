package com.codeorbit.service;

import com.codeorbit.dto.*;
import com.codeorbit.entity.*;
import com.codeorbit.exception.BadRequestException;
import com.codeorbit.repository.*;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.impl.PlacementReadyPaymentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlacementReadyPaymentServiceTest {

    @Mock
    private PlacementReadyPaymentRepository paymentRepository;

    @Mock
    private PlacementReadyEntitlementRepository entitlementRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private SubcourseRepository subcourseRepository;

    @Mock
    private RazorpayGatewayService razorpayGatewayService;

    private PlacementReadyPaymentServiceImpl paymentService;

    private User student;
    private UserPrincipal studentPrincipal;
    private Course dsaCourse;
    private Subcourse dsaPlacementReady;
    private PlacementReadyPayment samplePayment;

    @BeforeEach
    void setUp() {
        paymentService = new PlacementReadyPaymentServiceImpl(
                paymentRepository,
                entitlementRepository,
                userRepository,
                courseRepository,
                subcourseRepository,
                razorpayGatewayService
        );

        student = new User("Rahul Sharma", "rahul@student.edu", "$2a$10$hash", Role.STUDENT);
        student.setId(101L);
        studentPrincipal = UserPrincipal.create(student);

        dsaCourse = new Course();
        dsaCourse.setId(10L);
        dsaCourse.setTitle("Data Structures & Algorithms");
        dsaCourse.setSlug("dsa");

        dsaPlacementReady = new Subcourse(
                dsaCourse,
                CurriculumLevel.PLACEMENT_READY,
                "DSA — Placement Ready Top Interview Kit",
                "dsa-placement-ready",
                "FAANG questions",
                29,
                false,
                4,
                PublishStatus.PUBLISHED
        );
        dsaPlacementReady.setId(40L);

        samplePayment = new PlacementReadyPayment(
                "PR-ORD-2026-001",
                student,
                dsaCourse,
                dsaPlacementReady,
                2900,
                "INR",
                PaymentStatus.CREATED
        );
        samplePayment.setId(501L);
        samplePayment.setRazorpayOrderId("order_rzp_mock_123");
    }

    @Test
    @DisplayName("Create Placement Ready Order: Successfully locks price to ₹29 (2900 paise) and calls Razorpay gateway")
    void testCreatePlacementReadyOrder_Success() {
        when(userRepository.findById(101L)).thenReturn(Optional.of(student));
        when(courseRepository.findBySlug("dsa")).thenReturn(Optional.of(dsaCourse));
        when(subcourseRepository.findByCourseIdAndCurriculumLevel(10L, CurriculumLevel.PLACEMENT_READY))
                .thenReturn(Optional.of(dsaPlacementReady));
        when(entitlementRepository.existsByUserIdAndCourseId(101L, 10L)).thenReturn(false);
        when(razorpayGatewayService.createOrder(any(), eq(2900), eq("INR"))).thenReturn("order_rzp_mock_123");
        when(razorpayGatewayService.getKeyId()).thenReturn("rzp_test_key_id");
        when(paymentRepository.save(any(PlacementReadyPayment.class))).thenAnswer(i -> {
            PlacementReadyPayment p = i.getArgument(0);
            p.setId(501L);
            return p;
        });

        PlacementReadyOrderResponseDto response = paymentService.createPlacementReadyOrder(studentPrincipal, "dsa");

        assertNotNull(response);
        assertEquals(2900, response.getAmountPaise());
        assertEquals(29, response.getAmountInr());
        assertEquals("INR", response.getCurrency());
        assertEquals("order_rzp_mock_123", response.getRazorpayOrderId());
        assertEquals("dsa", response.getCourseSlug());
        assertEquals("DSA — Placement Ready Top Interview Kit", response.getSubcourseTitle());
        verify(razorpayGatewayService).createOrder(any(), eq(2900), eq("INR"));
    }

    @Test
    @DisplayName("Create Placement Ready Order: Rejects if student already holds active entitlement")
    void testCreatePlacementReadyOrder_AlreadyPurchased() {
        when(userRepository.findById(101L)).thenReturn(Optional.of(student));
        when(courseRepository.findBySlug("dsa")).thenReturn(Optional.of(dsaCourse));
        when(subcourseRepository.findByCourseIdAndCurriculumLevel(10L, CurriculumLevel.PLACEMENT_READY))
                .thenReturn(Optional.of(dsaPlacementReady));
        when(entitlementRepository.existsByUserIdAndCourseId(101L, 10L)).thenReturn(true);

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                paymentService.createPlacementReadyOrder(studentPrincipal, "dsa")
        );
        assertTrue(ex.getMessage().contains("already purchased"));
        verify(razorpayGatewayService, never()).createOrder(any(), anyInt(), any());
    }

    @Test
    @DisplayName("Verify Payment: Valid signature marks payment PAID and grants entitlement")
    void testVerifyPayment_ValidSignature_GrantsEntitlement() {
        PlacementReadyVerifyRequestDto request = new PlacementReadyVerifyRequestDto(
                "PR-ORD-2026-001",
                "order_rzp_mock_123",
                "pay_rzp_mock_456",
                "sig_valid_789"
        );

        when(paymentRepository.findByOrderNumber("PR-ORD-2026-001")).thenReturn(Optional.of(samplePayment));
        when(razorpayGatewayService.verifySignature("order_rzp_mock_123", "pay_rzp_mock_456", "sig_valid_789"))
                .thenReturn(true);
        when(paymentRepository.save(any(PlacementReadyPayment.class))).thenAnswer(i -> i.getArgument(0));
        when(entitlementRepository.existsByUserIdAndCourseId(101L, 10L)).thenReturn(false);

        PlacementReadyPaymentSummaryDto summary = paymentService.verifyPayment(studentPrincipal, request);

        assertNotNull(summary);
        assertEquals(PaymentStatus.PAID, summary.getStatus());
        assertTrue(summary.isEntitlementActive());
        verify(entitlementRepository).save(any(PlacementReadyEntitlement.class));
    }

    @Test
    @DisplayName("Verify Payment: Idempotent when called again on already PAID order")
    void testVerifyPayment_Idempotent() {
        samplePayment.setStatus(PaymentStatus.PAID);
        samplePayment.setPaidAt(LocalDateTime.now());

        PlacementReadyVerifyRequestDto request = new PlacementReadyVerifyRequestDto(
                "PR-ORD-2026-001",
                "order_rzp_mock_123",
                "pay_rzp_mock_456",
                "sig_valid_789"
        );

        when(paymentRepository.findByOrderNumber("PR-ORD-2026-001")).thenReturn(Optional.of(samplePayment));
        when(entitlementRepository.existsByUserIdAndCourseId(101L, 10L)).thenReturn(true);

        PlacementReadyPaymentSummaryDto summary = paymentService.verifyPayment(studentPrincipal, request);

        assertNotNull(summary);
        assertEquals(PaymentStatus.PAID, summary.getStatus());
        assertTrue(summary.isEntitlementActive());
        verify(razorpayGatewayService, never()).verifySignature(any(), any(), any());
        verify(entitlementRepository, never()).save(any());
    }

    @Test
    @DisplayName("Verify Payment: Invalid signature marks payment FAILED and throws BadRequestException")
    void testVerifyPayment_InvalidSignature_Fails() {
        PlacementReadyVerifyRequestDto request = new PlacementReadyVerifyRequestDto(
                "PR-ORD-2026-001",
                "order_rzp_mock_123",
                "pay_rzp_mock_456",
                "sig_invalid_bad"
        );

        when(paymentRepository.findByOrderNumber("PR-ORD-2026-001")).thenReturn(Optional.of(samplePayment));
        when(razorpayGatewayService.verifySignature("order_rzp_mock_123", "pay_rzp_mock_456", "sig_invalid_bad"))
                .thenReturn(false);
        when(paymentRepository.save(any(PlacementReadyPayment.class))).thenAnswer(i -> i.getArgument(0));

        assertThrows(BadRequestException.class, () ->
                paymentService.verifyPayment(studentPrincipal, request)
        );

        assertEquals(PaymentStatus.FAILED, samplePayment.getStatus());
        verify(entitlementRepository, never()).save(any());
    }

    @Test
    @DisplayName("Verify Payment: Tampered order ID is rejected")
    void testVerifyPayment_TamperedOrderId_Rejected() {
        PlacementReadyVerifyRequestDto request = new PlacementReadyVerifyRequestDto(
                "PR-ORD-2026-001",
                "order_rzp_tampered_999",
                "pay_rzp_mock_456",
                "sig_valid_789"
        );

        when(paymentRepository.findByOrderNumber("PR-ORD-2026-001")).thenReturn(Optional.of(samplePayment));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                paymentService.verifyPayment(studentPrincipal, request)
        );
        assertTrue(ex.getMessage().contains("mismatch"));
        verify(razorpayGatewayService, never()).verifySignature(any(), any(), any());
    }

    @Test
    @DisplayName("Verify Payment: Student A cannot verify payment belonging to Student B (Isolation)")
    void testVerifyPayment_StudentIsolation() {
        User anotherStudent = new User("Priya Patel", "priya@student.edu", "$2a$10$hash", Role.STUDENT);
        anotherStudent.setId(999L);
        UserPrincipal anotherPrincipal = UserPrincipal.create(anotherStudent);

        PlacementReadyVerifyRequestDto request = new PlacementReadyVerifyRequestDto(
                "PR-ORD-2026-001",
                "order_rzp_mock_123",
                "pay_rzp_mock_456",
                "sig_valid_789"
        );

        when(paymentRepository.findByOrderNumber("PR-ORD-2026-001")).thenReturn(Optional.of(samplePayment));

        assertThrows(AccessDeniedException.class, () ->
                paymentService.verifyPayment(anotherPrincipal, request)
        );
        verify(razorpayGatewayService, never()).verifySignature(any(), any(), any());
    }

    @Test
    @DisplayName("Get Student Payments: Returns payments isolated to authenticated student")
    void testGetStudentPayments_Isolation() {
        samplePayment.setStatus(PaymentStatus.PAID);
        when(paymentRepository.findByUserIdWithDetailsOrderByCreatedAtDesc(101L))
                .thenReturn(List.of(samplePayment));
        when(entitlementRepository.existsByUserIdAndCourseId(101L, 10L)).thenReturn(true);

        List<PlacementReadyPaymentSummaryDto> payments = paymentService.getStudentPayments(studentPrincipal);

        assertEquals(1, payments.size());
        assertEquals("PR-ORD-2026-001", payments.get(0).getOrderNumber());
        assertEquals(29, payments.get(0).getAmountInr());
        assertTrue(payments.get(0).isEntitlementActive());
    }
}
