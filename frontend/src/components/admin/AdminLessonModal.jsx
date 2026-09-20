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
        contentEn: '# Lesson Overview\n\nExplain the concept clearly here...\n\n### Key Principles\n* Point 1\n* Point 2\n',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {lesson ? 'Edit Lesson' : 'Create New Lesson'}
              </h2>
              <p className="text-xs text-slate-500">Bilingual lesson content (English + Hinglish), code snippets, and publishing</p>
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

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs flex-1 overflow-y-auto pr-1">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Lesson Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. 1.1 Introduction to Time & Space Complexity"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Slug (URL identifier) *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. time-and-space-complexity"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Est. Minutes</label>
              <input
                type="number"
                min="1"
                value={formData.estimatedMinutes}
                onChange={(e) => setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value, 10) || 1 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Order Index</label>
              <input
                type="number"
                min="0"
                value={formData.orderIndex}
                onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value, 10) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Publish Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-semibold"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
              </select>
            </div>
          </div>

          {/* Tab Navigation for Content & Code */}
          <div className="border border-slate-200 rounded-2xl bg-slate-50 p-1.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'en' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                English Content *
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('hinglish')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'hinglish' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Languages className="w-3.5 h-3.5" /> Hinglish Content 🇮🇳
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'code' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> Code Snippets
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'preview' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </button>
          </div>

          {/* TAB 1: English Content */}
          {activeTab === 'en' && (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold">English Lesson Content (Markdown Supported)</span>
                <span className="text-[11px]">Supports headings, bullet lists, math, and code blocks</span>
              </div>
              <textarea
                rows="14"
                value={formData.contentEn}
                onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                placeholder="# Introduction..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                required
              />
            </div>
          )}

          {/* TAB 2: Hinglish Content */}
          {activeTab === 'hinglish' && (
            <div className="space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                  <Languages className="w-4 h-4" /> Hinglish Explanation (Conversational Hindi-English)
                </span>
                <span className="text-[11px]">Students can switch with 1-click in the reader</span>
              </div>
              <textarea
                rows="14"
                value={formData.contentHinglish}
                onChange={(e) => setFormData({ ...formData, contentHinglish: e.target.value })}
                placeholder="# Concept ko aasaani se samjhte hain...

Time complexity ka matlab hota hai ki algorithm input size ke badhne par kitna time leta hai..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>
          )}

          {/* TAB 3: Code Snippets */}
          {activeTab === 'code' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveCodeLang('java')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                    activeCodeLang === 'java' ? 'bg-amber-100 text-amber-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Java ☕
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeLang('cpp')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                    activeCodeLang === 'cpp' ? 'bg-sky-100 text-sky-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  C++ ⚡
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeLang('python')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                    activeCodeLang === 'python' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Python 🐍
                </button>
              </div>

              {activeCodeLang === 'java' && (
                <textarea
                  rows="12"
                  value={formData.codeSnippetJava}
                  onChange={(e) => setFormData({ ...formData, codeSnippetJava: e.target.value })}
                  placeholder="// Java Implementation
public class Solution {
    public static void main(String[] args) {
        // ...
    }
}"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              )}

              {activeCodeLang === 'cpp' && (
                <textarea
                  rows="12"
                  value={formData.codeSnippetCpp}
                  onChange={(e) => setFormData({ ...formData, codeSnippetCpp: e.target.value })}
                  placeholder="// C++ Implementation
#include <iostream>
using namespace std;

int main() {
    return 0;
}"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-sky-300 placeholder-slate-600 focus:outline-none focus:border-sky-500 leading-relaxed"
                />
              )}

              {activeCodeLang === 'python' && (
                <textarea
                  rows="12"
                  value={formData.codeSnippetPython}
                  onChange={(e) => setFormData({ ...formData, codeSnippetPython: e.target.value })}
                  placeholder="# Python Implementation
def solve():
    pass

if __name__ == '__main__':
    solve()"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              )}
            </div>
          )}

          {/* TAB 4: Live Preview */}
          {activeTab === 'preview' && (
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 min-h-[300px] animate-in fade-in">
              <MarkdownRenderer content={formData.contentEn || '*No content entered yet.*'} />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 flex-shrink-0">
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

export default AdminLessonModal;
