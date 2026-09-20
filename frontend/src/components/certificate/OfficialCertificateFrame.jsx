import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, CheckCircle2, Award, Sparkles, Check, Globe, Cpu, BookOpen } from 'lucide-react';

export const OfficialCertificateFrame = forwardRef(({ cert }, ref) => {
  if (!cert) return null;

  const issueDateFormatted = cert.issuedAt
    ? new Date(cert.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'September 20, 2026';

  // Live canonical verification URL
  const baseUrl = typeof window !== 'undefined' && window.location.origin
    ? (window.location.hostname.includes('localhost') ? window.location.origin : 'https://www.codeorbit.online')
    : 'https://www.codeorbit.online';
    
  const verifyUrl = `${baseUrl}/verify/${cert.certificateCode}`;

  // Track-specific colorful theme detection
  const courseTitleLower = (cert.courseTitle || '').toLowerCase();
  let trackTheme = {
    name: 'Computer Science Track',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    cardBg: 'from-emerald-50/90 via-teal-50/80 to-emerald-50/90',
    cardBorder: 'border-emerald-300',
    titleColor: 'text-emerald-950',
    accentColor: '#10b981'
  };

  if (courseTitleLower.includes('operating') || courseTitleLower.includes('os')) {
    trackTheme = {
      name: 'Operating Systems & Systems Track',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-300',
      cardBg: 'from-amber-50/90 via-orange-50/80 to-amber-50/90',
      cardBorder: 'border-amber-300',
      titleColor: 'text-amber-950',
      accentColor: '#f59e0b'
    };
  } else if (courseTitleLower.includes('dbms') || courseTitleLower.includes('database') || courseTitleLower.includes('sql')) {
    trackTheme = {
      name: 'Database Systems & SQL Track',
      badgeBg: 'bg-teal-50 text-teal-800 border-teal-300',
      cardBg: 'from-teal-50/90 via-cyan-50/80 to-teal-50/90',
      cardBorder: 'border-teal-300',
      titleColor: 'text-teal-950',
      accentColor: '#0d9488'
    };
  } else if (courseTitleLower.includes('network')) {
    trackTheme = {
      name: 'Computer Networks & Protocols Track',
      badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-300',
      cardBg: 'from-indigo-50/90 via-blue-50/80 to-indigo-50/90',
      cardBorder: 'border-indigo-300',
      titleColor: 'text-indigo-950',
      accentColor: '#4f46e5'
    };
  }

  return (
    <div
      ref={ref}
      id="codeorbit-official-certificate"
      className="certificate-print-frame w-full max-w-5xl mx-auto text-slate-900 shadow-2xl rounded-2xl relative overflow-hidden select-text border-2 border-amber-400/90 bg-[#fdfbf7]"
      style={{
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 2px rgba(212, 175, 55, 0.4)'
      }}
    >
      {/* Outer Classical Royal Navy & Emerald Luxury Layer */}
      <div className="p-3 sm:p-5 md:p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
        
        {/* Decorative Outer Border Lines */}
        <div className="absolute inset-1.5 border border-amber-400/30 rounded-xl pointer-events-none" />

        {/* Inner Parchment Card Surface */}
        <div className="border-2 border-amber-400/90 rounded-lg p-4 sm:p-6 md:p-8 bg-[#ffffff] relative overflow-hidden shadow-inner">
          
          {/* Guilloche Security Geometric Wave Pattern */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.05] select-none"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, #d4af37 0%, transparent 70%), repeating-linear-gradient(45deg, #0f172a 0px, #0f172a 1px, transparent 1px, transparent 12px), repeating-linear-gradient(-45deg, #0f172a 0px, #0f172a 1px, transparent 1px, transparent 12px)`
            }}
          />

          {/* Luxury Corner Filigree Vector Accents */}
          {/* Top Left */}
          <svg className="absolute top-2 left-2 w-16 h-16 sm:w-22 sm:h-22 text-amber-600 pointer-events-none select-none opacity-95" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5,5 L95,5 M5,5 L5,95" strokeWidth="3.5" stroke="#d97706" />
            <path d="M12,12 L85,12 M12,12 L12,85" strokeWidth="1.5" stroke="#10b981" />
            <path d="M5,5 Q40,5 40,40 Q5,40 5,5 Z" fill="#fef3c7" fillOpacity="0.5" />
            <circle cx="22" cy="22" r="6" fill="#d97706" />
            <circle cx="22" cy="22" r="3" fill="#10b981" />
            <path d="M22,5 L22,40 M5,22 L40,22" strokeWidth="1" strokeDasharray="2,2" stroke="#d97706" />
          </svg>

          {/* Top Right */}
          <svg className="absolute top-2 right-2 w-16 h-16 sm:w-22 sm:h-22 text-amber-600 pointer-events-none select-none opacity-95 rotate-90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5,5 L95,5 M5,5 L5,95" strokeWidth="3.5" stroke="#d97706" />
            <path d="M12,12 L85,12 M12,12 L12,85" strokeWidth="1.5" stroke="#10b981" />
            <path d="M5,5 Q40,5 40,40 Q5,40 5,5 Z" fill="#fef3c7" fillOpacity="0.5" />
            <circle cx="22" cy="22" r="6" fill="#d97706" />
            <circle cx="22" cy="22" r="3" fill="#10b981" />
            <path d="M22,5 L22,40 M5,22 L40,22" strokeWidth="1" strokeDasharray="2,2" stroke="#d97706" />
          </svg>

          {/* Bottom Left */}
          <svg className="absolute bottom-2 left-2 w-16 h-16 sm:w-22 sm:h-22 text-amber-600 pointer-events-none select-none opacity-95 -rotate-90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5,5 L95,5 M5,5 L5,95" strokeWidth="3.5" stroke="#d97706" />
            <path d="M12,12 L85,12 M12,12 L12,85" strokeWidth="1.5" stroke="#10b981" />
            <path d="M5,5 Q40,5 40,40 Q5,40 5,5 Z" fill="#fef3c7" fillOpacity="0.5" />
            <circle cx="22" cy="22" r="6" fill="#d97706" />
            <circle cx="22" cy="22" r="3" fill="#10b981" />
            <path d="M22,5 L22,40 M5,22 L40,22" strokeWidth="1" strokeDasharray="2,2" stroke="#d97706" />
          </svg>

          {/* Bottom Right */}
          <svg className="absolute bottom-2 right-2 w-16 h-16 sm:w-22 sm:h-22 text-amber-600 pointer-events-none select-none opacity-95 rotate-180" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5,5 L95,5 M5,5 L5,95" strokeWidth="3.5" stroke="#d97706" />
            <path d="M12,12 L85,12 M12,12 L12,85" strokeWidth="1.5" stroke="#10b981" />
            <path d="M5,5 Q40,5 40,40 Q5,40 5,5 Z" fill="#fef3c7" fillOpacity="0.5" />
            <circle cx="22" cy="22" r="6" fill="#d97706" />
            <circle cx="22" cy="22" r="3" fill="#10b981" />
            <path d="M22,5 L22,40 M5,22 L40,22" strokeWidth="1" strokeDasharray="2,2" stroke="#d97706" />
          </svg>

          {/* Center Background Seal Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] select-none">
            <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full border-[16px] border-slate-900 flex flex-col items-center justify-center text-center">
              <span className="font-cinzel text-8xl font-black text-slate-900">CO</span>
              <span className="font-cinzel text-xs font-bold tracking-[0.3em] text-slate-900 mt-2">EST. 2026</span>
            </div>
          </div>

          {/* CERTIFICATE CONTENT CONTAINER */}
          <div className="relative z-10 space-y-5 sm:space-y-6 px-2 sm:px-6">
            
            {/* 1. TOP HEADER: Institution Crest & Colorful Status */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-amber-300/80 text-center sm:text-left">
              
              {/* Academy Seal Crest */}
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-auto flex items-center justify-center p-1 bg-white rounded-xl border border-amber-300 shadow-xs flex-shrink-0">
                  <img src="/logo.png" alt="CodeOrbit Academy" className="h-10 w-auto object-contain" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-cinzel text-lg sm:text-xl font-black tracking-wider text-slate-950 leading-tight">
                    CODEORBIT ACADEMY
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-800">
                    Faculty of Computer Science & Engineering
                  </div>
                  <div className="text-[9px] text-slate-500 font-serif italic">
                    Autonomous Open Academic Network • Verified Credential Registry
                  </div>
                </div>
              </div>

              {/* Verified Credential Badges */}
              <div className="flex flex-col items-center sm:items-end gap-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-400 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>AUTHENTIC & VERIFIED</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 font-bold bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200">
                  ID: <strong className="text-slate-900">{cert.certificateCode}</strong>
                </div>
              </div>

            </div>

            {/* 2. DIPLOMA TITLE & CONFERRAL PHRASING */}
            <div className="text-center space-y-3 sm:space-y-4 py-1">
              
              <div className="space-y-1">
                <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black tracking-[0.12em] text-slate-950 uppercase leading-tight">
                  CERTIFICATE OF ACHIEVEMENT
                </h1>
                <div className="flex items-center justify-center gap-3 max-w-sm mx-auto pt-1">
                  <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent flex-1" />
                  <span className="text-amber-600 text-sm">✦ ✦ ✦</span>
                  <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent flex-1" />
                </div>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-slate-500 pt-1 font-serif">
                  This is to officially certify that
                </p>
              </div>

              {/* 3. RECIPIENT FULL NAME (Grand Display Typography) */}
              <div className="space-y-1.5 py-1">
                <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-none px-4">
                  {cert.studentFullName}
                </h2>
                <div className="flex items-center justify-center gap-2 max-w-xs mx-auto pt-0.5">
                  <div className="h-[1.5px] bg-amber-400 flex-1" />
                  <div className="w-2 h-2 bg-emerald-600 rotate-45" />
                  <div className="h-[1.5px] bg-amber-400 flex-1" />
                </div>
              </div>

              {/* Conferral Description */}
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-serif">
                has successfully completed the comprehensive academic curriculum, demonstrated outstanding computational problem-solving, and passed all proctored assessments in
              </p>

              {/* 4. COURSE TITLE & VIBRANT COMPETENCIES CARD */}
              <div className="space-y-2.5 max-w-3xl mx-auto pt-1">
                <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r ${trackTheme.cardBg} border-2 ${trackTheme.cardBorder} shadow-xs space-y-2.5`}>
                  
                  <div className="flex items-center justify-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-2xs ${trackTheme.badgeBg}`}>
                      {trackTheme.name}
                    </span>
                  </div>

                  <h3 className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${trackTheme.titleColor} tracking-tight font-serif`}>
                    {cert.courseTitle}
                  </h3>
                  
                  {/* Competency Badges with Colorful Highlights */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[10px] text-slate-800">
                    <span className="px-3 py-1 rounded-lg bg-white border border-emerald-300 font-bold flex items-center gap-1.5 shadow-2xs text-emerald-900">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Full Curriculum Mastery</span>
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-white border border-amber-300 font-bold flex items-center gap-1.5 shadow-2xs text-amber-900">
                      <Cpu className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>Algorithmic Optimization</span>
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-white border border-teal-300 font-bold flex items-center gap-1.5 shadow-2xs text-teal-900">
                      <Award className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                      <span>Assessment Score: 80%+ Passed</span>
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-white border border-indigo-300 font-bold flex items-center gap-1.5 shadow-2xs text-indigo-900">
                      <Globe className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                      <span>Bilingual English & Hinglish</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* 5. FOOTER: Dual Signatures Left | 3D Gold Embossed Seal Center | Scannable QR Code & Recruiter Link Right */}
            <div className="pt-5 border-t border-amber-300/80 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              
              {/* Signatures Left (5 Cols) */}
              <div className="md:col-span-5 space-y-2.5 text-left">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 items-end">
                  {/* Signature 1 */}
                  <div className="space-y-0.5">
                    <div className="font-signature text-2xl sm:text-3xl text-slate-900 border-b border-slate-400 pb-0.5 select-none leading-tight font-normal">
                      Aarav Sharma
                    </div>
                    <div className="text-[11px] font-bold text-slate-900 leading-tight">Aarav Sharma</div>
                    <div className="text-[9px] text-slate-500 leading-tight font-serif">
                      Academic Dean, CodeOrbit Network
                    </div>
                  </div>

                  {/* Signature 2 */}
                  <div className="space-y-0.5">
                    <div className="font-signature text-2xl sm:text-3xl text-slate-900 border-b border-slate-400 pb-0.5 select-none leading-tight font-normal">
                      Dr. Priya Patel
                    </div>
                    <div className="text-[11px] font-bold text-slate-900 leading-tight">Dr. Priya Patel</div>
                    <div className="text-[9px] text-slate-500 leading-tight font-serif">
                      Lead Faculty, Computer Science
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 pt-1">
                  <span>Issued: <strong className="text-slate-800">{issueDateFormatted}</strong></span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Public Registry
                  </span>
                </div>
              </div>

              {/* 3D Embossed Gold Foil Seal (Center - 3 Cols) */}
              <div className="md:col-span-3 flex items-center justify-center">
                <div className="relative group select-none py-1">
                  {/* Gold/Emerald Satin Ribbons */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 pointer-events-none">
                    <div className="w-4 h-8 bg-gradient-to-b from-amber-500 via-amber-600 to-amber-800 -rotate-12 rounded-b-xs shadow-xs border-r border-amber-900/40" />
                    <div className="w-4 h-8 bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-900 rotate-12 rounded-b-xs shadow-xs border-l border-emerald-950/40" />
                  </div>

                  {/* Embossed Gold Medallion */}
                  <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 p-1 shadow-xl flex items-center justify-center relative border-2 border-amber-400">
                    <div className="w-full h-full rounded-full border-2 border-dashed border-amber-900/60 bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 flex flex-col items-center justify-center text-center p-1 shadow-inner">
                      <ShieldCheck className="w-6 h-6 text-amber-900" />
                      <span className="font-cinzel text-[7.5px] font-black uppercase text-amber-950 tracking-tighter mt-0.5 leading-none">
                        OFFICIAL SEAL
                      </span>
                      <span className="text-[6.5px] font-bold uppercase text-amber-900 tracking-tight leading-none mt-0.5">
                        AUTHENTIC & VERIFIED
                      </span>
                      <span className="text-[6px] font-mono text-emerald-900 font-black mt-0.5">
                        CODEORBIT CS
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scannable Dynamic QR Code & Recruiter URL (Right - 4 Cols) */}
              <div className="md:col-span-4 bg-slate-50 border-2 border-emerald-300 rounded-2xl p-3 flex items-center gap-3 text-left shadow-2xs">
                
                {/* Live Scannable QR Code */}
                <div className="p-1.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex-shrink-0">
                  <QRCodeSVG
                    value={verifyUrl}
                    size={68}
                    level="M"
                    includeMargin={false}
                    className="w-16 h-16 sm:w-[68px] sm:h-[68px]"
                  />
                </div>

                {/* Recruiter Instructions & Live URL */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    <span>Recruiter Verification</span>
                  </div>
                  
                  <a
                    href={verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono font-bold text-emerald-700 hover:text-emerald-800 hover:underline break-all block leading-tight"
                    title="Click or scan to verify official credential on CodeOrbit"
                  >
                    {verifyUrl}
                  </a>

                  <div className="text-[8.5px] text-slate-500 font-sans leading-tight pt-0.5">
                    Scan QR with phone camera or click link to verify authentic record.
                  </div>
                </div>

              </div>

            </div>

            {/* Micro Security Strip */}
            <div className="pt-2.5 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-[8.5px] text-slate-500 font-mono gap-1">
              <span>CodeOrbit Credential Registry • ID: {cert.certificateCode}</span>
              <span className="text-emerald-700 font-bold">Tamper-evident cryptographic verification enabled at codeorbit.online</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
});

OfficialCertificateFrame.displayName = 'OfficialCertificateFrame';

export default OfficialCertificateFrame;
