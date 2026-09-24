import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  CreditCard, 
  Award, 
  HelpCircle, 
  Clock, 
  Mail, 
  Calendar, 
  Shield, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchAdminStudentDetail } from '../../services/adminManagementApi';

export default function AdminStudentDetailPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, courses, quizzes, payments, certificates

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminStudentDetail(id);
      setStudent(data);
    } catch (err) {
      console.error('Failed to load student detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Student Details">
        <div className="p-12 text-center text-xs text-[#667085]">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Loading student profile...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!student) {
    return (
      <AdminLayout title="Student Details">
        <div className="p-12 text-center text-xs text-[#667085]">
          <p className="font-semibold text-[#111827] text-sm">Student not found</p>
          <Link to="/admin/students" className="mt-2 inline-block text-indigo-600 hover:underline">
            ← Back to Students
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title={student.fullName}
      subtitle={`Student ID #${student.id} • ${student.email}`}
    >
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          to="/admin/students"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#4F46E5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students List</span>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 1. STUDENT PROFILE HEADER CARD */}
      {/* ========================================================================= */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#4F46E5] text-white text-xl font-bold flex items-center justify-center shadow-md shadow-indigo-100">
              {student.fullName?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#111827]">{student.fullName}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200">
                  {student.status}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-[#4F46E5] border border-indigo-200">
                  {student.role}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#667085]">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{student.email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined {new Date(student.joinedAt).toLocaleDateString()}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Auth: {student.authProvider}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#F6F8FC] p-4 rounded-xl border border-[#E5E7EB]">
            <div>
              <p className="text-[11px] text-[#667085] uppercase font-bold tracking-wider">Total Invested</p>
              <p className="text-xl font-bold text-[#111827] mt-0.5">₹{student.totalSpent || 0}</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="text-[11px] text-[#667085] uppercase font-bold tracking-wider">Certificates</p>
              <p className="text-xl font-bold text-[#16A34A] mt-0.5">{student.certificates?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TABBED NAVIGATION */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] mb-6 overflow-x-auto pb-1">
        {[
          { key: 'overview', label: 'Overview', icon: Users },
          { key: 'courses', label: `Courses (${student.enrolledCourses?.length || 0})`, icon: BookOpen },
          { key: 'quizzes', label: `Quiz Attempts (${student.quizAttempts?.length || 0})`, icon: HelpCircle },
          { key: 'payments', label: `Payments (${student.payments?.length || 0})`, icon: CreditCard },
          { key: 'certificates', label: `Certificates (${student.certificates?.length || 0})`, icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#4F46E5] text-white shadow-xs'
                  : 'text-[#667085] hover:bg-slate-100 hover:text-[#111827]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB PANELS */}
      {/* ========================================================================= */}

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <h3 className="text-sm font-bold text-[#111827] mb-4">Active Course Progress</h3>
            <div className="space-y-4">
              {student.enrolledCourses?.map((c) => (
                <div key={c.courseId} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-[#111827]">
                    <span>{c.title}</span>
                    <span className="text-[#4F46E5]">{c.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div 
                      style={{ width: `${c.progressPercentage}%` }}
                      className="bg-[#4F46E5] h-full rounded-full"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#667085] mt-2">
                    <span>{c.completedLessons} / {c.totalLessons} Lessons Done</span>
                    <span>{c.track} Track</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <h3 className="text-sm font-bold text-[#111827] mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {student.payments?.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#111827]">{p.description}</p>
                    <p className="text-[11px] text-[#667085] mt-0.5">{new Date(p.createdAt).toLocaleDateString()} • {p.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#111827]">₹{p.amount}</p>
                    <span className="text-[10px] font-bold text-[#16A34A]">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: COURSES */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F6F8FC] text-[#667085] font-semibold">
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Lessons Completed</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Enrolled Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {student.enrolledCourses?.map((c) => (
                <tr key={c.courseId} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold">{c.title}</td>
                  <td className="py-3 px-4 text-[#667085]">{c.track}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-[#4F46E5]">
                      {c.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold">{c.completedLessons} / {c.totalLessons}</td>
                  <td className="py-3 px-4 font-bold text-[#4F46E5]">{c.progressPercentage}%</td>
                  <td className="py-3 px-4 text-[#667085]">{new Date(c.enrolledAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: QUIZZES */}
      {activeTab === 'quizzes' && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F6F8FC] text-[#667085] font-semibold">
                <th className="py-3 px-4">Quiz Title</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {student.quizAttempts?.map((q) => (
                <tr key={q.attemptId} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold">{q.quizTitle}</td>
                  <td className="py-3 px-4 text-[#667085]">{q.courseTitle}</td>
                  <td className="py-3 px-4 font-semibold">{q.score} / {q.totalQuestions}</td>
                  <td className="py-3 px-4 font-bold text-indigo-600">{q.percentage}%</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      q.passed ? 'bg-emerald-50 text-[#16A34A]' : 'bg-red-50 text-[#DC2626]'
                    }`}>
                      {q.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#667085]">{new Date(q.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F6F8FC] text-[#667085] font-semibold">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Product Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {student.payments?.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-medium">{p.id}</td>
                  <td className="py-3 px-4 font-bold">{p.description}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-[#667085]">
                      {p.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#111827]">₹{p.amount}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#667085]">{p.paymentId || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16A34A]">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#667085]">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F6F8FC] text-[#667085] font-semibold">
                <th className="py-3 px-4">Certificate Code</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Subject Track</th>
                <th className="py-3 px-4">Issued Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {student.certificates?.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">{c.certificateCode}</td>
                  <td className="py-3 px-4 font-bold">{c.courseTitle}</td>
                  <td className="py-3 px-4 text-[#667085]">{c.subject}</td>
                  <td className="py-3 px-4 text-[#667085]">{new Date(c.issuedAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={c.verificationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#4F46E5] hover:underline"
                    >
                      <span>Verify QR</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
