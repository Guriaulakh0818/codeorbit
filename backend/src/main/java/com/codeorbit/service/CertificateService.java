package com.codeorbit.service;

import com.codeorbit.dto.CertificateOrderResponseDto;
import com.codeorbit.dto.CertificatePaymentVerifyRequestDto;
import com.codeorbit.dto.CertificatePublicDto;
import com.codeorbit.dto.CertificateStatusDto;
import com.codeorbit.security.UserPrincipal;

import java.util.List;
import java.util.Map;

public interface CertificateService {

    CertificatePublicDto verifyCertificate(String certificateCode);

    CertificateStatusDto getCertificateStatus(UserPrincipal principal, String courseSlug);

    CertificateOrderResponseDto createCertificateOrder(UserPrincipal principal, String courseSlug);

    CertificatePublicDto verifyAndIssueCertificate(UserPrincipal principal, String courseSlug, CertificatePaymentVerifyRequestDto request);

    byte[] downloadCertificatePdf(UserPrincipal principal, String certificateCode);

    CertificatePublicDto claimCourseCertificate(UserPrincipal principal, String courseSlug);

    List<CertificatePublicDto> getStudentCertificates(UserPrincipal principal);

    void processCertificateWebhook(String eventType, Map<String, Object> payload, String signature);
}
