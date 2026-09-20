import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Search, 
  Code2, 
  Clock, 
  BookOpen, 
  Layers, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  ArrowRight, 
  Languages,
  CheckCircle2
} from 'lucide-react';
import { coursesApi } from '../services/coursesApi';

const TRACKS = [
  { id: 'ALL', name: 'All Tracks' },
  { id: 'DSA', name: 'Data Structures & Algorithms' },
  { id: 'SYSTEMS', name: 'Core Computer Systems' },
  { id: 'WEB', name: 'Full-Stack Web Dev' }
];

export const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTrack = searchParams.get('track') || 'ALL';
  const initialSearch = searchParams.get('q') || '';

  const [selectedTrack, setSelectedTrack] = useState(initialTrack);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state with URL params
  useEffect(() => {
    const track = searchParams.get('track');
    const q = searchParams.get('q');
    if (track !== null) setSelectedTrack(track);
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  // Load published courses from API
  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await coursesApi.getCourses({
        track: selectedTrack !== 'ALL' ? selectedTrack : '',
        search: searchQuery.trim(),
        size: 50
      });

      if (res.success) {
        setCourses(res.data || []);
      } else {
        setError(res.message || 'Failed to load courses.');
      }
    } catch (err) {
      setError('Could not connect to the backend server. Please verify the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [selectedTrack]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    } else {
      params.delete('q');
    }
    setSearchParams(params);
    loadCourses();
  };

  const handleTrackChange = (trackId) => {
    setSelectedTrack(trackId);
    const params = new URLSearchParams(searchParams);
    if (trackId === 'ALL') {
      params.delete('track');
    } else {
      params.set('track', trackId);
    }
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-[#080d1e] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-950 via-[#0b132b] to-slate-900 border border-brand-500/20 p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-sky-400 text-xs font-semibold tracking-wide uppercase">
              <GraduationCap className="w-4 h-4" /> Free CSE Learning Platform
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Interactive Computer Science <span className="bg-gradient-to-r from-sky-400 via-brand-400 to-indigo-400 bg-clip-text text-transparent">Curriculum</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Master fundamental engineering concepts with structured interactive lessons, dual-language explanations in English & Hinglish, and self-assessment module quizzes.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 via-brand-500 to-transparent" />
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
          {/* Track Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {TRACKS.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTrackChange(t.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedTrack === t.id
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/50'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tracks, algorithms, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-24 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse">
                <div className="h-6 bg-slate-800 rounded w-1/3" />
                <div className="h-8 bg-slate-800 rounded w-3/4" />
                <div className="h-16 bg-slate-800 rounded w-full" />
                <div className="h-10 bg-slate-800 rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-8 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Unable to Load Courses</h3>
            <p className="text-xs text-slate-300">{error}</p>
            <button
              onClick={loadCourses}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No Courses Found</h3>
            <p className="text-xs text-slate-400">
              No learning tracks match your current filter criteria. Try adjusting the search or select another track.
            </p>
            <button
              onClick={() => {
                setSelectedTrack('ALL');
                setSearchQuery('');
                setSearchParams({});
                loadCourses();
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Course Cards Grid */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id || course.slug}
                className="group relative flex flex-col justify-between bg-slate-900/70 hover:bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-sky-500/5"
              >
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {course.track || 'Track'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {course.hasHinglish && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          <Languages className="w-3 h-3" /> EN + HI
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {course.difficultyLevel || 'All Levels'}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                      {course.title}
                    </h2>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {course.shortDescription || course.description}
                    </p>
                  </div>
                </div>

                {/* Footer Metrics & Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400 font-medium">
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                      <div className="text-slate-200 font-bold">{course.moduleCount || 0}</div>
                      <div className="text-[10px] text-slate-500">Modules</div>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                      <div className="text-slate-200 font-bold">{course.lessonCount || 0}</div>
                      <div className="text-[10px] text-slate-500">Lessons</div>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                      <div className="text-slate-200 font-bold">~{course.estimatedHours || 0}h</div>
                      <div className="text-[10px] text-slate-500">Duration</div>
                    </div>
                  </div>

                  <Link
                    to={`/courses/${course.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 transition-all shadow-md shadow-brand-500/20 group-hover:shadow-sky-500/30"
                  >
                    <span>Explore Track Syllabus</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
