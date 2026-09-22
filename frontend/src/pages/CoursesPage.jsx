import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  Clock, 
  Layers, 
  ArrowRight,
  Terminal,
  RotateCcw
} from 'lucide-react';
import { coursesApi } from '../services/coursesApi';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { SeoHead } from '../components/seo/SeoHead';
import { AdSlot } from '../components/ads/AdSlot';
import { Button, Card, CardContent, Badge, Skeleton, EmptyState, SectionHeader } from '../components/ui';

export const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialTrack = searchParams.get('track') || 'ALL';

  const [courses, setCourses] = useState(() => {
    let initial = [...CURRICULUM_DATA];
    if (initialTrack && initialTrack !== 'ALL') {
      initial = initial.filter((c) => c.track?.toUpperCase() === initialTrack.toUpperCase());
    }
    return initial;
  });
  const [loading, setLoading] = useState(false);
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      <SeoHead
        title="Computer Science Tutorials & Subject Tracks — CodeOrbit"
        description="Browse all free CS courses, notes, and roadmaps. Master DSA, OS, DBMS, Networks, and System Design with step-by-step syllabus and interactive quizzes."
        canonicalUrl="/courses"
      />

      {/* Header Banner */}
      <section className="pt-12 pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                <span>FREE CS CURRICULUM & ROADMAPS</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Computer Science Tutorials & Subject Tracks
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Self-paced, verified tutorials designed for university curriculum, GATE prep, and tech placement interviews.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-2.5">
              <Badge variant="success" size="md">100% Free</Badge>
              <Badge variant="teal" size="md">English + Hinglish</Badge>
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
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md group">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none group-focus-within:text-emerald-600 transition-colors" />
            <input
              type="text"
              placeholder="Search tutorials by title, keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </form>

          {/* Track Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {tracks.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  setSelectedTrack(t.value);
                  setPage(0);
                }}
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
            title="No Tutorials Found"
            description="Try adjusting your search query or track filter to find available CS subjects."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearch('');
              setSelectedTrack('ALL');
              setPage(0);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.slug}`}
                className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between space-y-6 shadow-2xs"
              >
                <div className="space-y-4">
                  {/* Track Badge & Hours */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <Badge variant="primary" dot={true}>
                      {course.track || 'CS CORE'}
                    </Badge>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {course.estimatedHours || 30} hrs
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {course.shortDescription || course.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      {course.moduleCount || 1} Modules
                    </span>
                    <span>•</span>
                    <span>{course.lessonCount || 2} Lessons</span>
                  </div>

                  <span className="font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1">
                    <span>Explore Syllabus</span>
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
