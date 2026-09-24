import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Users, 
  BookOpen, 
  HelpCircle, 
  IndianRupee, 
  Award, 
  CheckCircle2, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { exportAdminReport } from '../../services/adminManagementApi';

export default function AdminReportsPage() {
  const [downloading, setDownloading] = useState(null);

  const reportTypes = [
    {
      id: 'STUDENTS',
      title: 'Student Directory & Progress Report',
      description: 'Complete export of registered students, enrollment counts, completed lessons, and account status.',
      icon: Users,
      color: 'bg-indigo-50 text-[#4F46E5] border-indigo-200'
    },
    {
      id: 'COURSES',
      title: 'Course & Curriculum Catalog Report',
      description: 'Audit report of all 20 domains, 80 tiers, modules, lessons, and publishing statuses.',
      icon: BookOpen,
      color: 'bg-blue-50 text-[#2563EB] border-blue-200'
    },
    {
      id: 'REVENUE',
      title: 'Financial Revenue & Gateway Ledger',
      description: 'Transaction ledger for ₹29 Placement Ready, ₹9 Certificates, and ₹99 Kits with Razorpay payment IDs.',
      icon: IndianRupee,
      color: 'bg-emerald-50 text-[#16A34A] border-emerald-200'
    },
    {
      id: 'CERTIFICATES',
      title: 'Issued Certificates & Verification Audit',
      description: 'List of all issued verified certificates, certificate codes, recipients, and verification URLs.',
      icon: Award,
      color: 'bg-amber-50 text-[#F59E0B] border-amber-200'
    },
    {
      id: 'QUIZZES',
      title: 'Quiz Assessment Results & Pass Rates',
      description: 'Detailed attempt logs for 10-question module quizzes and 25-question level final exams.',
      icon: HelpCircle,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    }
  ];

  const handleDownload = async (typeId) => {
    try {
      setDownloading(typeId);
      await exportAdminReport(typeId);
    } catch (err) {
      alert('Failed to generate export: ' + err.message);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <AdminLayout 
      title="Reports & Exports"
      subtitle="Generate and download database-backed CSV reports for operational and financial auditing."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        {reportTypes.map((r) => {
          const Icon = r.icon;
          const isCurrentDownloading = downloading === r.id;
          return (
            <div 
              key={r.id} 
              className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${r.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827]">{r.title}</h3>
                    <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">CSV Export</span>
                  </div>
                </div>
                <p className="text-xs text-[#667085] mt-3 leading-relaxed">
                  {r.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                <span className="text-[11px] text-[#667085] font-medium">Real-time database export</span>
                <button
                  onClick={() => handleDownload(r.id)}
                  disabled={isCurrentDownloading}
                  className="py-2 px-3.5 rounded-xl bg-[#4F46E5] text-white text-xs font-semibold shadow-xs hover:bg-indigo-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isCurrentDownloading ? 'Exporting...' : 'Download CSV'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
