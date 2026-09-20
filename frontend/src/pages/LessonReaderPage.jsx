import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Bookmark, 
  CheckCircle2, 
  Languages, 
  Clock, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Layers, 
  Sparkles,
  Menu,
  HelpCircle,
  Award
} from 'lucide-react';
import { coursesApi } from '../services/coursesApi';
import { studentLearningApi } from '../services/studentLearningApi';
import { useAuth } from '../context/AuthContext';
import { useLearningProgress } from '../context/LearningProgressContext';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { SeoHead } from '../components/seo/SeoHead';
import { AdSlot } from '../components/ads/AdSlot';
import { TutorialSidebar } from '../components/tutorial/TutorialSidebar';
import { TableOfContents } from '../components/tutorial/TableOfContents';

export const LessonReaderPage = () => {
  const { courseSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isLessonCompleted, isCourseBookmarked, toggleLessonCompletion, toggleCourseBookmark } = useLearningProgress();

  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en'); // 'en' | 'hinglish'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load course details (for sidebar navigation & metadata)
  useEffect(() => {
    async function loadCourse() {
      if (!courseSlug) return;
      try {
        const res = await coursesApi.getCourseBySlug(courseSlug);
        if (res.success && res.data) {
          setCourse(res.data);
        }
      } catch (err) {
        console.error('Failed to load course for sidebar', err);
      }
    }
    loadCourse();
  }, [courseSlug]);

  // Load lesson content in selected language
  useEffect(() => {
    async function loadLesson() {
      if (!courseSlug || !lessonSlug) return;
      setLoading(true);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        const res = await coursesApi.getLesson(courseSlug, lessonSlug, language);
        if (res.success && res.data) {
          setLesson(res.data);
        } else {
          setError(res.message || 'Lesson content could not be loaded.');
        }
      } catch (err) {
        setError('Network error while fetching lesson content.');
      } finally {
        setLoading(false);
      }
    }
    loadLesson();
  }, [courseSlug, lessonSlug, language]);

  // Flatten all lessons in course to find prev/next navigation
  const allLessons = React.useMemo(() => {
    if (!course || !course.modules) return [];
    return course.modules.flatMap((m) => m.lessons || []);
  }, [course]);

  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isCompleted = lesson ? isLessonCompleted(lesson.id) : false;
  const isBookmarked = course ? isCourseBookmarked(course.id) : false;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: lesson?.title || 'CodeOrbit CS Tutorial',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1e] text-slate-100 flex flex-col">
      {/* SEO Dynamic Head */}
      {lesson && (
        <SeoHead
          title={`${lesson.title} — ${course?.title || 'Computer Science'}`}
          description={lesson.shortDescription || `Learn ${lesson.title} with clear explanations, code examples, and practice questions in English & Hinglish.`}
          canonicalUrl={`https://www.codeorbit.online/courses/${courseSlug}/lessons/${lessonSlug}`}
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: 'Tutorials', url: '/courses' },
            { name: course?.title || 'Course', url: `/courses/${courseSlug}` },
            { name: lesson.title, url: `/courses/${courseSlug}/lessons/${lessonSlug}` }
          ]}
          article={{
            section: course?.track || 'Computer Science',
            tags: [course?.track, 'Tutorial', 'DSA', 'Computer Science'].filter(Boolean)
          }}
        />
      )}

      {/* Top Banner / Mobile Sidebar Trigger Bar */}
      <div className="sticky top-16 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Open Syllabus"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
            <Link to="/courses" className="hover:text-white transition-colors">
              Tutorials
            </Link>
            <span>/</span>
            <Link to={`/courses/${courseSlug}`} className="text-brand-400 hover:underline truncate max-w-[140px] sm:max-w-[200px]">
              {course?.title || courseSlug}
            </Link>
            {lesson && (
              <>
                <span className="hidden sm:inline">/</span>
                <span className="text-slate-200 font-semibold truncate hidden sm:inline max-w-[180px]">
                  {lesson.title}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Controls: Hinglish Switch & Share */}
        <div className="flex items-center gap-2">
          {/* English / Hinglish Toggle */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 shadow-inner">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                language === 'en'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hinglish')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                language === 'hinglish'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Hinglish</span>
              <span className="text-[10px]">🇮🇳</span>
            </button>
          </div>

          <button
            onClick={handleShare}
            title="Share Tutorial"
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout Container */}
      <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 flex-1 flex">
        {/* Left Column: Topic Syllabus Sidebar */}
        <TutorialSidebar
          course={course}
          activeLessonSlug={lessonSlug}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Center Column: Main Article & Code Reader */}
        <main className="flex-1 min-w-0 px-2 sm:px-6 lg:px-8 py-6 space-y-6 max-w-4xl mx-auto">
          {/* Top Leaderboard Ad Slot */}
          <AdSlot slotType="leaderboard" />

          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-8 bg-slate-800/60 rounded-xl w-3/4"></div>
              <div className="h-4 bg-slate-800/40 rounded w-1/2"></div>
              <div className="space-y-3 pt-4">
                <div className="h-4 bg-slate-800/40 rounded w-full"></div>
                <div className="h-4 bg-slate-800/40 rounded w-5/6"></div>
                <div className="h-4 bg-slate-800/40 rounded w-4/6"></div>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 rounded-3xl bg-rose-950/20 border border-rose-800/40 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
              <h2 className="text-xl font-bold text-white">Tutorial Not Found</h2>
              <p className="text-xs text-rose-300 max-w-md mx-auto">{error}</p>
              <Link
                to={`/courses/${courseSlug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Subject Syllabus</span>
              </Link>
            </div>
          ) : lesson ? (
            <article className="space-y-6">
              {/* Article Header */}
              <header className="space-y-3 border-b border-slate-800/80 pb-6">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-2.5 py-0.5 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20 font-bold uppercase tracking-wider">
                    {course?.track || 'CS Core'}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {lesson.estimatedMinutes || 15} mins read
                  </span>
                  {lesson.hinglishStatus && language === 'hinglish' && (
                    <>
                      <span className="text-slate-500">•</span>
                      <span className="text-emerald-400 font-semibold text-[11px]">
                        Hinglish Edition Available
                      </span>
                    </>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {lesson.title}
                </h1>
              </header>

              {/* Markdown Content (Sanitized & Rich Code Rendering) */}
              <div className="prose prose-invert max-w-none prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-headings:text-white prose-headings:font-bold prose-a:text-brand-400">
                <MarkdownRenderer content={lesson.contentMarkdown || ''} />
              </div>

              {/* In-Article Mid-Way Ad Slot */}
              <AdSlot slotType="in_article" />

              {/* Lesson Completion & Feedback Bar */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Finished reading this topic?</h3>
                    <p className="text-xs text-slate-400">Mark it completed to track your syllabus progress.</p>
                  </div>
                </div>

                <button
                  onClick={() => lesson && toggleLessonCompletion(lesson.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCompleted ? 'Completed ✓' : 'Mark as Completed'}</span>
                </button>
              </div>

              {/* Previous / Next Topic Navigation */}
              <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-800/80">
                {prevLesson ? (
                  <Link
                    to={`/courses/${courseSlug}/lessons/${prevLesson.slug}`}
                    className="group p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 transition-all flex flex-col items-start gap-1"
                  >
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 group-hover:text-brand-400">
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous Topic
                    </span>
                    <span className="text-sm font-bold text-slate-200 group-hover:text-white truncate w-full text-left">
                      {prevLesson.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <Link
                    to={`/courses/${courseSlug}/lessons/${nextLesson.slug}`}
                    className="group p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-brand-500/40 hover:bg-slate-800/40 transition-all flex flex-col items-end gap-1 text-right"
                  >
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 group-hover:text-brand-400">
                      Next Topic <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-sm font-bold text-slate-200 group-hover:text-white truncate w-full">
                      {nextLesson.title}
                    </span>
                  </Link>
                ) : (
                  <Link
                    to={`/courses/${courseSlug}`}
                    className="group p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-brand-500/40 hover:bg-slate-800/40 transition-all flex flex-col items-end gap-1 text-right"
                  >
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 group-hover:text-brand-400">
                      Track Completed <Award className="w-3.5 h-3.5 text-amber-400" />
                    </span>
                    <span className="text-sm font-bold text-emerald-400 truncate w-full">
                      View Certificate & Track Summary →
                    </span>
                  </Link>
                )}
              </nav>

              {/* Bottom Footer Ad Slot */}
              <AdSlot slotType="footer_banner" />
            </article>
          ) : null}
        </main>

        {/* Right Column: Dynamic Table of Contents & Sticky AdSense Banner */}
        <aside className="hidden xl:block w-72 h-[calc(100vh-5rem)] sticky top-20 p-4 space-y-4 overflow-y-auto custom-scrollbar">
          {lesson && <TableOfContents markdownContent={lesson.contentMarkdown || ''} />}

          {/* Sticky Sidebar Banner Ad */}
          <AdSlot slotType="sidebar" />
        </aside>
      </div>
    </div>
  );
};
