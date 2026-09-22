package com.codeorbit.service;

import com.codeorbit.dto.*;
import com.codeorbit.entity.*;
import com.codeorbit.exception.BadRequestException;
import com.codeorbit.repository.*;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.impl.PlacementKitServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlacementKitServiceTest {

    @Mock
    private PlacementKitRepository kitRepository;
    @Mock
    private PlacementKitCategoryRepository categoryRepository;
    @Mock
    private PlacementKitQuestionRepository questionRepository;
    @Mock
    private PlacementKitOptionRepository optionRepository;
    @Mock
    private PlacementKitPaymentRepository paymentRepository;
    @Mock
    private PlacementKitEntitlementRepository entitlementRepository;
    @Mock
    private PlacementKitProgressRepository progressRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private RazorpayGatewayService razorpayGatewayService;

    private PlacementKitServiceImpl kitService;

    private User student;
    private UserPrincipal studentPrincipal;
    private PlacementKit fullStackKit;
    private PlacementKitCategory frontendCategory;
    private PlacementKitQuestion question1;
    private PlacementKitOption optA;
    private PlacementKitOption optB;
    private PlacementKitPayment samplePayment;

    @BeforeEach
    void setUp() {
        kitService = new PlacementKitServiceImpl(
                kitRepository,
                categoryRepository,
                questionRepository,
                optionRepository,
                paymentRepository,
                entitlementRepository,
                progressRepository,
                userRepository,
                razorpayGatewayService
        );

        student = new User("Aarav Patel", "aarav@codeorbit.dev", "$2a$10$hash", Role.STUDENT);
        student.setId(101L);
        studentPrincipal = UserPrincipal.create(student);

        fullStackKit = new PlacementKit(
                "full-stack-developer-kit",
                "Full Stack Developer Kit",
                "Full Stack Developer",
                "MERN & Java full stack questions",
                "Complete full stack guide",
                1
        );
        fullStackKit.setId(1L);

        frontendCategory = new PlacementKitCategory(fullStackKit, "Frontend Core", "frontend-core", "HTML/CSS/JS/React", 1);
        frontendCategory.setId(10L);

        question1 = new PlacementKitQuestion(
                frontendCategory,
                "What is the Virtual DOM in React?",
                PlacementKitQuestionType.MCQ,
                "MEDIUM",
                "It is an in-memory lightweight representation of the real DOM.",
                "Virtual DOM reconciles efficiently.",
                1,
                true
        );
        question1.setId(100L);
        question1.setLessonReferenceLabel("React DOM & Reconciliation");
        question1.setExternalReferenceUrl("/courses/react-track/lessons/virtual-dom");

        optA = new PlacementKitOption(question1, "In-memory DOM tree representation", true, 1);
        optA.setId(1001L);
        optB = new PlacementKitOption(question1, "Direct browser DOM node", false, 2);
        optB.setId(1002L);

        question1.setOptions(new ArrayList<>(List.of(optA, optB)));
        frontendCategory.setQuestions(new ArrayList<>(List.of(question1)));
        fullStackKit.setCategories(new ArrayList<>(List.of(frontendCategory)));

        samplePayment = new PlacementKitPayment(
                "PK-ORD-2026-001",
                student,
                fullStackKit,
                9900,
                "INR",
                PaymentStatus.CREATED
        );
        samplePayment.setId(501L);
        samplePayment.setRazorpayOrderId("order_rzp_pk_123");
    }

    @Test
    @DisplayName("Get Kit By Slug: Unentitled user receives isPurchased=false and answers are stripped")
    void testGetKitBySlug_Unentitled_MasksContent() {
        when(kitRepository.findBySlug("full-stack-developer-kit")).thenReturn(Optional.of(fullStackKit));
        when(entitlementRepository.existsByUserIdAndPlacementKitId(101L, 1L)).thenReturn(false);
        when(questionRepository.findSampleQuestionsByKitId(1L)).thenReturn(List.of(question1));
        when(categoryRepository.findByPlacementKitIdOrderByOrderIndexAsc(1L)).thenReturn(List.of(frontendCategory));

        PlacementKitDetailDto detail = kitService.getKitBySlug("full-stack-developer-kit", studentPrincipal);

        assertNotNull(detail);
        assertFalse(detail.isPurchased());
        assertEquals(1, detail.getSampleQuestions().size());
        // Answer key and explanations should be stripped in preview
        assertNull(detail.getSampleQuestions().get(0).getExplanation());
        assertNull(detail.getSampleQuestions().get(0).getModelAnswer());
    }

    @Test
    @DisplayName("Get Kit By Slug: Entitled user receives isPurchased=true and full question bank with answers")
    void testGetKitBySlug_Entitled_ReceivesFullContent() {
        when(kitRepository.findBySlug("full-stack-developer-kit")).thenReturn(Optional.of(fullStackKit));
        when(entitlementRepository.existsByUserIdAndPlacementKitId(101L, 1L)).thenReturn(true);
        when(categoryRepository.findByPlacementKitIdOrderByOrderIndexAsc(1L)).thenReturn(List.of(frontendCategory));
        when(questionRepository.findByCategoryIdAndActiveTrueOrderByOrderIndexAsc(10L)).thenReturn(List.of(question1));
        when(progressRepository.findByUserIdAndPlacementKitId(101L, 1L)).thenReturn(List.of());

        PlacementKitDetailDto detail = kitService.getKitBySlug("full-stack-developer-kit", studentPrincipal);

        assertNotNull(detail);
        assertTrue(detail.isPurchased());
        assertEquals(1, detail.getCategories().size());
        assertEquals(1, detail.getCategories().get(0).getQuestions().size());
        assertNotNull(detail.getCategories().get(0).getQuestions().get(0).getExplanation());
        assertEquals("React DOM & Reconciliation", detail.getCategories().get(0).getQuestions().get(0).getLessonReferenceLabel());
    }

    @Test
    @DisplayName("Create Kit Order: Strictly locks server price to ₹99 (9900 paise) and calls Razorpay")
    void testCreateKitOrder_Success() {
        when(userRepository.findById(101L)).thenReturn(Optional.of(student));
        when(kitRepository.findBySlug("full-stack-developer-kit")).thenReturn(Optional.of(fullStackKit));
        when(entitlementRepository.existsByUserIdAndPlacementKitId(101L, 1L)).thenReturn(false);
        when(razorpayGatewayService.createOrder(any(), eq(9900), eq("INR"))).thenReturn("order_rzp_pk_123");
        when(razorpayGatewayService.getKeyId()).thenReturn("rzp_test_key_id");
        when(paymentRepository.save(any(PlacementKitPayment.class))).thenAnswer(i -> {
            PlacementKitPayment p = i.getArgument(0);
            p.setId(501L);
            return p;
        });

        PlacementKitOrderResponseDto response = kitService.createKitOrder(studentPrincipal, "full-stack-developer-kit");

        assertNotNull(response);
        assertEquals(9900, response.getAmountPaise());
        assertEquals(99, response.getAmountInr());
        assertEquals("INR", response.getCurrency());
        assertEquals("order_rzp_pk_123", response.getRazorpayOrderId());
        assertEquals("full-stack-developer-kit", response.getKitSlug());
        assertEquals("Full Stack Developer Kit", response.getKitTitle());
        verify(razorpayGatewayService).createOrder(any(), eq(9900), eq("INR"));
    }

    @Test
    @DisplayName("Create Kit Order: Throws BadRequestException if student already owns the kit")
    void testCreateKitOrder_AlreadyPurchased() {
        when(userRepository.findById(101L)).thenReturn(Optional.of(student));
        when(kitRepository.findBySlug("full-stack-developer-kit")).thenReturn(Optional.of(fullStackKit));
        when(entitlementRepository.existsByUserIdAndPlacementKitId(101L, 1L)).thenReturn(true);

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                kitService.createKitOrder(studentPrincipal, "full-stack-developer-kit")
        );
        assertTrue(ex.getMessage().contains("already purchased"));
        verify(razorpayGatewayService, never()).createOrder(any(), anyInt(), any());
    }

    @Test
    @DisplayName("Verify Payment: Valid HMAC signature marks payment PAID and grants PlacementKitEntitlement")
    void testVerifyPayment_ValidSignature_GrantsEntitlement() {
        PlacementKitVerifyRequestDto request = new PlacementKitVerifyRequestDto(
                "order_rzp_pk_123",
                "pay_rzp_pk_456",
                "sig_valid_789"
        );

        when(paymentRepository.findByRazorpayOrderId("order_rzp_pk_123")).thenReturn(Optional.of(samplePayment));
        when(kitRepository.findBySlug("full-stack-developer-kit")).thenReturn(Optional.of(fullStackKit));
        when(razorpayGatewayService.verifySignature("order_rzp_pk_123", "pay_rzp_pk_456", "sig_valid_789"))
                .thenReturn(true);
        when(paymentRepository.save(any(PlacementKitPayment.class))).thenAnswer(i -> i.getArgument(0));
        when(entitlementRepository.existsByUserIdAndPlacementKitId(101L, 1L)).thenReturn(false);
        when(categoryRepository.findByPlacementKitIdOrderByOrderIndexAsc(1L)).thenReturn(List.of());

        PlacementKitDetailDto result = kitService.verifyAndFulfillKitPayment(studentPrincipal, "full-stack-developer-kit", request);

        assertNotNull(result);
        assertEquals(PaymentStatus.PAID, samplePayment.getStatus());
        verify(entitlementRepository).save(any(PlacementKitEntitlement.class));
    }

    @Test
    @DisplayName("Verify Payment: Idempotent when called repeatedly on already PAID order")
    void testVerifyPayment_Idempotent() {
        samplePayment.setStatus(PaymentStatus.PAID);
        samplePayment.setPaidAt(LocalDateTime.now());

        PlacementKitVerifyRequestDto request = new PlacementKitVerifyRequestDto(
                "order_rzp_pk_123",
                "pay_rzp_pk_456",
                "sig_valid_789"
        );

        when(paymentRepository.findByRazorpayOrderId("order_rzp_pk_123")).thenReturn(Optional.of(samplePayment));
        when(kitRepository.findBySlug("full-stack-developer-kit")).thenReturn(Optional.of(fullStackKit));
        when(entitlementRepository.existsByUserIdAndPlacementKitId(101L, 1L)).thenReturn(true);
        when(categoryRepository.findByPlacementKitIdOrderByOrderIndexAsc(1L)).thenReturn(List.of());

        PlacementKitDetailDto result = kitService.verifyAndFulfillKitPayment(studentPrincipal, "full-stack-developer-kit", request);

        assertNotNull(result);
        verify(razorpayGatewayService, never()).verifySignature(any(), any(), any());
        verify(entitlementRepository, never()).save(any());
    }

    @Test
    @DisplayName("Verify Payment: Invalid signature marks payment FAILED and throws BadRequestException")
    void testVerifyPayment_InvalidSignature_Fails() {
        PlacementKitVerifyRequestDto request = new PlacementKitVerifyRequestDto(
                "order_rzp_pk_123",
                "pay_rzp_pk_456",
                "sig_invalid_bad"
        );

        when(paymentRepository.findByRazorpayOrderId("order_rzp_pk_123")).thenReturn(Optional.of(samplePayment));
        when(kitRepository.findBySlug("full-stack-developer-kit")).thenReturn(Optional.of(fullStackKit));
        when(razorpayGatewayService.verifySignature("order_rzp_pk_123", "pay_rzp_pk_456", "sig_invalid_bad"))
                .thenReturn(false);
        when(paymentRepository.save(any(PlacementKitPayment.class))).thenAnswer(i -> i.getArgument(0));

        assertThrows(BadRequestException.class, () ->
                kitService.verifyAndFulfillKitPayment(studentPrincipal, "full-stack-developer-kit", request)
        );

        assertEquals(PaymentStatus.FAILED, samplePayment.getStatus());
        verify(entitlementRepository, never()).save(any());
    }

    @Test
    @DisplayName("Verify Payment: Enforces student isolation (Student A cannot verify Student B's order)")
    void testVerifyPayment_StudentIsolation() {
        User anotherStudent = new User("Priya Patel", "priya@student.edu", "$2a$10$hash", Role.STUDENT);
        anotherStudent.setId(999L);
        UserPrincipal anotherPrincipal = UserPrincipal.create(anotherStudent);

        PlacementKitVerifyRequestDto request = new PlacementKitVerifyRequestDto(
                "order_rzp_pk_123",
                "pay_rzp_pk_456",
                "sig_valid_789"
        );

        when(paymentRepository.findByRazorpayOrderId("order_rzp_pk_123")).thenReturn(Optional.of(samplePayment));

        assertThrows(AccessDeniedException.class, () ->
                kitService.verifyAndFulfillKitPayment(anotherPrincipal, "full-stack-developer-kit", request)
        );
        verify(razorpayGatewayService, never()).verifySignature(any(), any(), any());
    }

    @Test
    @DisplayName("Submit Practice Answer: Evaluates MCQ correctness and saves progress")
    void testSubmitPracticeAnswer_EvaluatesMCQCorrectness() {
        PlacementKitPracticeSubmitDto submitDto = new PlacementKitPracticeSubmitDto(1001L, "My notes");

        when(userRepository.findById(101L)).thenReturn(Optional.of(student));
        when(kitRepository.findBySlug("full-stack-developer-kit")).thenReturn(Optional.of(fullStackKit));
        when(questionRepository.findById(100L)).thenReturn(Optional.of(question1));
        when(entitlementRepository.existsByUserIdAndPlacementKitId(101L, 1L)).thenReturn(true);
        when(optionRepository.findByQuestionIdOrderByOrderIndexAsc(100L)).thenReturn(List.of(optA, optB));
        when(progressRepository.findByUserIdAndQuestionId(101L, 100L)).thenReturn(Optional.empty());
        when(progressRepository.save(any(PlacementKitProgress.class))).thenAnswer(i -> i.getArgument(0));

        PlacementKitPracticeResultDto result = kitService.submitPracticeAnswer(studentPrincipal, "full-stack-developer-kit", 100L, submitDto);

        assertNotNull(result);
        assertTrue(result.isCorrect());
        assertEquals("React DOM & Reconciliation", result.getLessonReferenceLabel());
        verify(progressRepository).save(any(PlacementKitProgress.class));
    }

    @Test
    @DisplayName("Submit Practice Answer: Denies access if user is not entitled to the kit")
    void testSubmitPracticeAnswer_Unentitled_AccessDenied() {
        PlacementKitPracticeSubmitDto submitDto = new PlacementKitPracticeSubmitDto(1001L, null);

        when(userRepository.findById(101L)).thenReturn(Optional.of(student));
        when(kitRepository.findBySlug("full-stack-developer-kit")).thenReturn(Optional.of(fullStackKit));
        when(entitlementRepository.existsByUserIdAndPlacementKitId(101L, 1L)).thenReturn(false);

        assertThrows(AccessDeniedException.class, () ->
                kitService.submitPracticeAnswer(studentPrincipal, "full-stack-developer-kit", 100L, submitDto)
        );
        verify(progressRepository, never()).save(any());
    }
}
