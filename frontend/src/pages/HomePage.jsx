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
      description: 'Arrays, Linked Lists, Trees, Graphs, Dynamic Programming & 250+ LeetCode patterns.',
      slug: 'dsa',
      icon: Terminal,
      color: 'from-emerald-500/10 via-emerald-900/10 to-transparent',
      border: 'border-emerald-500/30 hover:border-emerald-400',
      iconColor: 'text-emerald-400',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      topics: '120+ Topics'
    },
    {
      title: 'Operating Systems',
      description: 'Processes, Threads, CPU Scheduling, Concurrency, Virtual Memory & Deadlocks.',
      slug: 'operating-systems',
      icon: Cpu,
      color: 'from-amber-500/10 via-amber-900/10 to-transparent',
      border: 'border-amber-500/30 hover:border-amber-400',
      iconColor: 'text-amber-400',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      topics: '45+ Topics'
    },
    {
      title: 'Database Management (DBMS)',
      description: 'SQL queries, Normalization, ACID properties, Indexing & B-Trees, Transactions.',
      slug: 'dbms',
      icon: Database,
      color: 'from-teal-500/10 via-teal-900/10 to-transparent',
      border: 'border-teal-500/30 hover:border-teal-400',
      iconColor: 'text-teal-400',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      topics: '50+ Topics'
    },
    {
      title: 'Computer Networks',
      description: 'OSI 7-Layer Model, TCP/IP, Subnetting, Routing Protocols, DNS, HTTP/3, WebSockets.',
      slug: 'computer-networks',
      icon: Network,
      color: 'from-sky-500/10 via-sky-900/10 to-transparent',
      border: 'border-sky-500/30 hover:border-sky-400',
      iconColor: 'text-sky-400',
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      topics: '40+ Topics'
    },
    {
      title: 'System Design & Scalability',
      description: 'Distributed architectures, Load Balancers, Caching, Sharding, Message Queues & CAP theorem.',
      slug: 'system-design-track-2026',
      icon: Server,
      color: 'from-indigo-500/10 via-indigo-900/10 to-transparent',
      border: 'border-indigo-500/30 hover:border-indigo-400',
      iconColor: 'text-indigo-400',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      topics: '35+ Topics'
    },
    {
      title: 'Core Java for Placements',
      description: 'OOPs concepts, JVM Internals, Garbage Collection, Collections Framework, Multithreading.',
      slug: 'dsa',
      icon: Code2,
      color: 'from-rose-500/10 via-rose-900/10 to-transparent',
      border: 'border-rose-500/30 hover:border-rose-400',
      iconColor: 'text-rose-400',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      topics: '60+ Topics'
    }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      <SeoHead
        title="CodeOrbit — Free Computer Science Tutorials, Notes & Interview Prep"
        description="100% Free Computer Science learning platform for CSE & IT students. GeeksforGeeks-style tutorials for DSA, Operating Systems, DBMS, Networks, and System Design in English & Hinglish."
        canonicalUrl="https://www.codeorbit.online/"
      />

      {/* Hero Section with Grid and Ambient Radial Halos */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-grid-pattern border-b border-slate-800/80">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold shadow-lg shadow-emerald-500/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>100% FREE COMPUTER SCIENCE LEARNING PORTAL</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Learn CS Fundamentals & Crack Placements{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Without Paying A Single Rupee.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Curated chapter-by-chapter tutorials, bilingual explanations (English & Hinglish), interactive code tabs, practice quizzes, and verifiable certificates.
          </p>

          {/* Global Search Input */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative group">
            <div className="relative flex items-center shadow-2xl rounded-2xl">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="text"
                placeholder="Search topics (e.g. Binary Search, Deadlocks, SQL Joins, TCP Handshake)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 backdrop-blur-xl border-2 border-slate-700/80 hover:border-slate-600 focus:border-emerald-500 rounded-2xl pl-12 pr-32 py-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Subject Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Popular Tracks:</span>
            {['DSA', 'Operating Systems', 'DBMS', 'Computer Networks', 'System Design', 'Java', 'Python'].map((tag, idx) => (
              <Link
                key={idx}
                to={`/courses?search=${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-all"
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

      {/* Core CS Subject Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Computer Science Tutorials & Roadmaps
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Complete syllabus structured for university exams, GATE preparation, and software engineer interviews.
            </p>
          </div>
          <Link
            to="/courses"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 group"
          >
            <span>Browse All Subjects</span>
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
                className={`group p-6 rounded-2xl bg-gradient-to-b ${sub.color} bg-slate-900/60 backdrop-blur-xl border ${sub.border} transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex flex-col justify-between space-y-6`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 ${sub.iconColor} group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border ${sub.badgeColor}`}>
                      {sub.topics}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {sub.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                  <span>Start Tutorial Free</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Why Students & Developers Love CodeOrbit
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered to remove all complexity and deliver clear, high-yield computer science concepts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700 transition-all space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">English + Hinglish 🇮🇳</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Toggle any lesson into Hinglish with one click. Read complex OS threading and DSA tree traversals explained in easy intuitive language.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700 transition-all space-y-3">
            <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Interactive Quizzes & Tests</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Test your grasp with topic-wise multiple-choice questions, instant feedback, explanations, and score tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700 transition-all space-y-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Verifiable Certifications</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Earn shareable, verifiable certificates of completion upon finishing tracks to showcase on your LinkedIn & resume.
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
