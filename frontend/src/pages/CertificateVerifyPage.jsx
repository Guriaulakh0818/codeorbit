import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  BookOpen, 
  ExternalLink, 
  AlertCircle, 
  RefreshCw, 
  ArrowLeft,
  Copy,
  Check
} from 'lucide-react';
import { certificateApi } from '../services/certificateApi';
import { SeoHead } from '../components/seo/SeoHead';

export const CertificateVerifyPage = () => {
  const { certificateCode } = useParams();
  const navigate = useNavigate();

  const [inputCode, setInputCode] = useState(certificateCode || '');
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8 flex flex-col selection:bg-emerald-500 selection:text-white">
      <SeoHead
        title="Verify Certificate — CodeOrbit"
        description="Verify the authenticity of computer science course completion credentials issued by CodeOrbit."
        canonicalUrl="https://www.codeorbit.online/certificates/verify"
      />

      <div className="max-w-3xl mx-auto w-full space-y-8 flex-1">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Subject Tracks
          </Link>
          <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Public Registry
          </span>
        </div>

        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> CodeOrbit Official Credential Verification
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Certificate Verification System
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Verify the authenticity of computer science course completion credentials issued by CodeOrbit.
          </p>
        </div>

        {/* Verification Lookup Form */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
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
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-4 animate-pulse max-w-xl mx-auto text-center shadow-xs">
            <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto" />
            <div className="h-6 bg-slate-100 rounded w-1/2 mx-auto" />
            <div className="h-10 bg-slate-100 rounded w-3/4 mx-auto" />
          </div>
        )}

        {/* 404 Not Found State */}
        {!loading && is404 && (
          <div className="bg-white border border-rose-200 rounded-3xl p-8 text-center space-y-4 max-w-xl mx-auto shadow-xs animate-in fade-in duration-200">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
              <XCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Certificate Not Found</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No issued certificate matches the code <span className="font-mono text-rose-600 font-bold">"{inputCode}"</span> in the CodeOrbit verification registry. Please check for typos and re-enter.
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && !is404 && error && (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-200">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Verification Error</h3>
            <p className="text-xs text-rose-700">{error}</p>
            <button
              onClick={() => fetchVerification(inputCode)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Verified Credential Card */}
        {!loading && !is404 && !error && cert && (
          <div className="relative overflow-hidden rounded-3xl bg-white border border-emerald-200 p-8 sm:p-12 shadow-sm space-y-8 animate-in fade-in duration-300 max-w-2xl mx-auto">
            
            {/* Top Seal & Validity Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-2xs flex-shrink-0">
                  <Award className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">CodeOrbit Open CS Academy</div>
                  <div className="text-sm font-extrabold text-slate-900">Verified Certificate of Completion</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  cert.valid
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {cert.valid ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> VALID CREDENTIAL
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-rose-600" /> {cert.status || 'REVOKED'}
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="space-y-6 text-center sm:text-left">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium">Awarded To</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {cert.studentFullName}
                </h2>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium">For Successfully Completing</span>
                <h3 className="text-lg sm:text-xl font-bold text-emerald-700">
                  {cert.courseTitle}
                </h3>
              </div>

              {/* Certificate Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Verification Code</span>
                  <span className="text-xs font-mono font-bold text-emerald-800 select-all">
                    {cert.certificateCode}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Issue Date</span>
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Revocation notice if invalid */}
            {!cert.valid && cert.revocationReason && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs text-rose-800">
                <span className="font-bold block mb-0.5">Revocation Notice:</span>
                <p>{cert.revocationReason}</p>
              </div>
            )}

            {/* Actions & Share */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-100">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Verification Link</span>
                  </>
                )}
              </button>

              {cert.courseSlug && (
                <Link
                  to={`/courses/${cert.courseSlug}`}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" /> View Course Syllabus <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CertificateVerifyPage;
