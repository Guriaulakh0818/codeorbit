package com.codeorbit.service.impl;

import com.codeorbit.dto.AdminStudentDto;
import com.codeorbit.dto.PagedResponseDto;
import com.codeorbit.entity.*;
import com.codeorbit.exception.ResourceNotFoundException;
import com.codeorbit.repository.*;
import com.codeorbit.service.AdminStudentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AdminStudentServiceImpl implements AdminStudentService {

    private final UserRepository userRepository;
    private final StudentEnrollmentRepository studentEnrollmentRepository;
    private final UserLessonProgressRepository userLessonProgressRepository;
    private final UserQuizAttemptRepository userQuizAttemptRepository;
    private final CertificateRepository certificateRepository;
    private final OrderRepository orderRepository;
    private final PlacementReadyPaymentRepository placementReadyPaymentRepository;
    private final CertificatePaymentRepository certificatePaymentRepository;
    private final PlacementKitPaymentRepository placementKitPaymentRepository;
    private final CourseRepository courseRepository;

    public AdminStudentServiceImpl(
            UserRepository userRepository,
            StudentEnrollmentRepository studentEnrollmentRepository,
            UserLessonProgressRepository userLessonProgressRepository,
            UserQuizAttemptRepository userQuizAttemptRepository,
            CertificateRepository certificateRepository,
            OrderRepository orderRepository,
            PlacementReadyPaymentRepository placementReadyPaymentRepository,
            CertificatePaymentRepository certificatePaymentRepository,
            PlacementKitPaymentRepository placementKitPaymentRepository,
            CourseRepository courseRepository
    ) {
        this.userRepository = userRepository;
        this.studentEnrollmentRepository = studentEnrollmentRepository;
        this.userLessonProgressRepository = userLessonProgressRepository;
        this.userQuizAttemptRepository = userQuizAttemptRepository;
        this.certificateRepository = certificateRepository;
        this.orderRepository = orderRepository;
        this.placementReadyPaymentRepository = placementReadyPaymentRepository;
        this.certificatePaymentRepository = certificatePaymentRepository;
        this.placementKitPaymentRepository = placementKitPaymentRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public PagedResponseDto<AdminStudentDto.Summary> getStudents(String search, String status, Pageable pageable) {
        List<User> allUsers = userRepository.findAll();

        if (search != null && !search.trim().isEmpty()) {
            String q = search.trim().toLowerCase();
            allUsers = allUsers.stream()
                    .filter(u -> (u.getFullName() != null && u.getFullName().toLowerCase().contains(q))
                            || (u.getEmail() != null && u.getEmail().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        int totalElements = allUsers.size();
        int fromIndex = Math.min((int) pageable.getOffset(), totalElements);
        int toIndex = Math.min(fromIndex + pageable.getPageSize(), totalElements);
        List<User> pagedUsers = allUsers.subList(fromIndex, toIndex);

        List<AdminStudentDto.Summary> content = pagedUsers.stream().map(u -> {
            AdminStudentDto.Summary s = new AdminStudentDto.Summary();
            s.setId(u.getId());
            s.setFullName(u.getFullName() != null ? u.getFullName() : "Learner");
            s.setEmail(u.getEmail());
            s.setRole(u.getRole() != null ? u.getRole().name() : "STUDENT");
            s.setJoinedAt(u.getCreatedAt());
            s.setStatus("ACTIVE");

            s.setEnrolledCoursesCount(studentEnrollmentRepository.countByUserId(u.getId()));
            s.setCompletedLessonsCount(userLessonProgressRepository.countCompletedPublishedLessons(u.getId()));
            s.setQuizAttemptsCount(userQuizAttemptRepository.countByUserId(u.getId()));
            s.setCertificatesCount(certificateRepository.findByUserIdOrderByIssuedAtDesc(u.getId()).size());

            // Calculate total spent
            BigDecimal totalSpent = BigDecimal.ZERO;
            List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(u);
            for (Order o : orders) {
                if (o.getStatus() == OrderStatus.PAID && o.getTotalAmount() != null) {
                    totalSpent = totalSpent.add(o.getTotalAmount());
                }
            }
            List<PlacementReadyPayment> prs = placementReadyPaymentRepository.findByUserIdOrderByCreatedAtDesc(u.getId());
            for (PlacementReadyPayment pr : prs) {
                if (pr.getStatus() == PaymentStatus.PAID) {
                    totalSpent = totalSpent.add(BigDecimal.valueOf(pr.getAmountPaise()).divide(BigDecimal.valueOf(100)));
                }
            }
            List<CertificatePayment> certs = certificatePaymentRepository.findByUserIdOrderByCreatedAtDesc(u.getId());
            for (CertificatePayment cp : certs) {
                if (cp.getStatus() == PaymentStatus.PAID) {
                    totalSpent = totalSpent.add(BigDecimal.valueOf(cp.getAmountPaise()).divide(BigDecimal.valueOf(100)));
                }
            }
            s.setTotalSpent(totalSpent);
            return s;
        }).collect(Collectors.toList());

        Page<AdminStudentDto.Summary> page = new PageImpl<>(content, pageable, totalElements);
        return new PagedResponseDto<>(page);
    }

    @Override
    public AdminStudentDto.Detail getStudentDetail(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        AdminStudentDto.Detail detail = new AdminStudentDto.Detail();
        detail.setId(user.getId());
        detail.setFullName(user.getFullName() != null ? user.getFullName() : "Learner");
        detail.setEmail(user.getEmail());
        detail.setRole(user.getRole() != null ? user.getRole().name() : "STUDENT");
        detail.setJoinedAt(user.getCreatedAt());
        detail.setAuthProvider(user.getAuthProvider() != null ? user.getAuthProvider().name() : "LOCAL");
        detail.setStatus("ACTIVE");

        // 1. Enrolled Courses
        List<StudentEnrollment> enrollments = studentEnrollmentRepository.findByUserIdWithCourseOrderByEnrolledAtDesc(user.getId());
        List<AdminStudentDto.StudentCourseProgressDto> courseProgressList = new ArrayList<>();
        for (StudentEnrollment se : enrollments) {
            Course c = se.getCourse();
            AdminStudentDto.StudentCourseProgressDto scp = new AdminStudentDto.StudentCourseProgressDto();
            scp.setCourseId(c.getId());
            scp.setTitle(c.getTitle());
            scp.setTrack(c.getTrack());
            scp.setLevel(c.getDifficultyLevel() != null ? c.getDifficultyLevel() : "BEGINNER");
            scp.setEnrolledAt(se.getEnrolledAt());

            long completed = userLessonProgressRepository.countCompletedPublishedLessons(user.getId(), c.getId());
            scp.setCompletedLessons((int) completed);
            scp.setTotalLessons(20);
            scp.setProgressPercentage(completed > 0 ? Math.min(100.0, (completed * 100.0) / 20.0) : 0.0);
            courseProgressList.add(scp);
        }
        detail.setEnrolledCourses(courseProgressList);

        // 2. Quiz Attempts
        List<UserQuizAttempt> attempts = userQuizAttemptRepository.findByUserIdOrderBySubmittedAtDesc(user.getId());
        List<AdminStudentDto.StudentQuizAttemptDto> attemptDtos = attempts.stream().map(a -> {
            AdminStudentDto.StudentQuizAttemptDto sqa = new AdminStudentDto.StudentQuizAttemptDto();
            sqa.setAttemptId(a.getId());
            if (a.getQuiz() != null) {
                sqa.setQuizId(a.getQuiz().getId());
                sqa.setQuizTitle(a.getQuiz().getTitle());
                if (a.getQuiz().getModule() != null && a.getQuiz().getModule().getCourse() != null) {
                    sqa.setCourseTitle(a.getQuiz().getModule().getCourse().getTitle());
                }
            }
            sqa.setScore(a.getCorrectAnswers());
            sqa.setTotalQuestions(a.getTotalQuestions());
            sqa.setPercentage(a.getScorePercentage() != null ? a.getScorePercentage().doubleValue() : 0.0);
            sqa.setPassed(a.isPassed());
            sqa.setSubmittedAt(a.getSubmittedAt());
            return sqa;
        }).collect(Collectors.toList());
        detail.setQuizAttempts(attemptDtos);

        // 3. Payments
        List<AdminStudentDto.StudentPaymentRecordDto> paymentList = new ArrayList<>();
        BigDecimal totalSpent = BigDecimal.ZERO;

        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        for (Order o : orders) {
            AdminStudentDto.StudentPaymentRecordDto p = new AdminStudentDto.StudentPaymentRecordDto();
            p.setId("ORD-" + o.getId());
            p.setType("EBOOK");
            p.setDescription("E-Book Order #" + o.getOrderNumber());
            p.setAmount(o.getTotalAmount());
            p.setCurrency(o.getCurrency());
            p.setStatus(o.getStatus().name());
            p.setOrderId(o.getRazorpayOrderId());
            p.setPaymentId(o.getRazorpayPaymentId());
            p.setCreatedAt(o.getCreatedAt());
            paymentList.add(p);
            if (o.getStatus() == OrderStatus.PAID && o.getTotalAmount() != null) {
                totalSpent = totalSpent.add(o.getTotalAmount());
            }
        }

        List<PlacementReadyPayment> prs = placementReadyPaymentRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        for (PlacementReadyPayment pr : prs) {
            AdminStudentDto.StudentPaymentRecordDto p = new AdminStudentDto.StudentPaymentRecordDto();
            p.setId("PR-" + pr.getId());
            p.setType("PLACEMENT_READY");
            p.setDescription("Placement Ready: " + (pr.getCourse() != null ? pr.getCourse().getTitle() : "Course"));
            BigDecimal amt = BigDecimal.valueOf(pr.getAmountPaise()).divide(BigDecimal.valueOf(100));
            p.setAmount(amt);
            p.setCurrency(pr.getCurrency());
            p.setStatus(pr.getStatus().name());
            p.setOrderId(pr.getRazorpayOrderId());
            p.setPaymentId(pr.getRazorpayPaymentId());
            p.setCreatedAt(pr.getCreatedAt());
            paymentList.add(p);
            if (pr.getStatus() == PaymentStatus.PAID) {
                totalSpent = totalSpent.add(amt);
            }
        }

        List<CertificatePayment> certPayments = certificatePaymentRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        for (CertificatePayment cp : certPayments) {
            AdminStudentDto.StudentPaymentRecordDto p = new AdminStudentDto.StudentPaymentRecordDto();
            p.setId("CERT-" + cp.getId());
            p.setType("CERTIFICATE");
            p.setDescription("Certificate: " + (cp.getCourse() != null ? cp.getCourse().getTitle() : "Course"));
            BigDecimal amt = BigDecimal.valueOf(cp.getAmountPaise()).divide(BigDecimal.valueOf(100));
            p.setAmount(amt);
            p.setCurrency(cp.getCurrency());
            p.setStatus(cp.getStatus().name());
            p.setOrderId(cp.getRazorpayOrderId());
            p.setPaymentId(cp.getRazorpayPaymentId());
            p.setCreatedAt(cp.getCreatedAt());
            paymentList.add(p);
            if (cp.getStatus() == PaymentStatus.PAID) {
                totalSpent = totalSpent.add(amt);
            }
        }

        detail.setPayments(paymentList);
        detail.setTotalSpent(totalSpent);

        // 4. Certificates
        List<Certificate> certs = certificateRepository.findByUserIdOrderByIssuedAtDesc(user.getId());
        List<AdminStudentDto.StudentCertificateRecordDto> certDtos = certs.stream().map(c -> {
            AdminStudentDto.StudentCertificateRecordDto cr = new AdminStudentDto.StudentCertificateRecordDto();
            cr.setId(c.getId());
            cr.setCertificateCode(c.getCertificateCode());
            cr.setCourseTitle(c.getCourse() != null ? c.getCourse().getTitle() : "Course");
            cr.setSubject(c.getCourse() != null ? c.getCourse().getTrack() : "Tech");
            cr.setStatus(c.getStatus() != null ? c.getStatus().name() : "ISSUED");
            cr.setIssuedAt(c.getIssuedAt());
            cr.setPdfUrl("/api/certificates/" + c.getId() + "/download");
            cr.setVerificationUrl("/verify/" + c.getCertificateCode());
            return cr;
        }).collect(Collectors.toList());
        detail.setCertificates(certDtos);
        detail.setCertificates(certDtos);

        return detail;
    }
}
