import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  Code2, 
  Languages, 
  AlertCircle, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Info,
  GraduationCap,
  Bookmark,
  CheckCircle2
} from 'lucide-react';
import { coursesApi } from '../services/coursesApi';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useLearningProgress } from '../context/LearningProgressContext';

export const LessonReaderPage = () => {
  const { courseSlug, lessonSlug } = useParams();
  const navigate = useNavigate();

  const {
    isLessonCompleted,
    isLessonBookmarked,
    markLessonInProgress,
    markLessonCompleted,
    toggleLessonBookmark
  } = useLearningProgress();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [is404, setIs404] = useState(false);

  // Language state: 'en' | 'hinglish'
  const [language, setLanguage] = useState('en');
  
  // Code snippet language tab
  const [activeCodeTab, setActiveCodeTab] = useState('java');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const loadLesson = async () => {
    if (!courseSlug || !lessonSlug) return;
    setLoading(true);
    setError(null);
    setIs404(false);

    try {
      const res = await coursesApi.getLesson(courseSlug, lessonSlug, language);
      if (res.success && res.data) {
        setLesson(res.data);
        // Authoritatively notify server that lesson is in-progress
        markLessonInProgress(res.data.id);
      } else {
        if (res.status === 404) {
          setIs404(true);
        } else {
          setError(res.message || 'Failed to load lesson content.');
        }
      }
    } catch (err) {
      setError('Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLesson();
  }, [courseSlug, lessonSlug, language]);

  // Select appropriate default code tab based on available snippets
  useEffect(() => {
    if (lesson) {
      if (lesson.codeSnippetJava) setActiveCodeTab('java');
      else if (lesson.codeSnippetCpp) setActiveCodeTab('cpp');
      else if (lesson.codeSnippetPython) setActiveCodeTab('python');
      else if (lesson.codeSnippetJs) setActiveCodeTab('js');
    }
  }, [lesson]);

  const getActiveCodeSnippet = () => {
    if (!lesson) return null;
    switch (activeCodeTab) {
      case 'java': return lesson.codeSnippetJava;
      case 'cpp': return lesson.codeSnippetCpp;
      case 'python': return lesson.codeSnippetPython;
      case 'js': return lesson.codeSnippetJs;
      default: return null;
    }
  };

  const handleCopyCode = () => {
    const code = getActiveCodeSnippet();
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedSnippet(true);
        setTimeout(() => setCopiedSnippet(false), 2000);
      });
    }
  };

  const handleToggleComplete = async () => {
    if (!lesson || isCompleting) return;
    setIsCompleting(true);
    try {
      await markLessonCompleted(lesson.id, courseSlug);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!lesson) return;
    await toggleLessonBookmark(lesson.id);
  };

  const completed = lesson ? isLessonCompleted(lesson.id) : false;
  const bookmarked = lesson ? isLessonBookmarked(lesson.id) : false;

  return (
    <div className="min-h-screen bg-[#080d1e] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <Link
            to={`/courses/${courseSlug}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-sky-400 transition-colors bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Syllabus
          </Link>

          <div className="flex items-center gap-3">
            {/* Bookmark Button */}
            {lesson && (
              <button
                onClick={handleToggleBookmark}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  bookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border-slate-800'
                }`}
                title={bookmarked ? 'Remove Bookmark' : 'Bookmark Lesson'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            )}

            {/* Bilingual Language Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-sky-400" /> Language:
              </span>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hinglish')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'hinglish'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hinglish 🇮🇳
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6 animate-pulse">
            <div className="h-6 bg-slate-800 rounded w-1/4" />
            <div className="h-10 bg-slate-800 rounded w-2/3" />
            <div className="space-y-3 pt-4">
              <div className="h-4 bg-slate-800 rounded w-full" />
              <div className="h-4 bg-slate-800 rounded w-5/6" />
              <div className="h-4 bg-slate-800 rounded w-4/6" />
            </div>
          </div>
        )}

        {/* 404 Not Found */}
        {!loading && is404 && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center space-y-5 max-w-lg mx-auto">
            <div className="w-14 h-14 bg-slate-800 text-sky-400 rounded-2xl flex items-center justify-center mx-auto">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white">Lesson Not Found</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              We couldn't find the lesson <span className="font-mono text-sky-300">"{lessonSlug}"</span> in this course.
            </p>
            <Link
              to={`/courses/${courseSlug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Return to Course Syllabus
            </Link>
          </div>
        )}

        {/* Error State */}
        {!loading && !is404 && error && (
          <div className="bg-rose-950/40 border border-rose-800/60 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Error Loading Lesson</h3>
            <p className="text-xs text-slate-300">{error}</p>
            <button
              onClick={loadLesson}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Loaded Lesson Content */}
        {!loading && !is404 && !error && lesson && (
          <div className="space-y-8">
            
            {/* Fallback Notice if Hinglish was requested but English was served */}
            {lesson.isFallback && (
              <div className="bg-amber-950/40 border border-amber-800/60 rounded-2xl p-4 flex items-center gap-3 text-xs text-amber-200">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  Hinglish explanation is currently in preparation for this lesson. Showing standard English content.
                </span>
              </div>
            )}

            {/* Lesson Header Card */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-medium">
                  <span className="text-sky-400 font-semibold">{lesson.courseTitle}</span>
                  <span>•</span>
                  <span>{lesson.moduleTitle}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-sky-400" /> {lesson.estimatedMinutes || 10} mins read
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {lesson.title}
                </h1>
              </div>

              {/* Completion Action */}
              <div className="flex-shrink-0">
                <button
                  onClick={handleToggleComplete}
                  disabled={isCompleting || completed}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    completed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 text-white shadow-lg shadow-brand-500/25 active:scale-95'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${completed ? 'text-emerald-400' : 'text-white'}`} />
                  <span>{completed ? 'Lesson Completed' : 'Mark as Completed'}</span>
                </button>
              </div>
            </div>

            {/* Main Markdown Body */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
              <MarkdownRenderer content={lesson.content} />
            </div>

            {/* Multi-Language Code Snippets (if available) */}
            {(lesson.codeSnippetJava || lesson.codeSnippetCpp || lesson.codeSnippetPython || lesson.codeSnippetJs) && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-sky-400" />
                    <h3 className="text-base font-bold text-white">Reference Code Implementation</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Copy-only (no remote execution)</span>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    {lesson.codeSnippetJava && (
                      <button
                        onClick={() => setActiveCodeTab('java')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          activeCodeTab === 'java'
                            ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Java
                      </button>
                    )}
                    {lesson.codeSnippetCpp && (
                      <button
                        onClick={() => setActiveCodeTab('cpp')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          activeCodeTab === 'cpp'
                            ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        C++
                      </button>
                    )}
                    {lesson.codeSnippetPython && (
                      <button
                        onClick={() => setActiveCodeTab('python')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          activeCodeTab === 'python'
                            ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Python
                      </button>
                    )}
                    {lesson.codeSnippetJs && (
                      <button
                        onClick={() => setActiveCodeTab('js')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          activeCodeTab === 'js'
                            ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        JavaScript
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
                  >
                    {copiedSnippet ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Snippet</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Body */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto">
                  <pre className="text-xs font-mono text-sky-200 leading-relaxed">
                    <code>{getActiveCodeSnippet()}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Bottom Lesson Navigation */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-800">
              {lesson.previousLessonSlug ? (
                <Link
                  to={`/courses/${courseSlug}/lessons/${lesson.previousLessonSlug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Lesson
                </Link>
              ) : (
                <div />
              )}

              {lesson.nextLessonSlug ? (
                <Link
                  to={`/courses/${courseSlug}/lessons/${lesson.nextLessonSlug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all"
                >
                  Next Lesson <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to={`/courses/${courseSlug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
                >
                  Complete Module Syllabus <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
