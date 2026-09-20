package com.codeorbit.service.impl;

import com.codeorbit.dto.*;
import com.codeorbit.entity.*;
import com.codeorbit.exception.BadRequestException;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.*;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.QuizService;
import com.codeorbit.service.QuizSubmissionTransactionalService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizServiceImpl implements QuizService {

    private static final Logger logger = LoggerFactory.getLogger(QuizServiceImpl.class);

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final UserQuizAttemptRepository attemptRepository;
    private final UserQuizAttemptAnswerRepository attemptAnswerRepository;
    private final QuizSubmissionTransactionalService transactionalService;
    private final ObjectMapper objectMapper;

    public QuizServiceImpl(QuizRepository quizRepository,
                           QuizQuestionRepository quizQuestionRepository,
                           UserQuizAttemptRepository attemptRepository,
                           UserQuizAttemptAnswerRepository attemptAnswerRepository,
                           QuizSubmissionTransactionalService transactionalService,
                           ObjectMapper objectMapper) {
        this.quizRepository = quizRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.attemptRepository = attemptRepository;
        this.attemptAnswerRepository = attemptAnswerRepository;
        this.transactionalService = transactionalService;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public QuizPublicDto getPublicQuizByCourseAndSlug(String courseSlug, String quizSlug, String requestedLanguage) {
        Quiz quiz = quizRepository.findByCourseSlugAndQuizSlugAndStatus(courseSlug, quizSlug, PublishStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found: " + quizSlug + " in course: " + courseSlug));

        String language = "hinglish".equalsIgnoreCase(requestedLanguage) ? "hinglish" : "en";

        QuizPublicDto dto = new QuizPublicDto();
        dto.setId(quiz.getId());
        dto.setModuleId(quiz.getModule().getId());
        dto.setModuleTitle(quiz.getModule().getTitle());
        dto.setCourseSlug(quiz.getModule().getCourse().getSlug());
        dto.setTitle(quiz.getTitle());
        dto.setSlug(quiz.getSlug());
        dto.setDescription(quiz.getDescription());
        dto.setMinPassScorePercentage(quiz.getMinPassScorePercentage());
        dto.setMaxAttempts(quiz.getMaxAttempts());
        dto.setDisplayedLanguage(language);

        List<QuizQuestion> questions = new ArrayList<>(quizQuestionRepository.findByQuizIdOrderByOrderIndexAsc(quiz.getId()));
        // Randomized question order for fresh immediate retakes
        Collections.shuffle(questions);

        List<QuizQuestionPublicDto> questionDtos = new ArrayList<>();
        int index = 1;
        for (QuizQuestion q : questions) {
            QuizQuestionPublicDto qDto = new QuizQuestionPublicDto();
            qDto.setId(q.getId());
            qDto.setOrderIndex(index++);
            qDto.setCodeContext(q.getCodeContext());

            String prompt = "hinglish".equals(language) && q.getPromptHinglish() != null && !q.getPromptHinglish().isBlank()
                    ? q.getPromptHinglish()
                    : q.getPromptEn();
            qDto.setPrompt(prompt);

            List<Map<String, String>> parsedOptions;
            try {
                parsedOptions = objectMapper.readValue(q.getOptionsJson(), new TypeReference<List<Map<String, String>>>() {});
            } catch (Exception e) {
                parsedOptions = Collections.emptyList();
            }

            List<QuizQuestionOptionDto> options = new ArrayList<>();
            for (Map<String, String> opt : parsedOptions) {
                String optId = opt.get("id");
                String optText = "hinglish".equals(language) && opt.get("text_hinglish") != null && !opt.get("text_hinglish").isBlank()
                        ? opt.get("text_hinglish")
                        : opt.get("text_en");
                options.add(new QuizQuestionOptionDto(optId, optText));
            }
            // Randomized option order
            Collections.shuffle(options);
            qDto.setOptions(options);

            questionDtos.add(qDto);
        }

        dto.setQuestions(questionDtos);
        return dto;
    }

    @Override
    public QuizSubmissionResultDto submitQuizAttempt(UserPrincipal principal, Long quizId, QuizSubmissionRequestDto request) {
        int maxRetries = 3;
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return transactionalService.executeSubmissionInNewTransaction(principal.getId(), quizId, request);
            } catch (DataIntegrityViolationException dive) {
                logger.warn("Concurrency collision during quiz submission for user {} on quiz {}. Attempt {}/{}",
                        principal.getId(), quizId, attempt, maxRetries);
                if (attempt == maxRetries) {
                    throw new BadRequestException("Concurrent submission conflict. Please try again.");
                }
                try {
                    Thread.sleep(50L * attempt);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new BadRequestException("Submission interrupted");
                }
            }
        }
        throw new BadRequestException("Failed to process quiz submission after multiple retries");
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuizSubmissionResultDto> getStudentQuizAttempts(UserPrincipal principal, Long quizId) {
        List<UserQuizAttempt> attempts = attemptRepository.findByUserIdAndQuizIdOrderByAttemptNumberDesc(principal.getId(), quizId);
        List<QuizSubmissionResultDto> dtos = new ArrayList<>();

        for (UserQuizAttempt att : attempts) {
            QuizSubmissionResultDto dto = new QuizSubmissionResultDto();
            dto.setAttemptId(att.getId());
            dto.setQuizId(att.getQuiz().getId());
            dto.setQuizTitle(att.getQuiz().getTitle());
            dto.setAttemptNumber(att.getAttemptNumber());
            dto.setTotalQuestions(att.getTotalQuestions());
            dto.setAnsweredQuestions(att.getAnsweredQuestions());
            dto.setCorrectAnswers(att.getCorrectAnswers());
            dto.setScorePercentage(att.getScorePercentage());
            dto.setPassThresholdPercentage(att.getPassThresholdPercentage());
            dto.setPassed(att.isPassed());
            dto.setSubmittedAt(att.getSubmittedAt());

            List<UserQuizAttemptAnswer> answers = attemptAnswerRepository.findByAttemptId(att.getId());
            List<QuestionFeedbackDto> feedback = answers.stream().map(ans -> {
                QuestionFeedbackDto fb = new QuestionFeedbackDto();
                fb.setQuestionId(ans.getQuestion().getId());
                fb.setPrompt(ans.getPromptSnapshot());
                fb.setSelectedOptionId(ans.getSelectedOptionId());
                fb.setCorrectOptionId(ans.getCorrectOptionIdSnapshot());
                fb.setCorrect(ans.isCorrect());
                fb.setExplanation(ans.getExplanationSnapshot());

                try {
                    List<Map<String, String>> parsed = objectMapper.readValue(ans.getOptionsSnapshotJson(), new TypeReference<List<Map<String, String>>>() {});
                    List<QuizQuestionOptionDto> optionDtos = parsed.stream()
                            .map(o -> new QuizQuestionOptionDto(o.get("id"), "hinglish".equals(ans.getDisplayedLanguage()) && o.get("text_hinglish") != null ? o.get("text_hinglish") : o.get("text_en")))
                            .collect(Collectors.toList());
                    fb.setOptions(optionDtos);
                } catch (Exception e) {
                    fb.setOptions(Collections.emptyList());
                }

                return fb;
            }).collect(Collectors.toList());

            dto.setFeedback(feedback);
            dtos.add(dto);
        }

        return dtos;
    }
}
