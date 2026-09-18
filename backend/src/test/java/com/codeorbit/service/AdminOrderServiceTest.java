package com.codeorbit.service;

import com.codeorbit.dto.AdminDashboardMetricsDto;
import com.codeorbit.dto.AdminOrderResponseDto;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.entity.*;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.EbookRepository;
import com.codeorbit.repository.OrderRepository;
import com.codeorbit.repository.UserRepository;
import com.codeorbit.service.impl.AdminOrderServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminOrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private EbookRepository ebookRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AdminOrderServiceImpl adminOrderService;

    private User sampleStudent;
    private Ebook sampleEbook;
    private Order samplePaidOrder;
    private Order samplePendingOrder;

    @BeforeEach
    void setUp() {
        sampleStudent = new User("Rahul Sharma", "rahul.student@codeorbit.dev", "hash_pw", Role.STUDENT);
        sampleStudent.setId(10L);

        sampleEbook = new Ebook(
                "Core Java Handbook",
                "Prof. Aditya Sharma",
                "Java",
                "Comprehensive Java guide",
                new BigDecimal("499.00"),
                340,
                "https://example.com/cover.jpg",
                true
        );
        sampleEbook.setId(1L);

        samplePaidOrder = new Order("ORD-2026-001", sampleStudent, new BigDecimal("499.00"), OrderStatus.PAID);
        samplePaidOrder.setId(100L);
        samplePaidOrder.setRazorpayOrderId("order_test_123");
        samplePaidOrder.setRazorpayPaymentId("pay_test_456");
        samplePaidOrder.setCreatedAt(LocalDateTime.now().minusDays(1));
        samplePaidOrder.setPaidAt(LocalDateTime.now().minusDays(1));

        OrderItem item = new OrderItem(samplePaidOrder, sampleEbook, new BigDecimal("499.00"));
        samplePaidOrder.addItem(item);

        samplePendingOrder = new Order("ORD-2026-002", sampleStudent, new BigDecimal("499.00"), OrderStatus.PENDING);
        samplePendingOrder.setId(101L);
        samplePendingOrder.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void testGetAllAdminOrders_ReturnsPaginatedOrders() {
        Page<Order> page = new PageImpl<>(List.of(samplePaidOrder, samplePendingOrder));
        when(orderRepository.searchAdminOrders(isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        PagedResponseDto<AdminOrderResponseDto> response = adminOrderService.getAllAdminOrders(
                null, null, null, null, 0, 10, "createdAt", "desc"
        );

        assertNotNull(response);
        assertEquals(2, response.getContent().size());
        assertEquals(2, response.getTotalElements());

        AdminOrderResponseDto dto1 = response.getContent().get(0);
        assertEquals(100L, dto1.getId());
        assertEquals("ORD-2026-001", dto1.getOrderNumber());
        assertEquals("Rahul Sharma", dto1.getStudentName());
        assertEquals("rahul.student@codeorbit.dev", dto1.getStudentEmail());
        assertEquals(OrderStatus.PAID, dto1.getStatus());
        assertEquals(1, dto1.getItemCount());
        assertEquals("Core Java Handbook", dto1.getItems().get(0).getEbookTitle());
    }

    @Test
    void testGetAllAdminOrders_WithStatusFilter() {
        Page<Order> page = new PageImpl<>(List.of(samplePaidOrder));
        when(orderRepository.searchAdminOrders(isNull(), eq(OrderStatus.PAID), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        PagedResponseDto<AdminOrderResponseDto> response = adminOrderService.getAllAdminOrders(
                null, OrderStatus.PAID, null, null, 0, 10, "createdAt", "desc"
        );

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals(OrderStatus.PAID, response.getContent().get(0).getStatus());
    }

    @Test
    void testGetAdminOrderById_Success() {
        when(orderRepository.findByIdWithUserAndItems(100L)).thenReturn(Optional.of(samplePaidOrder));

        AdminOrderResponseDto dto = adminOrderService.getAdminOrderById(100L);

        assertNotNull(dto);
        assertEquals(100L, dto.getId());
        assertEquals("ORD-2026-001", dto.getOrderNumber());
        assertEquals("Rahul Sharma", dto.getStudentName());
        assertEquals("rahul.student@codeorbit.dev", dto.getStudentEmail());
        assertEquals(new BigDecimal("499.00"), dto.getTotalAmount());
        assertEquals("pay_test_456", dto.getRazorpayPaymentId());
    }

    @Test
    void testGetAdminOrderById_NotFound_ThrowsException() {
        when(orderRepository.findByIdWithUserAndItems(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> adminOrderService.getAdminOrderById(999L));
    }

    @Test
    void testGetAdminDashboardMetrics_CalculatesDynamicDatabaseMetrics() {
        when(ebookRepository.count()).thenReturn(15L);
        when(ebookRepository.countByActive(true)).thenReturn(12L);
        when(ebookRepository.countByActive(false)).thenReturn(3L);

        when(orderRepository.count()).thenReturn(45L);
        when(orderRepository.countByStatus(OrderStatus.PAID)).thenReturn(35L);
        when(orderRepository.countByStatus(OrderStatus.PENDING)).thenReturn(7L);
        when(orderRepository.countByStatus(OrderStatus.FAILED)).thenReturn(3L);

        when(orderRepository.calculateTotalPaidRevenue()).thenReturn(new BigDecimal("17465.00"));
        when(userRepository.countByRole(Role.STUDENT)).thenReturn(28L);

        AdminDashboardMetricsDto metrics = adminOrderService.getAdminDashboardMetrics();

        assertNotNull(metrics);
        assertEquals(15L, metrics.getTotalEbooks());
        assertEquals(12L, metrics.getPublishedEbooks());
        assertEquals(3L, metrics.getUnpublishedEbooks());

        assertEquals(45L, metrics.getTotalOrders());
        assertEquals(35L, metrics.getPaidOrders());
        assertEquals(7L, metrics.getPendingOrders());
        assertEquals(3L, metrics.getFailedOrders());

        // Revenue includes PAID orders only
        assertEquals(new BigDecimal("17465.00"), metrics.getTotalRevenue());
        assertEquals(28L, metrics.getTotalStudents());
    }
}
