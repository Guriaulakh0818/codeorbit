import React, { useState, useEffect, useMemo } from 'react';
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
import { useLanguage } from '../context/LanguageContext';
import { useLearningProgress } from '../context/LearningProgressContext';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { SeoHead } from '../components/seo/SeoHead';
import { AdSlot } from '../components/ads/AdSlot';
import { TutorialSidebar } from '../components/tutorial/TutorialSidebar';
import { TableOfContents } from '../components/tutorial/TableOfContents';
import { LanguageSelector } from '../components/LanguageSelector';
import { translateToHinglish } from '../utils/hinglishTranslator';
import { Button, Badge, Card, Skeleton, EmptyState } from '../components/ui';
import confetti from 'canvas-confetti';

export const LessonReaderPage = () => {
  const { courseSlug, subcourseSlug, moduleSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, setLanguage, isHinglish } = useLanguage();
  const { isLessonCompleted, markLessonCompleted, toggleLessonCompletion } = useLearningProgress();

  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Load lesson content in selected language (syncs with global LanguageContext)
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

  // Dynamic language resolution: Instantly switches to Hinglish or English markdown
  const activeContent = useMemo(() => {
    if (!lesson) return '';
    const rawEnglish = lesson.contentEn || lesson.contentMarkdown || lesson.content || '';
    if (isHinglish) {
      if (lesson.contentHinglish && lesson.contentHinglish.trim() && lesson.contentHinglish.trim() !== rawEnglish.trim()) {
        return lesson.contentHinglish;
      }
      return translateToHinglish(rawEnglish);
    }
    return rawEnglish;
  }, [lesson, isHinglish]);

  const activeTitle = useMemo(() => {
    if (!lesson) return '';
    if (isHinglish) {
      if (lesson.titleHinglish && lesson.titleHinglish.trim()) {
        return lesson.titleHinglish;
      }
      return translateToHinglish(lesson.title);
    }
    return lesson.title;
  }, [lesson, isHinglish]);

  // Flatten all lessons in course to find prev/next navigation
  const allLessons = useMemo(() => {
    if (!course) return [];
    if (course.subcourses) {
      return course.subcourses.flatMap((s) => (s.modules || []).flatMap((m) => m.lessons || []));
    }
    if (course.modules) {
      return course.modules.flatMap((m) => m.lessons || []);
    }
    return [];
  }, [course]);

  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isCompleted = lesson
    ? (isLessonCompleted(lesson.id) || isLessonCompleted(lesson.slug) || (lessonSlug && isLessonCompleted(lessonSlug)))
    : (lessonSlug ? isLessonCompleted(lessonSlug) : false);

  const handleToggleCompletion = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    
    const target = lesson || lessonSlug;
    if (!target) return;
    
    const nowCompleted = await toggleLessonCompletion(target, courseSlug, lessonSlug);
    if (nowCompleted) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#10b981', '#34d399', '#f59e0b', '#6366f1']
        });
      } catch (err) {}
    }
  };

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

  // Build hierarchical canonical URL and Breadcrumb array
  const { canonicalUrl, breadcrumbs } = useMemo(() => {
    const list = [
      { name: 'Home', url: '/' },
      { name: 'Courses', url: '/courses' }
    ];

    if (course) {
      list.push({ name: course.title, url: `/courses/${courseSlug}` });
    }

    let url = `https://www.codeorbit.online/courses/${courseSlug}`;

    if (subcourseSlug) {
      list.push({ name: subcourseSlug.replace(/-/g, ' ').toUpperCase(), url: `/courses/${courseSlug}/${subcourseSlug}` });
      url += `/${subcourseSlug}`;
    }

    if (moduleSlug) {
      list.push({ name: moduleSlug.replace(/-/g, ' ').toUpperCase(), url: `/courses/${courseSlug}/${subcourseSlug}/${moduleSlug}` });
      url += `/${moduleSlug}`;
    }

    if (lesson) {
      list.push({ name: lesson.title, url: subcourseSlug && moduleSlug ? `${url}/${lessonSlug}` : `/courses/${courseSlug}/lessons/${lessonSlug}` });
      url = subcourseSlug && moduleSlug ? `${url}/${lessonSlug}` : `https://www.codeorbit.online/courses/${courseSlug}/lessons/${lessonSlug}`;
    } else {
      url = `https://www.codeorbit.online/courses/${courseSlug}/lessons/${lessonSlug}`;
    }

    return { canonicalUrl: url, breadcrumbs: list };
  }, [course, courseSlug, subcourseSlug, moduleSlug, lesson, lessonSlug]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* SEO Dynamic Head */}
      {lesson && (
        <SeoHead
          title={`${lesson.title} — ${course?.title || 'Computer Science'}`}
          description={lesson.shortDescription || `Learn ${lesson.title} with clear explanations, code examples, and practice questions in English & Hinglish.`}
          canonicalUrl={canonicalUrl}
          breadcrumbs={breadcrumbs}
          article={{
            section: course?.track || 'Computer Science',
            tags: [course?.track, 'Tutorial', 'DSA', 'Computer Science'].filter(Boolean)
          }}
          course={{
            name: `${course?.title || 'Computer Science'} — ${lesson.title}`,
            description: lesson.shortDescription || `Free lesson on ${lesson.title}`,
            isAccessibleForFree: true
          }}
        />
      )}

      {/* Top Banner / Mobile Sidebar Trigger Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 cursor-pointer"
            aria-label="Open Syllabus"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Visible Breadcrumbs in top bar */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
            <Link to="/courses" className="hover:text-emerald-700 transition-colors">
              Courses
            </Link>
            <span>/</span>
            <Link to={`/courses/${courseSlug}`} className="text-emerald-700 hover:underline truncate max-w-[120px] font-semibold">
              {course?.title || courseSlug}
            </Link>
            {subcourseSlug && (
              <>
                <span>/</span>
                <Link to={`/courses/${courseSlug}/${subcourseSlug}`} className="hover:text-emerald-700 truncate hidden md:inline max-w-[120px]">
                  {subcourseSlug}
                </Link>
              </>
            )}
            {lesson && (
              <>
                <span>/</span>
                <span className="text-slate-900 font-semibold truncate max-w-[180px]">
                  {lesson.title}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* Action Controls: Hinglish Switch & Share */}
        <div className="flex items-center gap-2">
          <LanguageSelector variant="pill" />

          <button
            onClick={handleShare}
            title={copied ? "Link Copied!" : "Share Tutorial"}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
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
            <div className="space-y-6">
              <Skeleton variant="text" width="60%" height="36px" />
              <Skeleton variant="text" width="40%" height="20px" />
              <div className="space-y-3 pt-4">
                <Skeleton variant="rectangular" height="20px" />
                <Skeleton variant="rectangular" height="20px" />
                <Skeleton variant="rectangular" height="120px" />
                <Skeleton variant="rectangular" height="20px" />
              </div>
            </div>
          ) : error ? (
            <EmptyState
              icon={AlertCircle}
              title="Tutorial Not Found"
              description={error}
              actionText="Back to Subject Syllabus"
              actionHref={`/courses/${courseSlug}`}
            />
          ) : lesson ? (
            <article className="space-y-6">
              {/* Article Header */}
              <header className="space-y-3 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <Badge variant="primary" size="sm">
                    {course?.track || 'CS Core'}
                  </Badge>
                  <span className="text-slate-400">•</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {lesson.estimatedMinutes || 15} mins read
                  </span>
                  {isHinglish && (
                    <>
                      <span className="text-slate-400">•</span>
                      <Badge variant="info" size="xs">
                        Hinglish Edition 🇮🇳
                      </Badge>
                    </>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {activeTitle}
                </h1>
              </header>

              {/* Markdown Content (Eye-friendly typography & high contrast code) */}
              <section className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 prose-strong:text-slate-900 prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:border prose-pre:border-slate-800 prose-a:text-emerald-700 hover:prose-a:underline">
                <MarkdownRenderer content={activeContent} />
              </section>

              {/* In-Article Mid-Way Ad Slot */}
              <AdSlot slotType="in_article" />

              {/* Lesson Completion & Feedback Bar */}
              <Card className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0 shadow-2xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Finished reading this topic?</h3>
                    <p className="text-xs text-slate-500">Mark it completed to track your syllabus progress.</p>
                  </div>
                </div>

                <Button
                  variant={isCompleted ? 'success' : 'outline'}
                  size="sm"
                  onClick={handleToggleCompletion}
                  icon={CheckCircle2}
                >
                  {isCompleted ? 'Completed ✓' : 'Mark as Completed'}
                </Button>
              </Card>

              {/* Previous / Next Topic Navigation */}
              <nav aria-label="Adjacent Lessons" className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200">
                {prevLesson ? (
                  <Link
                    to={`/courses/${courseSlug}/lessons/${prevLesson.slug}`}
                    className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col items-start gap-1"
                  >
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1 group-hover:text-emerald-700">
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous Topic
                    </span>
                    <span className="text-sm font-bold text-slate-800 group-hover:text-slate-900 truncate w-full text-left">
                      {prevLesson.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <Link
                    to={`/courses/${courseSlug}/lessons/${nextLesson.slug}`}
                    className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-xs transition-all flex flex-col items-end gap-1 text-right"
                  >
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1 group-hover:text-emerald-700">
                      Next Topic <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 truncate w-full">
                      {nextLesson.title}
                    </span>
                  </Link>
                ) : (
                  <Link
                    to={`/courses/${courseSlug}`}
                    className="group p-4 rounded-2xl bg-emerald-50 border border-emerald-300 hover:border-emerald-500 hover:shadow-xs transition-all flex flex-col items-end gap-1 text-right"
                  >
                    <span className="text-[11px] font-mono text-emerald-800 flex items-center gap-1 font-bold">
                      Curriculum Finished <Award className="w-3.5 h-3.5 text-amber-500" />
                    </span>
                    <span className="text-sm font-extrabold text-emerald-900 group-hover:text-emerald-950 truncate w-full">
                      View Subject Syllabus & Certificate →
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
          {lesson && <TableOfContents markdownContent={activeContent} />}
          <AdSlot slotType="sidebar" />
        </aside>
      </div>
    </div>
  );
};

export default LessonReaderPage;
