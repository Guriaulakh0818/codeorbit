import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Code2, 
  Heart,
  Terminal,
  Globe2,
  Mail,
  ArrowRight
} from 'lucide-react';
import { SeoHead } from '../components/seo/SeoHead';

export const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 flex flex-col selection:bg-emerald-500 selection:text-white">
      <SeoHead
        title="About CodeOrbit — Free Computer Science & Engineering Platform"
        description="Learn about CodeOrbit's mission to provide 100% free, high-quality computer science tutorials, bilingual notes, interactive practice quizzes, and verifiable certificates for engineering students."
        canonicalUrl="https://www.codeorbit.online/about"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About Us', url: '/about' }
        ]}
      />

      <div className="max-w-4xl mx-auto w-full space-y-12 flex-1">
        
        {/* Hero Header */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Our Mission & Educational Standards</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Democratizing Computer Science Education
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            CodeOrbit was created to give every CSE & IT engineering student access to world-class, structured, textbook-quality curriculum without paywalls.
          </p>
        </header>

        {/* 4 Core Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">100% Free Foundation</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every subject provides Beginner, Intermediate, and Advanced tiers completely free. Students can read lessons, copy code examples, and practice quizzes without paying a single rupee.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <Globe2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Bilingual Learning (English & Hinglish)</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Complex concepts in Data Structures, OS, and System Design are explained in clear English with instant one-click Hinglish translations for native intuitive comprehension.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Cryptographically Verified Certificates</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Upon passing curriculum milestones with 80%+ assessment scores, students can claim verifiable certificates featuring instant QR code public verification for resumes and LinkedIn.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Placement Preparation Kits</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Targeted ₹99 interview kits for 10 career roles (Full Stack, Frontend, Backend, Java, Python, DevOps, QA, etc.) connecting interview questions directly back to CodeOrbit theory lessons.
            </p>
          </div>
        </section>

        {/* Editorial Standards & Curriculum Accuracy */}
        <section className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-xl font-extrabold text-slate-900">Curriculum Quality & Editorial Process</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            All tutorials and lessons on CodeOrbit follow rigorous engineering standards. Code examples in C++, Java, and Python are benchmarked for time and space complexities, and theory chapters align with standard university syllabi (GATE, AICTE, and top CS programs).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-center">
              <div className="text-2xl font-extrabold text-emerald-700">4 Tiers</div>
              <div className="text-xs text-slate-500 font-medium">Standardized Subject Hierarchy</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-center">
              <div className="text-2xl font-extrabold text-emerald-700">80% Pass</div>
              <div className="text-xs text-slate-500 font-medium">Rigorous Quiz Mastery Standard</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-center">
              <div className="text-2xl font-extrabold text-emerald-700">0 Ads in Quiz</div>
              <div className="text-xs text-slate-500 font-medium">Distraction-Free Assessment</div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4">
          <h2 className="text-2xl font-extrabold text-white">Start Learning Free Today</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Choose from Data Structures & Algorithms, Operating Systems, DBMS, Computer Networks, and System Design tracks.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/courses"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
            >
              <span>Explore All Free Subjects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/placement-kits"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
            >
              Browse ₹99 Placement Kits
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUsPage;
