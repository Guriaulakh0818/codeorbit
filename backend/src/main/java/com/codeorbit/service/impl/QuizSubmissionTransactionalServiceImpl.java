package com.codeorbit.service.impl;

import com.codeorbit.dto.QuestionFeedbackDto;
import com.codeorbit.dto.QuizAnswerSubmissionDto;
import com.codeorbit.dto.QuizQuestionOptionDto;
import com.codeorbit.dto.QuizSubmissionRequestDto;
import com.codeorbit.dto.QuizSubmissionResultDto;
import com.codeorbit.entity.*;
import com.codeorbit.exception.BadRequestException;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.*;
import com.codeorbit.service.QuizSubmissionTransactionalService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizSubmissionTransactionalServiceImpl implements QuizSubmissionTransactionalService {

    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final UserQuizTrackerRepository trackerRepository;
    private final UserQuizAttemptRepository attemptRepository;
    private final UserQuizAttemptAnswerRepository attemptAnswerRepository;
    private final ObjectMapper objectMapper;

    public QuizSubmissionTransactionalServiceImpl(UserRepository userRepository,
                                                 QuizRepository quizRepository,
                                                 QuizQuestionRepository quizQuestionRepository,
                                                 UserQuizTrackerRepository trackerRepository,
                                                 UserQuizAttemptRepository attemptRepository,
                                                 UserQuizAttemptAnswerRepository attemptAnswerRepository,
                                                 ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.quizRepository = quizRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.trackerRepository = trackerRepository;
        this.attemptRepository = attemptRepository;
        this.attemptAnswerRepository = attemptAnswerRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_COMMITTED)
    public QuizSubmissionResultDto executeSubmissionInNewTransaction(Long userId, Long quizId, QuizSubmissionRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        if (quiz.getStatus() != PublishStatus.PUBLISHED) {
            throw new BadRequestException("Cannot submit attempt for unpublished quiz: " + quiz.getTitle());
        }

        List<QuizQuestion> questions = quizQuestionRepository.findByQuizIdOrderByOrderIndexAsc(quiz.getId());
        if (questions.isEmpty()) {
            throw new BadRequestException("Quiz contains no active questions");
        }

        // Map submission answers by questionId and validate uniqueness
        Map<Long, String> submittedAnswers = new HashMap<>();
        if (request.getAnswers() != null) {
            for (QuizAnswerSubmissionDto ans : request.getAnswers()) {
                if (submittedAnswers.containsKey(ans.getQuestionId())) {
                    throw new BadRequestException("Duplicate answer submitted for question ID: " + ans.getQuestionId());
                }
                submittedAnswers.put(ans.getQuestionId(), ans.getSelectedOptionId());
            }
        }

        // Validate that all submitted question IDs belong to this quiz
        Set<Long> validQuestionIds = questions.stream().map(QuizQuestion::getId).collect(Collectors.toSet());
        for (Long submittedQId : submittedAnswers.keySet()) {
            if (!validQuestionIds.contains(submittedQId)) {
                throw new BadRequestException("Question ID " + submittedQId + " does not belong to quiz: " + quiz.getTitle());
            }
        }

        // Concurrency-safe Tracker Acquisition and Attempt Number allocation
        UserQuizTracker tracker;
        Optional<UserQuizTracker> trackerOpt = trackerRepository.findByUserIdAndQuizIdForUpdate(user.getId(), quiz.getId());
        int attemptNumber;

        if (trackerOpt.isPresent()) {
            tracker = trackerOpt.get();
            attemptNumber = tracker.getAttemptsCount() + 1;
            tracker.setAttemptsCount(attemptNumber);
        } else {
            // First attempt: attempt to insert tracker row
            tracker = new UserQuizTracker(user, quiz);
            tracker.setAttemptsCount(1);
            tracker = trackerRepository.saveAndFlush(tracker);
            attemptNumber = 1;
        }

        // Evaluate questions and build snapshots
        String language = "hinglish".equalsIgnoreCase(request.getLanguage()) ? "hinglish" : "en";
        int correctCount = 0;
        int answeredCount = 0;
        List<UserQuizAttemptAnswer> answerEntities = new ArrayList<>();
        List<QuestionFeedbackDto> feedbackDtos = new ArrayList<>();

        for (QuizQuestion q : questions) {
            String selectedOptionId = submittedAnswers.get(q.getId());
            boolean isAnswered = selectedOptionId != null && !selectedOptionId.isBlank();
            if (isAnswered) {
                answeredCount++;
            }

            // Parse options JSON
            List<Map<String, String>> parsedOptions;
            try {
                parsedOptions = objectMapper.readValue(q.getOptionsJson(), new TypeReference<List<Map<String, String>>>() {});
            } catch (Exception e) {
                parsedOptions = Collections.emptyList();
            }

            // Validate selectedOptionId exists if provided
            String selectedOptionText = null;
            String correctOptionText = "";
            List<QuizQuestionOptionDto> optionDtos = new ArrayList<>();

            for (Map<String, String> opt : parsedOptions) {
                String optId = opt.get("id");
                String optText = "hinglish".equals(language) && opt.get("text_hinglish") != null && !opt.get("text_hinglish").isBlank()
                        ? opt.get("text_hinglish")
                        : opt.get("text_en");

                optionDtos.add(new QuizQuestionOptionDto(optId, optText));

                if (optId.equals(selectedOptionId)) {
                    selectedOptionText = optText;
                }
                if (optId.equals(q.getCorrectOptionId())) {
                    correctOptionText = optText;
                }
            }

            if (isAnswered && selectedOptionText == null) {
                throw new BadRequestException("Invalid option ID '" + selectedOptionId + "' for question ID " + q.getId());
            }

            boolean isCorrect = isAnswered && q.getCorrectOptionId().equals(selectedOptionId);
            if (isCorrect) {
                correctCount++;
            }

            String promptText = "hinglish".equals(language) && q.getPromptHinglish() != null && !q.getPromptHinglish().isBlank()
                    ? q.getPromptHinglish()
                    : q.getPromptEn();

            String explanationText = "hinglish".equals(language) && q.getExplanationHinglish() != null && !q.getExplanationHinglish().isBlank()
                    ? q.getExplanationHinglish()
                    : q.getExplanationEn();

            // Create Attempt Answer Entity
            UserQuizAttemptAnswer answerEntity = new UserQuizAttemptAnswer();
            answerEntity.setQuestion(q);
            answerEntity.setSelectedOptionId(selectedOptionId);
            answerEntity.setCorrect(isCorrect);
            answerEntity.setDisplayedLanguage(language);
            answerEntity.setPromptSnapshot(promptText);
            answerEntity.setOptionsSnapshotJson(q.getOptionsJson());
            answerEntity.setSelectedOptionTextSnapshot(selectedOptionText);
            answerEntity.setCorrectOptionIdSnapshot(q.getCorrectOptionId());
            answerEntity.setCorrectOptionTextSnapshot(correctOptionText);
            answerEntity.setExplanationSnapshot(explanationText);

            answerEntities.add(answerEntity);

            // Feedback DTO
            QuestionFeedbackDto fb = new QuestionFeedbackDto();
            fb.setQuestionId(q.getId());
            fb.setPrompt(promptText);
            fb.setCodeContext(q.getCodeContext());
            fb.setOptions(optionDtos);
            fb.setSelectedOptionId(selectedOptionId);
            fb.setCorrectOptionId(q.getCorrectOptionId());
            fb.setCorrect(isCorrect);
            fb.setExplanation(explanationText);
            feedbackDtos.add(fb);
        }

        // Calculate score
        int totalQuestions = questions.size();
        BigDecimal scorePercentage = BigDecimal.valueOf((double) correctCount / totalQuestions * 100.0)
                .setScale(2, RoundingMode.HALF_UP);

        int passThreshold = quiz.getMinPassScorePercentage();
        boolean passed = scorePercentage.compareTo(BigDecimal.valueOf(passThreshold)) >= 0;

        // Persist UserQuizAttempt
        UserQuizAttempt attempt = new UserQuizAttempt();
        attempt.setUser(user);
        attempt.setQuiz(quiz);
        attempt.setAttemptNumber(attemptNumber);
        attempt.setTotalQuestions(totalQuestions);
        attempt.setAnsweredQuestions(answeredCount);
        attempt.setCorrectAnswers(correctCount);
        attempt.setScorePercentage(scorePercentage);
        attempt.setPassThresholdPercentage(passThreshold);
        attempt.setPassed(passed);

        attempt = attemptRepository.save(attempt);

        // Link and persist answer snapshots
        for (UserQuizAttemptAnswer ans : answerEntities) {
            ans.setAttempt(attempt);
        }
        attemptAnswerRepository.saveAll(answerEntities);

        // Update Tracker
        if (scorePercentage.compareTo(tracker.getHighestScorePercentage()) > 0) {
            tracker.setHighestScorePercentage(scorePercentage);
        }
        if (passed) {
            tracker.setHasPassed(true);
        }
        tracker.setLastAttemptAt(LocalDateTime.now());
        trackerRepository.save(tracker);

        // Build Response
        QuizSubmissionResultDto resultDto = new QuizSubmissionResultDto();
        resultDto.setAttemptId(attempt.getId());
        resultDto.setQuizId(quiz.getId());
        resultDto.setQuizTitle(quiz.getTitle());
        resultDto.setAttemptNumber(attemptNumber);
        resultDto.setTotalQuestions(totalQuestions);
        resultDto.setAnsweredQuestions(answeredCount);
        resultDto.setCorrectAnswers(correctCount);
        resultDto.setScorePercentage(scorePercentage);
        resultDto.setPassThresholdPercentage(passThreshold);
        resultDto.setPassed(passed);
        resultDto.setSubmittedAt(attempt.getSubmittedAt());
        resultDto.setFeedback(feedbackDtos);

        return resultDto;
    }
}
