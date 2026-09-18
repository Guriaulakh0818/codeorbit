import React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, Clock, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RefundPolicyPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-300">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Fair & Transparent Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Refunds & Cancellations Policy
        </h1>
        <p className="text-xs text-slate-400">
          Last Updated: September 19, 2026 • CodeOrbit Technologies Private Limited
        </p>
      </div>

      {/* Main Content Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-8 text-xs sm:text-sm leading-relaxed">
        
        {/* Overview Box */}
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 space-y-1.5">
          <h3 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> 100% Student-Friendly Guarantee
          </h3>
          <p className="text-xs text-emerald-300/90 leading-relaxed">
            At CodeOrbit, customer satisfaction is our highest priority. If you encounter technical download issues, duplicate deductions, or corrupted files, we guarantee immediate replacement or a hassle-free refund to your original payment method.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            1. Nature of Digital Goods & Instant Fulfillment
          </h2>
          <p>
            Because CodeOrbit provides <strong>instant digital access</strong> to downloadable PDF handbooks and online reading materials, orders cannot be cancelled once digital files have been fully downloaded and decrypted.
          </p>
          <p>
            However, we provide comprehensive refund protections under the specific circumstances outlined below.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            2. Eligible Scenarios for Full Refund
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Duplicate / Accidental Multiple Charges</span>
              </div>
              <p className="text-xs text-slate-400">
                If your bank account or UPI was charged more than once for the same single e-book or order due to a network glitch, 100% of the duplicate amount will be refunded immediately.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Defective / Inaccessible Digital File</span>
              </div>
              <p className="text-xs text-slate-400">
                If an e-book file is corrupted, missing pages, or cannot be accessed on your dashboard, and our tech support cannot rectify the issue within 24 hours of report.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Payment Deducted but Order Failed</span>
              </div>
              <p className="text-xs text-slate-400">
                If money was debited from your account but the order shows as Failed or Pending due to bank gateway timeout, Razorpay automatically initiates auto-reversal.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Wrong E-Book Purchased by Mistake</span>
              </div>
              <p className="text-xs text-slate-400">
                If reported within <strong>48 hours</strong> of purchase and the file has not been downloaded more than 1 time, we can issue store credit or swap for the intended e-book.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            3. Refund Process & Timelines
          </h2>
          <p>
            Once a refund request is approved by our billing desk:
          </p>
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white font-semibold text-xs">Processing Time (Razorpay Gateway):</p>
                <p className="text-xs text-slate-400">Refunds are processed within <strong>5 to 7 working business days</strong> directly to the original payment source (UPI ID, Debit/Credit Card, or Bank Account).</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            4. Cancellation Policy
          </h2>
          <p>
            Since digital e-books are fulfilled instantly upon payment completion:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-400">
            <li><strong>Pending Orders:</strong> If an order is still marked as Pending and unfulfilled, students can cancel the order anytime from their dashboard or by contacting support.</li>
            <li><strong>Completed Orders:</strong> Post-delivery cancellations follow the refund qualification guidelines mentioned in Section 2.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            5. How to Raise a Refund Request
          </h2>
          <p>
            To initiate a refund or cancellation inquiry, please email us with your Order ID and registered email address:
          </p>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-mono text-sky-400 font-semibold text-xs">Email: support@codeorbit.dev / refunds@codeorbit.dev</p>
              <p className="text-xs text-slate-400">Subject: "Refund Request - [Your Order Number]"</p>
            </div>
            <Link
              to="/contact"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Submit via Contact Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};
