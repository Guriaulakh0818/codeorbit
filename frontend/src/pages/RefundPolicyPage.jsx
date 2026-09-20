import React from 'react';
import { RefreshCw, CheckCircle2, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../components/seo/SeoHead';

export const RefundPolicyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 flex flex-col selection:bg-emerald-500 selection:text-white">
      <SeoHead
        title="100% Free Learning Policy — CodeOrbit"
        description="CodeOrbit is a 100% free computer science learning portal. No payment or refund required."
        canonicalUrl="https://www.codeorbit.online/refund"
      />

      <div className="max-w-4xl mx-auto w-full space-y-10 flex-1">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Fair Learning Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            100% Free Learning Policy
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: September 20, 2026 • CodeOrbit Open Computer Science Platform
          </p>
        </div>

        {/* Main Content Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-8 text-xs sm:text-sm leading-relaxed text-slate-700">
          
          {/* Overview Box */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1.5">
            <h3 className="font-bold text-emerald-800 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Free Forever Guarantee
            </h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              CodeOrbit is an open-access platform. Every tutorial, code explanation, interview roadmap, and verified certificate of completion is completely free for students. There are no credit card charges, paywalls, or fee deductions.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              1. No Financial Transactions
            </h2>
            <p>
              Because CodeOrbit does not charge students for accessing course materials, reading lessons, or taking quizzes, payment refunds are generally not applicable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              2. Student Help Desk
            </h2>
            <p>
              If you experience any technical issues with course syllabus display, quiz scoring, or certificate code generation, our technical team will assist you immediately.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
              <div>
                <p className="font-bold text-slate-900 text-xs">Email: support@codeorbit.online</p>
                <p className="text-xs text-slate-500">Subject: Technical Support Request</p>
              </div>
              <Link
                to="/contact"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Contact Help Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
