package com.codeorbit.service;

import com.codeorbit.dto.OrderResponseDto;
import com.codeorbit.dto.PaymentVerificationRequestDto;
import com.codeorbit.dto.RazorpayOrderCreationDto;
import com.codeorbit.dto.RazorpayOrderResponseDto;
import com.codeorbit.entity.Order;
import com.codeorbit.entity.OrderStatus;
import com.codeorbit.entity.Role;
import com.codeorbit.entity.User;
import com.codeorbit.repository.OrderRepository;
import com.codeorbit.security.RazorpaySignatureService;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.impl.PaymentServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderService orderService;

    private RazorpaySignatureService signatureService;
    private ObjectMapper objectMapper;
    private PaymentServiceImpl paymentService;

    private User student;
    private UserPrincipal studentPrincipal;
    private Order sampleOrder;
    private final String testKeySecret = "test_key_secret_123456";
    private final String testWebhookSecret = "test_webhook_secret_789";

    @BeforeEach
    void setUp() {
        signatureService = new RazorpaySignatureService();
        objectMapper = new ObjectMapper();
        paymentService = new PaymentServiceImpl(orderRepository, orderService, signatureService, objectMapper);

        ReflectionTestUtils.setField(paymentService, "razorpayKeyId", "rzp_test_mockId");
        ReflectionTestUtils.setField(paymentService, "razorpayKeySecret", testKeySecret);
        ReflectionTestUtils.setField(paymentService, "razorpayWebhookSecret", testWebhookSecret);

        student = new User("Aman Verma", "aman.student@codeorbit.dev", "hash", Role.STUDENT);
        student.setId(5L);
        studentPrincipal = UserPrincipal.create(student);

        sampleOrder = new Order("ORD-2026-001", student, new BigDecimal("499.00"), OrderStatus.PENDING);
        sampleOrder.setId(10L);
    }

    @Test
    @DisplayName("Should create Razorpay order in test mode with accurate paise amount")
    void testCreateRazorpayOrder_Success() {
        when(orderService.getOrderEntityByIdAndUser(10L, studentPrincipal)).thenReturn(sampleOrder);
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        RazorpayOrderResponseDto response = paymentService.createRazorpayOrder(studentPrincipal, new RazorpayOrderCreationDto(10L));

        assertNotNull(response);
        assertNotNull(response.getRazorpayOrderId());
        assertEquals(49900L, response.getAmountInPaise());
        assertEquals(new BigDecimal("499.00"), response.getAmountInRupees());
        assertEquals("INR", response.getCurrency());
        verify(orderRepository, times(1)).save(sampleOrder);
    }

    @Test
    @DisplayName("Should mark order PAID upon valid HMAC-SHA256 signature verification")
    void testVerifyPayment_ValidSignature_MarksPaid() {
        String rzpOrderId = "order_rzp_123";
        String rzpPaymentId = "pay_rzp_456";
        String validSignature = signatureService.calculateHmacSha256(rzpOrderId + "|" + rzpPaymentId, testKeySecret);

        sampleOrder.setRazorpayOrderId(rzpOrderId);

        when(orderRepository.findByRazorpayOrderId(rzpOrderId)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);
        when(orderService.mapToDto(any(Order.class))).thenAnswer(i -> {
            Order o = i.getArgument(0);
            OrderResponseDto dto = new OrderResponseDto();
            dto.setStatus(o.getStatus());
            dto.setRazorpayPaymentId(o.getRazorpayPaymentId());
            return dto;
        });

        PaymentVerificationRequestDto dto = new PaymentVerificationRequestDto(rzpOrderId, rzpPaymentId, validSignature);
        OrderResponseDto response = paymentService.verifyPayment(studentPrincipal, dto);

        assertNotNull(response);
        assertEquals(OrderStatus.PAID, response.getStatus());
        assertEquals(rzpPaymentId, response.getRazorpayPaymentId());
        assertEquals(OrderStatus.PAID, sampleOrder.getStatus());
        assertNotNull(sampleOrder.getPaidAt());
        verify(orderRepository, times(1)).save(sampleOrder);
    }

    @Test
    @DisplayName("Should reject invalid signature and mark order FAILED")
    void testVerifyPayment_InvalidSignature_MarksFailedAndThrows() {
        String rzpOrderId = "order_rzp_123";
        String rzpPaymentId = "pay_rzp_456";
        String invalidSignature = "invalid_signature_hex_code_here";

        sampleOrder.setRazorpayOrderId(rzpOrderId);

        when(orderRepository.findByRazorpayOrderId(rzpOrderId)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        PaymentVerificationRequestDto dto = new PaymentVerificationRequestDto(rzpOrderId, rzpPaymentId, invalidSignature);

        assertThrows(IllegalArgumentException.class, () -> paymentService.verifyPayment(studentPrincipal, dto));
        assertEquals(OrderStatus.FAILED, sampleOrder.getStatus());
        verify(orderRepository, times(1)).save(sampleOrder);
    }

    @Test
    @DisplayName("Should prevent cross-user payment verification attempts")
    void testVerifyPayment_CrossUser_ThrowsAccessDenied() {
        User otherStudent = new User("Other Student", "other@student.com", "hash", Role.STUDENT);
        otherStudent.setId(99L);
        sampleOrder.setUser(otherStudent);
        sampleOrder.setRazorpayOrderId("order_rzp_123");

        when(orderRepository.findByRazorpayOrderId("order_rzp_123")).thenReturn(Optional.of(sampleOrder));

        PaymentVerificationRequestDto dto = new PaymentVerificationRequestDto("order_rzp_123", "pay_456", "sig_789");

        assertThrows(AccessDeniedException.class, () -> paymentService.verifyPayment(studentPrincipal, dto));
        verify(orderRepository, never()).save(sampleOrder);
    }

    @Test
    @DisplayName("Should handle duplicate payment verification idempotently")
    void testVerifyPayment_AlreadyPaid_IdempotentSuccess() {
        sampleOrder.setStatus(OrderStatus.PAID);
        sampleOrder.setRazorpayOrderId("order_rzp_123");
        sampleOrder.setRazorpayPaymentId("pay_already_recorded");
        sampleOrder.setPaidAt(LocalDateTime.now());

        when(orderRepository.findByRazorpayOrderId("order_rzp_123")).thenReturn(Optional.of(sampleOrder));
        when(orderService.mapToDto(sampleOrder)).thenReturn(new OrderResponseDto());

        PaymentVerificationRequestDto dto = new PaymentVerificationRequestDto("order_rzp_123", "pay_already_recorded", "some_sig");
        OrderResponseDto response = paymentService.verifyPayment(studentPrincipal, dto);

        assertNotNull(response);
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    @DisplayName("Should process valid webhook payment.captured event idempotently")
    void testHandleWebhook_PaymentCaptured_Success() {
        String rzpOrderId = "order_rzp_999";
        sampleOrder.setRazorpayOrderId(rzpOrderId);

        String rawJson = "{\"event\":\"payment.captured\",\"payload\":{\"payment\":{\"entity\":{\"id\":\"pay_captured_111\",\"order_id\":\"order_rzp_999\"}}}}";
        String validWebhookSig = signatureService.calculateHmacSha256(rawJson, testWebhookSecret);

        when(orderRepository.findByRazorpayOrderId(rzpOrderId)).thenReturn(Optional.of(sampleOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        paymentService.handleWebhook(rawJson, validWebhookSig);

        assertEquals(OrderStatus.PAID, sampleOrder.getStatus());
        assertEquals("pay_captured_111", sampleOrder.getRazorpayPaymentId());
        verify(orderRepository, times(1)).save(sampleOrder);
    }

    @Test
    @DisplayName("Should reject webhook with invalid signature")
    void testHandleWebhook_InvalidSignature_ThrowsException() {
        String rawJson = "{\"event\":\"payment.captured\"}";
        String badSig = "invalid_signature_mock";

        assertThrows(IllegalArgumentException.class, () -> paymentService.handleWebhook(rawJson, badSig));
        verify(orderRepository, never()).save(any(Order.class));
    }
}
