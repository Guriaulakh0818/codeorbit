import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, RefreshCw, BookOpen, Eye, Code2, Languages, Sparkles, FileText } from 'lucide-react';
import { adminCurriculumApi } from '../../services/adminCurriculumApi';
import { MarkdownRenderer } from '../MarkdownRenderer';

export const AdminLessonModal = ({ isOpen, onClose, moduleId, lesson, onSaved }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    estimatedMinutes: 15,
    orderIndex: 1,
    status: 'PUBLISHED',
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
        orderIndex: lesson.orderIndex || 1,
        status: lesson.status || 'PUBLISHED',
        contentEn: lesson.contentEn || '',
        contentHinglish: lesson.contentHinglish || '',
        hinglishStatus: lesson.hinglishStatus || 'PUBLISHED',
        codeSnippetJava: lesson.codeSnippetJava || '',
        codeSnippetCpp: lesson.codeSnippetCpp || '',
        codeSnippetPython: lesson.codeSnippetPython || ''
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        estimatedMinutes: 15,
        orderIndex: 1,
        status: 'PUBLISHED',
        contentEn: `# Chapter Overview\n\nExplain the core concept, syntax, architecture, and step-by-step logic here...\n\n### Key Concepts Covered\n- Concept 1\n- Concept 2\n- Code Walkthrough\n\n\`\`\`java\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello CodeOrbit!");\n    }\n}\n\`\`\``,
        contentHinglish: `# Chapter Ka Introduction 🇮🇳\n\nYahan concept ko aasan Hindi + English (Hinglish) me explain karein...\n\n### Important Points\n- Point 1\n- Point 2\n`,
        hinglishStatus: 'PUBLISHED',
        codeSnippetJava: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}',
        codeSnippetCpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World" << endl;\n    return 0;\n}',
        codeSnippetPython: 'def main():\n    print("Hello World")\n\nif __name__ == "__main__":\n    main()'
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
      setError('Chapter title, slug, and English content are required.');
      return;
    }

    setSaving(true);
    setError(null);

    // Auto-compute hinglish status
    const payload = { ...formData };
    if (payload.contentHinglish && payload.contentHinglish.trim().length > 10) {
      payload.hinglishStatus = 'PUBLISHED';
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
        setError(res.message || 'Failed to save chapter.');
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
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {lesson ? 'Edit Chapter / Lesson' : 'Add Chapter / Lesson to Module'}
              </h2>
              <p className="text-xs text-slate-500">
                Write concept explanations, bilingual Hinglish content, and code snippets
              </p>
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
          <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-xs text-rose-800 flex items-center gap-2.5 flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-5 text-xs pr-1">
          
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            <div className="sm:col-span-6">
              <label className="block text-slate-700 font-semibold mb-1">
                Chapter / Lesson Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. 1.1 Introduction to Java & JVM Architecture"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-700 font-semibold mb-1">
                Slug (URL Identifier) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. java-intro-jvm"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-700 font-semibold mb-1">
                Reading Time (Mins)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={formData.estimatedMinutes}
                onChange={(e) => setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value, 10) || 15 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

          </div>

          {/* Row 2: Status & Order */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Chapter Order #</label>
              <input
                type="number"
                min="1"
                value={formData.orderIndex}
                onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value, 10) || 1 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Publish Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-emerald-500"
              >
                <option value="PUBLISHED">PUBLISHED (Live)</option>
                <option value="DRAFT">DRAFT (Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Hinglish Mode</label>
              <select
                value={formData.hinglishStatus}
                onChange={(e) => setFormData({ ...formData, hinglishStatus: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-emerald-500"
              >
                <option value="PUBLISHED">Available (EN + HI)</option>
                <option value="MISSING">English Only</option>
              </select>
            </div>
          </div>

          {/* Editor Tabs Navigation */}
          <div className="border-b border-slate-200 flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`pb-2.5 px-3 font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'en'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> English Content (Markdown) *
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('hinglish')}
                className={`pb-2.5 px-3 font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'hinglish'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Languages className="w-3.5 h-3.5" /> Hinglish Content 🇮🇳
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`pb-2.5 px-3 font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'code'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> Code Snippets
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`pb-2.5 px-3 font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </button>
          </div>

          {/* Editor Panels */}
          {activeTab === 'en' && (
            <div className="space-y-2">
              <label className="block text-slate-700 font-semibold">English Lesson Content (Full Markdown)</label>
              <textarea
                rows="14"
                value={formData.contentEn}
                onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                placeholder="# Lesson Title\n\nExplain your concept in detail here..."
                className="w-full font-mono bg-slate-900 text-emerald-400 border border-slate-800 rounded-2xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                required
              />
            </div>
          )}

          {activeTab === 'hinglish' && (
            <div className="space-y-2">
              <label className="block text-slate-700 font-semibold">Hinglish Explanation (Hindi + English Romanized Markdown)</label>
              <textarea
                rows="14"
                value={formData.contentHinglish}
                onChange={(e) => setFormData({ ...formData, contentHinglish: e.target.value })}
                placeholder="# Chapter Introduction 🇮🇳\n\nIs concept ko simple hinglish me samjhayein..."
                className="w-full font-mono bg-slate-900 text-amber-300 border border-slate-800 rounded-2xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {['java', 'cpp', 'python'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveCodeLang(lang)}
                    className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                      activeCodeLang === lang
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {activeCodeLang === 'java' && (
                <textarea
                  rows="12"
                  value={formData.codeSnippetJava}
                  onChange={(e) => setFormData({ ...formData, codeSnippetJava: e.target.value })}
                  placeholder="// Java implementation"
                  className="w-full font-mono bg-slate-900 text-sky-300 border border-slate-800 rounded-2xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
                />
              )}

              {activeCodeLang === 'cpp' && (
                <textarea
                  rows="12"
                  value={formData.codeSnippetCpp}
                  onChange={(e) => setFormData({ ...formData, codeSnippetCpp: e.target.value })}
                  placeholder="// C++ implementation"
                  className="w-full font-mono bg-slate-900 text-cyan-300 border border-slate-800 rounded-2xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 leading-relaxed"
                />
              )}

              {activeCodeLang === 'python' && (
                <textarea
                  rows="12"
                  value={formData.codeSnippetPython}
                  onChange={(e) => setFormData({ ...formData, codeSnippetPython: e.target.value })}
                  placeholder="# Python implementation"
                  className="w-full font-mono bg-slate-900 text-emerald-300 border border-slate-800 rounded-2xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              )}
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="p-5 bg-white border border-slate-200 rounded-2xl min-h-[300px] overflow-y-auto">
              <h1 className="text-xl font-bold text-slate-900 mb-2">{formData.title || 'Chapter Title'}</h1>
              <div className="flex items-center gap-3 text-slate-500 text-[11px] mb-4 pb-3 border-b border-slate-100 font-mono">
                <span>⏱ {formData.estimatedMinutes} mins read</span>
                <span>•</span>
                <span>Order #{formData.orderIndex}</span>
              </div>
              <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed">
                <MarkdownRenderer content={formData.contentEn || '*No markdown content entered.*'} />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-shrink-0">
            <span className="text-[11px] text-slate-400">
              Saving will sync directly with the Chapter Reader on www.codeorbit.online.
            </span>
            <div className="flex items-center gap-3">
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
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Chapter
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AdminLessonModal;
