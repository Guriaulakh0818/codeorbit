package com.codeorbit.controller;

import com.codeorbit.dto.ApiResponse;
import com.codeorbit.dto.CreateOrderRequestDto;
import com.codeorbit.dto.OrderResponseDto;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/orders")
public class StudentOrderController {

    private final OrderService orderService;

    public StudentOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponseDto>> createOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateOrderRequestDto request
    ) {
        OrderResponseDto responseDto = orderService.createOrder(principal, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created successfully", responseDto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getStudentOrders(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<OrderResponseDto> orders = orderService.getStudentOrders(principal);
        return ResponseEntity.ok(ApiResponse.success("Student orders retrieved successfully", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDto>> getStudentOrderById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {
        OrderResponseDto order = orderService.getStudentOrderById(principal, id);
        return ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", order));
    }
}
