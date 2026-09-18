import React from 'react';
import { ShieldCheck, Lock, Eye, Server, UserCheck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-300">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
          <Lock className="w-3.5 h-3.5" />
          <span>Data Protection & Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">
          Last Updated: September 19, 2026 • CodeOrbit Technologies Private Limited
        </p>
      </div>

      {/* Main Content Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-8 text-xs sm:text-sm leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            1. Information We Collect
          </h2>
          <p>
            When you register on CodeOrbit or purchase an e-book, we collect limited personal details strictly necessary for account management and digital fulfillment:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-400">
            <li><strong>Account Details:</strong> Full Name, Email Address, College/University name, and chosen Academic Branch.</li>
            <li><strong>Transaction History:</strong> Order IDs, amount paid, and purchased e-book identifiers.</li>
            <li><strong>Payment Information:</strong> We do NOT store your credit card numbers, CVVs, or bank passwords. All financial transactions are processed directly on secure PCI-DSS certified servers of <strong>Cashfree Payments</strong>.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            2. How We Use Your Information
          </h2>
          <p>We use your information exclusively to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-400">
            <li>Authorize access to purchased digital e-books and maintain your library sync.</li>
            <li>Apply personalized DRM watermarks (Name + Email license stamp) to PDF downloads to protect author copyrights.</li>
            <li>Send order confirmation invoices and crucial security updates.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            3. Zero Spam & Data Confidentiality
          </h2>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <p className="font-semibold text-white">We Never Sell Your Data:</p>
            <p className="text-xs text-slate-400">CodeOrbit does not sell, rent, or trade your personal information or contact details to third-party advertisers or marketing agencies under any circumstances.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            4. Security Measures
          </h2>
          <p>
            Our web servers enforce industry-standard 256-Bit SSL encryption (HTTPS), cryptographic bcrypt password hashing, and stateless JWT token authentication with role-based access control.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            5. Contact Our Data Protection Officer
          </h2>
          <p>
            If you have questions about our data handling practices or wish to request data deletion, please contact:
          </p>
          <p className="font-mono text-xs text-sky-400">privacy@codeorbit.dev / support@codeorbit.dev</p>
        </section>

      </div>
    </div>
  );
};
