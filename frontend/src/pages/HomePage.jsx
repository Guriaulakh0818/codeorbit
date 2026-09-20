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
      color: 'bg-emerald-50/60',
      border: 'border-emerald-200 hover:border-emerald-400',
      iconColor: 'text-emerald-700 bg-emerald-100',
      badgeColor: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
      topics: '120+ Topics'
    },
    {
      title: 'Operating Systems',
      description: 'Processes, Threads, CPU Scheduling, Concurrency, Virtual Memory & Deadlocks.',
      slug: 'operating-systems',
      icon: Cpu,
      color: 'bg-amber-50/60',
      border: 'border-amber-200 hover:border-amber-400',
      iconColor: 'text-amber-700 bg-amber-100',
      badgeColor: 'bg-amber-100/80 text-amber-800 border-amber-200',
      topics: '45+ Topics'
    },
    {
      title: 'Database Management (DBMS)',
      description: 'SQL queries, Normalization, ACID properties, Indexing & B-Trees, Transactions.',
      slug: 'dbms',
      icon: Database,
      color: 'bg-teal-50/60',
      border: 'border-teal-200 hover:border-teal-400',
      iconColor: 'text-teal-700 bg-teal-100',
      badgeColor: 'bg-teal-100/80 text-teal-800 border-teal-200',
      topics: '50+ Topics'
    },
    {
      title: 'Computer Networks',
      description: 'OSI 7-Layer Model, TCP/IP, Subnetting, Routing Protocols, DNS, HTTP/3, WebSockets.',
      slug: 'computer-networks',
      icon: Network,
      color: 'bg-sky-50/60',
      border: 'border-sky-200 hover:border-sky-400',
      iconColor: 'text-sky-700 bg-sky-100',
      badgeColor: 'bg-sky-100/80 text-sky-800 border-sky-200',
      topics: '40+ Topics'
    },
    {
      title: 'System Design & Scalability',
      description: 'Distributed architectures, Load Balancers, Caching, Sharding, Message Queues & CAP theorem.',
      slug: 'system-design-track-2026',
      icon: Server,
      color: 'bg-indigo-50/60',
      border: 'border-indigo-200 hover:border-indigo-400',
      iconColor: 'text-indigo-700 bg-indigo-100',
      badgeColor: 'bg-indigo-100/80 text-indigo-800 border-indigo-200',
      topics: '35+ Topics'
    },
    {
      title: 'Core Java for Placements',
      description: 'OOPs concepts, JVM Internals, Garbage Collection, Collections Framework, Multithreading.',
      slug: 'dsa',
      icon: Code2,
      color: 'bg-rose-50/60',
      border: 'border-rose-200 hover:border-rose-400',
      iconColor: 'text-rose-700 bg-rose-100',
      badgeColor: 'bg-rose-100/80 text-rose-800 border-rose-200',
      topics: '60+ Topics'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      <SeoHead
        title="CodeOrbit — Free Computer Science Tutorials, Notes & Interview Prep"
        description="100% Free Computer Science learning platform for CSE & IT students. GeeksforGeeks-style tutorials for DSA, Operating Systems, DBMS, Networks, and System Design in English & Hinglish."
        canonicalUrl="https://www.codeorbit.online/"
      />

      {/* Hero Section with Clean Eye-Friendly Gradient */}
      <section className="relative pt-14 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-50">
        <div className="max-w-5xl mx-auto text-center space-y-7 relative z-10">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>100% FREE COMPUTER SCIENCE LEARNING PORTAL</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Learn CS Fundamentals & Crack Placements{' '}
            <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">
              Without Paying A Rupee.
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Curated chapter-by-chapter tutorials, bilingual explanations (English & Hinglish), interactive code snippets, practice quizzes, and verifiable certificates.
          </p>

          {/* Global Search Input */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative group">
            <div className="relative flex items-center rounded-2xl shadow-sm">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="text"
                placeholder="Search topics (e.g. Binary Search, Deadlocks, SQL Joins, TCP Handshake)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 focus:border-emerald-500 rounded-2xl pl-12 pr-32 py-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-2.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Subject Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-mono text-[11px]">Popular Tracks:</span>
            {['DSA', 'Operating Systems', 'DBMS', 'Computer Networks', 'System Design', 'Java', 'Python'].map((tag, idx) => (
              <Link
                key={idx}
                to={`/courses?search=${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-700 transition-all shadow-2xs font-medium"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Computer Science Tutorials & Roadmaps
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Complete syllabus structured for university exams, GATE preparation, and software engineer interviews.
            </p>
          </div>
          <Link
            to="/courses"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 group"
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
                className={`group p-6 rounded-2xl bg-white border ${sub.border} transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-md flex flex-col justify-between space-y-6`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${sub.iconColor} group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border ${sub.badgeColor}`}>
                      {sub.topics}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {sub.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="text-center space-y-1.5 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Students & Developers Love CodeOrbit
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Engineered to remove all complexity and deliver clear, high-yield computer science concepts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-3 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">English + Hinglish 🇮🇳</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toggle any lesson into Hinglish with one click. Read complex OS threading and DSA tree traversals explained in easy intuitive language.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-3 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-2xs">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Interactive Quizzes & Tests</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Test your grasp with topic-wise multiple-choice questions, instant feedback, explanations, and score tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-3 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Verifiable Certifications</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
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
