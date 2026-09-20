import React from 'react';
import { Scale, FileText, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../components/seo/SeoHead';

export const TermsConditionsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 flex flex-col selection:bg-emerald-500 selection:text-white">
      <SeoHead
        title="Terms & Conditions — CodeOrbit"
        description="Review terms of service, acceptable usage guidelines, and intellectual property terms for CodeOrbit."
        canonicalUrl="https://www.codeorbit.online/terms"
      />

      <div className="max-w-4xl mx-auto w-full space-y-10 flex-1">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <Scale className="w-3.5 h-3.5" />
            <span>Platform Terms & Guidelines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: September 20, 2026 • CodeOrbit Open Computer Science Platform
          </p>
        </div>

        {/* Main Content Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-8 text-xs sm:text-sm leading-relaxed text-slate-700">
          
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, reading tutorials, or taking quizzes on <strong>CodeOrbit</strong> (https://www.codeorbit.online), you agree to be legally bound by these Terms & Conditions. If you disagree with any part of these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              2. 100% Free Open Educational Access
            </h2>
            <p>
              All computer science courses, tutorials, practice quizzes, and verifiable certificates on CodeOrbit are provided free of charge to students worldwide. There are no paid paywalls or hidden fees.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              3. Intellectual Property & Code Snippets
            </h2>
            <p>
              Educational articles, diagrams, and explanations published on CodeOrbit are protected by intellectual property laws. Code examples and algorithmic solutions provided in tutorials are open for personal study and non-commercial educational reference.
            </p>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
              <p className="font-semibold">Acceptable Usage:</p>
              <p className="text-xs">You may not scrape, mirror, or republish bulk tutorials from CodeOrbit for commercial resale without prior written permission.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              4. Disclaimer of Warranties
            </h2>
            <p>
              While our editorial board strives for absolute accuracy in all technical topics (DSA, Operating Systems, DBMS, Networks, System Design), content is provided on an "as-is" basis for educational and interview preparation purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              5. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and interpreted in accordance with the laws of India.
            </p>
          </section>

          {/* Contact Banner */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-900">Questions regarding our terms?</p>
              <p className="text-xs text-slate-500">Our support team is available to assist you.</p>
            </div>
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs"
            >
              Contact Support Desk
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
