package com.codeorbit.service;

import com.codeorbit.entity.Certificate;

public interface CertificatePdfGeneratorService {

    byte[] generateCertificatePdf(Certificate cert);
}
