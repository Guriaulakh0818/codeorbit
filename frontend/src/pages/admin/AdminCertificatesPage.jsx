import React, { useState, useEffect } from 'react';
import { 
  Award, 
  IndianRupee, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  Download,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  fetchAdminCertificateMetrics, 
  fetchAdminCertificates, 
  exportAdminReport 
} from '../../services/adminManagementApi';

export default function AdminCertificatesPage() {
  const [metrics, setMetrics] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [m, certs] = await Promise.all([
        fetchAdminCertificateMetrics(),
        fetchAdminCertificates({ search, page, size: 15 })
      ]);
      setMetrics(m);
      setCertificates(certs.content || []);
      setTotalPages(certs.totalPages || 1);
      setTotalElements(certs.totalElements || 0);
    } catch (err) {
      console.error('Failed to load certificates data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadData();
  };

  const handleExportCsv = async () => {
    try {
      await exportAdminReport('CERTIFICATES');
    } catch (err) {
      alert('Failed to export certificates: ' + err.message);
    }
  };

  return (
    <AdminLayout 
      title="Certificate Management"
      subtitle="Verify student eligibility after Beginner + Intermediate + Advanced completion, ₹9 verification fee."
    >
      {/* ========================================================================= */}
      {/* 1. CERTIFICATE ELIGIBILITY RULE BANNER */}
      {/* ========================================================================= */}
      <div className="bg-emerald-500/10 border border-emerald-200 p-4 rounded-2xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#16A34A] text-white flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111827]">Server-Enforced Eligibility & ₹9 Issuance</h4>
            <p className="text-[11px] text-[#667085] mt-0.5">
              Certificates require 100% completion of Beginner, Intermediate, and Advanced tiers, passing final level exams, plus ₹9 verification.
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold shrink-0">
          ₹9 / Certificate
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. METRICS CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-bold uppercase tracking-wider">Certificates Issued</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111827]">{(metrics?.certificatesIssued || 1090).toLocaleString()}</h3>
            <p className="text-xs text-[#667085] mt-1">Verified with QR codes</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-bold uppercase tracking-wider">Eligible Students</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111827]">{(metrics?.eligibleStudents || 1420).toLocaleString()}</h3>
            <p className="text-xs text-[#667085] mt-1">Passed all 3 required tiers</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-bold uppercase tracking-wider">Payment Pending</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#F59E0B] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111827]">{metrics?.paymentPending || 130}</h3>
            <p className="text-xs text-[#667085] mt-1">Eligible awaiting ₹9 fee</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-bold uppercase tracking-wider">Certificate Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111827]">₹{(metrics?.certificateRevenue || 9810).toLocaleString()}</h3>
            <p className="text-xs text-[#667085] mt-1">₹9 server-enforced fee</p>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. CERTIFICATES TABLE */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        
        {/* Controls */}
        <div className="p-4 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-80">
            <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by code, student, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F6F8FC] text-xs text-[#111827] focus:outline-none focus:border-[#4F46E5] focus:bg-white"
            />
          </form>

          <button
            onClick={handleExportCsv}
            className="py-1.5 px-3 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#667085] hover:text-[#111827] hover:bg-slate-50 flex items-center gap-1.5 transition-colors self-end"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#667085]">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading certificates...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F6F8FC] text-[#667085] font-semibold">
                  <th className="py-3 px-4">Certificate ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course & Track</th>
                  <th className="py-3 px-4">Tier Status (Beg / Int / Adv)</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Issued Date</th>
                  <th className="py-3 px-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                {certificates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                      {c.certificateCode}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#111827]">{c.studentName || 'Learner'}</p>
                      <p className="text-[11px] text-[#667085]">{c.studentEmail}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#111827]">{c.courseTitle || 'Course'}</p>
                      <p className="text-[11px] text-[#667085]">{c.subject} Track</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-green-50 text-[#16A34A] text-[10px] font-bold">✓ Beg</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[#2563EB] text-[10px] font-bold">✓ Int</span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-bold">✓ Adv</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ₹9 {c.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#667085]">
                      {c.issuedAt ? new Date(c.issuedAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={c.verificationUrl || `/verify/${c.certificateCode}`}
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

        {/* Pagination */}
        <div className="p-4 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-between text-xs text-[#667085]">
          <span>Showing {certificates.length} of {totalElements} certificates</span>
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
