import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import { coursesApi } from '../services/coursesApi';
import { studentLearningApi } from '../services/studentLearningApi';
import { useLearningProgress } from '../context/LearningProgressContext';
import { SeoHead } from '../components/seo/SeoHead';
import { AdSlot } from '../components/ads/AdSlot';
import { triggerConfetti } from '../utils/confettiHelper';

export const CourseDetailPage = () => {
  const { courseSlug } = useParams();

  const {
    isLessonCompleted,
    isLessonBookmarked,
    courseProgressMap,
    fetchCourseProgress
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

  // Calculate totals
  const totalLessons = (course?.modules || []).reduce(
    (acc, m) => acc + (m.lessons?.length || 0), 
    0
  );
  const totalQuizzes = (course?.modules || []).reduce(
    (acc, m) => acc + (m.quizzes?.length || 0), 
    0
  );

  const progressData = courseProgressMap[courseSlug];
  const completionPercentage = progressData?.completionPercentage || 0;
  const completedLessonsCount = progressData?.completedLessons || 0;

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

            {/* Syllabus Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-emerald-700" /> Course Syllabus & Modules
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Step-by-step interactive curriculum with bilingual explanations and self-tests.
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  {course.modules?.length || 0} Modules Total
                </span>
              </div>

              {/* Empty Syllabus State */}
              {(!course.modules || course.modules.length === 0) && (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs">
                  Syllabus is currently being finalized for this track. Please check back soon.
                </div>
              )}

              {/* Module Accordions */}
              <div className="space-y-4">
                {(course.modules || []).map((module, mIdx) => {
                  const mId = module.id || module.slug;
                  const isOpen = openModules[mId] !== false;

                  return (
                    <div
                      key={mId}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-all duration-200"
                    >
                      {/* Module Header */}
                      <button
                        onClick={() => toggleModule(mId)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <span className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                            {String(mIdx + 1).padStart(2, '0')}
                          </span>
                          <div className="space-y-1">
                            <h3 className="text-base font-bold text-slate-900">
                              {module.title}
                            </h3>
                            {module.description && (
                              <p className="text-xs text-slate-500 line-clamp-1">
                                {module.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
                            {module.lessons?.length || 0} Lessons
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Module Body (Lessons & Quizzes) */}
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 space-y-2.5 border-t border-slate-100 bg-slate-50/50">
                          {/* Lessons List */}
                          {(module.lessons || []).map((lesson, lIdx) => {
                            const completed = isLessonCompleted(lesson.id);
                            const bookmarked = isLessonBookmarked(lesson.id);

                            return (
                              <Link
                                key={lesson.id || lesson.slug}
                                to={`/courses/${course.slug}/lessons/${lesson.slug}`}
                                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all group ${
                                  completed
                                    ? 'bg-emerald-50/80 border-emerald-200 hover:border-emerald-300'
                                    : 'bg-white hover:border-emerald-400 border-slate-200 shadow-2xs hover:shadow-xs'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className={`w-6 h-6 rounded-lg text-[11px] font-mono font-semibold flex items-center justify-center flex-shrink-0 transition-colors ${
                                    completed
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-800 border border-slate-200'
                                  }`}>
                                    {completed ? '✓' : `${mIdx + 1}.${lIdx + 1}`}
                                  </span>
                                  <div className="min-w-0 flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors truncate">
                                      {lesson.title}
                                    </span>
                                    {bookmarked && (
                                      <Bookmark className="w-3 h-3 fill-amber-500 text-amber-500 flex-shrink-0" />
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {lesson.hinglishStatus === 'PUBLISHED' && (
                                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                      <span>HI</span>
                                      <span>🇮🇳</span>
                                    </span>
                                  )}
                                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-400" /> {lesson.estimatedMinutes || 10} min
                                  </span>
                                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                                    completed
                                      ? 'text-emerald-800 bg-emerald-50 border-emerald-200 font-bold'
                                      : 'text-slate-700 bg-slate-100 border-slate-200 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600'
                                  }`}>
                                    {completed ? 'Completed' : 'Read Lesson →'}
                                  </span>
                                </div>
                              </Link>
                            );
                          })}

                          {/* Quizzes in Module */}
                          {(module.quizzes || []).map((quiz) => (
                            <Link
                              key={quiz.id || quiz.slug}
                              to={`/courses/${course.slug}/quizzes/${quiz.slug}`}
                              className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200 transition-all group shadow-2xs"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="w-6 h-6 rounded-lg bg-purple-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 shadow-2xs">
                                  Q
                                </span>
                                <div>
                                  <div className="text-xs font-bold text-purple-950 group-hover:text-purple-900 transition-colors">
                                    {quiz.title}
                                  </div>
                                  <div className="text-[10px] text-purple-700">
                                    {quiz.questionCount || 0} Questions • {quiz.minPassScorePercentage}% Pass Score
                                  </div>
                                </div>
                              </div>

                              <span className="text-[11px] font-bold text-purple-800 bg-white px-3 py-1 rounded-lg border border-purple-200 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-colors shadow-2xs">
                                Start Quiz →
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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
