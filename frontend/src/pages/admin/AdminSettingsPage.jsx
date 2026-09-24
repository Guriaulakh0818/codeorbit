import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Lock, 
  IndianRupee, 
  CreditCard, 
  Globe, 
  CheckCircle2, 
  Save, 
  AlertCircle 
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchAdminSettings, updateAdminSettings } from '../../services/adminManagementApi';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveSuccess(false);
      await updateAdminSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Platform Settings">
        <div className="p-12 text-center text-xs text-[#667085]">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Loading settings...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Platform Settings"
      subtitle="Configure platform identity, server-enforced pricing parameters, and payment gateways."
    >
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        
        {/* ========================================================================= */}
        {/* 1. SERVER ENFORCED PRICING (READ-ONLY / IMMUTABLE RULES) */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#111827]">Curriculum Pricing Configuration</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-[#4F46E5] border border-indigo-200">
                  SERVER-ENFORCED
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-0.5">These pricing tiers are strictly validated server-side to prevent tampering.</p>
            </div>
            <Lock className="w-5 h-5 text-[#4F46E5]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            
            {/* Free Tiers */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-semibold text-[#667085]">Standard Curriculum</p>
              <p className="text-xl font-bold text-emerald-600 mt-1">₹0 Free</p>
              <p className="text-[11px] text-[#667085] mt-1">Beginner, Intermediate, Advanced levels</p>
            </div>

            {/* Placement Ready */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#4F46E5]">Placement Ready</p>
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-xl font-bold text-[#4F46E5] mt-1">₹29.00</p>
              <p className="text-[11px] text-[#667085] mt-1">Per subject fixed server price</p>
            </div>

            {/* Verified Certificate */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#16A34A]">Verified Certificate</p>
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-xl font-bold text-[#16A34A] mt-1">₹9.00</p>
              <p className="text-[11px] text-[#667085] mt-1">After Beginner + Int + Adv completion</p>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. GENERAL & BRANDING SETTINGS */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-6 space-y-4">
          <h3 className="text-base font-bold text-[#111827]">General & Branding</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#111827] mb-1">Platform Name</label>
              <input
                type="text"
                value={settings?.platformName || 'CodeOrbit'}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#4F46E5]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#111827] mb-1">Production Domain</label>
              <input
                type="text"
                value={settings?.domain || 'codeorbit.online'}
                onChange={(e) => setSettings({ ...settings, domain: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#4F46E5]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#111827] mb-1">Support Email</label>
              <input
                type="email"
                value={settings?.supportEmail || 'support@codeorbit.online'}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-[#111827] focus:outline-none focus:border-[#4F46E5]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#111827] mb-1">Default Platform Currency</label>
              <input
                type="text"
                disabled
                value={settings?.currency || 'INR (₹)'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[#667085] cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. PAYMENT GATEWAY (RAZORPAY) */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#111827]">Payment Gateway Configuration</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200">
              RAZORPAY LIVE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#111827] mb-1">Razorpay Key ID</label>
              <input
                type="text"
                value={settings?.razorpayKeyId || ''}
                onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] font-mono text-[#111827] focus:outline-none focus:border-[#4F46E5]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#111827] mb-1">Razorpay Secret</label>
              <input
                type="password"
                disabled
                value="••••••••••••••••••••••••"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[#667085] cursor-not-allowed"
              />
              <p className="text-[10px] text-[#667085] mt-1">Managed securely via backend environment variables.</p>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          {saveSuccess && (
            <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Settings updated successfully!
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="py-2.5 px-6 rounded-xl bg-[#4F46E5] text-white text-xs font-bold shadow-xs shadow-indigo-200 hover:bg-indigo-700 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>
    </AdminLayout>
  );
}
