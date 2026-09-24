import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Save, 
  AlertCircle, 
  RefreshCw, 
  BookOpen, 
  Eye, 
  Code2, 
  Languages, 
  Sparkles, 
  FileText,
  Plus,
  Trash2,
  Copy,
  Check,
  CornerDownRight,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { adminCurriculumApi } from '../../services/adminCurriculumApi';
import { MarkdownRenderer } from '../MarkdownRenderer';

const SUPPORTED_LANGUAGES = [
  { id: 'java', label: 'Java', defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello CodeOrbit!");\n    }\n}' },
  { id: 'python', label: 'Python', defaultCode: 'def solve():\n    print("Hello CodeOrbit!")\n\nif __name__ == "__main__":\n    solve()' },
  { id: 'cpp', label: 'C++', defaultCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello CodeOrbit!" << endl;\n    return 0;\n}' },
  { id: 'c', label: 'C', defaultCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello CodeOrbit!\\n");\n    return 0;\n}' },
  { id: 'javascript', label: 'JavaScript', defaultCode: 'function run() {\n    console.log("Hello CodeOrbit!");\n}\nrun();' },
  { id: 'typescript', label: 'TypeScript', defaultCode: 'interface Message {\n    text: string;\n}\nconst msg: Message = { text: "Hello CodeOrbit!" };\nconsole.log(msg.text);' },
  { id: 'sql', label: 'SQL', defaultCode: 'SELECT user_id, full_name, role \nFROM users \nWHERE status = \'ACTIVE\'\nORDER BY created_at DESC;' },
  { id: 'html', label: 'HTML / CSS', defaultCode: '<div class="card">\n    <h2>Hello CodeOrbit</h2>\n    <p>Welcome to interactive coding.</p>\n</div>' },
  { id: 'go', label: 'Go', defaultCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello CodeOrbit!")\n}' },
  { id: 'rust', label: 'Rust', defaultCode: 'fn main() {\n    println!("Hello CodeOrbit!");\n}' }
];

export const AdminLessonModal = ({ isOpen, onClose, moduleId, lesson, onSaved }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    estimatedMinutes: 15,
    orderIndex: 1,
    status: 'PUBLISHED',
    contentEn: '',
    contentHinglish: '',
    hinglishStatus: 'PUBLISHED',
    codeSnippets: []
  });

  const [activeTab, setActiveTab] = useState('en'); // 'en' | 'hinglish' | 'snippets' | 'preview'
  const [selectedSnippetIdx, setSelectedSnippetIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [copiedNotification, setCopiedNotification] = useState(null);

  const enTextareaRef = useRef(null);
  const hiTextareaRef = useRef(null);

  useEffect(() => {
    if (lesson) {
      // Normalize code snippets
      let snippets = [];
      if (Array.isArray(lesson.codeSnippets) && lesson.codeSnippets.length > 0) {
        snippets = lesson.codeSnippets;
      } else {
        // Migrate legacy single snippets if present
        if (lesson.codeSnippetJava) {
          snippets.push({
            id: 'snippet_1',
            title: '1. Java Implementation',
            language: 'java',
            code: lesson.codeSnippetJava,
            explanation: 'Java concept code',
            placement: 'INLINE'
          });
        }
        if (lesson.codeSnippetCpp) {
          snippets.push({
            id: 'snippet_2',
            title: '2. C++ Implementation',
            language: 'cpp',
            code: lesson.codeSnippetCpp,
            explanation: 'C++ concept code',
            placement: 'INLINE'
          });
        }
        if (lesson.codeSnippetPython) {
          snippets.push({
            id: 'snippet_3',
            title: '3. Python Implementation',
            language: 'python',
            code: lesson.codeSnippetPython,
            explanation: 'Python concept code',
            placement: 'INLINE'
          });
        }
      }

      if (snippets.length === 0) {
        snippets.push({
          id: 'snippet_1',
          title: '1. Concept Example',
          language: 'java',
          code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello CodeOrbit!");\n    }\n}',
          explanation: 'Core concept demonstration',
          placement: 'INLINE'
        });
      }

      setFormData({
        title: lesson.title || '',
        slug: lesson.slug || '',
        estimatedMinutes: lesson.estimatedMinutes || 15,
        orderIndex: lesson.orderIndex || 1,
        status: lesson.status || 'PUBLISHED',
        contentEn: lesson.contentEn || '',
        contentHinglish: lesson.contentHinglish || '',
        hinglishStatus: lesson.hinglishStatus || 'PUBLISHED',
        codeSnippets: snippets
      });
      setSelectedSnippetIdx(0);
    } else {
      setFormData({
        title: '',
        slug: '',
        estimatedMinutes: 15,
        orderIndex: 1,
        status: 'PUBLISHED',
        contentEn: `# Chapter Title\n\nExplain the primary concept, syntax, architecture, and logic here...\n\n### Concept 1: Core Fundamentals\n\n\`\`\`java\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello CodeOrbit!");\n    }\n}\n\`\`\`\n\n### Concept 2: Key Principles\n- Principle 1\n- Principle 2\n`,
        contentHinglish: `# Chapter Introduction 🇮🇳\n\nYahan concept ko aasan Hindi + English (Hinglish) me explain karein...\n\n### Important Points\n- Point 1\n- Point 2\n`,
        hinglishStatus: 'PUBLISHED',
        codeSnippets: [
          {
            id: 'snippet_1',
            title: '1. Basic Concept & Syntax',
            language: 'java',
            code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Concept 1: Syntax");\n    }\n}',
            explanation: 'Demonstrates basic syntax and variables.',
            placement: 'INLINE'
          },
          {
            id: 'snippet_2',
            title: '2. Logic & Control Flow',
            language: 'java',
            code: 'int score = 85;\nif (score >= 80) {\n    System.out.println("Placement Ready!");\n}',
            explanation: 'Decision making logic example.',
            placement: 'INLINE'
          }
        ]
      });
      setSelectedSnippetIdx(0);
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

  // Snippets Management
  const handleAddSnippet = () => {
    const nextNum = (formData.codeSnippets?.length || 0) + 1;
    const defaultLang = 'java';
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.id === defaultLang) || SUPPORTED_LANGUAGES[0];
    const newSnippet = {
      id: `snippet_${Date.now()}`,
      title: `${nextNum}. Concept Example`,
      language: defaultLang,
      code: langObj.defaultCode,
      explanation: '',
      placement: 'INLINE'
    };

    setFormData((prev) => ({
      ...prev,
      codeSnippets: [...(prev.codeSnippets || []), newSnippet]
    }));
    setSelectedSnippetIdx(formData.codeSnippets?.length || 0);
  };

  const handleRemoveSnippet = (idx) => {
    if (formData.codeSnippets.length <= 1) {
      alert('You should have at least 1 code snippet template.');
      return;
    }
    setFormData((prev) => {
      const updated = prev.codeSnippets.filter((_, i) => i !== idx);
      return { ...prev, codeSnippets: updated };
    });
    setSelectedSnippetIdx((prev) => Math.max(0, prev - 1));
  };

  const handleUpdateCurrentSnippet = (field, value) => {
    setFormData((prev) => {
      const updated = [...prev.codeSnippets];
      if (updated[selectedSnippetIdx]) {
        updated[selectedSnippetIdx] = {
          ...updated[selectedSnippetIdx],
          [field]: value
        };
      }
      return { ...prev, codeSnippets: updated };
    });
  };

  // 1-Click Code Snippet Insertion into Markdown text at cursor
  const handleInsertSnippetIntoMarkdown = (targetField) => {
    const snippet = formData.codeSnippets[selectedSnippetIdx];
    if (!snippet) return;

    const formattedBlock = `\n\n### ${snippet.title || 'Code Example'}\n\`\`\`${snippet.language || 'text'}\n${snippet.code}\n\`\`\`\n${snippet.explanation ? `> **Note**: ${snippet.explanation}\n` : ''}\n`;

    const textarea = targetField === 'contentEn' ? enTextareaRef.current : hiTextareaRef.current;
    
    if (textarea) {
      const start = textarea.selectionStart || textarea.value.length;
      const end = textarea.selectionEnd || textarea.value.length;
      const currentVal = formData[targetField] || '';
      const newVal = currentVal.substring(0, start) + formattedBlock + currentVal.substring(end);

      setFormData((prev) => ({
        ...prev,
        [targetField]: newVal
      }));

      // Flash notification
      setCopiedNotification(`Snippet inserted into ${targetField === 'contentEn' ? 'English' : 'Hinglish'} content!`);
      setTimeout(() => setCopiedNotification(null), 3000);
    } else {
      // Append to end if textarea not mounted
      setFormData((prev) => ({
        ...prev,
        [targetField]: (prev[targetField] || '') + formattedBlock
      }));
      setCopiedNotification(`Snippet added to ${targetField === 'contentEn' ? 'English' : 'Hinglish'}!`);
      setTimeout(() => setCopiedNotification(null), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim() || !formData.contentEn.trim()) {
      setError('Chapter title, slug, and English content are required.');
      return;
    }

    setSaving(true);
    setError(null);

    // Sync legacy snippet fields for backward compatibility
    const javaSnippet = formData.codeSnippets.find((s) => s.language === 'java')?.code || '';
    const cppSnippet = formData.codeSnippets.find((s) => s.language === 'cpp')?.code || '';
    const pythonSnippet = formData.codeSnippets.find((s) => s.language === 'python')?.code || '';

    const payload = {
      ...formData,
      codeSnippetJava: javaSnippet,
      codeSnippetCpp: cppSnippet,
      codeSnippetPython: pythonSnippet
    };

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

  const currentSnippet = formData.codeSnippets[selectedSnippetIdx] || formData.codeSnippets[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {lesson ? 'Edit Chapter Content & Snippets' : 'Add Chapter to Module'}
              </h2>
              <p className="text-xs text-slate-500">
                Write concept explanations, place multiple code snippets anywhere, and manage bilingual content
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

        {copiedNotification && (
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 flex items-center gap-2 flex-shrink-0 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{copiedNotification}</span>
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

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Total Code Snippets</label>
              <div className="py-2 px-3 rounded-xl bg-slate-100 font-bold text-slate-800 flex items-center justify-between">
                <span>{formData.codeSnippets?.length || 0} Snippets</span>
                <span className="text-[10px] text-emerald-600 font-mono">Multiple allowed</span>
              </div>
            </div>
          </div>

          {/* Editor Tabs Navigation */}
          <div className="border-b border-slate-200 flex items-center justify-between pt-2 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`pb-2.5 px-3 font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'en'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> English Markdown *
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
                <Languages className="w-3.5 h-3.5" /> Hinglish Markdown 🇮🇳
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('snippets')}
                className={`pb-2.5 px-3 font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'snippets'
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Code Snippets Manager</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-bold">
                  {formData.codeSnippets?.length || 0}
                </span>
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

          {/* Quick Insert Snippet Toolbar (Visible on Markdown tabs) */}
          {(activeTab === 'en' || activeTab === 'hinglish') && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                  Quick Insert Snippet at Cursor:
                </span>
                
                {formData.codeSnippets?.map((snip, sIdx) => (
                  <button
                    key={snip.id || sIdx}
                    type="button"
                    onClick={() => {
                      setSelectedSnippetIdx(sIdx);
                      handleInsertSnippetIntoMarkdown(activeTab === 'en' ? 'contentEn' : 'contentHinglish');
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 hover:border-indigo-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    title={`Insert "${snip.title}" into content`}
                  >
                    <Plus className="w-3 h-3 text-indigo-500" />
                    <span>{snip.title || `Snippet ${sIdx + 1}`}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('snippets')}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
              >
                + Add / Manage Snippets
              </button>
            </div>
          )}

          {/* Tab 1: English Markdown Editor */}
          {activeTab === 'en' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-slate-700 font-semibold">
                  English Lesson Content (Markdown with embedded code snippets)
                </label>
                <span className="text-[11px] text-slate-400">
                  Tip: Place code blocks anywhere using standard ```java ... ``` or click quick insert buttons above.
                </span>
              </div>
              <textarea
                ref={enTextareaRef}
                rows="15"
                value={formData.contentEn}
                onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                placeholder="# Lesson Title\n\nExplain your concept in detail here..."
                className="w-full font-mono bg-slate-900 text-emerald-400 border border-slate-800 rounded-2xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                required
              />
            </div>
          )}

          {/* Tab 2: Hinglish Markdown Editor */}
          {activeTab === 'hinglish' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-slate-700 font-semibold">
                  Hinglish Explanation (Hindi + English Romanized Markdown)
                </label>
                <span className="text-[11px] text-slate-400">
                  Learners can toggle between English and Hinglish seamlessly.
                </span>
              </div>
              <textarea
                ref={hiTextareaRef}
                rows="15"
                value={formData.contentHinglish}
                onChange={(e) => setFormData({ ...formData, contentHinglish: e.target.value })}
                placeholder="# Chapter Introduction 🇮🇳\n\nIs concept ko simple hinglish me samjhayein..."
                className="w-full font-mono bg-slate-900 text-amber-300 border border-slate-800 rounded-2xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>
          )}

          {/* Tab 3: Multiple Code Snippets Manager & Placement */}
          {activeTab === 'snippets' && (
            <div className="space-y-4 bg-slate-50/70 p-5 border border-slate-200 rounded-2xl">
              
              {/* Snippets Navigation & Add Button */}
              <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-200 pb-3">
                <div className="flex items-center gap-1.5 overflow-x-auto flex-1">
                  {formData.codeSnippets?.map((snip, idx) => (
                    <button
                      key={snip.id || idx}
                      type="button"
                      onClick={() => setSelectedSnippetIdx(idx)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                        selectedSnippetIdx === idx
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      <span>{snip.title || `Snippet ${idx + 1}`}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddSnippet}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Snippet</span>
                </button>
              </div>

              {/* Active Snippet Editor Panel */}
              {currentSnippet && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
                  
                  {/* Snippet Header Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    
                    <div className="sm:col-span-6">
                      <label className="block text-slate-700 font-semibold mb-1">
                        Snippet Title / Concept Name *
                      </label>
                      <input
                        type="text"
                        value={currentSnippet.title}
                        onChange={(e) => handleUpdateCurrentSnippet('title', e.target.value)}
                        placeholder="e.g. Concept 1: Variable Declaration & Initialization"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-indigo-500 text-xs"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-slate-700 font-semibold mb-1">
                        Language
                      </label>
                      <select
                        value={currentSnippet.language || 'java'}
                        onChange={(e) => handleUpdateCurrentSnippet('language', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-indigo-500 text-xs"
                      >
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <option key={lang.id} value={lang.id}>{lang.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveSnippet(selectedSnippetIdx)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1 border border-rose-200 transition-colors cursor-pointer"
                        title="Delete this snippet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                  </div>

                  {/* Code Editor */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Code Content ({currentSnippet.language?.toUpperCase()})
                    </label>
                    <textarea
                      rows="10"
                      value={currentSnippet.code}
                      onChange={(e) => handleUpdateCurrentSnippet('code', e.target.value)}
                      placeholder="// Type or paste your code snippet here..."
                      className="w-full font-mono bg-slate-950 text-sky-300 border border-slate-800 rounded-xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                    />
                  </div>

                  {/* Concept Explanation / Output Notes */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Concept Explanation / Expected Output (Optional)
                    </label>
                    <input
                      type="text"
                      value={currentSnippet.explanation || ''}
                      onChange={(e) => handleUpdateCurrentSnippet('explanation', e.target.value)}
                      placeholder="e.g. Expected Output: Welcome to Java Programming! Time Complexity: O(1)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>

                  {/* Placement & Insertion Actions */}
                  <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">
                          Decide where to place this snippet:
                        </span>
                        <span className="text-[11px] text-slate-600">
                          Click below to insert this snippet at the cursor in your Markdown text.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleInsertSnippetIntoMarkdown('contentEn')}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>Insert in English</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInsertSnippetIntoMarkdown('contentHinglish')}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>Insert in Hinglish 🇮🇳</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* Tab 4: Live Preview */}
          {activeTab === 'preview' && (
            <div className="p-6 bg-white border border-slate-200 rounded-2xl min-h-[350px] overflow-y-auto space-y-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-1">{formData.title || 'Chapter Title'}</h1>
                <div className="flex items-center gap-3 text-slate-500 text-[11px] pb-3 border-b border-slate-100 font-mono">
                  <span>⏱ {formData.estimatedMinutes} mins read</span>
                  <span>•</span>
                  <span>Order #{formData.orderIndex}</span>
                  <span>•</span>
                  <span>{formData.codeSnippets?.length || 0} Code Snippets Defined</span>
                </div>
              </div>

              <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed">
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
                    <Save className="w-4 h-4" /> Save Chapter & Snippets
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
