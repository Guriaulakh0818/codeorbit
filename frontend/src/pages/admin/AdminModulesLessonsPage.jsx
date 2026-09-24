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
  FolderTree
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
        setSelectedModule(detail.modules[0]);
      } else {
        setSelectedModule(null);
      }
    } catch (err) {
      console.warn('Failed to load course detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveModule = async (moduleData) => {
    try {
      if (editingModule) {
        await updateModule(editingModule.id, moduleData);
      } else {
        await createModule(selectedCourseId, moduleData);
      }
      setModuleModalOpen(false);
      loadCourseDetail(selectedCourseId);
    } catch (err) {
      alert('Failed to save module: ' + err.message);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Delete this module and all its lessons?')) return;
    try {
      await deleteModule(moduleId);
      loadCourseDetail(selectedCourseId);
    } catch (err) {
      alert('Failed to delete module: ' + err.message);
    }
  };

  const handleSaveLesson = async (lessonData) => {
    try {
      if (editingLesson) {
        await updateLesson(editingLesson.id, lessonData);
      } else {
        await createLesson(selectedModule.id, lessonData);
      }
      setLessonModalOpen(false);
      loadCourseDetail(selectedCourseId);
    } catch (err) {
      alert('Failed to save lesson: ' + err.message);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await deleteLesson(lessonId);
      loadCourseDetail(selectedCourseId);
    } catch (err) {
      alert('Failed to delete lesson: ' + err.message);
    }
  };

  return (
    <AdminLayout 
      title="Modules & Lessons Editor"
      subtitle="Manage course hierarchy, bilingual English & Hinglish content, and sanitized Markdown rendering."
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
            className="w-full py-2 px-3 rounded-xl border border-[#E5E7EB] bg-[#F6F8FC] text-xs font-bold text-[#111827] focus:outline-none focus:border-[#4F46E5]"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.track} — {c.level})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setEditingModule(null); setModuleModalOpen(true); }}
            disabled={!selectedCourseId}
            className="py-2 px-3.5 rounded-xl bg-[#4F46E5] text-white text-xs font-semibold shadow-xs hover:bg-indigo-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Module</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SPLIT VIEW: MODULES LIST & LESSONS LIST */}
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
            <div className="p-8 text-center text-xs text-[#667085]">Loading modules...</div>
          ) : courseDetail?.modules?.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#667085]">
              No modules found. Click "+ Add Module" to start.
            </div>
          ) : (
            <div className="space-y-2">
              {courseDetail?.modules?.map((m, idx) => {
                const isSelected = selectedModule?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedModule(m)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50/70 border-[#4F46E5] text-[#111827] shadow-xs'
                        : 'bg-white border-[#E5E7EB] text-[#667085] hover:bg-slate-50 hover:text-[#111827]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="w-5 h-5 rounded bg-slate-200 text-[#111827] font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <p className="font-bold truncate">{m.title}</p>
                        <p className="text-[10px] text-[#667085]">{m.lessons?.length || 0} Lessons</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingModule(m); setModuleModalOpen(true); }}
                        className="p-1 hover:text-[#4F46E5] rounded"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteModule(m.id); }}
                        className="p-1 hover:text-[#DC2626] rounded"
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

        {/* Right: Lessons in Selected Module */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-6">
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                {selectedModule ? selectedModule.title : 'Select a Module'}
              </h3>
              <p className="text-xs text-[#667085] mt-0.5">
                Bilingual lessons with English and Hinglish content tabs
              </p>
            </div>

            {selectedModule && (
              <button
                onClick={() => { setEditingLesson(null); setLessonModalOpen(true); }}
                className="py-2 px-3.5 rounded-xl bg-[#4F46E5] text-white text-xs font-semibold shadow-xs hover:bg-indigo-700 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Lesson</span>
              </button>
            )}
          </div>

          {!selectedModule ? (
            <div className="p-12 text-center text-xs text-[#667085]">
              Select a module from the left list to view and manage lessons.
            </div>
          ) : selectedModule.lessons?.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#667085]">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-[#111827] text-sm">No lessons in this module</p>
              <p className="mt-1">Click "+ Create Lesson" to write English & Hinglish content.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedModule.lessons?.map((lesson, lIdx) => (
                <div 
                  key={lesson.id} 
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-white hover:border-[#4F46E5] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-white border border-slate-200 text-[#111827] font-bold text-xs flex items-center justify-center">
                      {lIdx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#111827]">{lesson.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[#667085]">
                        <span className="flex items-center gap-1 font-semibold text-indigo-600">
                          <Languages className="w-3 h-3" /> EN & Hinglish Ready
                        </span>
                        <span>•</span>
                        <span>{lesson.estimatedMinutes || 15} Mins Read</span>
                        <span>•</span>
                        <span className={`font-bold ${lesson.status === 'PUBLISHED' ? 'text-[#16A34A]' : 'text-slate-400'}`}>
                          {lesson.status || 'PUBLISHED'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingLesson(lesson); setLessonModalOpen(true); }}
                      className="py-1 px-2.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-indigo-50 hover:text-[#4F46E5] text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Content</span>
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-red-50 hover:text-[#DC2626]"
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

      {/* Module Modal */}
      {moduleModalOpen && (
        <AdminModuleModal
          isOpen={moduleModalOpen}
          module={editingModule}
          onClose={() => setModuleModalOpen(false)}
          onSave={handleSaveModule}
        />
      )}

      {/* Lesson Modal */}
      {lessonModalOpen && (
        <AdminLessonModal
          isOpen={lessonModalOpen}
          lesson={editingLesson}
          onClose={() => setLessonModalOpen(false)}
          onSave={handleSaveLesson}
        />
      )}
    </AdminLayout>
  );
}
