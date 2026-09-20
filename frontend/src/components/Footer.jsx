import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Download, Award, Zap, Github, Twitter, Linkedin, Heart, HelpCircle, Mail, Info } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#060b19] text-slate-400 text-xs mt-20">
      {/* Value Badges Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-sky-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs">Digital Delivery</h4>
              <p className="text-[11px] text-slate-400">PDFs + verified code snippets</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs">Quality Verified</h4>
              <p className="text-[11px] text-slate-400">Designed for CSE & IT coursework</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs">Curated Guides</h4>
              <p className="text-[11px] text-slate-400">Structured by experienced engineers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs">Bite-Sized Revisions</h4>
              <p className="text-[11px] text-slate-400">High-yield placement notes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand Col */}
        <div className="col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-white">Code<span className="text-sky-400">Orbit</span></span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            The dedicated digital e-book library for CSE and IT engineering students. Practical coding handbooks, DSA pattern sheets, DBMS indexing, and placement interview questions.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#github" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#twitter" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#linkedin" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/catalog?category=java" className="hover:text-sky-400 transition-colors">Java Programming</Link></li>
            <li><Link to="/catalog?category=python" className="hover:text-sky-400 transition-colors">Python & AI/ML</Link></li>
            <li><Link to="/catalog?category=dsa" className="hover:text-sky-400 transition-colors">DSA & Algorithms</Link></li>
            <li><Link to="/catalog?category=web-dev" className="hover:text-sky-400 transition-colors">Web Development</Link></li>
            <li><Link to="/catalog?category=dbms" className="hover:text-sky-400 transition-colors">SQL & DBMS</Link></li>
            <li><Link to="/catalog?category=interview-prep" className="hover:text-sky-400 transition-colors">Interview Preparation</Link></li>
          </ul>
        </div>

        {/* Support & Quick Links (About, Contact, Help) */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">About & Help</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/courses" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-400" /> Free CSE Courses
              </Link>
            </li>
            <li>
              <Link to="/certificates/verify" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Verify Certificate
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" /> Contact Us
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-sky-400 transition-colors">Student Login</Link>
            </li>
          </ul>
        </div>

        {/* Legal & Policy Pages (Cashfree Compliant) */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Legal & Policies</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/terms" className="hover:text-sky-400 transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/refund-policy" className="hover:text-sky-400 transition-colors">Refunds & Cancellations</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-sky-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/contact" className="hover:text-sky-400 transition-colors">Contact Information</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-3">
        <p>© 2026 CodeOrbit. Built for CSE & IT Students.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for engineering learners
        </p>
      </div>
    </footer>
  );
};
