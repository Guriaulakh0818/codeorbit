import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Filter, 
  Layers, 
  BookOpen, 
  HelpCircle, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Eye,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminCurriculumApi } from '../../services/adminCurriculumApi';
import { AdminCourseModal } from './AdminCourseModal';
import { AdminModuleModal } from './AdminModuleModal';
import { AdminLessonModal } from './AdminLessonModal';
import { AdminQuizModal } from './AdminQuizModal';

export const AdminCurriculumManager = () => {
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
      setError('Could not connect to backend server.');
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

  // Delete handlers
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course and all its modules, lessons, and quizzes? This action cannot be undone.')) return;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-sky-400" />
            Curriculum & Course Tracks
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Author and publish courses, modules, bilingual lessons, and interactive quizzes.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCourse(null);
            setCourseModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-brand-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add New Course Track
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses by title or slug..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-2xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-sky-400"
          >
            <option value="ALL">All Tracks</option>
            <option value="DSA">DSA</option>
            <option value="SYSTEM_DESIGN">System Design</option>
            <option value="JAVA">Java</option>
            <option value="PYTHON">Python</option>
            <option value="WEB_DEV">Web Development</option>
            <option value="DBMS">DBMS</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-2xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-sky-400"
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>

          <button
            onClick={fetchCourses}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-2xl text-slate-400 hover:text-white transition-colors"
            title="Refresh Courses"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 p-4 rounded-2xl text-xs text-rose-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 h-28" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && courses.length === 0 && (
        <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No Courses Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Get started by creating your first course track for computer science engineering students.
          </p>
        </div>
      )}

      {/* Hierarchical Course List */}
      {!loading && courses.length > 0 && (
        <div className="space-y-4">
          {courses.map((course) => {
            const isExpanded = !!expandedCourses[course.id];
            const details = expandedCourses[course.id];
            const isDetailLoading = !!loadingDetails[course.id];

            return (
              <div
                key={course.id}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-3xl overflow-hidden transition-all shadow-xl"
              >
                {/* Course Header Bar */}
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 cursor-pointer" onClick={() => toggleCourseExpand(course.id)}>
                    <button className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 mt-0.5">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm sm:text-base font-black text-white">{course.title}</span>
                        
                        {/* Status Badge */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCourseStatus(course.id, course.status);
                          }}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                            course.status === 'PUBLISHED'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                          }`}
                        >
                          {course.status}
                        </button>

                        <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                          {course.track}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-1">{course.shortDescription || course.description}</p>
                    </div>
                  </div>

                  {/* Course Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                    <Link
                      to={`/courses/${course.slug}`}
                      target="_blank"
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-xl transition-colors"
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Module
                    </button>

                    <button
                      onClick={() => {
                        setEditingCourse(course);
                        setCourseModalOpen(true);
                      }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                      title="Edit Course Metadata"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Modules & Content Tree */}
                {isExpanded && (
                  <div className="border-t border-slate-800/80 bg-slate-950/70 p-5 sm:p-6 space-y-4">
                    {isDetailLoading && (
                      <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-sky-400" /> Loading modules and lessons...
                      </div>
                    )}

                    {!isDetailLoading && details?.modules?.length === 0 && (
                      <div className="py-6 text-center text-xs text-slate-400 space-y-2">
                        <p>No modules created in this course track yet.</p>
                        <button
                          onClick={() => {
                            setTargetCourseId(course.id);
                            setEditingModule(null);
                            setModuleModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold"
                        >
                          Add First Module
                        </button>
                      </div>
                    )}

                    {!isDetailLoading && details?.modules?.map((mod) => (
                      <div
                        key={mod.id}
                        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-md"
                      >
                        {/* Module Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-bold text-white">{mod.title}</span>
                            
                            <button
                              onClick={() => handleToggleModuleStatus(course.id, mod.id, mod.status)}
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                mod.status === 'PUBLISHED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
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
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 rounded-lg text-[11px] font-semibold border border-sky-500/30"
                            >
                              <Plus className="w-3 h-3" /> Lesson
                            </button>

                            <button
                              onClick={() => {
                                setTargetQuizModuleId(mod.id);
                                setEditingQuizId(null);
                                setQuizModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg text-[11px] font-semibold border border-purple-500/30"
                            >
                              <Plus className="w-3 h-3" /> Quiz
                            </button>

                            <button
                              onClick={() => {
                                setTargetCourseId(course.id);
                                setEditingModule(mod);
                                setModuleModalOpen(true);
                              }}
                              className="p-1 text-slate-400 hover:text-white"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteModule(course.id, mod.id)}
                              className="p-1 text-rose-400 hover:text-rose-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Lessons & Quizzes in Module */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          
                          {/* Lessons Column */}
                          <div className="space-y-2">
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                              Lessons ({mod.lessons?.length || 0})
                            </div>

                            {mod.lessons?.length === 0 ? (
                              <p className="text-[11px] text-slate-400 italic">No lessons yet.</p>
                            ) : (
                              mod.lessons?.map((l) => (
                                <div
                                  key={l.id}
                                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="font-semibold text-slate-200 truncate">{l.title}</span>
                                    <span className="text-[10px] text-slate-400">{l.estimatedMinutes}m</span>
                                    {l.hasHinglish && (
                                      <span className="bg-purple-500/20 text-purple-300 text-[9px] px-1.5 py-0.2 rounded">Hinglish</span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                      onClick={() => handleToggleLessonStatus(course.id, l.id, l.status)}
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                        l.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-950/60' : 'text-amber-400 bg-amber-950/60'
                                      }`}
                                    >
                                      {l.status}
                                    </button>

                                    <button
                                      onClick={async () => {
                                        const res = await adminCurriculumApi.getLessonById(l.id);
                                        if (res.success) {
                                          setEditingLesson(res.data);
                                          setTargetModuleId(mod.id);
                                          setLessonModalOpen(true);
                                        }
                                      }}
                                      className="p-1 text-slate-400 hover:text-white"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteLesson(course.id, l.id)}
                                      className="p-1 text-rose-400 hover:text-rose-300"
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
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                              Quizzes ({mod.quizzes?.length || 0})
                            </div>

                            {mod.quizzes?.length === 0 ? (
                              <p className="text-[11px] text-slate-400 italic">No quiz created.</p>
                            ) : (
                              mod.quizzes?.map((q) => (
                                <div
                                  key={q.id}
                                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="font-semibold text-purple-200 truncate">{q.title}</span>
                                    <span className="text-[10px] text-slate-400">{q.questionCount} Qs</span>
                                    <span className="text-[10px] text-emerald-400">{q.minPassScorePercentage}% Pass</span>
                                  </div>

                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                      onClick={() => handleToggleQuizStatus(course.id, q.id, q.status)}
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                        q.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-950/60' : 'text-amber-400 bg-amber-950/60'
                                      }`}
                                    >
                                      {q.status}
                                    </button>

                                    <button
                                      onClick={() => {
                                        setEditingQuizId(q.id);
                                        setTargetQuizModuleId(mod.id);
                                        setQuizModalOpen(true);
                                      }}
                                      className="p-1 text-slate-400 hover:text-white"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteQuiz(course.id, q.id)}
                                      className="p-1 text-rose-400 hover:text-rose-300"
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
      <AdminCourseModal
        isOpen={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        course={editingCourse}
        onSaved={fetchCourses}
      />

      <AdminModuleModal
        isOpen={moduleModalOpen}
        onClose={() => setModuleModalOpen(false)}
        courseId={targetCourseId}
        module={editingModule}
        onSaved={() => refreshCourseDetails(targetCourseId)}
      />

      <AdminLessonModal
        isOpen={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        moduleId={targetModuleId}
        lesson={editingLesson}
        onSaved={() => {
          // find courseId
          const cId = Object.keys(expandedCourses).find((cId) =>
            expandedCourses[cId]?.modules?.some((m) => m.id === targetModuleId)
          );
          if (cId) refreshCourseDetails(cId);
        }}
      />

      <AdminQuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        moduleId={targetQuizModuleId}
        quizId={editingQuizId}
        onSaved={() => {
          const cId = Object.keys(expandedCourses).find((cId) =>
            expandedCourses[cId]?.modules?.some((m) => m.id === targetQuizModuleId)
          );
          if (cId) refreshCourseDetails(cId);
        }}
      />

    </div>
  );
};
