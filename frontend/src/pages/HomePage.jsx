import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Star, 
  Download, 
  Code2, 
  Layers, 
  GraduationCap,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { EbookCard } from '../components/EbookCard';
import { FeaturedCategories } from '../components/FeaturedCategories';
import { PdfPreviewModal } from '../components/PdfPreviewModal';
import { catalogApi } from '../services/catalogApi';

export const HomePage = () => {
  const [featuredEbooks, setFeaturedEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewEbook, setPreviewEbook] = useState(null);
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function loadFeatured() {
      setLoading(true);
      const res = await catalogApi.getEbooks({ size: 6 });
      if (!isMounted) return;
      if (res.success && Array.isArray(res.data)) {
        const published = res.data.filter(b => b.active !== false && b.status !== 'UNPUBLISHED');
        setFeaturedEbooks(published);
      }
      setLoading(false);
    }
    loadFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-brand-500/15 rounded-full blur-[130px] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Subtitle Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-brand-500/30 text-xs font-semibold text-sky-300 shadow-lg shadow-brand-500/10">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Official Engineering E-Book Store for CSE & IT Students</span>
            </div>

            {/* Exact Headline as Requested */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Learn. Build. <span className="text-gradient">Get Career-Ready.</span>
            </h1>

            {/* Sub-copy */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore downloadable educational PDF e-books, visual DSA interview sheets, SQL performance handbooks, and system design guides.
            </p>

            {/* Search Input Box */}
            <form onSubmit={handleHeroSearch} className="max-w-xl mx-auto relative flex items-center pt-2">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search engineering e-books (e.g. Java, Python, DSA, DBMS)..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full bg-slate-900/95 border border-slate-700/80 rounded-2xl pl-12 pr-32 py-3.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-2xl"
              />
              <button
                type="submit"
                className="absolute right-2 top-2.5 bottom-2.5 px-5 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Filter Term Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-1">
              <span className="font-semibold text-slate-300">Quick links:</span>
              {['Java 21', 'DSA Sheets', 'Web Dev', 'SQL Tuning', 'Interview Prep'].map((term) => (
                <button
                  key={term}
                  onClick={() => navigate(`/catalog?q=${encodeURIComponent(term)}`)}
                  className="bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 hover:text-sky-300 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Store Highlights Grid */}
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-white">100%</p>
                <p className="text-xs text-slate-400 mt-0.5">Verified PDF Notes</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-sky-400">Direct</p>
                <p className="text-xs text-slate-400 mt-0.5">Secure PDF Download</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">Lifetime</p>
                <p className="text-xs text-slate-400 mt-0.5">Student Library Access</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-purple-400">Razorpay</p>
                <p className="text-xs text-slate-400 mt-0.5">Instant Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards Section (Java, Python, DSA, Web Dev, DBMS, Interview Prep) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturedCategories />
      </div>

      {/* Featured E-books Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Top Handbooks</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full font-mono">
                Official Publications
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Featured Engineering E-Books
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Comprehensive guides with code snippets, chapter breakdowns, and sample previews.
            </p>
          </div>

          <Link
            to="/catalog"
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 group"
          >
            <span>View all e-books</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Grid */}
        {loading ? (
          <div className="p-16 text-center space-y-3 bg-slate-900/30 border border-slate-800 rounded-3xl">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading featured engineering handbooks...</p>
          </div>
        ) : featuredEbooks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
            <p className="text-sm text-slate-400">No featured e-books available currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEbooks.map((ebook) => (
              <EbookCard
                key={ebook.id}
                ebook={ebook}
                onQuickPreview={(b) => setPreviewEbook(b)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Value Proposition Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-sky-400">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Instant Offline Reading</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct digital access to study guides and cheat sheets on your computer, tablet, or mobile device.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Clean Code & Architectures</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every handbook is packed with verified code examples, algorithmic dry runs, and system diagrams.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Placement & Exam Oriented</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tailored for computer science university syllabi, semester revisions, and campus recruitment tests.
            </p>
          </div>
        </div>
      </section>

      {/* PDF Sample Preview Modal */}
      <PdfPreviewModal
        ebook={previewEbook}
        isOpen={Boolean(previewEbook)}
        onClose={() => setPreviewEbook(null)}
      />
    </div>
  );
};
