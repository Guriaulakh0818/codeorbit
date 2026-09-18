import React from 'react';
import { FileText, Shield, Scale, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsConditionsPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-300">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-400">
          <Scale className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-400">
          Last Updated: September 19, 2026 • CodeOrbit Technologies Private Limited
        </p>
      </div>

      {/* Main Content Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-8 text-xs sm:text-sm leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            1. Introduction & Acceptance of Terms
          </h2>
          <p>
            Welcome to <strong>CodeOrbit</strong> (accessible via our website and web applications). By accessing, browsing, registering an account, or purchasing digital goods (such as technical e-books, cheat sheets, interview guides, or code repositories) through CodeOrbit, you agree to be legally bound by these Terms & Conditions.
          </p>
          <p>
            If you do not agree to these Terms, you must immediately discontinue using the platform.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            2. Nature of Products & Digital Delivery
          </h2>
          <p>
            CodeOrbit offers <strong>100% digital products</strong> (including DRM-watermarked PDF e-books, source code bundles, and interactive in-browser readers) specifically designed for engineering students and developers.
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-400">
            <li><strong>Instant Delivery:</strong> Upon successful payment authorization via our authorized gateway (Razorpay), purchased materials are automatically added to your personal "Student Dashboard" and available for instant viewing and download.</li>
            <li><strong>No Physical Shipment:</strong> We do not ship physical paperback books or optical media. All fulfillment is digital.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            3. Pricing, Payments & Currency
          </h2>
          <p>
            All product prices listed on CodeOrbit are prominently displayed in <strong>Indian Rupees (INR - ₹)</strong> and include all applicable digital goods taxes unless otherwise stated.
          </p>
          <p>
            Payments are securely processed through RBI-authorized payment aggregators, specifically <strong>Razorpay Software Pvt. Ltd.</strong> We support UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), and NetBanking from major Indian banks.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            4. User License & Intellectual Property Rights
          </h2>
          <p>
            When you purchase an e-book from CodeOrbit, you are granted a non-exclusive, non-transferable, revocable single-user personal license to read, study, and reference the material for personal educational and career development purposes.
          </p>
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-1">
            <p className="font-semibold text-rose-200">Strict Prohibitions:</p>
            <p>You may NOT redistribute, resell, re-host, upload to public file-sharing networks (e.g. Telegram channels, torrent sites, Google Drive links), modify, or create unauthorized derivative commercial works from any CodeOrbit publications.</p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            5. User Account Responsibilities
          </h2>
          <p>
            You are solely responsible for maintaining the confidentiality of your account credentials (email and password). Any activities, purchases, or interactions performed under your registered account will be deemed authorized by you.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            6. Limitation of Liability
          </h2>
          <p>
            CodeOrbit publications and guides are provided for educational purposes. While our authors and editors make every effort to ensure factual correctness and optimal coding patterns, CodeOrbit shall not be liable for any indirect, incidental, or consequential damages resulting from technical implementations or examinations.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            7. Governing Law & Jurisdiction
          </h2>
          <p>
            These Terms shall be governed by and interpreted in accordance with the laws of <strong>India</strong>. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Noida / New Delhi, India</strong>.
          </p>
        </section>

        {/* Contact Banner */}
        <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="font-semibold text-white">Questions regarding our terms?</p>
            <p className="text-xs text-slate-400">Our legal and customer support team is available to assist you.</p>
          </div>
          <Link
            to="/contact"
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition-colors shrink-0"
          >
            Contact Legal Desk
          </Link>
        </div>

      </div>
    </div>
  );
};
