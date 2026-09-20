import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Terminal, 
  Search, 
  Cpu, 
  Database, 
  Network, 
  Server, 
  Code2, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Zap, 
  Globe2, 
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import { coursesApi } from '../services/coursesApi';
import { SeoHead } from '../components/seo/SeoHead';
import { AdSlot } from '../components/ads/AdSlot';

export const HomePage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadFeaturedCourses() {
      try {
        const res = await coursesApi.getCourses({ page: 0, size: 8 });
        if (res.success && res.data) {
          setCourses(res.data);
        }
      } catch (err) {
        console.error('Failed to load courses on homepage', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedCourses();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const subjectCards = [
    {
      title: 'Data Structures & Algorithms',
      description: 'Arrays, Linked Lists, Trees, Graphs, Dynamic Programming & LeetCode patterns.',
      slug: 'dsa',
      icon: Terminal,
      color: 'from-sky-500/20 to-brand-600/20',
      border: 'border-sky-500/30',
      iconColor: 'text-sky-400',
      topics: '120+ Topics'
    },
    {
      title: 'Operating Systems',
      description: 'Processes, Threads, CPU Scheduling, Concurrency, Virtual Memory & Deadlocks.',
      slug: 'operating-systems',
      icon: Cpu,
      color: 'from-amber-500/20 to-orange-600/20',
      border: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      topics: '45+ Topics'
    },
    {
      title: 'Database Management (DBMS)',
      description: 'SQL queries, Normalization, ACID properties, Indexing & B-Trees, Transactions.',
      slug: 'dbms',
      icon: Database,
      color: 'from-emerald-500/20 to-teal-600/20',
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      topics: '50+ Topics'
    },
    {
      title: 'Computer Networks',
      description: 'OSI 7-Layer Model, TCP/IP, Subnetting, Routing Protocols, DNS, HTTP/3, WebSockets.',
      slug: 'computer-networks',
      icon: Network,
      color: 'from-indigo-500/20 to-blue-600/20',
      border: 'border-indigo-500/30',
      iconColor: 'text-indigo-400',
      topics: '40+ Topics'
    },
    {
      title: 'System Design & Scalability',
      description: 'Distributed architectures, Load Balancers, Caching, Sharding, Message Queues & CAP theorem.',
      slug: 'system-design-track-2026',
      icon: Server,
      color: 'from-purple-500/20 to-violet-600/20',
      border: 'border-purple-500/30',
      iconColor: 'text-purple-400',
      topics: '35+ Topics'
    },
    {
      title: 'Core Java for Interviews',
      description: 'OOPs concepts, JVM Internals, Garbage Collection, Collections Framework, Multithreading.',
      slug: 'dsa',
      icon: Code2,
      color: 'from-rose-500/20 to-pink-600/20',
      border: 'border-rose-500/30',
      iconColor: 'text-rose-400',
      topics: '60+ Topics'
    }
  ];

  return (
    <div className="min-h-screen bg-[#080d1e] text-slate-100 flex flex-col">
      <SeoHead
        title="CodeOrbit — Free Computer Science Tutorials, Notes & Interview Prep"
        description="100% Free Computer Science learning platform for CSE & IT students. GeeksforGeeks-style tutorials for DSA, Operating Systems, DBMS, Networks, and System Design in English & Hinglish."
        canonicalUrl="https://www.codeorbit.online/"
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#0e1630] to-[#080d1e] border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-mono font-bold shadow-lg shadow-brand-500/10">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>100% FREE COMPUTER SCIENCE ENGINEERING PORTAL</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Master CS Subjects & Placements{' '}
            <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Without Paying A Rupee.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Curated, bite-sized tutorials, bilingual explanations (English & Hinglish), executable code snippets, practice quizzes, and verified certifications for engineering students.
          </p>

          {/* Global Search Input */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative shadow-2xl">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search any CS topic (e.g. Binary Search, Deadlocks, SQL Joins, TCP 3-Way Handshake)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/95 border-2 border-slate-700/80 hover:border-slate-600 focus:border-brand-500 rounded-2xl pl-12 pr-32 py-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Subject Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Popular:</span>
            {['DSA', 'Operating Systems', 'DBMS', 'Computer Networks', 'System Design', 'Java', 'Python'].map((tag, idx) => (
              <Link
                key={idx}
                to={`/courses?search=${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Leaderboard Ad */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-6">
        <AdSlot slotType="leaderboard" />
      </div>

      {/* Core CS Subject Cards Grid (GeeksforGeeks Style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Explore Computer Science Subjects
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Structured step-by-step tracks curated for university semesters and campus placements.
            </p>
          </div>
          <Link
            to="/courses"
            className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 group"
          >
            <span>Browse All Subjects & Roadmaps</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectCards.map((sub, idx) => {
            const IconComponent = sub.icon;
            return (
              <Link
                key={idx}
                to={`/courses/${sub.slug}`}
                className={`group p-6 rounded-3xl bg-gradient-to-b ${sub.color} bg-slate-900/40 border ${sub.border} hover:border-brand-500/60 transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between space-y-6`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-slate-900/90 border border-slate-800 ${sub.iconColor}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                      {sub.topics}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
                      {sub.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-semibold text-brand-400 group-hover:text-brand-300">
                  <span>Start Learning Free</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Mid-Page In-Feed AdSlot */}
      <div className="max-w-7xl mx-auto w-full px-4">
        <AdSlot slotType="in_article" />
      </div>

      {/* Features & Why CodeOrbit Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Built Specifically For Engineering Students
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Everything you need to crack your semester exams and technical placement interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">English + Hinglish 🇮🇳</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Stuck on difficult concepts? Toggle to Hinglish for crystal clear, intuitive real-world explanations in simple conversational Hindi-English.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Interactive Practice Quizzes</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reinforce your knowledge with instant scoring, attempt history, and comprehensive answer explanations after each chapter.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Verifiable Certifications</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Complete full subject tracks with 80%+ quiz scores to earn cryptographic, publicly verifiable course completion certificates.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Banner Ad */}
      <div className="max-w-7xl mx-auto w-full px-4 pb-6">
        <AdSlot slotType="footer_banner" />
      </div>
    </div>
  );
};
