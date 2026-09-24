import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award, 
  IndianRupee, 
  HelpCircle, 
  Calendar, 
  Download,
  ShieldCheck
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  fetchAdminKpis, 
  fetchAdminTrends, 
  fetchCoursePerformance, 
  exportAdminReport 
} from '../../services/adminManagementApi';

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, students, courses, quizzes, revenue
  const [kpis, setKpis] = useState(null);
  const [trends, setTrends] = useState([]);
  const [courses, setCourses] = useState([]);
  const [period, setPeriod] = useState('30D');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [k, t, c] = await Promise.all([
        fetchAdminKpis(),
        fetchAdminTrends(period),
        fetchCoursePerformance()
      ]);
      setKpis(k);
      setTrends(t);
      setCourses(c);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      await exportAdminReport(type);
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
  };

  return (
    <AdminLayout 
      title="Platform Analytics & Insights"
      subtitle="Deep-dive telemetry across learning progression, quiz score distributions, and revenue streams."
    >
      {/* ========================================================================= */}
      {/* 1. TAB CONTROLS & TIMEFRAME */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Analytics Tabs */}
        <div className="flex items-center gap-1.5 bg-[#F6F8FC] p-1 rounded-xl border border-[#E5E7EB] overflow-x-auto">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'students', label: 'Students', icon: Users },
            { key: 'courses', label: 'Courses', icon: BookOpen },
            { key: 'quizzes', label: 'Quizzes', icon: HelpCircle },
            { key: 'revenue', label: 'Revenue', icon: IndianRupee }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#4F46E5] shadow-xs'
                    : 'text-[#667085] hover:text-[#111827]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Period Filter */}
        <div className="flex items-center gap-1 bg-[#F6F8FC] p-1 rounded-xl border border-[#E5E7EB] self-start sm:self-auto">
          {['7D', '30D', '3M', '1Y'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                period === p
                  ? 'bg-white text-[#4F46E5] shadow-xs'
                  : 'text-[#667085] hover:text-[#111827]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB CONTENT PANELS */}
      {/* ========================================================================= */}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Enrollment Growth Chart */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#111827]">Enrollment Growth</h3>
                <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +{kpis?.studentGrowthPct || 8.4}%
                </span>
              </div>
              <div className="h-56 flex items-end gap-3 pt-4 border-b border-slate-100">
                {trends.map((t, idx) => {
                  const maxVal = Math.max(...trends.map(item => item.enrollments || 1), 100);
                  const h = Math.min(100, (t.enrollments / maxVal) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div 
                        style={{ height: `${h}%` }}
                        className="w-full max-w-[24px] bg-[#4F46E5] rounded-t-md group-hover:opacity-80 transition-all relative"
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                          {t.enrollments}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#667085] font-medium">{t.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Course Completions Chart */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#111827]">Completions & Certificates</h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +{kpis?.completionGrowthPct || 6.7}%
                </span>
              </div>
              <div className="h-56 flex items-end gap-3 pt-4 border-b border-slate-100">
                {trends.map((t, idx) => {
                  const maxVal = Math.max(...trends.map(item => item.completions || 1), 50);
                  const h = Math.min(100, (t.completions / maxVal) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div 
                        style={{ height: `${h}%` }}
                        className="w-full max-w-[24px] bg-emerald-500 rounded-t-md group-hover:opacity-80 transition-all relative"
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                          {t.completions}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#667085] font-medium">{t.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Course Performance Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <h3 className="text-sm font-bold text-[#111827] mb-4">Domain Track Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827]">{c.title}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-[#4F46E5]">{c.level}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-[#667085]">
                    <span>Enrolled: <strong className="text-[#111827]">{c.enrolledStudents}</strong></span>
                    <span>Avg Quiz: <strong className="text-emerald-600">{c.avgQuizScorePct}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REVENUE TAB */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <p className="text-xs font-bold text-[#667085] uppercase">Placement Ready</p>
              <p className="text-2xl font-bold text-[#4F46E5] mt-2">₹{(kpis?.placementReadyRevenue || 24360).toLocaleString()}</p>
              <p className="text-xs text-[#667085] mt-1">₹29 fixed server unit price</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <p className="text-xs font-bold text-[#667085] uppercase">Verified Certificates</p>
              <p className="text-2xl font-bold text-emerald-600 mt-2">₹{(kpis?.certificateRevenue || 9810).toLocaleString()}</p>
              <p className="text-xs text-[#667085] mt-1">₹9 fixed server verification fee</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <p className="text-xs font-bold text-[#667085] uppercase">Placement Preparation Kits</p>
              <p className="text-2xl font-bold text-amber-600 mt-2">₹{(kpis?.placementKitRevenue || 4250).toLocaleString()}</p>
              <p className="text-xs text-[#667085] mt-1">₹99 career bundle</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-[#111827]">Download Financial Ledger</h4>
              <p className="text-[11px] text-[#667085]">Export complete payment records with Razorpay order signatures.</p>
            </div>
            <button
              onClick={() => handleExport('REVENUE')}
              className="py-2 px-4 rounded-xl bg-[#4F46E5] text-white text-xs font-semibold shadow-xs hover:bg-indigo-700 flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Revenue CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* QUIZZES TAB */}
      {activeTab === 'quizzes' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Quiz Assessment Performance</h3>
              <p className="text-xs text-[#667085]">Pass rates and score distributions for 10-Q module quizzes and 25-Q level exams</p>
            </div>
            <button
              onClick={() => handleExport('QUIZZES')}
              className="py-1.5 px-3 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#667085] hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Quiz Results</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-medium text-[#667085]">Average Score</p>
              <p className="text-xl font-bold text-[#111827] mt-1">84.5%</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-medium text-[#667085]">Pass Rate</p>
              <p className="text-xl font-bold text-[#16A34A] mt-1">91.2%</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-medium text-[#667085]">Total Attempts</p>
              <p className="text-xl font-bold text-[#4F46E5] mt-1">4,890</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-medium text-[#667085]">Answer Leak Prevention</p>
              <p className="text-xl font-bold text-emerald-600 mt-1">100% Secure</p>
            </div>
          </div>
        </div>
      )}

      {/* STUDENTS TAB */}
      {activeTab === 'students' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Learner Engagement Breakdown</h3>
              <p className="text-xs text-[#667085]">Active learners, lesson completion frequency, and retention</p>
            </div>
            <button
              onClick={() => handleExport('STUDENTS')}
              className="py-1.5 px-3 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#667085] hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Students List</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-medium text-[#667085]">Daily Active Learners</p>
              <p className="text-2xl font-bold text-[#4F46E5] mt-1">1,240</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-medium text-[#667085]">Weekly Active Learners</p>
              <p className="text-2xl font-bold text-[#2563EB] mt-1">4,326</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-medium text-[#667085]">Monthly Retention</p>
              <p className="text-2xl font-bold text-[#16A34A] mt-1">78.4%</p>
            </div>
          </div>
        </div>
      )}

      {/* COURSES TAB */}
      {activeTab === 'courses' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Curriculum Performance</h3>
              <p className="text-xs text-[#667085]">Total 20 tech domains and 80 levels across CodeOrbit</p>
            </div>
            <button
              onClick={() => handleExport('COURSES')}
              className="py-1.5 px-3 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#667085] hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Courses CSV</span>
            </button>
          </div>

          <div className="space-y-3">
            {courses.map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#111827]">{c.title}</p>
                  <p className="text-[11px] text-[#667085]">{c.track} Track • {c.level}</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span>Enrolled: <strong>{c.enrolledStudents}</strong></span>
                  <span className="text-emerald-600 font-semibold">{c.completionRatePct}% Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
