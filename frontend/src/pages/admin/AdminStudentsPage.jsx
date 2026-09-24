import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Award, 
  CreditCard, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchAdminStudents } from '../../services/adminManagementApi';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadStudents();
  }, [page, statusFilter]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminStudents({
        search,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        page,
        size: 15
      });
      setStudents(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadStudents();
  };

  return (
    <AdminLayout 
      title="Student Management"
      subtitle="View learner enrollment, progress tracking, quiz scores, payments, and certificates."
    >
      {/* ========================================================================= */}
      {/* 1. STUDENT METRICS CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Students</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111827]">{totalElements.toLocaleString()}</h3>
            <p className="text-xs font-medium text-[#667085] mt-1">Enrolled across 20 domains</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-bold uppercase tracking-wider">Active This Month</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111827]">{Math.round(totalElements * 0.72).toLocaleString()}</h3>
            <p className="text-xs font-semibold text-[#16A34A] mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12% active learners
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-bold uppercase tracking-wider">Placement Ready</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#F59E0B] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111827]">840</h3>
            <p className="text-xs font-medium text-[#667085] mt-1">₹29 paid entitlements</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-bold uppercase tracking-wider">Certificates Issued</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111827]">1,090</h3>
            <p className="text-xs font-medium text-[#667085] mt-1">₹9 verified certificates</p>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. FILTERS & SEARCH */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5E7EB] bg-[#F6F8FC] text-xs text-[#111827] focus:outline-none focus:border-[#4F46E5] focus:bg-white"
          />
        </form>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="py-2 px-3 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#4F46E5]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. STUDENTS TABLE */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        
        {loading ? (
          <div className="p-12 text-center text-xs text-[#667085]">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading students...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#667085]">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-[#111827] text-sm">No students found</p>
            <p className="mt-1">Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F6F8FC] text-[#667085] font-semibold">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Courses</th>
                  <th className="py-3 px-4">Lessons Done</th>
                  <th className="py-3 px-4">Quiz Attempts</th>
                  <th className="py-3 px-4">Certificates</th>
                  <th className="py-3 px-4">Total Spent</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#4F46E5] font-bold flex items-center justify-center text-xs border border-indigo-100">
                          {s.fullName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-[#111827]">{s.fullName}</p>
                          <p className="text-[11px] text-[#667085]">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#667085]">
                      {s.joinedAt ? new Date(s.joinedAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-3 px-4 font-semibold">{s.enrolledCoursesCount} Courses</td>
                    <td className="py-3 px-4 font-semibold text-indigo-600">{s.completedLessonsCount}</td>
                    <td className="py-3 px-4 font-medium">{s.quizAttemptsCount}</td>
                    <td className="py-3 px-4 font-medium">
                      {s.certificatesCount > 0 ? (
                        <span className="px-2 py-0.5 rounded font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200">
                          {s.certificatesCount} Issued
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#111827]">
                      {s.totalSpent > 0 ? `₹${s.totalSpent}` : '₹0'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/admin/students/${s.id}`}
                        className="py-1 px-2.5 rounded-lg border border-[#E5E7EB] hover:bg-indigo-50 hover:text-[#4F46E5] hover:border-indigo-200 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-between text-xs text-[#667085]">
          <span>Showing {students.length} of {totalElements} students</span>
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
    </AdminLayout>
  );
}
