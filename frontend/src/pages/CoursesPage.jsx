import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  Clock, 
  Layers, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Filter,
  Terminal,
  Cpu,
  Database,
  Network,
  Server,
  Code2
} from 'lucide-react';
import { coursesApi } from '../services/coursesApi';
import { SeoHead } from '../components/seo/SeoHead';
import { AdSlot } from '../components/ads/AdSlot';

export const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialTrack = searchParams.get('track') || 'ALL';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedTrack, setSelectedTrack] = useState(initialTrack);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);

  const tracks = [
    { label: 'All Subjects', value: 'ALL' },
    { label: 'DSA & Algorithms', value: 'DSA' },
    { label: 'Operating Systems', value: 'OS' },
    { label: 'DBMS & SQL', value: 'DBMS' },
    { label: 'Computer Networks', value: 'NETWORKS' },
    { label: 'System Design', value: 'SYSTEM_DESIGN' },
    { label: 'Languages (Java/Python/C++)', value: 'LANGUAGES' }
  ];

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await coursesApi.getCourses({
        track: selectedTrack === 'ALL' ? '' : selectedTrack,
        search: search.trim(),
        page,
        size: 12
      });

      if (res.success) {
        setCourses(res.data || []);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch CS courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedTrack, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      <SeoHead
        title="Computer Science Tutorials & Subject Tracks — CodeOrbit"
        description="Browse all free CS courses, notes, and roadmaps. Master DSA, OS, DBMS, Networks, and System Design with step-by-step syllabus and interactive quizzes."
        canonicalUrl="https://www.codeorbit.online/courses"
      />

      {/* Header Banner */}
      <section className="pt-12 pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-grid-pattern relative">
        <div className="max-w-7xl mx-auto space-y-4 text-center sm:text-left relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                <span>FREE CS CURRICULUM & ROADMAPS</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Computer Science Tutorials & Subject Tracks
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                Self-paced, verified tutorials designed for university curriculum, GATE prep, and tech placement interviews.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                100% Free
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono font-bold">
                English + Hinglish
              </span>
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
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-slate-800/80">
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md group">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              placeholder="Search tutorials by title, keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </form>

          {/* Track Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {tracks.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  setSelectedTrack(t.value);
                  setPage(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTrack === t.value
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 font-bold'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
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
              <div key={i} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse space-y-4 h-64">
                <div className="h-6 bg-slate-800 rounded w-1/3"></div>
                <div className="h-8 bg-slate-800 rounded w-3/4"></div>
                <div className="h-16 bg-slate-800 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800 space-y-4 max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Tutorials Found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search query or track filter to find available CS subjects.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedTrack('ALL');
                setPage(0);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.slug}`}
                className="group p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Track Badge & Hours */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider">
                      {course.track || 'CS CORE'}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {course.estimatedHours || 30} hrs
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {course.shortDescription || course.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      {course.moduleCount || 1} Modules
                    </span>
                    <span>•</span>
                    <span>{course.lessonCount || 2} Lessons</span>
                  </div>

                  <span className="font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1">
                    <span>Syllabus</span>
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
