import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Languages, 
  CheckCircle2, 
  FileText, 
  ChevronRight,
  FolderTree,
  Lightbulb,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminModuleModal from '../../components/admin/AdminModuleModal';
import AdminLessonModal from '../../components/admin/AdminLessonModal';
import { 
  fetchAdminCourses, 
  fetchAdminCourseById, 
  createModule, 
  updateModule, 
  deleteModule, 
  createLesson, 
  updateLesson, 
  deleteLesson,
  TECH_DOMAINS 
} from '../../services/adminCurriculumApi';

export default function AdminModulesLessonsPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [courseDetail, setCourseDetail] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modals
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);

  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadCourseDetail(selectedCourseId);
    }
  }, [selectedCourseId]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminCourses({ size: 100 });
      const list = res.content || [];
      setCourses(list);
      if (list.length > 0) {
        setSelectedCourseId(list[0].id);
      }
    } catch (err) {
      console.warn('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseDetail = async (id) => {
    try {
      setLoading(true);
      const detail = await fetchAdminCourseById(id);
      setCourseDetail(detail);
      if (detail?.modules?.length > 0) {
        // Keep currently selected module if it still exists, else pick first
        setSelectedModule((prev) => {
          if (!prev) return detail.modules[0];
          const found = detail.modules.find((m) => m.id === prev.id);
          return found || detail.modules[0];
        });
      } else {
        setSelectedModule(null);
      }
    } catch (err) {
      console.warn('Failed to load course detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveModule = () => {
    setModuleModalOpen(false);
    loadCourseDetail(selectedCourseId);
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Delete this module and all its chapters/lessons?')) return;
    try {
      await deleteModule(moduleId);
      loadCourseDetail(selectedCourseId);
    } catch (err) {
      alert('Failed to delete module: ' + err.message);
    }
  };

  const handleSaveLesson = () => {
    setLessonModalOpen(false);
    loadCourseDetail(selectedCourseId);
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this chapter / lesson?')) return;
    try {
      await deleteLesson(lessonId);
      loadCourseDetail(selectedCourseId);
    } catch (err) {
      alert('Failed to delete chapter: ' + err.message);
    }
  };

  return (
    <AdminLayout 
      title="Modules, Concepts & Chapters Editor"
      subtitle="Configure module concepts, roadmap tiers, and bilingual chapters synced live with the web app."
    >
      {/* ========================================================================= */}
      {/* 1. COURSE SELECTOR BAR */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <BookOpen className="w-5 h-5 text-[#4F46E5] shrink-0" />
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full py-2.5 px-3.5 rounded-xl border border-[#E5E7EB] bg-[#F6F8FC] text-xs font-bold text-[#111827] focus:outline-none focus:border-[#4F46E5]"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.iconEmoji || '📘'} {c.title} ({c.track} — {c.difficultyLevel || c.level || 'All Tiers'})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setEditingModule(null); setModuleModalOpen(true); }}
            disabled={!selectedCourseId}
            className="py-2.5 px-4 rounded-xl bg-[#4F46E5] text-white text-xs font-bold shadow-xs hover:bg-indigo-700 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Module</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SPLIT VIEW: MODULES LIST & CHAPTERS LIST */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Modules Tree */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-4">
            <h3 className="text-sm font-bold text-[#111827]">Course Modules</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-[#4F46E5]">
              {courseDetail?.modules?.length || 0} Modules
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#667085]">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-600" />
              <span>Loading modules...</span>
            </div>
          ) : !courseDetail?.modules || courseDetail.modules.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#667085]">
              No modules found. Click "+ Add Module" to start.
            </div>
          ) : (
            <div className="space-y-2.5">
              {courseDetail.modules.map((m, idx) => {
                const isSelected = selectedModule?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedModule(m)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-indigo-50/80 border-[#4F46E5] text-[#111827] shadow-xs ring-1 ring-indigo-500/20'
                        : 'bg-white border-[#E5E7EB] text-[#667085] hover:bg-slate-50 hover:text-[#111827]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 overflow-hidden flex-1">
                      <span className={`w-5 h-5 rounded-md text-[10px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {m.orderIndex || idx + 1}
                      </span>
                      <div className="truncate flex-1">
                        <p className="font-bold truncate text-slate-900">{m.title}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500">
                          <span className="font-semibold text-indigo-600">{m.curriculumLevel || 'BEGINNER'}</span>
                          <span>•</span>
                          <span>{m.lessons?.length || 0} Chapters</span>
                        </div>
                        {m.description && (
                          <p className="text-[10px] text-slate-400 truncate mt-1">
                            {m.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingModule(m); setModuleModalOpen(true); }}
                        className="p-1 hover:text-[#4F46E5] hover:bg-slate-100 rounded"
                        title="Edit Module & Concepts"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteModule(m.id); }}
                        className="p-1 hover:text-[#DC2626] hover:bg-red-50 rounded"
                        title="Delete Module"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Module Detail & Chapters */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-6 space-y-5">
          
          {/* Module Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#111827]">
                  {selectedModule ? selectedModule.title : 'Select a Module'}
                </h3>
                {selectedModule && (
                  <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">
                    {selectedModule.curriculumLevel || 'BEGINNER'}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#667085] mt-0.5">
                Bilingual chapters with English, Hinglish, code snippets, and live preview
              </p>
            </div>

            {selectedModule && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditingModule(selectedModule); setModuleModalOpen(true); }}
                  className="py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Concepts</span>
                </button>
                <button
                  onClick={() => { setEditingLesson(null); setLessonModalOpen(true); }}
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Chapter</span>
                </button>
              </div>
            )}
          </div>

          {!selectedModule ? (
            <div className="p-12 text-center text-xs text-[#667085]">
              Select a module from the left list to view concepts and manage chapters.
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Module Concepts Banner */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                      Module Concepts Covered:
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {selectedModule.description || 'No concepts description specified yet. Click "Edit Concepts" to add.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setEditingModule(selectedModule); setModuleModalOpen(true); }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 shrink-0 inline-flex items-center gap-1 p-1.5 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
              </div>

              {/* Chapters List */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-1">
                  <span>Chapters in this Module ({selectedModule.lessons?.length || 0})</span>
                  <span className="text-[11px] text-slate-400 font-normal">Auto-synced with reader</span>
                </div>

                {(!selectedModule.lessons || selectedModule.lessons.length === 0) ? (
                  <div className="p-10 text-center text-xs text-[#667085] bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-[#111827] text-sm">No chapters in this module</p>
                    <p className="mt-1 mb-3">Click "+ Add Chapter" to add bilingual chapters with code snippets.</p>
                    <button
                      onClick={() => { setEditingLesson(null); setLessonModalOpen(true); }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Chapter</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedModule.lessons.map((lesson, lIdx) => (
                      <div 
                        key={lesson.id} 
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-white hover:border-[#4F46E5] hover:shadow-xs transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-white border border-slate-200 text-[#111827] font-bold text-xs flex items-center justify-center font-mono">
                            {lesson.orderIndex || lIdx + 1}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-[#111827]">{lesson.title}</p>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-[#667085]">
                              <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                <Languages className="w-3 h-3" /> {lesson.hinglishStatus === 'PUBLISHED' ? 'EN + Hinglish 🇮🇳' : 'English Only'}
                              </span>
                              <span>•</span>
                              <span>⏱ {lesson.estimatedMinutes || 15} Mins Read</span>
                              <span>•</span>
                              <span className={`font-bold ${lesson.status === 'PUBLISHED' ? 'text-[#16A34A]' : 'text-amber-600'}`}>
                                {lesson.status || 'PUBLISHED'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setEditingLesson(lesson); setLessonModalOpen(true); }}
                            className="py-1.5 px-3 rounded-lg border border-[#E5E7EB] bg-white hover:bg-indigo-50 hover:text-[#4F46E5] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Chapter</span>
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-red-50 hover:text-[#DC2626] transition-colors cursor-pointer"
                            title="Delete Chapter"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Module Modal */}
      {moduleModalOpen && (
        <AdminModuleModal
          isOpen={moduleModalOpen}
          courseId={selectedCourseId}
          module={editingModule}
          onClose={() => setModuleModalOpen(false)}
          onSaved={handleSaveModule}
        />
      )}

      {/* Lesson Modal */}
      {lessonModalOpen && (
        <AdminLessonModal
          isOpen={lessonModalOpen}
          moduleId={selectedModule?.id}
          lesson={editingLesson}
          onClose={() => setLessonModalOpen(false)}
          onSaved={handleSaveLesson}
        />
      )}
    </AdminLayout>
  );
}
