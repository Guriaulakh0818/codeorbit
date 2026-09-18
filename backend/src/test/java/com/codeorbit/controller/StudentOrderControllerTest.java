package com.codeorbit.controller;

import com.codeorbit.dto.CreateOrderRequestDto;
import com.codeorbit.dto.OrderResponseDto;
import com.codeorbit.entity.OrderStatus;
import com.codeorbit.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StudentOrderController.class)
@AutoConfigureMockMvc(addFilters = false)
class StudentOrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderService orderService;

    @Test
    @DisplayName("POST /api/student/orders should create order and return 201 Created")
    void testCreateOrder() throws Exception {
        CreateOrderRequestDto requestDto = new CreateOrderRequestDto(List.of(1L, 2L));
        OrderResponseDto responseDto = new OrderResponseDto(
                10L, "ORD-2026-001", new BigDecimal("1098.00"), "INR",
                OrderStatus.PENDING, null, null, LocalDateTime.now(), null, List.of()
        );

        when(orderService.createOrder(any(), any())).thenReturn(responseDto);

        mockMvc.perform(post("/api/student/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(10))
                .andExpect(jsonPath("$.data.orderNumber").value("ORD-2026-001"))
                .andExpect(jsonPath("$.data.totalAmount").value(1098.00))
                .andExpect(jsonPath("$.data.status").value("PENDING"));
    }

    @Test
    @DisplayName("GET /api/student/orders should return 200 OK and student order list")
    void testGetStudentOrders() throws Exception {
        OrderResponseDto responseDto = new OrderResponseDto(
                10L, "ORD-2026-001", new BigDecimal("499.00"), "INR",
                OrderStatus.PAID, "order_rzp_123", "pay_rzp_456", LocalDateTime.now(), LocalDateTime.now(), List.of()
        );

        when(orderService.getStudentOrders(any())).thenReturn(List.of(responseDto));

        mockMvc.perform(get("/api/student/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(10))
                .andExpect(jsonPath("$.data[0].status").value("PAID"));
    }
}
