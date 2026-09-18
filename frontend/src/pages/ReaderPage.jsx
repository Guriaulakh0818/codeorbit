import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Bookmark, 
  Shield, 
  Download, 
  FileText, 
  CheckCircle2,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';

export const ReaderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allEbooks, isBookPurchased, readingProgress, updateProgress } = useLibrary();
  const { user } = useAuth();

  const ebook = allEbooks.find(b => b.id === id) || allEbooks[0];
  const isPurchased = isBookPurchased(ebook.id);

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fontSize, setFontSize] = useState('text-sm'); // 'text-xs' | 'text-sm' | 'text-base'
  const [themeMode, setThemeMode] = useState('dark'); // 'dark' | 'sepia' | 'light'
  const [bookmarked, setBookmarked] = useState(false);

  // Update progress on chapter change
  useEffect(() => {
    if (ebook) {
      const estimatedPage = Math.round(((activeChapterIndex + 1) / (ebook.tableOfContents?.length || 6)) * ebook.pages);
      updateProgress(ebook.id, estimatedPage, ebook.pages);
    }
  }, [activeChapterIndex, ebook]);

  const currentChapter = ebook.tableOfContents?.[activeChapterIndex] || {
    chapter: 'Chapter 1',
    title: 'Introduction and Architecture Fundamentals',
    pages: '1 - 40'
  };

  const currentProgress = readingProgress[ebook.id] || { page: 1, percent: 15 };

  return (
    <div className={`min-h-screen flex flex-col ${
      themeMode === 'dark' ? 'bg-[#060b19] text-slate-100' :
      themeMode === 'sepia' ? 'bg-[#fbf0d9] text-[#2c2214]' :
      'bg-white text-slate-900'
    }`}>
      {/* Top Reader Navbar */}
      <header className={`sticky top-0 z-40 border-b px-4 py-2.5 flex items-center justify-between gap-3 ${
        themeMode === 'dark' ? 'bg-[#080d1e]/90 border-slate-800' :
        themeMode === 'sepia' ? 'bg-[#f4e4c1] border-[#dec49a]' :
        'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <Link
            to="/library"
            className="p-1.5 rounded-lg hover:bg-slate-800/40 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Library</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-800/40 text-xs flex items-center gap-1 font-semibold"
            title="Toggle Chapter Sidebar"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden md:inline">Index</span>
          </button>

          <div className="h-4 w-px bg-slate-700/60 hidden sm:block"></div>

          <div className="max-w-xs md:max-w-md truncate">
            <h2 className="text-xs font-bold truncate">{ebook.title}</h2>
            <p className="text-[10px] opacity-70 truncate font-mono">
              {currentChapter.chapter}: {currentChapter.title}
            </p>
          </div>
        </div>

        {/* Center/Right Toolbar */}
        <div className="flex items-center gap-2 text-xs">
          {/* Theme Mode Toggle */}
          <div className="flex items-center rounded-lg border p-0.5 border-slate-700/60">
            <button
              onClick={() => setThemeMode('dark')}
              className={`p-1 rounded ${themeMode === 'dark' ? 'bg-brand-600 text-white' : 'opacity-60'}`}
              title="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setThemeMode('sepia')}
              className={`p-1 rounded font-bold text-[10px] px-1.5 ${themeMode === 'sepia' ? 'bg-[#a3703c] text-white' : 'opacity-60'}`}
              title="Sepia Reading Mode"
            >
              SEP
            </button>
            <button
              onClick={() => setThemeMode('light')}
              className={`p-1 rounded ${themeMode === 'light' ? 'bg-slate-300 text-slate-900' : 'opacity-60'}`}
              title="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Font Resizer */}
          <div className="hidden sm:flex items-center rounded-lg border p-0.5 border-slate-700/60">
            <button
              onClick={() => setFontSize('text-xs')}
              className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${fontSize === 'text-xs' ? 'bg-brand-600 text-white' : 'opacity-60'}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('text-sm')}
              className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${fontSize === 'text-sm' ? 'bg-brand-600 text-white' : 'opacity-60'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('text-base')}
              className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${fontSize === 'text-base' ? 'bg-brand-600 text-white' : 'opacity-60'}`}
            >
              A+
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-1.5 rounded-lg border transition-colors ${
              bookmarked
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                : 'border-slate-700/60 opacity-80 hover:opacity-100'
            }`}
            title="Bookmark this page"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Reading Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Table of Contents Sidebar */}
        {sidebarOpen && (
          <aside className={`w-72 border-r overflow-y-auto flex-shrink-0 p-4 space-y-4 ${
            themeMode === 'dark' ? 'bg-[#080d1e] border-slate-800' :
            themeMode === 'sepia' ? 'bg-[#f4e4c1] border-[#dec49a]' :
            'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/40">
              <span className="text-xs font-bold uppercase tracking-wider">Chapters Index</span>
              <span className="text-[10px] opacity-70 font-mono">{ebook.tableOfContents?.length || 0} Parts</span>
            </div>

            <div className="space-y-1.5">
              {ebook.tableOfContents?.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                    activeChapterIndex === idx
                      ? 'bg-brand-600 text-white font-semibold shadow-md shadow-brand-500/20'
                      : 'hover:bg-slate-800/30 opacity-80 hover:opacity-100'
                  }`}
                >
                  <span className="w-5 h-5 rounded-md bg-black/20 flex items-center justify-center font-mono text-[10px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate leading-snug">{item.title}</p>
                    <p className="text-[10px] opacity-75 font-mono">{item.chapter} • pp. {item.pages}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* DRM security watermark footer */}
            <div className="p-3 rounded-xl border border-dashed border-slate-700/60 text-[10px] opacity-75 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <Shield className="w-3.5 h-3.5" /> Authenticated License
              </div>
              <p>Registered User: {user?.email || 'student@codeorbit.dev'}</p>
              <p className="font-mono">Security Token: #CO-{ebook.id.toUpperCase()}-SECURE</p>
            </div>
          </aside>
        )}

        {/* Center Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 relative flex justify-center">
          {/* Floating Subtle Watermark */}
          <div className="fixed bottom-6 right-6 pointer-events-none opacity-20 text-xs font-mono select-none">
            Licensed to {user?.email || 'CodeOrbit Student'}
          </div>

          <article className={`w-full max-w-3xl space-y-8 ${fontSize} leading-relaxed`}>
            {/* Chapter Header */}
            <div className="space-y-2 border-b pb-6 border-slate-700/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-brand-400 tracking-wider">
                  {currentChapter.chapter}
                </span>
                <span className="text-xs opacity-60 font-mono">Pages {currentChapter.pages}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {currentChapter.title}
              </h1>
            </div>

            {/* Simulated Content Body with Code Blocks */}
            <div className="space-y-6">
              <p>
                Welcome to this chapter of <strong>{ebook.title}</strong>. In this module, we explore core architectural concepts, memory behavior, performance profiling, and step-by-step implementations designed specifically for real-world engineering standards.
              </p>

              <div className="p-4 rounded-xl border border-brand-500/30 bg-brand-950/20 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Key Architectural Objective
                </h4>
                <p className="text-xs opacity-90 leading-relaxed">
                  Understand how system runtime structures, memory references, and algorithmic pipelines operate at scale. Every snippet provided here is verified for modern compiler versions.
                </p>
              </div>

              <div className="whitespace-pre-line font-mono text-xs p-5 rounded-2xl bg-[#090e1f] text-slate-200 border border-slate-800 overflow-x-auto shadow-inner">
                {ebook.samplePreviewText}
              </div>

              <h3 className="text-lg font-bold pt-4">Deep Dive & Practical Notes</h3>
              <p>
                When deploying production systems, always account for concurrency hazards, deadlock prevention, and cache locality. In high-throughput architectures, avoiding lock contention and leveraging non-blocking queues can yield up to a 10x reduction in tail latency.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-slate-700/40 bg-slate-900/30">
                  <h5 className="font-bold text-xs mb-1">Time Complexity</h5>
                  <p className="text-xs font-mono text-emerald-400">O(1) average lookup, O(N) worst-case</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-700/40 bg-slate-900/30">
                  <h5 className="font-bold text-xs mb-1">Space Complexity</h5>
                  <p className="text-xs font-mono text-sky-400">O(K) auxiliary buffer allocations</p>
                </div>
              </div>
            </div>

            {/* Chapter Navigation Pagination */}
            <div className="flex items-center justify-between pt-12 border-t border-slate-700/40">
              <button
                onClick={() => setActiveChapterIndex(prev => Math.max(0, prev - 1))}
                disabled={activeChapterIndex === 0}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 hover:bg-slate-800/40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Chapter
              </button>

              <span className="text-xs font-mono opacity-70">
                Chapter {activeChapterIndex + 1} of {ebook.tableOfContents?.length || 6}
              </span>

              <button
                onClick={() => setActiveChapterIndex(prev => Math.min((ebook.tableOfContents?.length || 6) - 1, prev + 1))}
                disabled={activeChapterIndex === (ebook.tableOfContents?.length || 6) - 1}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 transition-colors shadow-md shadow-brand-500/20"
              >
                <span>Next Chapter</span> <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
};
