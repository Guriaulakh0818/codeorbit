package com.codeorbit.service.impl;

import com.codeorbit.dto.*;
import com.codeorbit.entity.Order;
import com.codeorbit.entity.OrderItem;
import com.codeorbit.entity.OrderStatus;
import com.codeorbit.entity.Role;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.EbookRepository;
import com.codeorbit.repository.OrderRepository;
import com.codeorbit.repository.UserRepository;
import com.codeorbit.service.AdminOrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminOrderServiceImpl implements AdminOrderService {

    private static final Logger log = LoggerFactory.getLogger(AdminOrderServiceImpl.class);

    private final OrderRepository orderRepository;
    private final EbookRepository ebookRepository;
    private final UserRepository userRepository;

    public AdminOrderServiceImpl(
            OrderRepository orderRepository,
            EbookRepository ebookRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.ebookRepository = ebookRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponseDto<AdminOrderResponseDto> getAllAdminOrders(
            String search,
            OrderStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        String cleanSearch = StringUtils.hasText(search) ? search.trim() : null;

        // Safe sort validation
        String validSortBy = "createdAt";
        if (StringUtils.hasText(sortBy)) {
            String lower = sortBy.trim().toLowerCase();
            if (lower.equals("totalamount") || lower.equals("ordernumber") || lower.equals("status") || lower.equals("createdat")) {
                validSortBy = lower.equals("totalamount") ? "totalAmount"
                        : lower.equals("ordernumber") ? "orderNumber"
                        : lower.equals("status") ? "status"
                        : "createdAt";
            }
        }

        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, Math.min(size, 100)), Sort.by(direction, validSortBy));

        Page<Order> orderPage = orderRepository.searchAdminOrders(cleanSearch, status, startDate, endDate, pageable);

        List<AdminOrderResponseDto> content = orderPage.getContent()
                .stream()
                .map(this::mapToAdminOrderDto)
                .collect(Collectors.toList());

        return new PagedResponseDto<>(
                content,
                orderPage.getNumber(),
                orderPage.getSize(),
                orderPage.getTotalElements(),
                orderPage.getTotalPages(),
                orderPage.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public AdminOrderResponseDto getAdminOrderById(Long id) {
        Order order = orderRepository.findByIdWithUserAndItems(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        return mapToAdminOrderDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardMetricsDto getAdminDashboardMetrics() {
        long totalEbooks = ebookRepository.count();
        long publishedEbooks = ebookRepository.countByActive(true);
        long unpublishedEbooks = ebookRepository.countByActive(false);

        long totalOrders = orderRepository.count();
        long paidOrders = orderRepository.countByStatus(OrderStatus.PAID);
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long failedOrders = orderRepository.countByStatus(OrderStatus.FAILED);

        BigDecimal totalRevenue = orderRepository.calculateTotalPaidRevenue();
        long totalStudents = userRepository.countByRole(Role.STUDENT);

        log.info("Computed admin metrics: totalEbooks={}, totalOrders={}, paidOrders={}, totalRevenue=₹{}, totalStudents={}",
                totalEbooks, totalOrders, paidOrders, totalRevenue, totalStudents);

        return new AdminDashboardMetricsDto(
                totalEbooks,
                publishedEbooks,
                unpublishedEbooks,
                totalOrders,
                paidOrders,
                pendingOrders,
                failedOrders,
                totalRevenue,
                totalStudents
        );
    }

    private AdminOrderResponseDto mapToAdminOrderDto(Order order) {
        List<AdminOrderItemDto> itemDtos = order.getItems() != null
                ? order.getItems().stream().map(this::mapToItemDto).collect(Collectors.toList())
                : List.of();

        String studentName = order.getUser() != null ? order.getUser().getFullName() : "Anonymous / Guest";
        String studentEmail = order.getUser() != null ? order.getUser().getEmail() : "N/A";
        Long studentId = order.getUser() != null ? order.getUser().getId() : null;

        return new AdminOrderResponseDto(
                order.getId(),
                order.getOrderNumber(),
                studentId,
                studentName,
                studentEmail,
                order.getTotalAmount(),
                order.getCurrency(),
                order.getStatus(),
                order.getRazorpayOrderId(),
                order.getRazorpayPaymentId(),
                itemDtos.size(),
                itemDtos,
                order.getCreatedAt(),
                order.getPaidAt()
        );
    }

    private AdminOrderItemDto mapToItemDto(OrderItem item) {
        Long ebookId = item.getEbook() != null ? item.getEbook().getId() : null;
        String title = item.getEbook() != null ? item.getEbook().getTitle() : "E-Book Unavailable";
        String author = item.getEbook() != null ? item.getEbook().getAuthorName() : "N/A";
        String category = item.getEbook() != null ? item.getEbook().getCategory() : "General";
        String coverImage = item.getEbook() != null ? item.getEbook().getCoverImageUrl() : null;

        return new AdminOrderItemDto(
                ebookId,
                title,
                author,
                category,
                item.getPrice(),
                coverImage
        );
    }
}
