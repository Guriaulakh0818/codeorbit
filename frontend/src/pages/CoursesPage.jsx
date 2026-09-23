import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  Clock, 
  Layers, 
  ArrowRight,
  Terminal,
  Sparkles,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { coursesApi } from '../services/coursesApi';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { SeoHead } from '../components/seo/SeoHead';
import { AdSlot } from '../components/ads/AdSlot';
import { Button, Card, CardContent, Badge, Skeleton, EmptyState } from '../components/ui';

export const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialTrack = searchParams.get('track') || 'ALL';

  const [courses, setCourses] = useState(() => {
    let initial = [...CURRICULUM_DATA];
    if (initialTrack && initialTrack !== 'ALL') {
      initial = initial.filter((c) => {
        if (initialTrack === 'LANGUAGES') return c.track === 'LANGUAGES';
        if (initialTrack === 'WEB_MOBILE') return c.track === 'WEB' || c.track === 'MOBILE';
        if (initialTrack === 'BACKEND_DB') return c.track === 'BACKEND' || c.track === 'DATABASE';
        if (initialTrack === 'DSA_SYS') return c.track === 'DSA' || c.track === 'SYSTEM_DESIGN';
        if (initialTrack === 'CORE_CS') return c.track === 'CORE_CS';
        if (initialTrack === 'CLOUD_DEVOPS') return c.track === 'CLOUD' || c.track === 'DEVOPS';
        if (initialTrack === 'AI_SECURITY') return c.track === 'AI_DATA' || c.track === 'SECURITY' || c.track === 'TESTING';
        return c.track?.toUpperCase() === initialTrack.toUpperCase();
      });
    }
    return initial;
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [selectedTrack, setSelectedTrack] = useState(initialTrack);

  const tracks = [
    { label: 'All 20 Domains', value: 'ALL' },
    { label: '☕ Languages', value: 'LANGUAGES' },
    { label: '🧠 DSA & System Design', value: 'DSA_SYS' },
    { label: '🌐 Web & Mobile', value: 'WEB_MOBILE' },
    { label: '🌱 Backend & DB', value: 'BACKEND_DB' },
    { label: '🖥️ Core CS (OS, CN, DBMS)', value: 'CORE_CS' },
    { label: '☁️ Cloud & DevOps', value: 'CLOUD_DEVOPS' },
    { label: '🤖 AI, Data & Security', value: 'AI_SECURITY' }
  ];

  const filterCoursesList = () => {
    let list = [...CURRICULUM_DATA];

    if (selectedTrack && selectedTrack !== 'ALL') {
      list = list.filter((c) => {
        if (selectedTrack === 'LANGUAGES') return c.track === 'LANGUAGES';
        if (selectedTrack === 'WEB_MOBILE') return c.track === 'WEB' || c.track === 'MOBILE';
        if (selectedTrack === 'BACKEND_DB') return c.track === 'BACKEND' || c.track === 'DATABASE';
        if (selectedTrack === 'DSA_SYS') return c.track === 'DSA' || c.track === 'SYSTEM_DESIGN';
        if (selectedTrack === 'CORE_CS') return c.track === 'CORE_CS';
        if (selectedTrack === 'CLOUD_DEVOPS') return c.track === 'CLOUD' || c.track === 'DEVOPS';
        if (selectedTrack === 'AI_SECURITY') return c.track === 'AI_DATA' || c.track === 'SECURITY' || c.track === 'TESTING';
        return c.track?.toUpperCase() === selectedTrack.toUpperCase();
      });
    }

    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => {
        const titleMatch = c.title?.toLowerCase().includes(q);
        const descMatch = c.description?.toLowerCase().includes(q) || c.shortDescription?.toLowerCase().includes(q);
        const subMatch = c.subcourses?.some((s) => s.title.toLowerCase().includes(q));
        return titleMatch || descMatch || subMatch;
      });
    }

    setCourses(list);
  };

  useEffect(() => {
    filterCoursesList();
  }, [selectedTrack, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    filterCoursesList();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      <SeoHead
        title="20 Core Computer Science & Tech Domains Catalogue — CodeOrbit"
        description="Browse all 20 professional technical domains with 4 structured tiers: Beginner, Intermediate, Advanced, and Placement Ready (₹29). Complete syllabus with free tutorials and verified certificates."
        canonicalUrl="/courses"
      />

      {/* Header Banner */}
      <section className="pt-12 pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                <span>20 DOMAINS • 4 TIERS EACH • 100% VERIFIED SYLLABUS</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Complete Engineering & Tech Course Catalogue
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Step-by-step master tracks designed for college curriculum, semester exams, GATE prep, and high-paying tech placements.
              </p>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              <Badge variant="success" size="md">Tier 1-3: 100% Free</Badge>
              <Badge variant="teal" size="md">Placement Ready: ₹29</Badge>
              <Badge variant="primary" size="md">Certificates: ₹9</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Ad */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-6">
        <AdSlot slotType="leaderboard" />
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        
        {/* Search & Subject Track Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md group">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none group-focus-within:text-emerald-600 transition-colors" />
            <input
              type="text"
              placeholder="Search 20 domains (e.g., Java, Python, React, SQL, DSA, Cloud)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </form>

          {/* Track Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {tracks.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setSelectedTrack(t.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedTrack === t.value
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses / Tutorials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} variant="card" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No Domains Found"
            description="Try adjusting your search query or domain category filter."
            actionLabel="Reset All Filters"
            onAction={() => {
              setSearch('');
              setSelectedTrack('ALL');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.slug}`}
                className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between space-y-5 shadow-2xs"
              >
                <div className="space-y-4">
                  {/* Track Badge & Hours */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{course.iconEmoji || '💻'}</span>
                      <Badge variant="primary" dot={true}>
                        {course.track || 'CS CORE'}
                      </Badge>
                    </div>
                    <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {course.estimatedHours || 30} hrs
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {course.shortDescription || course.description}
                    </p>
                  </div>

                  {/* 4 Tier Subcourses Pills */}
                  {course.subcourses && course.subcourses.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                        4-Tier Structured Roadmap:
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        {course.subcourses.map((sub, sIdx) => (
                          <div 
                            key={sIdx} 
                            className={`px-2 py-1 rounded-lg border text-left truncate flex items-center justify-between gap-1 ${
                              sub.curriculumLevel === 'PLACEMENT_READY'
                                ? 'bg-amber-50/80 border-amber-200 text-amber-900 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="truncate">{sub.title}</span>
                            {sub.curriculumLevel === 'PLACEMENT_READY' && (
                              <span className="text-[9px] bg-amber-600 text-white px-1 py-0.2 rounded font-extrabold shrink-0">₹29</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      4 Levels
                    </span>
                    <span>•</span>
                    <span>Free Notes & Quizzes</span>
                  </div>

                  <span className="font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1">
                    <span>Explore Track</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom Banner Ad */}
        <AdSlot slotType="footer_banner" />
      </div>
    </div>
  );
};

export default CoursesPage;
