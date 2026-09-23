import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Layers, 
  BookOpen, 
  HelpCircle, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Lock,
  RotateCcw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminCurriculumApi } from '../../services/adminCurriculumApi';
import { AdminCourseModal } from './AdminCourseModal';
import { AdminModuleModal } from './AdminModuleModal';
import { AdminLessonModal } from './AdminLessonModal';
import { AdminQuizModal } from './AdminQuizModal';

export const AdminCurriculumManager = ({ onNotify }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [trackFilter, setTrackFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Expanded Tree State: { [courseId]: AdminCourseDetailDto }
  const [expandedCourses, setExpandedCourses] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});

  // Modals state
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [targetCourseId, setTargetCourseId] = useState(null);
  const [editingModule, setEditingModule] = useState(null);

  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);

  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [targetQuizModuleId, setTargetQuizModuleId] = useState(null);
  const [editingQuizId, setEditingQuizId] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminCurriculumApi.getCourses({
        search: searchTerm,
        track: trackFilter,
        status: statusFilter,
        size: 50
      });
      if (res.success) {
        setCourses(res.data || []);
      } else {
        setError(res.message || 'Failed to fetch courses.');
      }
    } catch (err) {
      setError('Could not connect to curriculum database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [trackFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleResetToStandard = () => {
    if (window.confirm('Reset/Sync curriculum to standard 20 Domains with 4 tiers each?')) {
      const fresh = adminCurriculumApi.resetToDefaultCurriculum();
      setCourses(fresh);
      setExpandedCourses({});
      if (onNotify) onNotify('Curriculum successfully synchronized to all 20 Domains & 4-tier roadmaps!');
    }
  };

  const toggleCourseExpand = async (courseId) => {
    if (expandedCourses[courseId]) {
      setExpandedCourses((prev) => {
        const next = { ...prev };
        delete next[courseId];
        return next;
      });
      return;
    }

    setLoadingDetails((prev) => ({ ...prev, [courseId]: true }));
    try {
      const res = await adminCurriculumApi.getCourseById(courseId);
      if (res.success && res.data) {
        setExpandedCourses((prev) => ({ ...prev, [courseId]: res.data }));
      }
    } catch (e) {
      // ignore
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  const refreshCourseDetails = async (courseId) => {
    if (!courseId) return;
    try {
      const res = await adminCurriculumApi.getCourseById(courseId);
      if (res.success && res.data) {
        setExpandedCourses((prev) => ({ ...prev, [courseId]: res.data }));
      }
      fetchCourses();
    } catch (e) {
      // ignore
    }
  };

  // Status toggle handlers
  const handleToggleCourseStatus = async (courseId, currentStatus) => {
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await adminCurriculumApi.updateCourseStatus(courseId, newStatus);
      if (res.success) {
        fetchCourses();
        if (expandedCourses[courseId]) {
          refreshCourseDetails(courseId);
        }
      }
    } catch (e) {
      // ignore
    }
  };

  const handleToggleModuleStatus = async (courseId, moduleId, currentStatus) => {
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await adminCurriculumApi.updateModuleStatus(moduleId, newStatus);
      if (res.success) {
        refreshCourseDetails(courseId);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleToggleLessonStatus = async (courseId, lessonId, currentStatus) => {
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await adminCurriculumApi.updateLessonStatus(lessonId, newStatus);
      if (res.success) {
        refreshCourseDetails(courseId);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleToggleQuizStatus = async (courseId, quizId, currentStatus) => {
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await adminCurriculumApi.updateQuizStatus(quizId, newStatus);
      if (res.success) {
        refreshCourseDetails(courseId);
      }
    } catch (e) {
      // ignore
    }
  };

  // Deletion handlers
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course track and all its modules/lessons?')) return;
    try {
      const res = await adminCurriculumApi.deleteCourse(courseId);
      if (res.success) {
        fetchCourses();
      }
    } catch (e) {
      // ignore
    }
  };

  const handleDeleteModule = async (courseId, moduleId) => {
    if (!window.confirm('Delete this module and all its lessons/quizzes?')) return;
    try {
      const res = await adminCurriculumApi.deleteModule(moduleId);
      if (res.success) {
        refreshCourseDetails(courseId);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleDeleteLesson = async (courseId, lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      const res = await adminCurriculumApi.deleteLesson(lessonId);
      if (res.success) {
        refreshCourseDetails(courseId);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleDeleteQuiz = async (courseId, quizId) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      const res = await adminCurriculumApi.deleteQuiz(quizId);
      if (res.success) {
        refreshCourseDetails(courseId);
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
            20-Domain Technical Curriculum & Roadmaps
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Author and manage 20 core domains, 4-tier subcourses, modules, bilingual chapters (English & Hinglish), and practice quizzes.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetToStandard}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all border border-slate-200 cursor-pointer"
            title="Synchronize standard 20 Domains catalogue"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Sync Standard 20 Domains
          </button>

          <button
            onClick={() => {
              setEditingCourse(null);
              setCourseModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add New Domain
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search all 20 domains by title, keyword, or slug..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 shadow-2xs font-medium"
          >
            <option value="ALL">All Categories ({courses.length})</option>
            <option value="LANGUAGES">☕ Languages (Java, Python, C++)</option>
            <option value="DSA">🧠 DSA</option>
            <option value="SYSTEM_DESIGN">🏗️ System Design</option>
            <option value="WEB">🌐 Web & React</option>
            <option value="BACKEND">🌱 Backend & Spring</option>
            <option value="DATABASE">🗄️ SQL & DB</option>
            <option value="CORE_CS">🖥️ Core CS (OS, DBMS, CN)</option>
            <option value="DEVOPS">🐧 Linux & Git</option>
            <option value="CLOUD">☁️ Cloud Computing</option>
            <option value="TESTING">🧪 Testing & QA</option>
            <option value="SECURITY">🔐 Cyber Security</option>
            <option value="AI_DATA">🤖 AI, ML & Data Analytics</option>
            <option value="MOBILE">📱 Flutter Mobile</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 shadow-2xs font-medium"
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>

          <button
            onClick={fetchCourses}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 transition-colors shadow-2xs cursor-pointer shrink-0"
            title="Refresh Courses"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs text-rose-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white border border-slate-200 rounded-2xl p-6 h-28" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && courses.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Courses Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click &quot;Sync Standard 20 Domains&quot; to restore all 20 professional curriculum tracks.
          </p>
          <button
            onClick={handleResetToStandard}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            Sync 20 Standard Domains
          </button>
        </div>
      )}

      {/* Hierarchical Course List */}
      {!loading && courses.length > 0 && (
        <div className="space-y-4">
          {courses.map((course) => {
            const isExpanded = Boolean(expandedCourses[course.id]);
            const details = expandedCourses[course.id];
            const isDetailLoading = Boolean(loadingDetails[course.id]);

            return (
              <div
                key={course.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                {/* Course Header Bar */}
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 cursor-pointer" onClick={() => toggleCourseExpand(course.id)}>
                    <button className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 mt-0.5 cursor-pointer">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base">{course.iconEmoji || '💻'}</span>
                        <span className="text-sm sm:text-base font-bold text-slate-900">{course.title}</span>
                        
                        {/* Status Badge */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCourseStatus(course.id, course.status);
                          }}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            course.status === 'PUBLISHED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          {course.status}
                        </button>

                        <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                          {course.track}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-1">{course.shortDescription || course.description}</p>
                    </div>
                  </div>

                  {/* Course Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                    <Link
                      to={`/courses/${course.slug}`}
                      target="_blank"
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                      title="Preview Public Course Page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => {
                        setTargetCourseId(course.id);
                        setEditingModule(null);
                        setModuleModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Module
                    </button>

                    <button
                      onClick={() => {
                        setEditingCourse(course);
                        setCourseModalOpen(true);
                      }}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                      title="Edit Domain Metadata"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition-colors cursor-pointer"
                      title="Delete Domain"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Modules & Content Tree */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/70 p-5 sm:p-6 space-y-5">
                    
                    {/* 4 Subcourse Tiers Ribbon */}
                    {details?.subcourses && details.subcourses.length > 0 && (
                      <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center justify-between">
                          <span>4-Tier Roadmap Hierarchy:</span>
                          <span className="text-emerald-700 font-bold">100% Free Tiers 1-3 • ₹29 Placement Ready</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          {details.subcourses.map((sub, sIdx) => (
                            <div
                              key={sIdx}
                              className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                                sub.curriculumLevel === 'PLACEMENT_READY'
                                  ? 'bg-amber-50/90 border-amber-200 text-amber-950 font-semibold'
                                  : 'bg-slate-50 border-slate-200 text-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-[11px] truncate">{sub.title}</span>
                                {sub.curriculumLevel === 'PLACEMENT_READY' ? (
                                  <span className="text-[9px] bg-amber-600 text-white px-1.5 py-0.2 rounded font-extrabold">₹29</span>
                                ) : (
                                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">FREE</span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">{sub.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isDetailLoading && (
                      <div className="py-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" /> Loading modules and lessons...
                      </div>
                    )}

                    {!isDetailLoading && (!details?.modules || details.modules.length === 0) && (
                      <div className="py-6 text-center text-xs text-slate-500 space-y-2 bg-white rounded-xl border border-slate-200 p-6">
                        <p>No custom modules created yet for this domain.</p>
                        <button
                          onClick={() => {
                            setTargetCourseId(course.id);
                            setEditingModule(null);
                            setModuleModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                        >
                          Add First Module
                        </button>
                      </div>
                    )}

                    {!isDetailLoading && details?.modules?.map((mod) => (
                      <div
                        key={mod.id}
                        className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs"
                      >
                        {/* Module Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-bold text-slate-900">{mod.title}</span>
                            
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                              {mod.curriculumLevel || 'BEGINNER'}
                            </span>

                            <button
                              onClick={() => handleToggleModuleStatus(course.id, mod.id, mod.status)}
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold border cursor-pointer ${
                                mod.status === 'PUBLISHED'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {mod.status}
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            <button
                              onClick={() => {
                                setTargetModuleId(mod.id);
                                setEditingLesson(null);
                                setLessonModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-[11px] font-semibold border border-emerald-200 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" /> Lesson
                            </button>

                            <button
                              onClick={() => {
                                setTargetQuizModuleId(mod.id);
                                setEditingQuizId(null);
                                setQuizModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-sky-800 hover:bg-sky-100 rounded-lg text-[11px] font-semibold border border-sky-200 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" /> Quiz
                            </button>

                            <button
                              onClick={() => {
                                setTargetCourseId(course.id);
                                setEditingModule(mod);
                                setModuleModalOpen(true);
                              }}
                              className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteModule(course.id, mod.id)}
                              className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Lessons & Quizzes in Module */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          
                          {/* Lessons Column */}
                          <div className="space-y-2">
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                              Lessons ({mod.lessons?.length || 0})
                            </div>

                            {(!mod.lessons || mod.lessons.length === 0) ? (
                              <p className="text-[11px] text-slate-400 italic">No lessons yet.</p>
                            ) : (
                              mod.lessons.map((l) => (
                                <div
                                  key={l.id}
                                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 text-xs"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="font-semibold text-slate-800 truncate">{l.title}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">{l.estimatedMinutes}m</span>
                                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">EN+HI</span>
                                  </div>

                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                      onClick={() => handleToggleLessonStatus(course.id, l.id, l.status)}
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer ${
                                        l.status === 'PUBLISHED' ? 'text-emerald-800 bg-emerald-100' : 'text-amber-800 bg-amber-100'
                                      }`}
                                    >
                                      {l.status}
                                    </button>

                                    <button
                                      onClick={async () => {
                                        const res = await adminCurriculumApi.getLessonById(l.id);
                                        if (res.success) {
                                          setEditingLesson(res.data);
                                        } else {
                                          setEditingLesson(l);
                                        }
                                        setTargetModuleId(mod.id);
                                        setLessonModalOpen(true);
                                      }}
                                      className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteLesson(course.id, l.id)}
                                      className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Quizzes Column */}
                          <div className="space-y-2">
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                              Quizzes ({mod.quizzes?.length || 0})
                            </div>

                            {(!mod.quizzes || mod.quizzes.length === 0) ? (
                              <p className="text-[11px] text-slate-400 italic">No quizzes yet.</p>
                            ) : (
                              mod.quizzes.map((q) => (
                                <div
                                  key={q.id}
                                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 text-xs"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="font-semibold text-slate-800 truncate">{q.title}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">{q.minPassScorePercentage || 80}% Pass</span>
                                  </div>

                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                      onClick={() => handleToggleQuizStatus(course.id, q.id, q.status)}
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer ${
                                        q.status === 'PUBLISHED' ? 'text-emerald-800 bg-emerald-100' : 'text-amber-800 bg-amber-100'
                                      }`}
                                    >
                                      {q.status}
                                    </button>

                                    <button
                                      onClick={async () => {
                                        const res = await adminCurriculumApi.getQuizById(q.id);
                                        if (res.success) {
                                          setEditingQuizId(res.data.id);
                                        } else {
                                          setEditingQuizId(q.id);
                                        }
                                        setTargetQuizModuleId(mod.id);
                                        setQuizModalOpen(true);
                                      }}
                                      className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteQuiz(course.id, q.id)}
                                      className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {courseModalOpen && (
        <AdminCourseModal
          isOpen={courseModalOpen}
          onClose={() => setCourseModalOpen(false)}
          editingCourse={editingCourse}
          onSaved={() => {
            fetchCourses();
            if (onNotify) onNotify('Course saved successfully.');
          }}
        />
      )}

      {moduleModalOpen && (
        <AdminModuleModal
          isOpen={moduleModalOpen}
          onClose={() => setModuleModalOpen(false)}
          courseId={targetCourseId}
          editingModule={editingModule}
          onSaved={() => {
            refreshCourseDetails(targetCourseId);
            if (onNotify) onNotify('Module saved successfully.');
          }}
        />
      )}

      {lessonModalOpen && (
        <AdminLessonModal
          isOpen={lessonModalOpen}
          onClose={() => setLessonModalOpen(false)}
          moduleId={targetModuleId}
          editingLesson={editingLesson}
          onSaved={() => {
            if (targetCourseId) refreshCourseDetails(targetCourseId);
            fetchCourses();
            if (onNotify) onNotify('Lesson saved successfully.');
          }}
        />
      )}

      {quizModalOpen && (
        <AdminQuizModal
          isOpen={quizModalOpen}
          onClose={() => setQuizModalOpen(false)}
          moduleId={targetQuizModuleId}
          quizId={editingQuizId}
          onSaved={() => {
            if (targetCourseId) refreshCourseDetails(targetCourseId);
            fetchCourses();
            if (onNotify) onNotify('Quiz saved successfully.');
          }}
        />
      )}

    </div>
  );
};

export default AdminCurriculumManager;
