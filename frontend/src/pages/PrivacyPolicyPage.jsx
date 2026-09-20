import React from 'react';
import { Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SeoHead } from '../components/seo/SeoHead';

export const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 flex flex-col selection:bg-emerald-500 selection:text-white">
      <SeoHead
        title="Privacy Policy — CodeOrbit"
        description="Learn how CodeOrbit protects student privacy, handles data, and maintains transparency on our open-access computer science learning platform."
        canonicalUrl="https://www.codeorbit.online/privacy"
      />

      <div className="max-w-4xl mx-auto w-full space-y-10 flex-1">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <Lock className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: September 20, 2026 • CodeOrbit Open Computer Science Platform
          </p>
        </div>

        {/* Main Content Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-8 text-xs sm:text-sm leading-relaxed text-slate-700">
          
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              1. Information We Collect
            </h2>
            <p>
              When you use CodeOrbit, we collect minimal personal details strictly necessary for account authentication, progress tracking, and certificate issuance:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
              <li><strong>Account Details:</strong> Name, Email Address, and password hash (encrypted via BCrypt).</li>
              <li><strong>Learning Progress:</strong> Completed lesson checkpoints, quiz scores, and certificate issuance codes.</li>
              <li><strong>Cookies & Analytics:</strong> Standard non-identifying telemetry (pages viewed, device type) to optimize performance and core web vitals.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              2. Google AdSense & Third-Party Cookies
            </h2>
            <p>
              CodeOrbit uses Google AdSense to serve advertisements on select pages to support free learning. Google, as a third-party vendor, uses cookies to serve ads based on user prior visits to this website or other websites on the internet.
            </p>
            <p className="text-slate-600">
              Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-semibold underline">Google Ads Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-semibold underline">AboutAds.info</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              3. Zero Spam & Data Confidentiality
            </h2>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <p className="font-semibold text-slate-900">We Never Sell Your Personal Data:</p>
              <p className="text-xs text-slate-600">CodeOrbit does not sell, rent, or trade your personal information or contact details to third-party telemarketers or external entities under any circumstances.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              4. Security Measures
            </h2>
            <p>
              Our web servers enforce industry-standard 256-Bit SSL encryption (HTTPS), cryptographic bcrypt password hashing, and stateless JWT token authentication with role-based access control.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              5. Contact Us
            </h2>
            <p>
              If you have questions about our data handling practices or wish to request data deletion, please contact:
            </p>
            <p className="font-mono text-xs text-emerald-700 font-bold">privacy@codeorbit.online</p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
