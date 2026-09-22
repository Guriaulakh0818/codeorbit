package com.codeorbit.service.impl;

import com.codeorbit.entity.Certificate;
import com.codeorbit.service.CertificatePdfGeneratorService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class CertificatePdfGeneratorServiceImpl implements CertificatePdfGeneratorService {

    @Value("${app.frontend-url:https://www.codeorbit.online}")
    private String frontendUrl;

    @Override
    public byte[] generateCertificatePdf(Certificate cert) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            // A4 Landscape dimensions: 842 x 595 points
            Document document = new Document(PageSize.A4.rotate(), 30, 30, 30, 30);
            PdfWriter writer = PdfWriter.getInstance(document, baos);

            document.open();

            PdfContentByte cb = writer.getDirectContent();

            // 1. Draw decorative double gold/navy borders
            // Outer navy border
            cb.setColorStroke(new Color(15, 23, 42)); // Slate 900
            cb.setLineWidth(4f);
            cb.rectangle(20, 20, PageSize.A4.rotate().getWidth() - 40, PageSize.A4.rotate().getHeight() - 40);
            cb.stroke();

            // Inner gold border
            cb.setColorStroke(new Color(217, 119, 6)); // Amber 600
            cb.setLineWidth(1.5f);
            cb.rectangle(26, 26, PageSize.A4.rotate().getWidth() - 52, PageSize.A4.rotate().getHeight() - 52);
            cb.stroke();

            // Thin inner border
            cb.setColorStroke(new Color(16, 185, 129)); // Emerald 500
            cb.setLineWidth(0.8f);
            cb.rectangle(30, 30, PageSize.A4.rotate().getWidth() - 60, PageSize.A4.rotate().getHeight() - 60);
            cb.stroke();

            // 2. Main Content
            Font brandFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, new Color(15, 23, 42));
            Font subBrandFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, new Color(16, 185, 129));
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, new Color(217, 119, 6));
            Font certForFont = FontFactory.getFont(FontFactory.HELVETICA, 11, new Color(100, 116, 139));
            Font studentNameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28, new Color(15, 23, 42));
            Font descFont = FontFactory.getFont(FontFactory.HELVETICA, 11, new Color(51, 65, 85));
            Font courseFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, new Color(13, 148, 136));
            Font metaFont = FontFactory.getFont(FontFactory.HELVETICA, 9, new Color(100, 116, 139));
            Font signFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new Color(15, 23, 42));

            Paragraph header = new Paragraph();
            header.setAlignment(Element.ALIGN_CENTER);
            header.setSpacingBefore(15);
            header.add(new Chunk("CODEORBIT ACADEMY\n", brandFont));
            header.add(new Chunk("FACULTY OF COMPUTER SCIENCE & ENGINEERING\n", subBrandFont));
            document.add(header);

            Paragraph title = new Paragraph();
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingBefore(12);
            title.add(new Chunk("CERTIFICATE OF ACHIEVEMENT\n", titleFont));
            title.add(new Chunk("This is to officially certify that\n", certForFont));
            document.add(title);

            Paragraph studentPara = new Paragraph();
            studentPara.setAlignment(Element.ALIGN_CENTER);
            studentPara.setSpacingBefore(8);
            studentPara.add(new Chunk(cert.getStudentFullName() != null ? cert.getStudentFullName() : "Student", studentNameFont));
            document.add(studentPara);

            Paragraph descPara = new Paragraph();
            descPara.setAlignment(Element.ALIGN_CENTER);
            descPara.setSpacingBefore(8);
            descPara.add(new Chunk("has successfully demonstrated computational mastery, completed all required curriculum levels,\nand passed all proctored assessments in\n", descFont));
            document.add(descPara);

            Paragraph coursePara = new Paragraph();
            coursePara.setAlignment(Element.ALIGN_CENTER);
            coursePara.setSpacingBefore(6);
            coursePara.add(new Chunk(cert.getCourseTitle() != null ? cert.getCourseTitle() : "Computer Science", courseFont));
            document.add(coursePara);

            // 3. Footer Table with Signatures, QR Code & ID
            PdfPTable footerTable = new PdfPTable(3);
            footerTable.setWidthPercentage(90);
            footerTable.setSpacingBefore(20);
            footerTable.setWidths(new float[]{35f, 35f, 30f});

            // Column 1: Signatures
            PdfPCell signCell = new PdfPCell();
            signCell.setBorder(Rectangle.NO_BORDER);
            Paragraph p1 = new Paragraph();
            p1.add(new Chunk("Aarav Sharma\n", signFont));
            p1.add(new Chunk("Academic Dean, CodeOrbit\n\n", metaFont));
            p1.add(new Chunk("Dr. Priya Patel\n", signFont));
            p1.add(new Chunk("Lead Faculty, Computer Science", metaFont));
            signCell.addElement(p1);
            footerTable.addCell(signCell);

            // Column 2: Date & Seal / Verification Text
            PdfPCell midCell = new PdfPCell();
            midCell.setBorder(Rectangle.NO_BORDER);
            midCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            String issueDate = cert.getIssuedAt() != null
                    ? cert.getIssuedAt().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"))
                    : "Official Record";
            Paragraph p2 = new Paragraph();
            p2.setAlignment(Element.ALIGN_CENTER);
            p2.add(new Chunk("OFFICIAL ACADEMIC CREDENTIAL\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, new Color(217, 119, 6))));
            p2.add(new Chunk("Certificate ID: " + cert.getCertificateCode() + "\n", FontFactory.getFont(FontFactory.COURIER_BOLD, 10, new Color(15, 23, 42))));
            p2.add(new Chunk("Issued Date: " + issueDate + "\n", metaFont));
            p2.add(new Chunk("Status: " + cert.getStatus().name(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, new Color(16, 185, 129))));
            midCell.addElement(p2);
            footerTable.addCell(midCell);

            // Column 3: Scannable QR Code
            PdfPCell qrCell = new PdfPCell();
            qrCell.setBorder(Rectangle.NO_BORDER);
            qrCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

            String verifyUrl = getVerifyUrl(cert.getCertificateCode());
            Image qrImage = generateQrCodeImage(verifyUrl);
            if (qrImage != null) {
                qrImage.scaleAbsolute(70, 70);
                qrImage.setAlignment(Element.ALIGN_RIGHT);
                qrCell.addElement(qrImage);
                Paragraph qrLabel = new Paragraph(new Chunk("Scan to Verify Online", FontFactory.getFont(FontFactory.HELVETICA, 7, new Color(100, 116, 139))));
                qrLabel.setAlignment(Element.ALIGN_RIGHT);
                qrCell.addElement(qrLabel);
            }
            footerTable.addCell(qrCell);

            document.add(footerTable);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF certificate: " + e.getMessage(), e);
        }
    }

    private String getVerifyUrl(String certificateCode) {
        String base = (frontendUrl != null && !frontendUrl.isBlank()) ? frontendUrl.trim() : "https://www.codeorbit.online";
        if (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        return base + "/verify/" + certificateCode;
    }

    private Image generateQrCodeImage(String qrContent) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M);
            hints.put(EncodeHintType.MARGIN, 1);

            BitMatrix bitMatrix = qrCodeWriter.encode(qrContent, BarcodeFormat.QR_CODE, 150, 150, hints);
            BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

            ByteArrayOutputStream qrBaos = new ByteArrayOutputStream();
            javax.imageio.ImageIO.write(bufferedImage, "png", qrBaos);
            return Image.getInstance(qrBaos.toByteArray());
        } catch (Exception e) {
            return null;
        }
    }
}
