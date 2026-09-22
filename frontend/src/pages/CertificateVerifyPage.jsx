import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  ArrowLeft, 
  Copy, 
  Check, 
  Printer, 
  Download, 
  Share2, 
  ExternalLink, 
  BookOpen, 
  QrCode, 
  Sparkles, 
  Loader2
} from 'lucide-react';
import { certificateApi } from '../services/certificateApi';
import { SeoHead } from '../components/seo/SeoHead';
import { OfficialCertificateFrame } from '../components/certificate/OfficialCertificateFrame';
import { Button, Badge, Card, Skeleton, EmptyState } from '../components/ui';

export const CertificateVerifyPage = () => {
  const { certificateCode } = useParams();
  const navigate = useNavigate();
  const certificateRef = useRef(null);

  const [inputCode, setInputCode] = useState(certificateCode || '');
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [error, setError] = useState(null);
  const [is404, setIs404] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchVerification = async (codeToVerify) => {
    if (!codeToVerify || !codeToVerify.trim()) return;
    setLoading(true);
    setError(null);
    setIs404(false);
    setCert(null);

    try {
      const res = await certificateApi.verifyCertificate(codeToVerify.trim());
      if (res.success && res.data) {
        setCert(res.data);
      } else {
        if (res.status === 404) {
          setIs404(true);
        } else {
          setError(res.message || 'Verification check failed.');
        }
      }
    } catch (err) {
      setError('Server unreachable during verification.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certificateCode) {
      setInputCode(certificateCode);
      fetchVerification(certificateCode);
    }
  }, [certificateCode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      navigate(`/certificates/verify/${encodeURIComponent(inputCode.trim().toUpperCase())}`);
    }
  };

  const getVerifyUrl = () => {
    const code = cert?.certificateCode || inputCode.trim();
    if (typeof window !== 'undefined' && window.location.origin) {
      const isLocal = window.location.hostname.includes('localhost');
      const origin = isLocal ? window.location.origin : 'https://www.codeorbit.online';
      return `${origin}/verify/${code}`;
    }
    return `https://www.codeorbit.online/verify/${code}`;
  };

  const handleCopyLink = () => {
    const link = getVerifyUrl();
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownloadPdf = async () => {
    if (!cert || !certificateRef.current) return;
    setDownloadingPdf(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = certificateRef.current;

      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const renderWidth = imgWidth * ratio;
      const renderHeight = imgHeight * ratio;
      const marginX = (pdfWidth - renderWidth) / 2;
      const marginY = (pdfHeight - renderHeight) / 2;

      pdf.addImage(imgData, 'PNG', marginX, marginY, renderWidth, renderHeight, undefined, 'FAST');
      
      const sanitizedName = (cert.studentFullName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
      const sanitizedCode = (cert.certificateCode || 'CERT').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`CodeOrbit_Certificate_${sanitizedName}_${sanitizedCode}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF automatically, falling back to print dialog:', err);
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLinkedInShare = () => {
    if (!cert) return;
    const certUrl = getVerifyUrl();
    const certName = encodeURIComponent(cert.courseTitle);
    const orgName = encodeURIComponent('CodeOrbit');
    const certId = encodeURIComponent(cert.certificateCode);
    
    const linkedinUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${certName}&organizationName=${orgName}&certUrl=${encodeURIComponent(certUrl)}&certId=${certId}`;
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 flex flex-col selection:bg-emerald-500 selection:text-white">
      <SeoHead
        title={cert ? `${cert.studentFullName} — ${cert.courseTitle} Certificate | CodeOrbit` : 'Verify Certificate — CodeOrbit'}
        description={cert ? `Official verified certificate of completion awarded to ${cert.studentFullName} for ${cert.courseTitle}. Verification ID: ${cert.certificateCode}.` : 'Verify the authenticity of computer science course completion credentials issued by CodeOrbit.'}
        canonicalUrl={`https://www.codeorbit.online/certificates/verify/${certificateCode || ''}`}
      />

      <div className="max-w-6xl mx-auto w-full space-y-8 flex-1">
        
        {/* Navigation Bar (Hidden during Print) */}
        <div className="no-print flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            href="/courses"
            icon={ArrowLeft}
          >
            Back to Subject Tracks
          </Button>
          <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Public Registry & Cryptographic Verification
          </span>
        </div>

        {/* Header Title (Hidden during Print) */}
        <div className="no-print text-center space-y-3">
          <Badge variant="primary" size="md">
            <ShieldCheck className="w-3.5 h-3.5" /> CodeOrbit Official Credential Registry
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Academic Certificate Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Verify the authenticity of computer science course completion diplomas and professional credentials issued by CodeOrbit.
          </p>
        </div>

        {/* Verification Lookup Form (Hidden during Print) */}
        <form onSubmit={handleSearchSubmit} className="no-print relative max-w-xl mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Enter Certificate Code (e.g. CO-DSA-2026-XXXX)"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-2xl pl-11 pr-28 py-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono uppercase shadow-2xs"
          />
          <button
            type="submit"
            disabled={!inputCode.trim() || loading}
            className="absolute right-2 top-2 bottom-2 px-5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            {loading ? 'Checking...' : 'Verify'}
          </button>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="no-print max-w-xl mx-auto space-y-4">
            <Skeleton variant="card" height="180px" />
          </div>
        )}

        {/* 404 Not Found State */}
        {!loading && is404 && (
          <div className="no-print max-w-xl mx-auto">
            <Card className="p-8 text-center">
              <EmptyState
                icon={XCircle}
                title="Certificate Not Found"
                description={`No issued certificate matches the code "${inputCode}" in the CodeOrbit verification registry. Please check for typos and re-enter.`}
              />
            </Card>
          </div>
        )}

        {/* Error State */}
        {!loading && !is404 && error && (
          <div className="no-print max-w-xl mx-auto">
            <Card className="p-8 text-center">
              <EmptyState
                icon={AlertCircle}
                title="Verification Error"
                description={error}
                actionText="Retry Verification"
                onAction={() => fetchVerification(inputCode)}
              />
            </Card>
          </div>
        )}

        {/* Verified Certificate Section */}
        {!loading && !is404 && !error && cert && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Top Verification Status & Download Toolbar (Hidden during Print) */}
            <Card className="no-print p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">Authentic CodeOrbit Credential</span>
                    <Badge variant="success" size="xs">
                      VERIFIED & VALID
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Code: <strong className="text-slate-800">{cert.certificateCode}</strong> • Recipient: <strong className="text-slate-800">{cert.studentFullName}</strong>
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDownloadPdf}
                  loading={downloadingPdf}
                  icon={Download}
                >
                  Download PDF
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePrint}
                  icon={Printer}
                >
                  Print
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyLink}
                  icon={copied ? Check : Copy}
                >
                  {copied ? 'Link Copied!' : 'Copy Link for CV'}
                </Button>

                <button
                  onClick={handleLinkedInShare}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[#0077B5] hover:bg-[#005f93] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  title="Add this verified certificate to your LinkedIn profile certifications"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Add to LinkedIn</span>
                </button>
              </div>
            </Card>

            {/* Official Academic Certificate Frame */}
            <OfficialCertificateFrame ref={certificateRef} cert={cert} />

            {/* Recruiter & Resume Integration Guide (Hidden during Print) */}
            <Card className="no-print p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  How Recruiters & Employers Verify This Certificate
                </h3>
                <span className="text-[11px] font-mono text-slate-500 font-medium">100% Cryptographically Verifiable</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>1. Instant QR Code Scan</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Recruiters can scan the QR code printed on the bottom right of the certificate with any phone camera to immediately open the authentic registry record.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Copy className="w-4 h-4 text-emerald-600" />
                    <span>2. Direct Resume URL</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Add the live verification URL <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-emerald-800 font-bold break-all">{getVerifyUrl()}</code> directly to your Resume / CV.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>3. High-Res PDF Export</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Download the A4 Landscape PDF using the button above and attach it to job applications or portfolio repositories.
                  </p>
                </div>
              </div>

              {cert.courseSlug && (
                <div className="pt-2 flex justify-end">
                  <Link
                    to={`/courses/${cert.courseSlug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> View Full Course Curriculum & Syllabus <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </Card>

          </div>
        )}

      </div>
    </div>
  );
};

export default CertificateVerifyPage;
