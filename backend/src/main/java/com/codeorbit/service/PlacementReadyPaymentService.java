package com.codeorbit.service;

import com.codeorbit.dto.*;
import com.codeorbit.security.UserPrincipal;

import java.util.List;

public interface PlacementReadyPaymentService {

    PlacementReadyOrderResponseDto createPlacementReadyOrder(UserPrincipal principal, String courseSlug);

    PlacementReadyPaymentSummaryDto verifyPayment(UserPrincipal principal, PlacementReadyVerifyRequestDto request);

    void handleWebhook(String payload, String signature);

    List<PlacementReadyPaymentSummaryDto> getStudentPayments(UserPrincipal principal);

    PlacementReadyStatusDto getPlacementReadyStatus(UserPrincipal principal, String courseSlug);

    boolean hasEntitlement(Long userId, Long courseId);
}
