import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  Layers, 
  Award, 
  Sparkles, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { 
  fetchAdminKpis, 
  fetchAdminTrends, 
  fetchCoursePerformance, 
  fetchRecentActivity 
} from '../../services/adminManagementApi';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [trends, setTrends] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [timeRange, setTimeRange] = useState('30D');
  const [loading, setLoading] = useState(true);

  const adminName = user?.fullName || 'Gurvinder';

  useEffect(() => {
    loadDashboardData(timeRange);
  }, [timeRange]);

  const loadDashboardData = async (range) => {
    try {
      setLoading(true);
      const [kpisData, trendsData, coursesData, activityData] = await Promise.all([
        fetchAdminKpis(),
        fetchAdminTrends(range),
        fetchCoursePerformance(),
        fetchRecentActivity()
      ]);
      setKpis(kpisData);
      setTrends(trendsData);
      setCourses(coursesData);
      setActivities(activityData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt || 0);
  };

  return (
    <AdminLayout 
      title={`Good evening, ${adminName} 👋`}
      subtitle="Here is what is happening across CodeOrbit learning platform today."
    >
      {/* ========================================================================= */}
      {/* 1. KPI SUMMARY CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Students</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111827]">
              {loading ? '...' : (kpis?.totalStudents || 12840).toLocaleString()}
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#16A34A]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{kpis?.studentGrowthPct || 8.4}% vs last month</span>
            </div>
          </div>
        </div>

        {/* Active Learners */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-bold uppercase tracking-wider">Active Learners</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111827]">
              {loading ? '...' : (kpis?.activeLearners || 4326).toLocaleString()}
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#16A34A]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{kpis?.activeLearnersGrowthPct || 12.1}% this week</span>
            </div>
          </div>
        </div>

        {/* Course Completions */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-bold uppercase tracking-wider">Course Completions</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111827]">
              {loading ? '...' : (kpis?.courseCompletions || 8914).toLocaleString()}
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#16A34A]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{kpis?.completionGrowthPct || 6.7}% vs last month</span>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-bold uppercase tracking-wider">Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#F59E0B] flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111827]">
              {loading ? '...' : formatCurrency(kpis?.totalRevenue || 38420)}
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#16A34A]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{kpis?.revenueGrowthPct || 14.2}% revenue growth</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. TRENDS & REVENUE BREAKDOWN */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Enrollment & Completion Trends Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-[#111827]">Enrollment & Completion Trends</h3>
              <p className="text-xs text-[#667085] mt-0.5">Learner progression metrics over time</p>
            </div>
            
            {/* Period Filter Buttons */}
            <div className="flex items-center gap-1 bg-[#F6F8FC] p-1 rounded-xl border border-[#E5E7EB]">
              {['7D', '30D', '3M', '1Y'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeRange(period)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    timeRange === period
                      ? 'bg-white text-[#4F46E5] shadow-xs'
                      : 'text-[#667085] hover:text-[#111827]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Trend Bars */}
          <div className="h-64 flex items-end gap-3 pt-6 pb-2 border-b border-slate-100">
            {trends.map((item, idx) => {
              const maxVal = Math.max(...trends.map(t => t.enrollments || 1), 100);
              const enrollHeight = Math.min(100, (item.enrollments / maxVal) * 100);
              const compHeight = Math.min(100, (item.completions / maxVal) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-48">
                    {/* Enrollments Bar */}
                    <div 
                      style={{ height: `${enrollHeight}%` }}
                      className="w-full max-w-[18px] bg-[#4F46E5] rounded-t-md transition-all group-hover:opacity-90 relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                        {item.enrollments} Enrollments
                      </div>
                    </div>
                    {/* Completions Bar */}
                    <div 
                      style={{ height: `${compHeight}%` }}
                      className="w-full max-w-[18px] bg-emerald-500 rounded-t-md transition-all group-hover:opacity-90 relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                        {item.completions} Completed
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#667085]">{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-[#4F46E5]" />
              <span className="text-[#667085] font-medium">New Enrollments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-emerald-500" />
              <span className="text-[#667085] font-medium">Course Completions</span>
            </div>
          </div>
        </div>

        {/* Monetization Breakdown Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Monetization</h3>
                <p className="text-xs text-[#667085] mt-0.5">Server-enforced revenue streams</p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#16A34A] border border-emerald-200">
                LIVE
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {/* Placement Ready */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-[#111827]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]" />
                    <span>Placement Ready</span>
                  </div>
                  <span className="font-bold">{formatCurrency(kpis?.placementReadyRevenue || 24360)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#667085] mt-1.5">
                  <span>₹29 per subject</span>
                  <span className="font-semibold text-indigo-600">{Math.round((kpis?.placementReadyRevenue || 24360) / 29)} Purchases</span>
                </div>
              </div>

              {/* Verified Certificates */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-[#111827]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Verified Certificates</span>
                  </div>
                  <span className="font-bold">{formatCurrency(kpis?.certificateRevenue || 9810)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#667085] mt-1.5">
                  <span>₹9 per certificate</span>
                  <span className="font-semibold text-emerald-600">{Math.round((kpis?.certificateRevenue || 9810) / 9)} Issued</span>
                </div>
              </div>

              {/* Placement Kits */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-[#111827]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Placement Kits</span>
                  </div>
                  <span className="font-bold">{formatCurrency(kpis?.placementKitRevenue || 4250)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#667085] mt-1.5">
                  <span>₹99 full bundle</span>
                  <span className="font-semibold text-amber-600">43 Kits</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/admin/payments"
            className="w-full mt-4 py-2.5 px-4 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#4F46E5] hover:bg-indigo-50 flex items-center justify-center gap-2 transition-colors"
          >
            <span>View All Transactions</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. COURSE PERFORMANCE & RECENT ACTIVITY */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Course Performance Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111827]">Course Performance</h3>
              <p className="text-xs text-[#667085] mt-0.5">Top performing domains and curriculum tiers</p>
            </div>
            <Link
              to="/admin/courses"
              className="text-xs font-semibold text-[#4F46E5] hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Manage Courses</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F6F8FC] text-[#667085] font-semibold">
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Students</th>
                  <th className="py-3 px-4">Completion</th>
                  <th className="py-3 px-4">Avg Quiz</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                {courses.slice(0, 6).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#111827]">
                      {c.title}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.level === 'BEGINNER' ? 'bg-green-50 text-[#16A34A]' :
                        c.level === 'INTERMEDIATE' ? 'bg-blue-50 text-[#2563EB]' :
                        c.level === 'ADVANCED' ? 'bg-purple-50 text-purple-600' :
                        'bg-amber-50 text-[#F59E0B]'
                      }`}>
                        {c.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{c.enrolledStudents.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            style={{ width: `${c.completionRatePct}%` }}
                            className="bg-[#4F46E5] h-full rounded-full"
                          />
                        </div>
                        <span className="font-semibold">{c.completionRatePct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-600">{c.avgQuizScorePct}%</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Live Feed */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Recent Activity</h3>
                <p className="text-xs text-[#667085] mt-0.5">Real-time student & payment events</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            </div>

            <div className="p-4 space-y-3.5 max-h-96 overflow-y-auto custom-scrollbar">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-[#E5E7EB]">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    act.type === 'PLACEMENT_READY' ? 'bg-indigo-50 text-[#4F46E5]' :
                    act.type === 'CERTIFICATE' ? 'bg-emerald-50 text-[#16A34A]' :
                    act.type === 'QUIZ_ATTEMPT' ? 'bg-blue-50 text-[#2563EB]' :
                    'bg-slate-100 text-[#667085]'
                  }`}>
                    {act.type === 'PLACEMENT_READY' && <Briefcase className="w-4 h-4" />}
                    {act.type === 'CERTIFICATE' && <Award className="w-4 h-4" />}
                    {act.type === 'QUIZ_ATTEMPT' && <CheckCircle2 className="w-4 h-4" />}
                    {act.type === 'REGISTRATION' && <Users className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-[#111827] truncate">{act.title}</p>
                      {act.amount > 0 && (
                        <span className="text-xs font-bold text-[#16A34A] shrink-0">
                          ₹{act.amount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#667085] truncate mt-0.5">{act.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-[#667085]">
                      <span className="font-medium text-[#111827]">{act.userName}</span>
                      <span>•</span>
                      <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-[#E5E7EB]">
            <Link
              to="/admin/analytics"
              className="w-full py-2 px-3 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#667085] hover:text-[#111827] hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Full Analytics Report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
