package com.codeorbit.service.impl;

import com.codeorbit.entity.*;
import com.codeorbit.repository.*;
import com.codeorbit.service.AdminReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AdminReportServiceImpl implements AdminReportService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final OrderRepository orderRepository;
    private final PlacementReadyPaymentRepository placementReadyPaymentRepository;
    private final CertificatePaymentRepository certificatePaymentRepository;
    private final CertificateRepository certificateRepository;
    private final UserQuizAttemptRepository userQuizAttemptRepository;

    public AdminReportServiceImpl(
            UserRepository userRepository,
            CourseRepository courseRepository,
            OrderRepository orderRepository,
            PlacementReadyPaymentRepository placementReadyPaymentRepository,
            CertificatePaymentRepository certificatePaymentRepository,
            CertificateRepository certificateRepository,
            UserQuizAttemptRepository userQuizAttemptRepository
    ) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.orderRepository = orderRepository;
        this.placementReadyPaymentRepository = placementReadyPaymentRepository;
        this.certificatePaymentRepository = certificatePaymentRepository;
        this.certificateRepository = certificateRepository;
        this.userQuizAttemptRepository = userQuizAttemptRepository;
    }

    @Override
    public String generateCsvReport(String reportType) {
        StringBuilder sb = new StringBuilder();

        switch (reportType.toUpperCase()) {
            case "STUDENTS":
                sb.append("Student ID,Full Name,Email,Role,Auth Provider,Joined At\n");
                List<User> users = userRepository.findAll();
                for (User u : users) {
                    sb.append(u.getId()).append(",")
                            .append(escapeCsv(u.getFullName())).append(",")
                            .append(escapeCsv(u.getEmail())).append(",")
                            .append(u.getRole()).append(",")
                            .append(u.getProvider()).append(",")
                            .append(u.getCreatedAt()).append("\n");
                }
                break;

            case "COURSES":
                sb.append("Course ID,Title,Slug,Track,Level,Status,Price\n");
                List<Course> courses = courseRepository.findAll();
                for (Course c : courses) {
                    sb.append(c.getId()).append(",")
                            .append(escapeCsv(c.getTitle())).append(",")
                            .append(escapeCsv(c.getSlug())).append(",")
                            .append(escapeCsv(c.getTrack())).append(",")
                            .append(c.getLevel()).append(",")
                            .append(c.getStatus()).append(",")
                            .append(c.isPaid() ? "29.00" : "0.00").append("\n");
                }
                break;

            case "REVENUE":
                sb.append("Payment Type,Order Number,User Email,Amount (INR),Status,Gateway Order ID,Payment ID,Date\n");
                // Placement Ready
                for (PlacementReadyPayment pr : placementReadyPaymentRepository.findAll()) {
                    sb.append("PLACEMENT_READY,")
                            .append(escapeCsv(pr.getOrderNumber())).append(",")
                            .append(escapeCsv(pr.getUser() != null ? pr.getUser().getEmail() : "")).append(",")
                            .append(BigDecimal.valueOf(pr.getAmountPaise()).divide(BigDecimal.valueOf(100))).append(",")
                            .append(pr.getStatus()).append(",")
                            .append(escapeCsv(pr.getRazorpayOrderId())).append(",")
                            .append(escapeCsv(pr.getRazorpayPaymentId())).append(",")
                            .append(pr.getCreatedAt()).append("\n");
                }
                // Certificate
                for (CertificatePayment cp : certificatePaymentRepository.findAll()) {
                    sb.append("CERTIFICATE,")
                            .append(escapeCsv(cp.getOrderNumber())).append(",")
                            .append(escapeCsv(cp.getUser() != null ? cp.getUser().getEmail() : "")).append(",")
                            .append(BigDecimal.valueOf(cp.getAmountPaise()).divide(BigDecimal.valueOf(100))).append(",")
                            .append(cp.getStatus()).append(",")
                            .append(escapeCsv(cp.getRazorpayOrderId())).append(",")
                            .append(escapeCsv(cp.getRazorpayPaymentId())).append(",")
                            .append(cp.getCreatedAt()).append("\n");
                }
                // Orders
                for (Order o : orderRepository.findAll()) {
                    sb.append("EBOOK,")
                            .append(escapeCsv(o.getOrderNumber())).append(",")
                            .append(escapeCsv(o.getUser() != null ? o.getUser().getEmail() : "")).append(",")
                            .append(o.getTotalAmount()).append(",")
                            .append(o.getStatus()).append(",")
                            .append(escapeCsv(o.getRazorpayOrderId())).append(",")
                            .append(escapeCsv(o.getRazorpayPaymentId())).append(",")
                            .append(o.getCreatedAt()).append("\n");
                }
                break;

            case "CERTIFICATES":
                sb.append("Certificate Code,Student Name,Student Email,Course Title,Status,Issued At,Verification URL\n");
                for (Certificate c : certificateRepository.findAll()) {
                    sb.append(escapeCsv(c.getCertificateCode())).append(",")
                            .append(escapeCsv(c.getUser() != null ? c.getUser().getFullName() : "")).append(",")
                            .append(escapeCsv(c.getUser() != null ? c.getUser().getEmail() : "")).append(",")
                            .append(escapeCsv(c.getCourse() != null ? c.getCourse().getTitle() : "")).append(",")
                            .append(c.getStatus()).append(",")
                            .append(c.getIssuedAt()).append(",")
                            .append(escapeCsv(c.getVerificationUrl())).append("\n");
                }
                break;

            case "QUIZZES":
            default:
                sb.append("Attempt ID,Student Email,Quiz Title,Score,Total Questions,Percentage,Passed,Submitted At\n");
                for (UserQuizAttempt a : userQuizAttemptRepository.findAll()) {
                    sb.append(a.getId()).append(",")
                            .append(escapeCsv(a.getUser() != null ? a.getUser().getEmail() : "")).append(",")
                            .append(escapeCsv(a.getQuiz() != null ? a.getQuiz().getTitle() : "")).append(",")
                            .append(a.getScore()).append(",")
                            .append(a.getTotalQuestions()).append(",")
                            .append(a.getPercentage()).append(",")
                            .append(a.isPassed()).append(",")
                            .append(a.getSubmittedAt()).append("\n");
                }
                break;
        }

        return sb.toString();
    }

    private String escapeCsv(String input) {
        if (input == null) return "";
        if (input.contains(",") || input.contains("\"") || input.contains("\n")) {
            return "\"" + input.replace("\"", "\"\"") + "\"";
        }
        return input;
    }
}
