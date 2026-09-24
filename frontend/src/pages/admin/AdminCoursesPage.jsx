import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  FolderGit2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCourseModal from '../../components/admin/AdminCourseModal';
import { 
  fetchAdminCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse, 
  updateCourseStatus,
  TECH_DOMAINS 
} from '../../services/adminCurriculumApi';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    loadCourses();
  }, [page, selectedTrack, selectedLevel, selectedStatus]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminCourses({
        search,
        track: selectedTrack !== 'ALL' ? selectedTrack : undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        page,
        size: 15
      });
      setCourses(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      console.error('Failed to load admin courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadCourses();
  };

  const handleCreateNew = () => {
    setEditingCourse(null);
    setModalOpen(true);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setModalOpen(true);
  };

  const handleSaveCourse = async (courseData) => {
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData);
      } else {
        await createCourse(courseData);
      }
      setModalOpen(false);
      loadCourses();
    } catch (err) {
      alert('Error saving course: ' + err.message);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteCourse(courseId);
      loadCourses();
    } catch (err) {
      alert('Failed to delete course: ' + err.message);
    }
  };

  const handleToggleStatus = async (course) => {
    const newStatus = course.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await updateCourseStatus(course.id, newStatus);
      loadCourses();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const filteredCourses = courses.filter((c) => {
    if (selectedLevel !== 'ALL' && c.level !== selectedLevel) return false;
    return true;
  });

  return (
    <AdminLayout 
      title="Course Management"
      subtitle="Manage curriculum catalog, 20 domain tracks, 80 tiers, and publishing status."
    >
      {/* ========================================================================= */}
      {/* 1. TOP CONTROLS & ACTIONS */}
      {/* ========================================================================= */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search & Domain Filter */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <form onSubmit={handleSearchSubmit} className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by course title or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5E7EB] bg-[#F6F8FC] text-xs text-[#111827] focus:outline-none focus:border-[#4F46E5] focus:bg-white"
            />
          </form>

          {/* Domain Track Dropdown */}
          <select
            value={selectedTrack}
            onChange={(e) => { setSelectedTrack(e.target.value); setPage(0); }}
            className="py-2 px-3 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#4F46E5]"
          >
            <option value="ALL">All 20 Domains</option>
            {TECH_DOMAINS.map(t => (
              <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
            ))}
          </select>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="py-2 px-3 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#4F46E5]"
          >
            <option value="ALL">All Levels</option>
            <option value="BEGINNER">Beginner (Free)</option>
            <option value="INTERMEDIATE">Intermediate (Free)</option>
            <option value="ADVANCED">Advanced (Free)</option>
            <option value="PLACEMENT_READY">Placement Ready (₹29)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setPage(0); }}
            className="py-2 px-3 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#4F46E5]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/curriculum"
            className="py-2 px-3.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#667085] hover:text-[#111827] hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <FolderGit2 className="w-4 h-4 text-indigo-500" />
            <span>Curriculum Tree</span>
          </Link>
          <button
            onClick={handleCreateNew}
            className="py-2 px-4 rounded-xl bg-[#4F46E5] text-white text-xs font-semibold shadow-xs shadow-indigo-200 hover:bg-indigo-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. COURSES DATA TABLE */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        
        {loading ? (
          <div className="p-12 text-center text-xs text-[#667085]">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading courses from database...</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#667085]">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-[#111827] text-sm">No courses found</p>
            <p className="mt-1">Try adjusting your filters or create a new course.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F6F8FC] text-[#667085] font-semibold">
                  <th className="py-3 px-4">Course Title & Domain</th>
                  <th className="py-3 px-4">Tier / Level</th>
                  <th className="py-3 px-4">Modules</th>
                  <th className="py-3 px-4">Lessons</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Title & Domain */}
                    <td className="py-3 px-4 font-semibold text-[#111827]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-sm">
                          {c.thumbnailUrl?.length === 2 ? c.thumbnailUrl : '📘'}
                        </div>
                        <div>
                          <p className="font-bold text-[#111827]">{c.title}</p>
                          <p className="text-[11px] text-[#667085] font-medium">{c.track} Track</p>
                        </div>
                      </div>
                    </td>

                    {/* Level Badge */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.level === 'BEGINNER' ? 'bg-green-50 text-[#16A34A] border border-green-200' :
                        c.level === 'INTERMEDIATE' ? 'bg-blue-50 text-[#2563EB] border border-blue-200' :
                        c.level === 'ADVANCED' ? 'bg-purple-50 text-purple-600 border border-purple-200' :
                        'bg-amber-50 text-[#F59E0B] border border-amber-200'
                      }`}>
                        {c.level?.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Modules & Lessons count */}
                    <td className="py-3 px-4 font-medium">{c.moduleCount || 10}</td>
                    <td className="py-3 px-4 font-medium">{c.lessonCount || 80}</td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      {c.paid ? (
                        <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          ₹29
                        </span>
                      ) : (
                        <span className="font-semibold text-emerald-600">
                          Free
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(c)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                          c.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-[#16A34A] border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-[#667085] border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {c.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/courses/${c.slug || c.id}`}
                          target="_blank"
                          title="View on site"
                          className="p-1.5 text-[#667085] hover:text-[#4F46E5] hover:bg-slate-100 rounded-lg"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleEdit(c)}
                          title="Edit Course"
                          className="p-1.5 text-[#667085] hover:text-[#4F46E5] hover:bg-slate-100 rounded-lg"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          title="Delete Course"
                          className="p-1.5 text-[#667085] hover:text-[#DC2626] hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-between text-xs text-[#667085]">
          <span>Showing {filteredCourses.length} of {totalElements} courses</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              className="px-3 py-1 rounded-lg border border-[#E5E7EB] bg-white disabled:opacity-50 font-medium"
            >
              Previous
            </button>
            <span className="font-semibold text-[#111827]">Page {page + 1} of {Math.max(1, totalPages)}</span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 rounded-lg border border-[#E5E7EB] bg-white disabled:opacity-50 font-medium"
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* Course Modal */}
      {modalOpen && (
        <AdminCourseModal
          isOpen={modalOpen}
          course={editingCourse}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveCourse}
        />
      )}

    </AdminLayout>
  );
}
