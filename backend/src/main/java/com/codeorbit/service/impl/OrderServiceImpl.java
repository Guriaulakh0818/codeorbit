package com.codeorbit.service.impl;

import com.codeorbit.dto.CreateOrderRequestDto;
import com.codeorbit.dto.OrderItemResponseDto;
import com.codeorbit.dto.OrderResponseDto;
import com.codeorbit.entity.Ebook;
import com.codeorbit.entity.Order;
import com.codeorbit.entity.OrderItem;
import com.codeorbit.entity.OrderStatus;
import com.codeorbit.entity.User;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.EbookRepository;
import com.codeorbit.repository.OrderRepository;
import com.codeorbit.repository.UserRepository;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final EbookRepository ebookRepository;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            UserRepository userRepository,
            EbookRepository ebookRepository
    ) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.ebookRepository = ebookRepository;
    }

    @Override
    @Transactional
    public OrderResponseDto createOrder(UserPrincipal principal, CreateOrderRequestDto request) {
        if (request.getEbookIds() == null || request.getEbookIds().isEmpty()) {
            throw new IllegalArgumentException("Cannot create order with an empty item list");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        BigDecimal totalAmount = BigDecimal.ZERO;

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String shortId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String orderNumber = "ORD-" + timestamp + "-" + shortId;

        Order order = new Order(orderNumber, user, BigDecimal.ZERO, OrderStatus.PENDING);

        for (Long ebookId : request.getEbookIds()) {
            Ebook ebook = ebookRepository.findById(ebookId)
                    .orElseThrow(() -> new ResourceNotFoundException("E-Book", "id", ebookId));

            if (!ebook.isActive()) {
                throw new IllegalStateException("E-Book '" + ebook.getTitle() + "' is currently unpublished and cannot be purchased.");
            }

            BigDecimal price = ebook.getPrice();
            totalAmount = totalAmount.add(price);

            OrderItem orderItem = new OrderItem(order, ebook, price);
            order.addItem(orderItem);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);
        log.info("Created internal order #{} with {} item(s), total: ₹{} for user: {}",
                savedOrder.getOrderNumber(), savedOrder.getItems().size(), savedOrder.getTotalAmount(), user.getEmail());

        return mapToDto(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getStudentOrders(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        List<Order> orders = orderRepository.findByUserWithItemsOrderByCreatedAtDesc(user);
        return orders.stream().map(this::mapToDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getStudentOrderById(UserPrincipal principal, Long orderId) {
        Order order = getOrderEntityByIdAndUser(orderId, principal);
        return mapToDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Order getOrderEntityByIdAndUser(Long orderId, UserPrincipal principal) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(principal.getId())) {
            log.warn("Access denied: User {} tried to access Order #{} belonging to User {}",
                    principal.getId(), orderId, order.getUser().getId());
            throw new AccessDeniedException("You do not have permission to view or pay for this order.");
        }

        return order;
    }

    @Override
    public OrderResponseDto mapToDto(Order order) {
        List<OrderItemResponseDto> itemDtos = order.getItems().stream()
                .map(item -> new OrderItemResponseDto(
                        item.getId(),
                        item.getEbook().getId(),
                        item.getEbook().getTitle(),
                        item.getEbook().getAuthorName(),
                        item.getEbook().getCategory(),
                        item.getPrice(),
                        item.getEbook().getCoverImageUrl()
                ))
                .toList();

        return new OrderResponseDto(
                order.getId(),
                order.getOrderNumber(),
                order.getTotalAmount(),
                order.getCurrency(),
                order.getStatus(),
                order.getRazorpayOrderId(),
                order.getRazorpayPaymentId(),
                order.getCreatedAt(),
                order.getPaidAt(),
                itemDtos
        );
    }
}
