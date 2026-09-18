package com.codeorbit.service;

import com.codeorbit.dto.CreateOrderRequestDto;
import com.codeorbit.dto.OrderResponseDto;
import com.codeorbit.entity.Order;
import com.codeorbit.security.UserPrincipal;

import java.util.List;

public interface OrderService {

    OrderResponseDto createOrder(UserPrincipal principal, CreateOrderRequestDto request);

    List<OrderResponseDto> getStudentOrders(UserPrincipal principal);

    OrderResponseDto getStudentOrderById(UserPrincipal principal, Long orderId);

    Order getOrderEntityByIdAndUser(Long orderId, UserPrincipal principal);

    OrderResponseDto mapToDto(Order order);
}
