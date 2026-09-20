import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Github, Twitter, Linkedin, Heart, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#050814] border-t border-slate-800/80 text-slate-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-lg shadow-brand-500/25">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                Code<span className="text-brand-400">Orbit</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Free, modern Computer Science learning platform and placement handbook portal. High-quality tutorials, bilingual notes (English & Hinglish), interactive practice quizzes, and verifiable certifications.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-bold">
                100% Free For Students
              </span>
            </div>
          </div>

          {/* Col 2: Core CS Subjects */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              Core CS Subjects
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/courses/dsa" className="hover:text-brand-400 transition-colors">
                  Data Structures & Algorithms
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-brand-400 transition-colors">
                  Operating Systems
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-brand-400 transition-colors">
                  Database Management (DBMS)
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-brand-400 transition-colors">
                  Computer Networks
                </Link>
              </li>
              <li>
                <Link to="/courses/system-design-track-2026" className="hover:text-brand-400 transition-colors">
                  System Design & Scalability
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Programming & Practice */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              Languages & Practice
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="hover:text-brand-400 transition-colors">
                  Java for Placements
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-brand-400 transition-colors">
                  Python Programming
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-brand-400 transition-colors">
                  C++ STL & Complexity
                </Link>
              </li>
              <li>
                <Link to="/certificates/verify" className="hover:text-brand-400 transition-colors">
                  Certificate Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & AdSense Compliance */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              Legal & Policies
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="hover:text-brand-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-brand-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-brand-400 transition-colors">
                  Free Platform Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-400 transition-colors">
                  Contact Us & Editorial
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} CodeOrbit. Built for CSE & IT Engineering Students.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Coders
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
