import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Code2, 
  HelpCircle, 
  Layers, 
  Sparkles, 
  Languages, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  RefreshCw, 
  GraduationCap,
  Bookmark,
  Award,
  Terminal,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { coursesApi } from '../services/coursesApi';
import { studentLearningApi } from '../services/studentLearningApi';
import { useLearningProgress } from '../context/LearningProgressContext';
import { SeoHead } from '../components/seo/SeoHead';
import { AdSlot } from '../components/ads/AdSlot';
import { triggerConfetti } from '../utils/confettiHelper';

export const CourseDetailPage = () => {
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    isLessonCompleted,
    isLessonBookmarked,
    courseProgressMap,
    fetchCourseProgress,
    getTrackProgress
  } = useLearningProgress();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [is404, setIs404] = useState(false);
  const [claimingCertificate, setClaimingCertificate] = useState(false);
  const [claimError, setClaimError] = useState(null);
  
  // Track open/closed state for module accordions (all open by default)
  const [openModules, setOpenModules] = useState({});

  const handleClaimCertificate = async () => {
    if (!courseSlug || claimingCertificate) return;

    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setClaimingCertificate(true);
    setClaimError(null);
    try {
      const res = await studentLearningApi.claimCertificate(courseSlug);
      if (res.success && res.data) {
        triggerConfetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        fetchCourseProgress(courseSlug);
      } else {
        setClaimError(res.message || 'Unable to issue certificate at this time.');
      }
    } catch (e) {
      setClaimError('Server error during certificate issuance.');
    } finally {
      setClaimingCertificate(false);
    }
  };

  const loadCourseDetail = async () => {
    if (!courseSlug) return;
    setLoading(true);
    setError(null);
    setIs404(false);

    try {
      const res = await coursesApi.getCourseBySlug(courseSlug);
      if (res.success && res.data) {
        setCourse(res.data);
        // Initialize all modules as expanded
        const initialOpen = {};
        (res.data.modules || []).forEach((m) => {
          initialOpen[m.id || m.slug] = true;
        });
        setOpenModules(initialOpen);

        // Fetch authoritative student progress for this course
        fetchCourseProgress(courseSlug);
      } else {
        if (res.status === 404) {
          setIs404(true);
        } else {
          setError(res.message || 'Failed to load course details.');
        }
      }
    } catch (err) {
      setError('Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseDetail();
  }, [courseSlug]);

  const toggleModule = (moduleId) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Calculate track progress (real-time local + server sync)
  const trackProgress = getTrackProgress(course || courseSlug);
  const totalLessons = trackProgress.totalLessons;
  const completedLessonsCount = trackProgress.completedLessons;
  const completionPercentage = trackProgress.completionPercentage;
  const totalQuizzes = (course?.modules || []).reduce(
    (acc, m) => acc + (m.quizzes?.length || 0), 
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* SEO Dynamic Head */}
      {course && (
        <SeoHead
          title={`${course.title} Syllabus & Notes — CodeOrbit`}
          description={course.shortDescription || `Complete syllabus, verified code examples, and practice quizzes for ${course.title}. 100% Free in English & Hinglish.`}
          canonicalUrl={`https://www.codeorbit.online/courses/${courseSlug}`}
        />
      )}

      <div className="max-w-5xl mx-auto w-full space-y-8 flex-1">
        
        {/* Top Breadcrumbs & Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Subject Tracks
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              100% FREE
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6 animate-pulse">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-4 shadow-xs">
              <div className="h-6 bg-slate-200 rounded w-1/4" />
              <div className="h-10 bg-slate-200 rounded w-2/3" />
              <div className="h-20 bg-slate-200 rounded w-full" />
            </div>
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white border border-slate-200 rounded-2xl p-6 h-32" />
              ))}
            </div>
          </div>
        )}

        {/* 404 Not Found State */}
        {!loading && is404 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-5 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 bg-slate-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto border border-slate-200">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Course Track Not Found</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We couldn't find a published course matching <span className="font-mono text-emerald-700 font-semibold">"{courseSlug}"</span>. It may be in draft mode or the URL may be incorrect.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              Browse All Courses
            </Link>
          </div>
        )}

        {/* Generic Error State */}
        {!loading && !is404 && error && (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-200">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Error Loading Syllabus</h3>
            <p className="text-xs text-rose-700">{error}</p>
            <button
              onClick={loadCourseDetail}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Loaded Course Details & Syllabus */}
        {!loading && !is404 && !error && course && (
          <div className="space-y-8">
            
            {/* Top Leaderboard Ad */}
            <AdSlot slotType="leaderboard" />

            {/* Hero Card */}
            <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {course.track || 'CS CORE'}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {course.difficultyLevel || 'Beginner to Advanced'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                  <Languages className="w-3.5 h-3.5" /> English & Hinglish
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3 max-w-3xl">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {course.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {course.description || course.shortDescription}
                </p>
              </div>

              {/* Progress Bar (if authenticated / progress available) */}
              {progressData && (
                <div className="space-y-3">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Your Learning Progress
                      </span>
                      <span className="font-bold text-emerald-800">
                        {completedLessonsCount} of {totalLessons} Lessons ({completionPercentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300/60">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Certificate Status & Claim Box */}
                  {progressData.certificateCode ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 border border-emerald-200">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <span>Course Certificate Issued</span>
                            <span className="font-mono text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 text-[10px] font-bold">
                              {progressData.certificateCode}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600">
                            Congratulations! Your verifiable completion credential is registered.
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/certificates/verify/${progressData.certificateCode}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex-shrink-0 shadow-xs"
                      >
                        <Award className="w-3.5 h-3.5" /> View Certificate
                      </Link>
                    </div>
                  ) : progressData.eligibleForCertificate ? (
                    <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 border border-emerald-200">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Certificate Ready to Claim!
                          </div>
                          <p className="text-[11px] text-slate-600">
                            You have completed all lessons and passed all module quizzes.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleClaimCertificate}
                        disabled={claimingCertificate}
                        className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex-shrink-0 shadow-xs active:scale-95 cursor-pointer"
                      >
                        {claimingCertificate ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Issuing...
                          </>
                        ) : (
                          <>
                            <Award className="w-3.5 h-3.5" /> Claim Certificate
                          </>
                        )}
                      </button>
                    </div>
                  ) : null}

                  {claimError && (
                    <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>{claimError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-700" /> Modules
                  </div>
                  <div className="text-xl font-extrabold text-slate-900">
                    {course.modules?.length || 0}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" /> Lessons
                  </div>
                  <div className="text-xl font-extrabold text-slate-900">
                    {totalLessons}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-600" /> Quizzes
                  </div>
                  <div className="text-xl font-extrabold text-slate-900">
                    {totalQuizzes}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" /> Estimated
                  </div>
                  <div className="text-xl font-extrabold text-slate-900">
                    ~{course.estimatedHours || 0} Hours
                  </div>
                </div>
              </div>
            </div>

            {/* 4-Tier Curriculum Hierarchy Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-emerald-700" /> Four-Tier Computer Science Curriculum
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Beginner through Placement Ready progressive learning path with module assessments and level final exams.
                </p>
              </div>

              {/* Tiers List */}
              {[
                { 
                  levelKey: 'BEGINNER', 
                  title: 'Level 1: Beginner Fundamentals', 
                  subtitle: 'Core principles, asymptotic notation, and foundational algorithmic concepts', 
                  badge: '100% FREE', 
                  badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
                  accentColor: 'border-l-4 border-l-emerald-500' 
                },
                { 
                  levelKey: 'INTERMEDIATE', 
                  title: 'Level 2: Intermediate Concepts', 
                  subtitle: 'Complex data structures, trees, graphs, and multi-paradigm problem solving', 
                  badge: '100% FREE', 
                  badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
                  accentColor: 'border-l-4 border-l-teal-500' 
                },
                { 
                  levelKey: 'ADVANCED', 
                  title: 'Level 3: Advanced Mastery', 
                  subtitle: 'Dynamic programming, system concurrency, and algorithmic optimization', 
                  badge: '100% FREE (Certificate Unlocks Here)', 
                  badgeColor: 'bg-purple-50 text-purple-800 border-purple-300',
                  accentColor: 'border-l-4 border-l-purple-500' 
                },
                { 
                  levelKey: 'PLACEMENT_READY', 
                  title: 'Level 4: Placement Ready', 
                  subtitle: 'FAANG/Tier-1 Product Company mock interviews and hard problem breakdowns', 
                  badge: '₹29 UNLOCK', 
                  badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
                  accentColor: 'border-l-4 border-l-amber-500' 
                }
              ].map((tier) => {
                const tierModules = (course.modules || []).filter(
                  (m) => (m.curriculumLevel || 'BEGINNER') === tier.levelKey
                );

                if (tierModules.length === 0 && tier.levelKey === 'PLACEMENT_READY') {
                  return null;
                }

                return (
                  <div key={tier.levelKey} className={`bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 ${tier.accentColor}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-slate-900">{tier.title}</h3>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${tier.badgeColor}`}>
                            {tier.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{tier.subtitle}</p>
                      </div>
                      <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
                        {tierModules.length} Module{tierModules.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    {tierModules.length === 0 ? (
                      <div className="text-xs text-slate-400 italic py-2">
                        Lessons and assessments for this tier will be published soon.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {tierModules.map((module, mIdx) => {
                          const mId = module.id || module.slug;
                          const isOpen = openModules[mId] !== false;

                          return (
                            <div
                              key={mId}
                              className="border border-slate-200/90 rounded-2xl overflow-hidden bg-slate-50/40 shadow-2xs"
                            >
                              {/* Module Header */}
                              <button
                                onClick={() => toggleModule(mId)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-100/60 transition-colors cursor-pointer"
                              >
                                <div className="flex items-start gap-3">
                                  <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {String(mIdx + 1).padStart(2, '0')}
                                  </span>
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-900">{module.title}</h4>
                                    {module.description && (
                                      <p className="text-xs text-slate-500 line-clamp-1">{module.description}</p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2.5 flex-shrink-0">
                                  <span className="text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                                    {module.lessons?.length || 0} Lessons
                                  </span>
                                  {isOpen ? (
                                    <ChevronUp className="w-4 h-4 text-slate-400" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                  )}
                                </div>
                              </button>

                              {/* Module Body */}
                              {isOpen && (
                                <div className="px-4 pb-4 pt-1 space-y-2 border-t border-slate-100 bg-white">
                                  {/* Lessons */}
                                  {(module.lessons || []).map((lesson, lIdx) => {
                                    const completed = isLessonCompleted(lesson.id) || isLessonCompleted(lesson.slug);
                                    const bookmarked = isLessonBookmarked(lesson.id) || isLessonBookmarked(lesson.slug);

                                    return (
                                      <Link
                                        key={lesson.id || lesson.slug}
                                        to={`/courses/${course.slug}/lessons/${lesson.slug}`}
                                        className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${
                                          completed
                                            ? 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300'
                                            : 'bg-white hover:border-emerald-400 border-slate-200 shadow-2xs hover:shadow-xs'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <span className={`w-5 h-5 rounded text-[10px] font-mono font-semibold flex items-center justify-center flex-shrink-0 ${
                                            completed
                                              ? 'bg-emerald-600 text-white'
                                              : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-800 border border-slate-200'
                                          }`}>
                                            {completed ? '✓' : `${mIdx + 1}.${lIdx + 1}`}
                                          </span>
                                          <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors truncate">
                                            {lesson.title}
                                          </span>
                                          {bookmarked && (
                                            <Bookmark className="w-3 h-3 fill-amber-500 text-amber-500 flex-shrink-0" />
                                          )}
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                          {lesson.hinglishStatus === 'PUBLISHED' && (
                                            <span className="hidden sm:inline-flex items-center text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                              HI 🇮🇳
                                            </span>
                                          )}
                                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-slate-400" /> {lesson.estimatedMinutes || 10} min
                                          </span>
                                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                                            completed
                                              ? 'text-emerald-800 bg-emerald-50 border-emerald-200 font-bold'
                                              : 'text-slate-700 bg-slate-100 border-slate-200 group-hover:bg-emerald-600 group-hover:text-white'
                                          }`}>
                                            {completed ? 'Done' : 'Read →'}
                                          </span>
                                        </div>
                                      </Link>
                                    );
                                  })}

                                  {/* Quizzes */}
                                  {(module.quizzes || []).map((quiz) => {
                                    const isFinal = quiz.quizType === 'LEVEL_FINAL_QUIZ';
                                    return (
                                      <Link
                                        key={quiz.id || quiz.slug}
                                        to={`/courses/${course.slug}/quizzes/${quiz.slug}`}
                                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all group shadow-2xs ${
                                          isFinal
                                            ? 'bg-gradient-to-r from-amber-50/90 to-amber-100/50 border-amber-300 hover:border-amber-400'
                                            : 'bg-purple-50/90 hover:bg-purple-100/80 border-purple-200 hover:border-purple-300'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <span className={`w-6 h-6 rounded-lg text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 shadow-2xs ${
                                            isFinal ? 'bg-amber-600' : 'bg-purple-600'
                                          }`}>
                                            {isFinal ? '★' : 'Q'}
                                          </span>
                                          <div>
                                            <div className={`text-xs font-bold transition-colors ${
                                              isFinal ? 'text-amber-950 group-hover:text-amber-900' : 'text-purple-950 group-hover:text-purple-900'
                                            }`}>
                                              {quiz.title}
                                            </div>
                                            <div className={`text-[10px] ${isFinal ? 'text-amber-800' : 'text-purple-700'}`}>
                                              {isFinal ? '25 Questions • 80% Pass Score (Level Exam)' : '10 Questions • 75% Pass Score (Module Quiz)'}
                                            </div>
                                          </div>
                                        </div>

                                        <span className={`text-[11px] font-bold bg-white px-3 py-1 rounded-lg border transition-colors shadow-2xs ${
                                          isFinal
                                            ? 'text-amber-900 border-amber-300 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600'
                                            : 'text-purple-800 border-purple-200 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600'
                                        }`}>
                                          Start Assessment →
                                        </span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Ad Slot */}
            <AdSlot slotType="footer_banner" />

          </div>
        )}

      </div>
    </div>
  );
};

export default CourseDetailPage;
