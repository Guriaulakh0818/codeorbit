package com.codeorbit.service;

import com.codeorbit.dto.CreateOrderRequestDto;
import com.codeorbit.dto.OrderResponseDto;
import com.codeorbit.entity.Ebook;
import com.codeorbit.entity.Order;
import com.codeorbit.entity.OrderStatus;
import com.codeorbit.entity.Role;
import com.codeorbit.entity.User;
import com.codeorbit.repository.EbookRepository;
import com.codeorbit.repository.OrderRepository;
import com.codeorbit.repository.UserRepository;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.impl.OrderServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EbookRepository ebookRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private User student;
    private UserPrincipal studentPrincipal;
    private Ebook javaBook;
    private Ebook dsaBook;

    @BeforeEach
    void setUp() {
        student = new User("Rahul Verma", "rahul.student@codeorbit.dev", "hashed_pass", Role.STUDENT);
        student.setId(10L);
        studentPrincipal = UserPrincipal.create(student);

        javaBook = new Ebook("Java Handbook", "Sharma", "Java", "Desc", new BigDecimal("499.00"), 300, "cover.jpg", true);
        javaBook.setId(1L);

        dsaBook = new Ebook("DSA in C++", "Roy", "DSA", "Desc", new BigDecimal("599.00"), 400, "cover.jpg", true);
        dsaBook.setId(2L);
    }

    @Test
    @DisplayName("Should create order calculating exact prices from DB active records")
    void testCreateOrder_Success() {
        CreateOrderRequestDto request = new CreateOrderRequestDto(List.of(1L, 2L));

        when(userRepository.findById(10L)).thenReturn(Optional.of(student));
        when(ebookRepository.findById(1L)).thenReturn(Optional.of(javaBook));
        when(ebookRepository.findById(2L)).thenReturn(Optional.of(dsaBook));

        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            o.setId(100L);
            return o;
        });

        OrderResponseDto result = orderService.createOrder(studentPrincipal, request);

        assertNotNull(result);
        assertEquals(new BigDecimal("1098.00"), result.getTotalAmount());
        assertEquals(OrderStatus.PENDING, result.getStatus());
        assertEquals(2, result.getItems().size());
        assertTrue(result.getOrderNumber().startsWith("ORD-"));
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    @DisplayName("Should throw exception when attempting to order unpublished e-book")
    void testCreateOrder_UnpublishedEbook_ThrowsException() {
        javaBook.setActive(false);
        CreateOrderRequestDto request = new CreateOrderRequestDto(List.of(1L));

        when(userRepository.findById(10L)).thenReturn(Optional.of(student));
        when(ebookRepository.findById(1L)).thenReturn(Optional.of(javaBook));

        assertThrows(IllegalStateException.class, () -> orderService.createOrder(studentPrincipal, request));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    @DisplayName("Should reject cross-user order retrieval")
    void testGetOrder_CrossUser_ThrowsAccessDenied() {
        User otherUser = new User("Other User", "other@example.com", "pass", Role.STUDENT);
        otherUser.setId(99L);

        Order order = new Order("ORD-123", otherUser, new BigDecimal("499.00"), OrderStatus.PENDING);
        order.setId(50L);

        when(orderRepository.findByIdWithItems(50L)).thenReturn(Optional.of(order));

        assertThrows(AccessDeniedException.class, () -> orderService.getOrderEntityByIdAndUser(50L, studentPrincipal));
    }
}
