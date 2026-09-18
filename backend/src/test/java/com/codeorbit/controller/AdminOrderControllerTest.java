package com.codeorbit.controller;

import com.codeorbit.dto.AdminDashboardMetricsDto;
import com.codeorbit.dto.AdminOrderItemDto;
import com.codeorbit.dto.AdminOrderResponseDto;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.entity.OrderStatus;
import com.codeorbit.service.AdminOrderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminOrderController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminOrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminOrderService adminOrderService;

    @Test
    @DisplayName("GET /api/admin/orders should return 200 OK and paginated orders")
    void testGetAllAdminOrders_Success() throws Exception {
        AdminOrderItemDto item = new AdminOrderItemDto(1L, "Core Java", "Prof. Aditya", "Java", new BigDecimal("499.00"), "cover.jpg");
        AdminOrderResponseDto orderDto = new AdminOrderResponseDto(
                100L, "ORD-2026-001", 10L, "Rahul Sharma", "rahul.student@codeorbit.dev",
                new BigDecimal("499.00"), "INR", OrderStatus.PAID,
                "order_rzp_123", "pay_rzp_456", 1, List.of(item),
                LocalDateTime.now(), LocalDateTime.now()
        );

        PagedResponseDto<AdminOrderResponseDto> paged = new PagedResponseDto<>(
                List.of(orderDto), 0, 10, 1, 1, true
        );

        when(adminOrderService.getAllAdminOrders(any(), any(), any(), any(), anyInt(), anyInt(), any(), any()))
                .thenReturn(paged);

        mockMvc.perform(get("/api/admin/orders")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].orderNumber").value("ORD-2026-001"))
                .andExpect(jsonPath("$.data.content[0].studentName").value("Rahul Sharma"))
                .andExpect(jsonPath("$.data.content[0].studentEmail").value("rahul.student@codeorbit.dev"))
                .andExpect(jsonPath("$.data.content[0].totalAmount").value(499.00))
                .andExpect(jsonPath("$.data.content[0].status").value("PAID"))
                .andExpect(jsonPath("$.data.content[0].items[0].ebookTitle").value("Core Java"))
                // Ensure no sensitive passwords/secrets leaked
                .andExpect(jsonPath("$.data.content[0].password").doesNotExist())
                .andExpect(jsonPath("$.data.content[0].passwordHash").doesNotExist())
                .andExpect(jsonPath("$.data.content[0].razorpaySignature").doesNotExist());
    }

    @Test
    @DisplayName("GET /api/admin/orders/{id} should return single order")
    void testGetAdminOrderById_Success() throws Exception {
        AdminOrderItemDto item = new AdminOrderItemDto(1L, "Core Java", "Prof. Aditya", "Java", new BigDecimal("499.00"), "cover.jpg");
        AdminOrderResponseDto orderDto = new AdminOrderResponseDto(
                100L, "ORD-2026-001", 10L, "Rahul Sharma", "rahul.student@codeorbit.dev",
                new BigDecimal("499.00"), "INR", OrderStatus.PAID,
                "order_rzp_123", "pay_rzp_456", 1, List.of(item),
                LocalDateTime.now(), LocalDateTime.now()
        );

        when(adminOrderService.getAdminOrderById(100L)).thenReturn(orderDto);

        mockMvc.perform(get("/api/admin/orders/100")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(100))
                .andExpect(jsonPath("$.data.orderNumber").value("ORD-2026-001"));
    }

    @Test
    @DisplayName("GET /api/admin/orders/metrics should return real sales metrics")
    void testGetAdminOrderMetrics_Success() throws Exception {
        AdminDashboardMetricsDto metrics = new AdminDashboardMetricsDto(
                10L, 8L, 2L, 50L, 40L, 7L, 3L, new BigDecimal("19960.00"), 30L
        );

        when(adminOrderService.getAdminDashboardMetrics()).thenReturn(metrics);

        mockMvc.perform(get("/api/admin/orders/metrics")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalOrders").value(50))
                .andExpect(jsonPath("$.data.paidOrders").value(40))
                .andExpect(jsonPath("$.data.pendingOrders").value(7))
                .andExpect(jsonPath("$.data.failedOrders").value(3))
                .andExpect(jsonPath("$.data.totalRevenue").value(19960.00))
                .andExpect(jsonPath("$.data.totalStudents").value(30));
    }
}
