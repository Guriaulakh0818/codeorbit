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
  ChevronRight,
  Briefcase,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check
} from 'lucide-react';
import { coursesApi } from '../services/coursesApi';
import { SeoHead } from '../components/seo/SeoHead';
import { AdSlot } from '../components/ads/AdSlot';
import { Button, Card, CardContent, Badge, SectionHeader } from '../components/ui';

export const HomePage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState({ 0: true });

  useEffect(() => {
    async function loadFeaturedCourses() {
      try {
        const res = await coursesApi.getCourses({ page: 0, size: 6 });
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

  const toggleFaq = (index) => {
    setOpenFaq(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const coreTracks = [
    {
      title: 'Data Structures & Algorithms',
      description: 'Arrays, Linked Lists, Trees, Graphs, Dynamic Programming & 250+ LeetCode patterns.',
      slug: 'dsa',
      icon: Terminal,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-800',
      badge: '100% FREE',
      topics: '120+ Topics'
    },
    {
      title: 'Operating Systems',
      description: 'Processes, Threads, CPU Scheduling, Concurrency, Virtual Memory & Deadlocks.',
      slug: 'operating-systems',
      icon: Cpu,
      color: 'bg-amber-50 text-amber-900 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-900',
      badge: '100% FREE',
      topics: '45+ Topics'
    },
    {
      title: 'Database Management (DBMS)',
      description: 'SQL queries, Normalization, ACID properties, Indexing & B-Trees, Transactions.',
      slug: 'dbms',
      icon: Database,
      color: 'bg-teal-50 text-teal-900 border-teal-200',
      iconBg: 'bg-teal-100 text-teal-900',
      badge: '100% FREE',
      topics: '50+ Topics'
    },
    {
      title: 'Computer Networks',
      description: 'OSI 7-Layer Model, TCP/IP, Subnetting, Routing Protocols, DNS, HTTP/3, WebSockets.',
      slug: 'computer-networks',
      icon: Network,
      color: 'bg-sky-50 text-sky-900 border-sky-200',
      iconBg: 'bg-sky-100 text-sky-900',
      badge: '100% FREE',
      topics: '40+ Topics'
    },
    {
      title: 'System Design & Scalability',
      description: 'Distributed architectures, Load Balancers, Caching, Sharding, Message Queues & CAP theorem.',
      slug: 'system-design-track-2026',
      icon: Server,
      color: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      iconBg: 'bg-indigo-100 text-indigo-900',
      badge: '100% FREE',
      topics: '35+ Topics'
    },
    {
      title: 'Core Java for Placements',
      description: 'OOPs concepts, JVM Internals, Garbage Collection, Collections Framework, Multithreading.',
      slug: 'dsa',
      icon: Code2,
      color: 'bg-rose-50 text-rose-900 border-rose-200',
      iconBg: 'bg-rose-100 text-rose-900',
      badge: '100% FREE',
      topics: '60+ Topics'
    }
  ];

  const faqs = [
    {
      question: 'Is CodeOrbit completely free for computer science students?',
      answer: 'Yes. All core curriculum levels (Beginner, Intermediate, and Advanced) across all subject tracks are 100% free with no subscription barriers. You get complete notes, verified code examples, and practice quizzes.'
    },
    {
      question: 'What is the bilingual (Hinglish) reading feature?',
      answer: 'Every lesson includes an instant language toggle between clear academic English and conversational Hinglish (Hindi-English mix), allowing you to grasp complex CS concepts intuitively without translation delays.'
    },
    {
      question: 'How do verifiable certificates work on CodeOrbit?',
      answer: 'After passing all 12 module quizzes and 3 level exams with an 80%+ score, you become eligible for an official verifiable certificate. You can issue it for a one-time administrative fee of ₹9 with a permanent public verification QR code and high-resolution PDF download.'
    },
    {
      question: 'What is included in the ₹99 Placement Prep Kits?',
      answer: 'Placement Prep Kits are role-focused practice suites (SDE 1, Frontend, Backend, DevOps, Data Engineer, System Design, QA) with curated interview question banks, detailed step-by-step explanations, and direct links to CodeOrbit concept tutorials.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      <SeoHead
        title="CodeOrbit — Learn Computer Science. Build Skills. Get Placement Ready."
        description="100% Free Computer Science learning platform for CSE & IT students. GeeksforGeeks-style tutorials for DSA, Operating Systems, DBMS, Networks, and System Design in English & Hinglish."
        canonicalUrl="/"
        faq={faqs}
      />

      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-slate-50">
        <div className="max-w-5xl mx-auto text-center space-y-7 relative z-10">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>FREE COMPUTER SCIENCE LEARNING & PLACEMENT HANDBOOK</span>
          </div>

          {/* Hero Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
              Learn Computer Science.{' '}
              <span className="text-emerald-600">
                Build Skills.
              </span>{' '}
              Get Placement Ready.
            </h1>

            <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
              Structured university & interview roadmaps, bilingual explanations (English & Hinglish), interactive practice quizzes, verifiable credentials, and curated placement kits.
            </p>
          </div>

          {/* Primary & Secondary Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/courses">
              <Button size="lg" variant="primary" rightIcon={ArrowRight}>
                Explore Courses
              </Button>
            </Link>

            <Link to="/placement-kits">
              <Button size="lg" variant="outline" leftIcon={Briefcase}>
                Explore Placement Kits (₹99)
              </Button>
            </Link>
          </div>

          {/* Global Search Input */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative group pt-2">
            <div className="relative flex items-center rounded-2xl shadow-xs">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="text"
                placeholder="Search topics (e.g. Binary Search, Deadlocks, SQL Joins, TCP Handshake)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 focus:border-emerald-500 rounded-2xl pl-12 pr-32 py-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-2xs"
              />
              <button
                type="submit"
                className="absolute right-2.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Subject Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-mono text-[11px]">Popular Subjects:</span>
            {['DSA', 'Operating Systems', 'DBMS', 'Computer Networks', 'System Design', 'Java', 'Python'].map((tag, idx) => (
              <Link
                key={idx}
                to={`/courses?search=${encodeURIComponent(tag)}`}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-700 transition-all shadow-2xs text-xs font-medium"
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

      {/* 2. Explore Computer Science Courses Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <SectionHeader
          title="Core Computer Science Tutorials & Roadmaps"
          subtitle="Complete chapter-by-chapter curriculum with code examples, visual diagrams, and module assessments."
          actionText="Browse All Subjects"
          actionHref="/courses"
          pulseDot={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreTracks.map((sub, idx) => {
            const IconComponent = sub.icon;
            return (
              <Link
                key={idx}
                to={`/courses/${sub.slug}`}
                className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all duration-200 hover:-translate-y-1 shadow-2xs hover:shadow-md flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${sub.iconBg} group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <Badge variant="primary" dot={true}>
                      {sub.topics}
                    </Badge>
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
                  <span>Start Learning Free</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Four-Tier Learning Path Breakdown */}
      <section className="bg-white border-y border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <Badge variant="purple">Progressive Engineering Pedagogy</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Four-Tier Computer Science Learning Path
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Each subject track is divided into structured milestones designed for mastery from beginner basics to top-tier placements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: '01',
                level: 'Level 1: Beginner',
                desc: 'Foundational principles, asymptotic notation, standard syntax, and introductory algorithms.',
                price: '100% FREE',
                color: 'border-l-4 border-l-emerald-500'
              },
              {
                step: '02',
                level: 'Level 2: Intermediate',
                desc: 'Complex data structures, non-linear hierarchies, trees, graphs, and multi-paradigm problem solving.',
                price: '100% FREE',
                color: 'border-l-4 border-l-teal-500'
              },
              {
                step: '03',
                level: 'Level 3: Advanced',
                desc: 'Dynamic programming, system concurrency, cache coherence, and algorithmic optimization.',
                price: '100% FREE (Certificate)',
                color: 'border-l-4 border-l-purple-500'
              },
              {
                step: '04',
                level: 'Level 4: Placement Ready',
                desc: 'Curated FAANG & product company interview question patterns, mock breakdowns, and deep dives.',
                price: '₹29 UNLOCK',
                color: 'border-l-4 border-l-amber-500'
              }
            ].map((tier, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 ${tier.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-slate-400">STAGE {tier.step}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                    {tier.price}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{tier.level}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How CodeOrbit Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How CodeOrbit Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            A frictionless learning experience engineered specifically for Indian engineering students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: BookOpen,
              title: '1. Read & Understand',
              desc: 'High-yield conceptual notes with English + Hinglish toggle and verified runnable code snippets.'
            },
            {
              icon: Zap,
              title: '2. Practice Quizzes',
              desc: 'Module-wise multiple-choice questions with instant scoring, feedback, and progress syncing.'
            },
            {
              icon: Award,
              title: '3. Earn Certificate',
              desc: 'Complete curriculum to earn official verifiable academic credentials with public QR verification for ₹9.'
            },
            {
              icon: Briefcase,
              title: '4. Crack Placements',
              desc: 'Sharpen interview skills with role-based ₹99 Placement Kits and subject-specific ₹29 interview guides.'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mid-Page In-Feed AdSlot */}
      <div className="max-w-7xl mx-auto w-full px-4">
        <AdSlot slotType="in_article" />
      </div>

      {/* 5. Placement Kits & Certification Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placement Kits Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white space-y-5 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
              <Briefcase className="w-3.5 h-3.5" />
              <span>ROLE-BASED QUESTION BANKS</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Placement Preparation Kits — ₹99
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Handpicked interview banks with detailed step-by-step explanations and lesson references for SDE 1, Frontend, Backend, DevOps, Data Engineer, and System Design.
              </p>
            </div>
            <Link to="/placement-kits" className="inline-block">
              <Button size="md" variant="primary" rightIcon={ArrowRight}>
                Browse 10 Placement Kits
              </Button>
            </Link>
          </div>

          {/* Certificate Verification Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-mono font-bold">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>OFFICIAL VERIFIABLE CREDENTIALS</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Verifiable Academic Certificates — ₹9
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pass all 12 module assessments and 3 final exams to claim your official diploma with unique cryptographic verification codes, scannable QR codes, and downloadable high-res PDF.
              </p>
            </div>
            <Link to="/certificates/verify" className="inline-block">
              <Button size="md" variant="outline" rightIcon={ArrowRight}>
                Verify a Certificate Online
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions (FAQ) Section */}
      <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Answers to common questions about CodeOrbit curriculum, certificates, and pricing.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq[idx];
            return (
              <div key={idx} className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Final Action Callout Banner */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white text-center space-y-6 shadow-md relative overflow-hidden">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Master Computer Science?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join thousands of engineering students preparing for semester exams and cracking top tech placements.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/courses">
              <Button size="lg" variant="primary" rightIcon={ArrowRight}>
                Start Learning for Free
              </Button>
            </Link>
            <Link to="/placement-kits">
              <Button size="lg" variant="outline" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
                Explore Placement Kits
              </Button>
            </Link>
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

export default HomePage;
