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
  RotateCcw,
  IndianRupee,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminCurriculumApi } from '../../services/adminCurriculumApi';
import { AdminCourseModal } from './AdminCourseModal';
import { AdminModuleModal } from './AdminModuleModal';
import { AdminSubcourseModal } from './AdminSubcourseModal';
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

  const [subcourseModalOpen, setSubcourseModalOpen] = useState(false);
  const [targetSubcourseCourseId, setTargetSubcourseCourseId] = useState(null);
  const [editingSubcourse, setEditingSubcourse] = useState(null);

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

  // Delete Handlers
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this entire course domain? All modules and lessons will be removed.')) {
      try {
        const res = await adminCurriculumApi.deleteCourse(courseId);
        if (res.success) {
          fetchCourses();
          setExpandedCourses((prev) => {
            const next = { ...prev };
            delete next[courseId];
            return next;
          });
          if (onNotify) onNotify('Course domain deleted.');
        }
      } catch (e) {
        // ignore
      }
    }
  };

  const handleDeleteModule = async (courseId, moduleId) => {
    if (window.confirm('Delete this module and all its chapters/lessons?')) {
      try {
        const res = await adminCurriculumApi.deleteModule(moduleId);
        if (res.success) {
          refreshCourseDetails(courseId);
          if (onNotify) onNotify('Module deleted.');
        }
      } catch (e) {
        // ignore
      }
    }
  };

  const handleDeleteLesson = async (courseId, lessonId) => {
    if (window.confirm('Delete this chapter / lesson?')) {
      try {
        const res = await adminCurriculumApi.deleteLesson(lessonId);
        if (res.success) {
          refreshCourseDetails(courseId);
          if (onNotify) onNotify('Chapter / Lesson deleted.');
        }
      } catch (e) {
        // ignore
      }
    }
  };

  const handleDeleteQuiz = async (courseId, quizId) => {
    if (window.confirm('Delete this quiz assessment?')) {
      try {
        const res = await adminCurriculumApi.deleteQuiz(quizId);
        if (res.success) {
          refreshCourseDetails(courseId);
          if (onNotify) onNotify('Quiz deleted.');
        }
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Curriculum & Concepts Management</h2>
            <p className="text-xs text-slate-500">
              Manage 20 Domains, 4-Tier Roadmaps, Module Concepts, and Chapters/Lessons
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetToStandard}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title="Reset to 20 full domains with 4 tiers each"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Sync All 20 Domains</span>
          </button>

          <button
            onClick={() => {
              setEditingCourse(null);
              setCourseModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shadow-indigo-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Domain</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search domain title, slug, or concepts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
          />
        </form>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Categories</option>
            <option value="LANGUAGES">☕ Programming Languages</option>
            <option value="WEB_FRONTEND">🌐 Web Development</option>
            <option value="BACKEND_SYSTEMS">⚙️ Backend Systems</option>
            <option value="CS_CORE">💻 CS Core Fundamentals</option>
            <option value="DATA_AI">🤖 Data & AI</option>
            <option value="DEVOPS_CLOUD">☁️ Cloud & DevOps</option>
            <option value="SECURITY">🛡️ Cyber Security</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchCourses}
            className="text-xs font-bold underline hover:text-rose-900 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Courses List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-2xl">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
          <span>Loading curriculum catalogue...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-2xl">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-800 text-sm">No curriculum domains found</p>
          <p className="mt-1">Try resetting to standard 20 domains or creating a new one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => {
            const isExpanded = !!expandedCourses[course.id];
            const isDetailLoading = !!loadingDetails[course.id];
            const details = expandedCourses[course.id];

            return (
              <div
                key={course.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all"
              >
                {/* Course Header Row */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-3.5 flex-1 cursor-pointer" onClick={() => toggleCourseExpand(course.id)}>
                    <button
                      type="button"
                      className="mt-0.5 p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-transform"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg">{course.iconEmoji || '📘'}</span>
                        <h3 className="font-bold text-sm text-slate-900">{course.title}</h3>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCourseStatus(course.id, course.status);
                          }}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            course.status === 'PUBLISHED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {course.status}
                        </button>

                        <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                          {course.track}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {course.shortDescription || course.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                    <Link
                      to={`/courses/${course.slug || course.id}`}
                      target="_blank"
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
                      title="Preview on Public Web"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => {
                        setTargetCourseId(course.id);
                        setEditingModule(null);
                        setModuleModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold border border-emerald-200 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Module
                    </button>

                    <button
                      onClick={() => {
                        setEditingCourse(course);
                        setCourseModalOpen(true);
                      }}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                      title="Edit Domain Info"
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
                    
                    {/* 4 Subcourse Tiers Ribbon with Concepts & Edit Capabilities */}
                    {details?.subcourses && details.subcourses.length > 0 && (
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="flex items-center gap-1.5 text-slate-800">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            4-Tier Roadmap Hierarchy & Concepts:
                          </span>
                          <span className="text-emerald-700 font-bold">100% Free Tiers 1-3 • ₹29 Placement Ready</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          {details.subcourses.map((sub, sIdx) => (
                            <div
                              key={sIdx}
                              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all hover:shadow-xs ${
                                sub.curriculumLevel === 'PLACEMENT_READY'
                                  ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                                  : 'bg-slate-50/90 border-slate-200 text-slate-800'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1.5">
                                  <span className="font-bold text-[11.5px] text-slate-900 truncate">{sub.title}</span>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    {sub.curriculumLevel === 'PLACEMENT_READY' ? (
                                      <span className="text-[9px] bg-amber-600 text-white px-1.5 py-0.2 rounded font-extrabold">₹29</span>
                                    ) : (
                                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">FREE</span>
                                    )}
                                    <button
                                      onClick={() => {
                                        setTargetSubcourseCourseId(course.id);
                                        setEditingSubcourse(sub);
                                        setSubcourseModalOpen(true);
                                      }}
                                      className="p-1 hover:bg-slate-200/80 rounded-md text-slate-500 hover:text-indigo-600 transition-colors"
                                      title="Edit Tier Concepts"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {/* Concepts Covered in this Tier */}
                                <div className="mt-1.5 bg-white/80 rounded-lg p-2 border border-slate-200/60">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase block mb-0.5">
                                    Concepts Covered:
                                  </span>
                                  <p className="text-[10.5px] text-slate-600 line-clamp-3 leading-relaxed">
                                    {sub.description || 'No concepts defined yet.'}
                                  </p>
                                </div>
                              </div>

                              <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                                <span className="font-bold text-slate-500">Tier {sIdx + 1}</span>
                                <button
                                  onClick={() => {
                                    setTargetSubcourseCourseId(course.id);
                                    setEditingSubcourse(sub);
                                    setSubcourseModalOpen(true);
                                  }}
                                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3" /> Edit Concepts
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isDetailLoading && (
                      <div className="py-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" /> Loading modules, concepts and chapters...
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
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add First Module
                        </button>
                      </div>
                    )}

                    {/* Modules List */}
                    {!isDetailLoading && details?.modules?.map((mod) => (
                      <div
                        key={mod.id}
                        className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs"
                      >
                        {/* Module Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Layers className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-bold text-slate-900">{mod.title}</span>
                            
                            <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded font-bold">
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

                          <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
                            <button
                              onClick={() => {
                                setTargetModuleId(mod.id);
                                setEditingLesson(null);
                                setLessonModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" /> Add Chapter
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
                              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                              title="Edit Module & Concepts"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteModule(course.id, mod.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-800 rounded-lg cursor-pointer"
                              title="Delete Module"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Module Concepts Banner */}
                        {mod.description && (
                          <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-xl p-3 flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <div className="p-1 rounded-md bg-emerald-100 text-emerald-800 mt-0.5 flex-shrink-0">
                                <Lightbulb className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-0.5">
                                  Concepts Covered in this Module:
                                </span>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                  {mod.description}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setTargetCourseId(course.id);
                                setEditingModule(mod);
                                setModuleModalOpen(true);
                              }}
                              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 whitespace-nowrap flex items-center gap-1 py-1 px-2 hover:bg-emerald-100 rounded-lg transition-colors flex-shrink-0"
                            >
                              <Edit3 className="w-3 h-3" /> Edit Concepts
                            </button>
                          </div>
                        )}

                        {/* Chapters / Lessons & Quizzes in Module */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          
                          {/* Chapters Column */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                                Chapters / Lessons ({mod.lessons?.length || 0})
                              </div>
                              <button
                                onClick={() => {
                                  setTargetModuleId(mod.id);
                                  setEditingLesson(null);
                                  setLessonModalOpen(true);
                                }}
                                className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" /> Add Chapter
                              </button>
                            </div>

                            {(!mod.lessons || mod.lessons.length === 0) ? (
                              <div className="p-4 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
                                <p className="text-[11px] text-slate-400 mb-2">No chapters added yet to this module.</p>
                                <button
                                  onClick={() => {
                                    setTargetModuleId(mod.id);
                                    setEditingLesson(null);
                                    setLessonModalOpen(true);
                                  }}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" /> Add First Chapter
                                </button>
                              </div>
                            ) : (
                              mod.lessons.map((l, lIdx) => (
                                <div
                                  key={l.id}
                                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 flex items-center justify-between gap-2 text-xs transition-colors"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0">
                                      {l.orderIndex || lIdx + 1}
                                    </span>
                                    <span className="font-semibold text-slate-800 truncate">{l.title}</span>
                                    <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">⏱ {l.estimatedMinutes || 15}m</span>
                                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                                      {l.hinglishStatus === 'PUBLISHED' ? 'EN+HI 🇮🇳' : 'EN'}
                                    </span>
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
                                      title="Edit Chapter Content"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteLesson(course.id, l.id)}
                                      className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
                                      title="Delete Chapter"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Quizzes Column */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                                Quizzes ({mod.quizzes?.length || 0})
                              </div>
                              <button
                                onClick={() => {
                                  setTargetQuizModuleId(mod.id);
                                  setEditingQuizId(null);
                                  setQuizModalOpen(true);
                                }}
                                className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" /> Add Quiz
                              </button>
                            </div>

                            {(!mod.quizzes || mod.quizzes.length === 0) ? (
                              <p className="text-[11px] text-slate-400 italic p-3 bg-slate-50 rounded-xl border border-slate-100">No quizzes yet.</p>
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

      {subcourseModalOpen && (
        <AdminSubcourseModal
          isOpen={subcourseModalOpen}
          onClose={() => setSubcourseModalOpen(false)}
          courseId={targetSubcourseCourseId}
          subcourse={editingSubcourse}
          onSaved={() => {
            refreshCourseDetails(targetSubcourseCourseId);
            if (onNotify) onNotify('Tier concepts updated & synchronized with main website!');
          }}
        />
      )}

      {moduleModalOpen && (
        <AdminModuleModal
          isOpen={moduleModalOpen}
          onClose={() => setModuleModalOpen(false)}
          courseId={targetCourseId}
          module={editingModule}
          onSaved={() => {
            refreshCourseDetails(targetCourseId);
            if (onNotify) onNotify('Module & Concepts saved and synchronized!');
          }}
        />
      )}

      {lessonModalOpen && (
        <AdminLessonModal
          isOpen={lessonModalOpen}
          onClose={() => setLessonModalOpen(false)}
          moduleId={targetModuleId}
          lesson={editingLesson}
          onSaved={() => {
            if (targetCourseId) refreshCourseDetails(targetCourseId);
            fetchCourses();
            if (onNotify) onNotify('Chapter / Lesson saved and synchronized with Reader!');
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
            if (onNotify) onNotify('Quiz assessment saved.');
          }}
        />
      )}

    </div>
  );
};

export default AdminCurriculumManager;
