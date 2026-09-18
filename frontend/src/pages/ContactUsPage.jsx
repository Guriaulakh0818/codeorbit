import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';

export const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    orderNumber: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-400">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Support & Help Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Contact Us
        </h1>
        <p className="text-sm text-slate-400">
          Have questions regarding your e-book orders, downloads, or course curriculum? We are here to assist you 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information Cards */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-400" /> Direct Email
            </h2>
            <div className="space-y-1 text-xs">
              <p className="text-slate-400">Customer & Student Support:</p>
              <a href="mailto:support@codeorbit.dev" className="text-sky-400 font-mono font-semibold hover:underline block">
                support@codeorbit.dev
              </a>
              <a href="mailto:contact@codeorbit.dev" className="text-sky-400 font-mono font-semibold hover:underline block">
                contact@codeorbit.dev
              </a>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" /> Phone & WhatsApp
            </h2>
            <div className="space-y-1 text-xs">
              <p className="text-slate-400">Toll-Free Helpline (Mon - Sat):</p>
              <p className="text-slate-200 font-mono font-semibold">+91 98765 43210</p>
              <p className="text-[11px] text-slate-500">10:00 AM – 7:00 PM IST</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" /> Registered Office
            </h2>
            <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-white">CodeOrbit Technologies Pvt. Ltd.</p>
              <p className="text-slate-400">Plot 18, Tech Innovation Hub, Cyber City</p>
              <p className="text-slate-400">Sector 62, Noida, Uttar Pradesh – 201309</p>
              <p className="text-slate-400 font-mono">India</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20 text-xs text-slate-400 flex items-center gap-3">
            <Clock className="w-5 h-5 text-sky-400 shrink-0" />
            <span>Average response turnaround: <strong>within 2–4 hours</strong></span>
          </div>
        </div>

        {/* Interactive Query Form */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Dispatched!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Thank you for reaching out. Our support engineering team will review your inquiry and get back to you at <span className="text-sky-400 font-mono">{formData.email}</span> shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white">Send Us a Direct Message</h3>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SSL Encrypted
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aman Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs text-white placeholder-slate-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs text-white placeholder-slate-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Inquiry Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs text-white transition-colors"
                  >
                    <option value="">Select subject category...</option>
                    <option value="payment">Payment & Billing Query</option>
                    <option value="download">PDF Download Issue</option>
                    <option value="refund">Refund or Cancellation Request</option>
                    <option value="author">Instructor / Book Submission</option>
                    <option value="general">General Question</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Order Number (if applicable)</label>
                  <input
                    type="text"
                    placeholder="e.g. ORD-2026-..."
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs text-white placeholder-slate-500 font-mono transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Detailed Message *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe your query or issue in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs text-white placeholder-slate-500 transition-colors"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Inquiry to Support Desk
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
