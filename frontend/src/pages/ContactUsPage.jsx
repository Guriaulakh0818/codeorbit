import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { SeoHead } from '../components/seo/SeoHead';

export const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 flex flex-col selection:bg-emerald-500 selection:text-white">
      <SeoHead
        title="Contact Us & Help Desk — CodeOrbit"
        description="Get in touch with CodeOrbit editorial & academic team. Student support for CS tutorials, quizzes, and certificates."
        canonicalUrl="https://www.codeorbit.online/contact"
      />

      <div className="max-w-6xl mx-auto w-full space-y-10 flex-1">
        {/* Header Banner */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Support & Help Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact Us
          </h1>
          <p className="text-sm text-slate-600">
            Have questions regarding computer science courses, curriculum topics, or verified certificates? We are here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information Cards */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-700" /> Direct Email
              </h2>
              <div className="space-y-1 text-xs">
                <p className="text-slate-500">Student & Technical Inquiries:</p>
                <a href="mailto:support@codeorbit.online" className="text-emerald-700 font-mono font-semibold hover:underline block">
                  support@codeorbit.online
                </a>
                <a href="mailto:contact@codeorbit.online" className="text-emerald-700 font-mono font-semibold hover:underline block">
                  contact@codeorbit.online
                </a>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" /> Response Time
              </h2>
              <div className="space-y-1 text-xs text-slate-600">
                <p>Monday – Saturday: 9:00 AM – 7:00 PM IST</p>
                <p className="text-slate-500">Average ticket response time: Under 24 hours.</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Academic Inquiries
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                For university tie-ups, curriculum contributions, and educator partnerships, email our curriculum board directly.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">Send us a Message</h3>
                <p className="text-xs text-slate-500">
                  Fill out the form below and our team will get back to you promptly.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-slate-900">Message Received!</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Thank you for contacting CodeOrbit. A member of our academic support team will review your query and reply to your email shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-semibold block">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white text-xs text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-semibold block">Your Email</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white text-xs text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-semibold block">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Course suggestion or Certificate verification"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white text-xs text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-semibold block">Message</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Describe your question or feedback in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white text-xs text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
