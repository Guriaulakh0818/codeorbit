import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, RefreshCw, BookOpen, Eye, Code2, Languages } from 'lucide-react';
import { adminCurriculumApi } from '../../services/adminCurriculumApi';
import { MarkdownRenderer } from '../MarkdownRenderer';

export const AdminLessonModal = ({ isOpen, onClose, moduleId, lesson, onSaved }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    estimatedMinutes: 15,
    orderIndex: 0,
    status: 'DRAFT',
    contentEn: '',
    contentHinglish: '',
    hinglishStatus: 'MISSING',
    codeSnippetJava: '',
    codeSnippetCpp: '',
    codeSnippetPython: ''
  });

  const [activeTab, setActiveTab] = useState('en'); // 'en' | 'hinglish' | 'code' | 'preview'
  const [activeCodeLang, setActiveCodeLang] = useState('java'); // 'java' | 'cpp' | 'python'
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        slug: lesson.slug || '',
        estimatedMinutes: lesson.estimatedMinutes || 15,
        orderIndex: lesson.orderIndex || 0,
        status: lesson.status || 'DRAFT',
        contentEn: lesson.contentEn || '',
        contentHinglish: lesson.contentHinglish || '',
        hinglishStatus: lesson.hinglishStatus || 'MISSING',
        codeSnippetJava: lesson.codeSnippetJava || '',
        codeSnippetCpp: lesson.codeSnippetCpp || '',
        codeSnippetPython: lesson.codeSnippetPython || ''
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        estimatedMinutes: 15,
        orderIndex: 0,
        status: 'DRAFT',
        contentEn: '# Lesson Overview\n\nExplain the concept here...\n\n### Key Patterns\n* Point 1\n* Point 2\n',
        contentHinglish: '',
        hinglishStatus: 'MISSING',
        codeSnippetJava: '',
        codeSnippetCpp: '',
        codeSnippetPython: ''
      });
    }
    setError(null);
  }, [lesson, isOpen]);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !lesson ? generateSlug(val) : prev.slug
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim() || !formData.contentEn.trim()) {
      setError('Title, slug, and English content are required.');
      return;
    }

    setSaving(true);
    setError(null);

    // Auto-compute hinglish status if text provided
    const payload = { ...formData };
    if (payload.contentHinglish && payload.contentHinglish.trim().length > 10) {
      if (payload.hinglishStatus === 'MISSING') {
        payload.hinglishStatus = 'PUBLISHED';
      }
    } else {
      payload.hinglishStatus = 'MISSING';
    }

    try {
      let res;
      if (lesson?.id) {
        res = await adminCurriculumApi.updateLesson(lesson.id, payload);
      } else {
        res = await adminCurriculumApi.createLesson(moduleId, payload);
      }

      if (res.success) {
        onSaved();
        onClose();
      } else {
        setError(res.message || 'Failed to save lesson.');
      }
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lesson ? 'Edit Lesson' : 'Create New Lesson'}
              </h2>
              <p className="text-xs text-slate-400">Bilingual lesson content, code snippets, and publishing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-800/60 p-3.5 rounded-2xl text-xs text-rose-200 flex items-center gap-2.5 flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs flex-1 overflow-y-auto pr-1">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Lesson Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. 1.1 Introduction to Time & Space Complexity"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Slug (URL identifier) *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. time-and-space-complexity"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-sky-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Est. Minutes</label>
              <input
                type="number"
                min="1"
                value={formData.estimatedMinutes}
                onChange={(e) => setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value, 10) || 1 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Order Index</label>
              <input
                type="number"
                min="0"
                value={formData.orderIndex}
                onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value, 10) || 0 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Publish Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-400 font-semibold"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
              </select>
            </div>
          </div>

          {/* Tab Navigation for Content & Code */}
          <div className="border border-slate-800 rounded-2xl bg-slate-950/60 p-1.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'en' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                English Content *
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('hinglish')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'hinglish' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Languages className="w-3.5 h-3.5" /> Hinglish Content
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'code' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> Code Snippets
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'preview' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </button>
          </div>

          {/* Tab 1: English Content Editor */}
          {activeTab === 'en' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Markdown supported (Headers, Bold, Lists, Tables, Math, etc.)</span>
                <span>{formData.contentEn.length} characters</span>
              </div>
              <textarea
                rows="12"
                value={formData.contentEn}
                onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                placeholder="# English Lesson Title..."
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-400 leading-relaxed"
                required
              />
            </div>
          )}

          {/* Tab 2: Hinglish Content Editor */}
          {activeTab === 'hinglish' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Intuitive Hinglish explanation for Indian engineering students</span>
                <span>{formData.contentHinglish.length} characters</span>
              </div>
              <textarea
                rows="12"
                value={formData.contentHinglish}
                onChange={(e) => setFormData({ ...formData, contentHinglish: e.target.value })}
                placeholder="# Hinglish Me Title..."
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-slate-100 font-mono text-xs focus:outline-none focus:border-purple-400 leading-relaxed"
              />
            </div>
          )}

          {/* Tab 3: Code Snippets (Java, C++, Python) */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveCodeLang('java')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    activeCodeLang === 'java' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Java Solution
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeLang('cpp')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    activeCodeLang === 'cpp' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  C++ Solution
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeLang('python')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    activeCodeLang === 'python' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Python Solution
                </button>
              </div>

              {activeCodeLang === 'java' && (
                <textarea
                  rows="10"
                  value={formData.codeSnippetJava}
                  onChange={(e) => setFormData({ ...formData, codeSnippetJava: e.target.value })}
                  placeholder="// Java implementation..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-emerald-300 font-mono text-xs focus:outline-none focus:border-sky-400"
                />
              )}

              {activeCodeLang === 'cpp' && (
                <textarea
                  rows="10"
                  value={formData.codeSnippetCpp}
                  onChange={(e) => setFormData({ ...formData, codeSnippetCpp: e.target.value })}
                  placeholder="// C++ implementation..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-sky-300 font-mono text-xs focus:outline-none focus:border-sky-400"
                />
              )}

              {activeCodeLang === 'python' && (
                <textarea
                  rows="10"
                  value={formData.codeSnippetPython}
                  onChange={(e) => setFormData({ ...formData, codeSnippetPython: e.target.value })}
                  placeholder="# Python implementation..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-amber-300 font-mono text-xs focus:outline-none focus:border-sky-400"
                />
              )}
            </div>
          )}

          {/* Tab 4: Live Markdown Preview */}
          {activeTab === 'preview' && (
            <div className="border border-slate-800 rounded-2xl bg-slate-950 p-6 max-h-96 overflow-y-auto">
              <MarkdownRenderer markdown={formData.contentEn || '*No English content written yet.*'} />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-600 to-brand-600 hover:from-sky-500 hover:to-brand-500 text-white rounded-xl font-bold transition-all shadow-md shadow-sky-500/20 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Lesson
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
