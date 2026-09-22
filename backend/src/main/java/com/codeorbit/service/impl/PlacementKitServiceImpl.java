package com.codeorbit.service.impl;

import com.codeorbit.dto.*;
import com.codeorbit.entity.*;
import com.codeorbit.exception.BadRequestException;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.*;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.PlacementKitService;
import com.codeorbit.service.RazorpayGatewayService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class PlacementKitServiceImpl implements PlacementKitService {

    private static final Logger log = LoggerFactory.getLogger(PlacementKitServiceImpl.class);
    public static final int PLACEMENT_KIT_PRICE_INR = 99;
    public static final int PLACEMENT_KIT_PRICE_PAISE = 9900;

    private final PlacementKitRepository placementKitRepository;
    private final PlacementKitCategoryRepository categoryRepository;
    private final PlacementKitQuestionRepository questionRepository;
    private final PlacementKitOptionRepository optionRepository;
    private final PlacementKitPaymentRepository paymentRepository;
    private final PlacementKitEntitlementRepository entitlementRepository;
    private final PlacementKitProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final RazorpayGatewayService razorpayGatewayService;

    @Autowired
    public PlacementKitServiceImpl(
            PlacementKitRepository placementKitRepository,
            PlacementKitCategoryRepository categoryRepository,
            PlacementKitQuestionRepository questionRepository,
            PlacementKitOptionRepository optionRepository,
            PlacementKitPaymentRepository paymentRepository,
            PlacementKitEntitlementRepository entitlementRepository,
            PlacementKitProgressRepository progressRepository,
            UserRepository userRepository,
            RazorpayGatewayService razorpayGatewayService
    ) {
        this.placementKitRepository = placementKitRepository;
        this.categoryRepository = categoryRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
        this.paymentRepository = paymentRepository;
        this.entitlementRepository = entitlementRepository;
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
        this.razorpayGatewayService = razorpayGatewayService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlacementKitSummaryDto> getAllActiveKits(UserPrincipal principal) {
        List<PlacementKit> kits = placementKitRepository.findByActiveTrueOrderByOrderIndexAsc();
        Set<Long> entitledKitIds = new HashSet<>();

        if (principal != null && principal.getId() != null) {
            entitledKitIds = entitlementRepository.findByUserIdOrderByGrantedAtDesc(principal.getId())
                    .stream()
                    .map(e -> e.getPlacementKit().getId())
                    .collect(Collectors.toSet());
        }

        List<PlacementKitSummaryDto> summaries = new ArrayList<>();
        for (PlacementKit kit : kits) {
            int qCount = (int) questionRepository.countByKitId(kit.getId());
            int cCount = categoryRepository.findByPlacementKitIdOrderByOrderIndexAsc(kit.getId()).size();
            boolean isPurchased = entitledKitIds.contains(kit.getId());

            summaries.add(new PlacementKitSummaryDto(
                    kit.getId(),
                    kit.getSlug(),
                    kit.getTitle(),
                    kit.getRole(),
                    kit.getShortDescription(),
                    kit.getPriceInr(),
                    kit.getPricePaise(),
                    kit.getCurrency(),
                    kit.getCoverImageUrl(),
                    kit.getBadgeText(),
                    qCount,
                    cCount,
                    isPurchased
            ));
        }

        return summaries;
    }

    @Override
    @Transactional(readOnly = true)
    public PlacementKitDetailDto getKitBySlug(String slug, UserPrincipal principal) {
        if (slug == null || slug.trim().isEmpty()) {
            throw new BadRequestException("Placement kit slug cannot be empty");
        }

        PlacementKit kit = placementKitRepository.findBySlug(slug.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("PlacementKit", "slug", slug));

        boolean isEntitled = false;
        Long userId = (principal != null) ? principal.getId() : null;

        if (userId != null) {
            boolean isAdmin = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            isEntitled = isAdmin || entitlementRepository.existsByUserIdAndPlacementKitId(userId, kit.getId());
        }

        List<PlacementKitCategory> categories = categoryRepository.findByPlacementKitIdOrderByOrderIndexAsc(kit.getId());
        int totalQuestions = (int) questionRepository.countByKitId(kit.getId());

        PlacementKitDetailDto dto = new PlacementKitDetailDto();
        dto.setId(kit.getId());
        dto.setSlug(kit.getSlug());
        dto.setTitle(kit.getTitle());
        dto.setRole(kit.getRole());
        dto.setShortDescription(kit.getShortDescription());
        dto.setFullDescription(kit.getFullDescription());
        dto.setPriceInr(kit.getPriceInr());
        dto.setPricePaise(kit.getPricePaise());
        dto.setCurrency(kit.getCurrency());
        dto.setCoverImageUrl(kit.getCoverImageUrl());
        dto.setBadgeText(kit.getBadgeText());
        dto.setPurchased(isEntitled);
        dto.setTotalQuestions(totalQuestions);
        dto.setTotalCategories(categories.size());

        if (isEntitled) {
            // Entitled student: map all categories and all questions with full content
            Map<Long, PlacementKitProgress> progressMap = new HashMap<>();
            if (userId != null) {
                progressRepository.findByUserIdAndPlacementKitId(userId, kit.getId())
                        .forEach(p -> progressMap.put(p.getQuestion().getId(), p));
            }

            List<PlacementKitCategoryDto> categoryDtos = new ArrayList<>();
            for (PlacementKitCategory cat : categories) {
                List<PlacementKitQuestion> questions = questionRepository.findByCategoryIdAndActiveTrueOrderByOrderIndexAsc(cat.getId());
                PlacementKitCategoryDto catDto = new PlacementKitCategoryDto(
                        cat.getId(), cat.getTitle(), cat.getSlug(), cat.getDescription(), cat.getOrderIndex(), questions.size()
                );

                List<PlacementKitQuestionDto> qDtos = questions.stream()
                        .map(q -> mapQuestionToDto(q, progressMap.get(q.getId()), true))
                        .collect(Collectors.toList());

                catDto.setQuestions(qDtos);
                categoryDtos.add(catDto);
            }
            dto.setCategories(categoryDtos);

            if (userId != null) {
                dto.setProgress(getKitProgress(principal, kit.getSlug()));
            }
        } else {
            // Unentitled / Guest: map categories outline (no protected questions) and ONLY sample questions
            List<PlacementKitCategoryDto> categoryDtos = categories.stream()
                    .map(cat -> {
                        int count = questionRepository.findByCategoryIdAndActiveTrueOrderByOrderIndexAsc(cat.getId()).size();
                        return new PlacementKitCategoryDto(cat.getId(), cat.getTitle(), cat.getSlug(), cat.getDescription(), cat.getOrderIndex(), count);
                    })
                    .collect(Collectors.toList());
            dto.setCategories(categoryDtos);

            // Fetch sample preview questions (3 per kit) with answers/explanations safely stripped
            List<PlacementKitQuestion> sampleQuestions = questionRepository.findSampleQuestionsByKitId(kit.getId());
            List<PlacementKitQuestionDto> sampleDtos = sampleQuestions.stream()
                    .map(q -> mapQuestionToDto(q, null, false))
                    .collect(Collectors.toList());
            dto.setSampleQuestions(sampleDtos);
        }

        return dto;
    }

    @Override
    public PlacementKitOrderResponseDto createKitOrder(UserPrincipal principal, String kitSlug) {
        if (principal == null || principal.getId() == null) {
            throw new AccessDeniedException("Authentication required to purchase a Placement Kit");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        PlacementKit kit = placementKitRepository.findBySlug(kitSlug.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("PlacementKit", "slug", kitSlug));

        if (!kit.isActive()) {
            throw new BadRequestException("This Placement Kit is currently not available for purchase");
        }

        if (entitlementRepository.existsByUserIdAndPlacementKitId(user.getId(), kit.getId())) {
            throw new BadRequestException("You have already purchased the " + kit.getTitle());
        }

        // Server-enforced price: 9900 paise (₹99 INR)
        int pricePaise = PLACEMENT_KIT_PRICE_PAISE;

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String shortId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String orderNumber = "PK-ORD-" + timestamp + "-" + shortId;

        PlacementKitPayment payment = new PlacementKitPayment(
                orderNumber,
                user,
                kit,
                pricePaise,
                "INR",
                PaymentStatus.CREATED
        );

        String razorpayOrderId = razorpayGatewayService.createOrder(orderNumber, pricePaise, "INR");
        payment.setRazorpayOrderId(razorpayOrderId);

        PlacementKitPayment savedPayment = paymentRepository.save(payment);
        log.info("Created ₹99 Placement Kit order #{} (RZP: {}) for student {} on kit {}",
                orderNumber, razorpayOrderId, user.getEmail(), kit.getTitle());

        return new PlacementKitOrderResponseDto(
                savedPayment.getOrderNumber(),
                savedPayment.getRazorpayOrderId(),
                razorpayGatewayService.getKeyId(),
                savedPayment.getAmountPaise(),
                PLACEMENT_KIT_PRICE_INR,
                savedPayment.getCurrency(),
                kit.getSlug(),
                kit.getTitle(),
                kit.getRole(),
                user.getEmail(),
                user.getFullName(),
                "Placement Kit order created successfully"
        );
    }

    @Override
    public PlacementKitDetailDto verifyAndFulfillKitPayment(UserPrincipal principal, String kitSlug, PlacementKitVerifyRequestDto request) {
        if (principal == null || principal.getId() == null) {
            throw new AccessDeniedException("Authentication required to verify kit payment");
        }

        if (request == null || request.getRazorpayOrderId() == null || request.getRazorpayOrderId().trim().isEmpty()) {
            throw new BadRequestException("Razorpay order ID is required for verification");
        }

        PlacementKitPayment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId().trim())
                .orElseThrow(() -> new ResourceNotFoundException("PlacementKitPayment", "razorpayOrderId", request.getRazorpayOrderId()));

        // Security: Payment must belong to authenticated student
        if (!payment.getUser().getId().equals(principal.getId())) {
            log.warn("Security Alert: User #{} attempted to verify kit payment owned by User #{}",
                    principal.getId(), payment.getUser().getId());
            throw new AccessDeniedException("You do not have permission to verify this payment");
        }

        // Kit match check
        PlacementKit kit = placementKitRepository.findBySlug(kitSlug.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("PlacementKit", "slug", kitSlug));
        if (!payment.getPlacementKit().getId().equals(kit.getId())) {
            throw new BadRequestException("Payment order does not match kit: " + kitSlug);
        }

        // Amount verification
        if (payment.getAmountPaise() != PLACEMENT_KIT_PRICE_PAISE) {
            throw new BadRequestException("Invalid payment amount for Placement Kit");
        }

        // Idempotency: If already paid, ensure entitlement exists and return full kit details
        if (payment.getStatus() == PaymentStatus.PAID) {
            log.info("Idempotent verification for already paid kit order #{}", payment.getOrderNumber());
            ensureEntitlement(payment.getUser(), kit, payment);
            return getKitBySlug(kit.getSlug(), principal);
        }

        // Verify Razorpay HMAC-SHA256 signature
        boolean isValidSignature = razorpayGatewayService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!isValidSignature) {
            log.error("Invalid kit payment signature for order #{}", payment.getOrderNumber());
            payment.setStatus(PaymentStatus.FAILED);
            payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
            payment.setRazorpaySignature(request.getRazorpaySignature());
            paymentRepository.save(payment);
            throw new BadRequestException("Invalid or tampered payment signature");
        }

        // Mark payment PAID
        payment.setStatus(PaymentStatus.PAID);
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setPaidAt(LocalDateTime.now());
        PlacementKitPayment updatedPayment = paymentRepository.save(payment);

        // Grant entitlement idempotently
        ensureEntitlement(payment.getUser(), kit, updatedPayment);
        log.info("Successfully unlocked Placement Kit {} for student {}", kit.getTitle(), payment.getUser().getEmail());

        return getKitBySlug(kit.getSlug(), principal);
    }

    private void ensureEntitlement(User user, PlacementKit kit, PlacementKitPayment payment) {
        if (!entitlementRepository.existsByUserIdAndPlacementKitId(user.getId(), kit.getId())) {
            PlacementKitEntitlement entitlement = new PlacementKitEntitlement(user, kit, payment);
            entitlementRepository.save(entitlement);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlacementKitSummaryDto> getStudentPurchasedKits(UserPrincipal principal) {
        if (principal == null || principal.getId() == null) {
            throw new AccessDeniedException("Authentication required to view purchased kits");
        }

        List<PlacementKitEntitlement> entitlements = entitlementRepository.findByUserIdOrderByGrantedAtDesc(principal.getId());
        List<PlacementKitSummaryDto> purchased = new ArrayList<>();

        for (PlacementKitEntitlement ent : entitlements) {
            PlacementKit kit = ent.getPlacementKit();
            int qCount = (int) questionRepository.countByKitId(kit.getId());
            int cCount = categoryRepository.findByPlacementKitIdOrderByOrderIndexAsc(kit.getId()).size();

            purchased.add(new PlacementKitSummaryDto(
                    kit.getId(),
                    kit.getSlug(),
                    kit.getTitle(),
                    kit.getRole(),
                    kit.getShortDescription(),
                    kit.getPriceInr(),
                    kit.getPricePaise(),
                    kit.getCurrency(),
                    kit.getCoverImageUrl(),
                    kit.getBadgeText(),
                    qCount,
                    cCount,
                    true
            ));
        }

        return purchased;
    }

    @Override
    public PlacementKitPracticeResultDto submitPracticeAnswer(
            UserPrincipal principal,
            String kitSlug,
            Long questionId,
            PlacementKitPracticeSubmitDto submitDto
    ) {
        if (principal == null || principal.getId() == null) {
            throw new AccessDeniedException("Authentication required to submit practice answers");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        PlacementKit kit = placementKitRepository.findBySlug(kitSlug.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("PlacementKit", "slug", kitSlug));

        // Enforce kit entitlement
        boolean isAdmin = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !entitlementRepository.existsByUserIdAndPlacementKitId(user.getId(), kit.getId())) {
            throw new AccessDeniedException("You must purchase this Placement Kit to submit practice answers and view detailed explanations.");
        }

        PlacementKitQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementKitQuestion", "id", questionId));

        if (!question.getCategory().getPlacementKit().getId().equals(kit.getId())) {
            throw new BadRequestException("Question does not belong to Placement Kit: " + kitSlug);
        }

        boolean isCorrect = false;
        Long correctOptionId = null;

        if (question.getQuestionType() == PlacementKitQuestionType.MCQ) {
            List<PlacementKitOption> options = optionRepository.findByQuestionIdOrderByOrderIndexAsc(question.getId());
            for (PlacementKitOption opt : options) {
                if (opt.isCorrect()) {
                    correctOptionId = opt.getId();
                    if (submitDto.getSelectedOptionId() != null && submitDto.getSelectedOptionId().equals(opt.getId())) {
                        isCorrect = true;
                    }
                }
            }
        } else {
            // SHORT_ANSWER / INTERVIEW: marked attempted and verified
            isCorrect = true;
        }

        // Upsert progress
        Optional<PlacementKitProgress> existingOpt = progressRepository.findByUserIdAndQuestionId(user.getId(), question.getId());
        PlacementKitProgress progress;
        if (existingOpt.isPresent()) {
            progress = existingOpt.get();
            progress.setSelectedOptionId(submitDto.getSelectedOptionId());
            progress.setUserAnswer(submitDto.getUserAnswer());
            progress.setCorrect(isCorrect);
        } else {
            progress = new PlacementKitProgress(
                    user,
                    kit,
                    question,
                    submitDto.getSelectedOptionId(),
                    submitDto.getUserAnswer(),
                    isCorrect
            );
        }
        progressRepository.save(progress);

        int totalAttempted = (int) progressRepository.countAttemptedByUserIdAndKitId(user.getId(), kit.getId());
        int totalCorrect = (int) progressRepository.countCorrectByUserIdAndKitId(user.getId(), kit.getId());

        PlacementKitPracticeResultDto result = new PlacementKitPracticeResultDto();
        result.setQuestionId(question.getId());
        result.setCorrect(isCorrect);
        result.setCorrectOptionId(correctOptionId);
        result.setModelAnswer(question.getModelAnswer());
        result.setExplanation(question.getExplanation());
        result.setLessonReferenceLabel(question.getLessonReferenceLabel());
        result.setExternalReferenceUrl(question.getExternalReferenceUrl());
        result.setTotalAttempted(totalAttempted);
        result.setTotalCorrect(totalCorrect);

        if (question.getLesson() != null) {
            result.setLessonId(question.getLesson().getId());
            result.setLessonSlug(question.getLesson().getSlug());
            if (question.getLesson().getModule() != null && question.getLesson().getModule().getCourse() != null) {
                result.setCourseSlug(question.getLesson().getModule().getCourse().getSlug());
            }
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public PlacementKitProgressDto getKitProgress(UserPrincipal principal, String kitSlug) {
        if (principal == null || principal.getId() == null) {
            return new PlacementKitProgressDto(kitSlug, 0, 0, 0);
        }

        PlacementKit kit = placementKitRepository.findBySlug(kitSlug.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("PlacementKit", "slug", kitSlug));

        int totalQuestions = (int) questionRepository.countByKitId(kit.getId());
        int attempted = (int) progressRepository.countAttemptedByUserIdAndKitId(principal.getId(), kit.getId());
        int correct = (int) progressRepository.countCorrectByUserIdAndKitId(principal.getId(), kit.getId());

        return new PlacementKitProgressDto(kit.getSlug(), totalQuestions, attempted, correct);
    }

    private PlacementKitQuestionDto mapQuestionToDto(
            PlacementKitQuestion q,
            PlacementKitProgress progress,
            boolean isEntitled
    ) {
        PlacementKitQuestionDto dto = new PlacementKitQuestionDto();
        dto.setId(q.getId());
        dto.setQuestionText(q.getQuestionText());
        dto.setQuestionType(q.getQuestionType().name());
        dto.setDifficulty(q.getDifficulty());
        dto.setSample(q.isSample());
        dto.setOrderIndex(q.getOrderIndex());
        dto.setLessonReferenceLabel(q.getLessonReferenceLabel());
        dto.setExternalReferenceUrl(q.getExternalReferenceUrl());

        if (q.getLesson() != null) {
            dto.setLessonId(q.getLesson().getId());
            dto.setLessonSlug(q.getLesson().getSlug());
            if (q.getLesson().getModule() != null && q.getLesson().getModule().getCourse() != null) {
                dto.setCourseSlug(q.getLesson().getModule().getCourse().getSlug());
            }
        }

        List<PlacementKitOption> options = optionRepository.findByQuestionIdOrderByOrderIndexAsc(q.getId());
        if (isEntitled) {
            dto.setModelAnswer(q.getModelAnswer());
            dto.setExplanation(q.getExplanation());
            dto.setOptions(options.stream()
                    .map(opt -> new PlacementKitOptionDto(opt.getId(), opt.getOptionText(), opt.isCorrect(), opt.getOrderIndex()))
                    .collect(Collectors.toList()));

            if (progress != null) {
                dto.setUserAttempted(true);
                dto.setUserCorrect(progress.isCorrect());
                dto.setSelectedOptionId(progress.getSelectedOptionId());
                dto.setUserAnswer(progress.getUserAnswer());
            } else {
                dto.setUserAttempted(false);
            }
        } else {
            // For unentitled / preview mode: strip correct flags, explanations, and model answers
            dto.setOptions(options.stream()
                    .map(opt -> new PlacementKitOptionDto(opt.getId(), opt.getOptionText(), null, opt.getOrderIndex()))
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}
