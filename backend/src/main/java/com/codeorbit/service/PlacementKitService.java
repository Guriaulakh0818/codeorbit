package com.codeorbit.service;

import com.codeorbit.dto.*;
import com.codeorbit.security.UserPrincipal;

import java.util.List;

public interface PlacementKitService {

    List<PlacementKitSummaryDto> getAllActiveKits(UserPrincipal principal);

    PlacementKitDetailDto getKitBySlug(String slug, UserPrincipal principal);

    PlacementKitOrderResponseDto createKitOrder(UserPrincipal principal, String kitSlug);

    PlacementKitDetailDto verifyAndFulfillKitPayment(UserPrincipal principal, String kitSlug, PlacementKitVerifyRequestDto request);

    List<PlacementKitSummaryDto> getStudentPurchasedKits(UserPrincipal principal);

    PlacementKitPracticeResultDto submitPracticeAnswer(UserPrincipal principal, String kitSlug, Long questionId, PlacementKitPracticeSubmitDto submitDto);

    PlacementKitProgressDto getKitProgress(UserPrincipal principal, String kitSlug);
}
