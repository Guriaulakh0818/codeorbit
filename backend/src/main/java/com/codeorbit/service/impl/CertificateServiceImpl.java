package com.codeorbit.service.impl;

import com.codeorbit.dto.CertificatePublicDto;
import com.codeorbit.entity.*;
import com.codeorbit.exception.BadRequestException;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.*;
import com.codeorbit.security.UserPrincipal;
import com.codeorbit.service.CertificateService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CertificateServiceImpl implements CertificateService {

    private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final UserLessonProgressRepository progressRepository;
    private final UserQuizTrackerRepository trackerRepository;

    public CertificateServiceImpl(CertificateRepository certificateRepository,
                                  UserRepository userRepository,
                                  CourseRepository courseRepository,
                                  LessonRepository lessonRepository,
                                  QuizRepository quizRepository,
                                  UserLessonProgressRepository progressRepository,
                                  UserQuizTrackerRepository trackerRepository) {
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.quizRepository = quizRepository;
        this.progressRepository = progressRepository;
        this.trackerRepository = trackerRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public CertificatePublicDto verifyCertificate(String certificateCode) {
        Certificate cert = certificateRepository.findByCertificateCode(certificateCode.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with code: " + certificateCode));

        boolean isValid = cert.getStatus() == CertificateStatus.VALID;
        return new CertificatePublicDto(
                cert.getCertificateCode(),
                cert.getStudentFullName(),
                cert.getCourseTitle(),
                cert.getCourse().getSlug(),
                cert.getStatus().name(),
                isValid,
                cert.getRevocationReason(),
                cert.getIssuedAt()
        );
    }

    @Override
    public CertificatePublicDto claimCourseCertificate(UserPrincipal principal, String courseSlug) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + principal.getId()));

        Course course = courseRepository.findBySlugAndStatus(courseSlug, PublishStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with slug: " + courseSlug));

        // If certificate already claimed, return existing
        Optional<Certificate> existingCert = certificateRepository.findByUserIdAndCourseId(user.getId(), course.getId());
        if (existingCert.isPresent()) {
            Certificate c = existingCert.get();
            return new CertificatePublicDto(
                    c.getCertificateCode(),
                    c.getStudentFullName(),
                    c.getCourseTitle(),
                    c.getCourse().getSlug(),
                    c.getStatus().name(),
                    c.getStatus() == CertificateStatus.VALID,
                    c.getRevocationReason(),
                    c.getIssuedAt()
            );
        }

        // Server-side verification of completion requirements across Beginner, Intermediate, and Advanced levels
        List<CurriculumLevel> requiredLevels = List.of(
                CurriculumLevel.BEGINNER,
                CurriculumLevel.INTERMEDIATE,
                CurriculumLevel.ADVANCED
        );

        long totalLessons = lessonRepository.countPublishedLessonsByCourseIdAndLevels(course.getId(), requiredLevels);
        long completedLessons = progressRepository.countCompletedPublishedLessonsByLevels(user.getId(), course.getId(), requiredLevels);

        if (totalLessons > 0 && completedLessons < totalLessons) {
            throw new BadRequestException("Cannot claim certificate: " + (totalLessons - completedLessons) + " published lesson(s) across Beginner, Intermediate, and Advanced remain incomplete.");
        }

        long totalQuizzes = quizRepository.countPublishedQuizzesByCourseIdAndLevels(course.getId(), requiredLevels);
        long passedQuizzes = trackerRepository.countPassedPublishedQuizzesByCourseAndLevels(user.getId(), course.getId(), requiredLevels);

        if (totalQuizzes > 0 && passedQuizzes < totalQuizzes) {
            throw new BadRequestException("Cannot claim certificate: " + (totalQuizzes - passedQuizzes) + " required module/level final quiz(zes) have not met the passing threshold across Beginner, Intermediate, and Advanced.");
        }

        // Generate unique code
        String code = generateUniqueCertificateCode(course.getTrack());

        Certificate cert = new Certificate();
        cert.setCertificateCode(code);
        cert.setUser(user);
        cert.setCourse(course);
        cert.setStudentFullName(user.getFullName());
        cert.setCourseTitle(course.getTitle());
        cert.setStatus(CertificateStatus.VALID);

        cert = certificateRepository.save(cert);

        return new CertificatePublicDto(
                cert.getCertificateCode(),
                cert.getStudentFullName(),
                cert.getCourseTitle(),
                cert.getCourse().getSlug(),
                cert.getStatus().name(),
                true,
                null,
                cert.getIssuedAt()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<CertificatePublicDto> getStudentCertificates(UserPrincipal principal) {
        return certificateRepository.findByUserIdOrderByIssuedAtDesc(principal.getId()).stream()
                .map(c -> new CertificatePublicDto(
                        c.getCertificateCode(),
                        c.getStudentFullName(),
                        c.getCourseTitle(),
                        c.getCourse().getSlug(),
                        c.getStatus().name(),
                        c.getStatus() == CertificateStatus.VALID,
                        c.getRevocationReason(),
                        c.getIssuedAt()
                ))
                .collect(Collectors.toList());
    }

    private String generateUniqueCertificateCode(String track) {
        String prefix = "CO-" + (track != null && !track.isBlank() ? track.toUpperCase() : "CSE") + "-2026-";
        for (int attempt = 0; attempt < 100; attempt++) {
            StringBuilder sb = new StringBuilder(prefix);
            for (int i = 0; i < 6; i++) {
                sb.append(CODE_CHARS.charAt(RANDOM.nextInt(CODE_CHARS.length())));
            }
            String code = sb.toString();
            if (!certificateRepository.existsByCertificateCode(code)) {
                return code;
            }
        }
        throw new IllegalStateException("Failed to generate unique certificate code");
    }
}
