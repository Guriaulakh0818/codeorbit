import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, RefreshCw, Layers, Sparkles, IndianRupee } from 'lucide-react';
import { adminCurriculumApi } from '../../services/adminCurriculumApi';

export const AdminSubcourseModal = ({ isOpen, onClose, courseId, subcourse, onSaved }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    curriculumLevel: 'BEGINNER',
    priceInr: 0,
    isFree: true,
    status: 'PUBLISHED'
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (subcourse) {
      setFormData({
        title: subcourse.title || '',
        slug: subcourse.slug || '',
        description: subcourse.description || '',
        curriculumLevel: subcourse.curriculumLevel || 'BEGINNER',
        priceInr: subcourse.priceInr || (subcourse.curriculumLevel === 'PLACEMENT_READY' ? 29 : 0),
        isFree: subcourse.curriculumLevel === 'PLACEMENT_READY' ? false : (subcourse.isFree !== false),
        status: subcourse.status || 'PUBLISHED'
      });
    }
    setError(null);
  }, [subcourse, isOpen]);

  const handleLevelChange = (e) => {
    const level = e.target.value;
    const isPlacement = level === 'PLACEMENT_READY';
    setFormData((prev) => ({
      ...prev,
      curriculumLevel: level,
      priceInr: isPlacement ? 29 : 0,
      isFree: !isPlacement
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Tier title is required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await adminCurriculumApi.updateSubcourse(courseId, subcourse?.id || subcourse?.slug, formData);
      if (res.success) {
        onSaved();
        onClose();
      } else {
        setError(res.message || 'Failed to save tier concepts.');
      }
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Edit Tier & Concepts
              </h2>
              <p className="text-xs text-slate-500">Configure roadmap level syllabus and concepts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-xs text-rose-800 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Tier / Subcourse Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Java Programming / Advanced Java / Java Interview Prep"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Roadmap Level</label>
              <select
                value={formData.curriculumLevel}
                onChange={handleLevelChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="BEGINNER">Tier 1: Beginner (Free)</option>
                <option value="INTERMEDIATE">Tier 2: Intermediate (Free)</option>
                <option value="ADVANCED">Tier 3: Advanced (Free)</option>
                <option value="PLACEMENT_READY">Tier 4: Placement Ready (₹29)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Pricing (INR)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={formData.priceInr}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    priceInr: parseInt(e.target.value, 10) || 0,
                    isFree: (parseInt(e.target.value, 10) || 0) === 0
                  })}
                  disabled={formData.curriculumLevel !== 'PLACEMENT_READY'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 font-mono disabled:opacity-60"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                  {formData.isFree ? 'FREE' : '₹' + formData.priceInr}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Concepts & Topics Covered in this Tier *
            </label>
            <p className="text-[11px] text-slate-500 mb-1.5">
              Enter key concepts, chapters summary, or comma-separated topics learners will master.
            </p>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Core syntax, variables, data types, control flow, loops, methods, arrays, OOPs principles, collections, coding interview prep..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 leading-relaxed"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">
              Updates will automatically synchronize across Course Roadmaps and Learner Pages.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Concepts
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AdminSubcourseModal;
