package com.codeorbit.service;

import com.codeorbit.dto.CertificatePublicDto;
import com.codeorbit.security.UserPrincipal;

import java.util.List;

public interface CertificateService {

    CertificatePublicDto verifyCertificate(String certificateCode);

    CertificatePublicDto claimCourseCertificate(UserPrincipal principal, String courseSlug);

    List<CertificatePublicDto> getStudentCertificates(UserPrincipal principal);
}
