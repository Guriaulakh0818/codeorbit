import React, { useState, useEffect } from 'react';
import { 
  UserCog, 
  ShieldCheck, 
  Users, 
  Search, 
  Check, 
  X, 
  AlertCircle,
  Key
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchAdminUsers, updateUserRole } from '../../services/adminManagementApi';

export default function AdminUsersRolesPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const permissionsMatrix = [
    { module: 'Dashboard & Metrics', superAdmin: true, admin: true, contentManager: true, support: true },
    { module: 'Courses & Curriculum', superAdmin: true, admin: true, contentManager: true, support: false },
    { module: 'Lessons (EN & Hinglish)', superAdmin: true, admin: true, contentManager: true, support: false },
    { module: 'Quizzes & Scoring Rules', superAdmin: true, admin: true, contentManager: true, support: false },
    { module: 'Student Progress & Profiles', superAdmin: true, admin: true, contentManager: false, support: true },
    { module: 'Payment & Razorpay Audits', superAdmin: true, admin: true, contentManager: false, support: false },
    { module: 'Placement Ready (₹29)', superAdmin: true, admin: true, contentManager: false, support: true },
    { module: 'Certificates (₹9)', superAdmin: true, admin: true, contentManager: false, support: true },
    { module: 'Reports & CSV Exports', superAdmin: true, admin: true, contentManager: false, support: false },
    { module: 'User Role Assignments', superAdmin: true, admin: true, contentManager: false, support: false },
    { module: 'Platform & Security Settings', superAdmin: true, admin: false, contentManager: false, support: false }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setEditingUserId(null);
      loadUsers();
    } catch (err) {
      alert('Failed to update role: ' + err.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (search && !u.fullName?.toLowerCase().includes(search.toLowerCase()) && !u.email?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <AdminLayout 
      title="Users & Roles"
      subtitle="Manage administrator access, staff roles, and granular platform permission matrix."
    >
      {/* ========================================================================= */}
      {/* 1. USERS TABLE */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs mb-8 overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#111827]">Administrative Accounts</h3>
            <p className="text-xs text-[#667085] mt-0.5">Staff users with backend access privileges</p>
          </div>
          <div className="relative w-72">
            <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search admin users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F6F8FC] text-xs text-[#111827] focus:outline-none focus:border-[#4F46E5] focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F6F8FC] text-[#667085] font-semibold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Auth Provider</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4F46E5] font-bold flex items-center justify-center text-xs border border-indigo-100">
                        {u.fullName?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="font-bold text-[#111827]">{u.fullName}</p>
                        <p className="text-[11px] text-[#667085]">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {editingUserId === u.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="py-1 px-2 rounded-lg border border-[#4F46E5] bg-white text-xs font-semibold"
                        >
                          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="CONTENT_MANAGER">CONTENT_MANAGER</option>
                          <option value="SUPPORT">SUPPORT</option>
                          <option value="STUDENT">STUDENT</option>
                        </select>
                        <button
                          onClick={() => handleRoleChange(u.id, selectedRole)}
                          className="p-1 rounded bg-[#16A34A] text-white hover:bg-green-700"
                          title="Save"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="p-1 rounded bg-slate-200 text-[#667085] hover:bg-slate-300"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'SUPER_ADMIN' ? 'bg-indigo-50 text-[#4F46E5] border border-indigo-200' :
                        u.role === 'ADMIN' ? 'bg-blue-50 text-[#2563EB] border border-blue-200' :
                        u.role === 'CONTENT_MANAGER' ? 'bg-purple-50 text-purple-600 border border-purple-200' :
                        'bg-slate-100 text-[#667085]'
                      }`}>
                        {u.role}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-[#667085] font-medium">{u.authProvider || 'LOCAL'}</td>
                  
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200">
                      {u.status || 'ACTIVE'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-[#667085]">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => { setEditingUserId(u.id); setSelectedRole(u.role); }}
                      className="py-1 px-2.5 rounded-lg border border-[#E5E7EB] hover:bg-indigo-50 hover:text-[#4F46E5] text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Change Role</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. GRANULAR PERMISSION MATRIX */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-6">
        <div className="mb-6">
          <h3 className="text-base font-bold text-[#111827]">Role Permission Matrix</h3>
          <p className="text-xs text-[#667085] mt-0.5">Server-enforced authorization rules applied to all `/api/admin/**` endpoints</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F6F8FC] text-[#667085] font-semibold">
                <th className="py-3 px-4">Platform Capability</th>
                <th className="py-3 px-4 text-center">SUPER_ADMIN</th>
                <th className="py-3 px-4 text-center">ADMIN</th>
                <th className="py-3 px-4 text-center">CONTENT_MANAGER</th>
                <th className="py-3 px-4 text-center">SUPPORT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {permissionsMatrix.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-[#111827]">{p.module}</td>
                  <td className="py-3 px-4 text-center">
                    {p.superAdmin ? <Check className="w-4 h-4 text-[#16A34A] mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.admin ? <Check className="w-4 h-4 text-[#16A34A] mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.contentManager ? <Check className="w-4 h-4 text-[#16A34A] mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.support ? <Check className="w-4 h-4 text-[#16A34A] mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
