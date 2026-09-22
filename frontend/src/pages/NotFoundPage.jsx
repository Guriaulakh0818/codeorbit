import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, Sparkles, Home, ArrowRight, HelpCircle } from 'lucide-react';
import { SeoHead } from '../components/seo/SeoHead';

export const NotFoundPage = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/courses?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 text-slate-800 px-4 py-16">
      <SeoHead
        title="404 — Page Not Found | CodeOrbit"
        description="The page or lesson you were looking for could not be found. Search tutorials or browse our free Computer Science catalog."
        keywords="404, not found, codeorbit"
      />

      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
          <HelpCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider">
            HTTP 404 — Resource Not Found
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Lost in Code Orbit?
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
            The tutorial, module, or page you requested may have moved or been updated.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="relative max-w-sm mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search DSA, OS, DBMS, Java..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 rounded-xl pl-10 pr-12 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
          >
            Go
          </button>
        </form>

        {/* Navigation CTAs */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
          <Link
            to="/"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <Link
            to="/courses"
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Browse Courses</span>
          </Link>
          <Link
            to="/placement-kits"
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>₹99 Prep Kits</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
