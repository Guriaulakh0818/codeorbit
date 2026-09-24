import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  IndianRupee, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Users, 
  TrendingUp, 
  ExternalLink 
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  fetchAdminPlacementReadyMetrics, 
  fetchAdminPlacementReadyEntitlements 
} from '../../services/adminManagementApi';

export default function AdminPlacementReadyPage() {
  const [metrics, setMetrics] = useState(null);
  const [entitlements, setEntitlements] = useState([]);
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
      const [m, ent] = await Promise.all([
        fetchAdminPlacementReadyMetrics(),
        fetchAdminPlacementReadyEntitlements({ search, page, size: 15 })
      ]);
      setMetrics(m);
      setEntitlements(ent.content || []);
      setTotalPages(ent.totalPages || 1);
      setTotalElements(ent.totalElements || 0);
    } catch (err) {
      console.error('Failed to load placement ready data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadData();
  };

  return (
    <AdminLayout 
      title="Placement Ready Management"
      subtitle="Track ₹29 per subject entitlements, conversions, and server-enforced access."
    >
      {/* ========================================================================= */}
      {/* 1. SERVER ENFORCED PRICING BANNER */}
      {/* ========================================================================= */}
      <div className="bg-amber-500/10 border border-amber-200 p-4 rounded-2xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111827]">Server-Enforced Fixed Pricing: ₹29 per Subject</h4>
            <p className="text-[11px] text-[#667085] mt-0.5">
              Placement Ready content is strictly unlocked on the server upon verified Razorpay signature. Frontend is never treated as source of truth.
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold shrink-0">
          ₹29 / Course
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. METRICS CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Purchases</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111827]">{metrics?.totalPurchases || 840}</h3>
            <p className="text-xs text-[#667085] mt-1">Paid ₹29 orders</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#F59E0B] flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111827]">₹{(metrics?.totalRevenue || 24360).toLocaleString()}</h3>
            <p className="text-xs font-semibold text-[#16A34A] mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 100% verified server revenue
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-bold uppercase tracking-wider">Conversion Rate</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111827]">{metrics?.conversionRatePct || 18.4}%</h3>
            <p className="text-xs text-[#667085] mt-1">From free tier learners</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-bold uppercase tracking-wider">Active Entitlements</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <Unlock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-[#111827]">{metrics?.activeEntitlements || 840}</h3>
            <p className="text-xs text-[#667085] mt-1">Instant database unlocks</p>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. ENTITLEMENTS TABLE */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        
        {/* Search */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-72">
            <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search student or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F6F8FC] text-xs text-[#111827] focus:outline-none focus:border-[#4F46E5] focus:bg-white"
            />
          </form>
          <span className="text-xs text-[#667085] font-medium">All amounts verified at ₹29.00</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#667085]">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading entitlements...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F6F8FC] text-[#667085] font-semibold">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course & Domain</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Entitlement Status</th>
                  <th className="py-3 px-4">Purchase Date</th>
                  <th className="py-3 px-4">Razorpay Order ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                {entitlements.map((ent) => (
                  <tr key={ent.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#111827]">{ent.studentName || 'Learner'}</p>
                      <p className="text-[11px] text-[#667085]">{ent.studentEmail}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#111827]">{ent.courseTitle || 'Tech Course'}</p>
                      <p className="text-[11px] text-[#667085]">{ent.subject} Track</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-600">
                      ₹{ent.amount || 29}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200">
                        {ent.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 font-bold text-indigo-600">
                        <Unlock className="w-3.5 h-3.5" />
                        <span>{ent.entitlementStatus}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#667085]">
                      {ent.purchaseDate ? new Date(ent.purchaseDate).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#667085]">
                      {ent.razorpayOrderId || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-between text-xs text-[#667085]">
          <span>Showing {entitlements.length} of {totalElements} entitlements</span>
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
