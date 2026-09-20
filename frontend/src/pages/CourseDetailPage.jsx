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
  Award
} from 'lucide-react';
import { coursesApi } from '../services/coursesApi';
import { studentLearningApi } from '../services/studentLearningApi';
import { useLearningProgress } from '../context/LearningProgressContext';
import confetti from 'canvas-confetti';

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
        confetti({
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
    <div className="min-h-screen bg-[#080d1e] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back Link */}
        <div className="flex items-center gap-2">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-sky-400 transition-colors bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6 animate-pulse">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-4">
              <div className="h-6 bg-slate-800 rounded w-1/4" />
              <div className="h-10 bg-slate-800 rounded w-2/3" />
              <div className="h-20 bg-slate-800 rounded w-full" />
            </div>
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-32" />
              ))}
            </div>
          </div>
        )}

        {/* 404 Not Found State */}
        {!loading && is404 && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center space-y-5 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-slate-800/80 text-sky-400 rounded-2xl flex items-center justify-center mx-auto">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Course Not Found</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              We couldn't find a published course matching <span className="font-mono text-sky-300">"{courseSlug}"</span>. It may be in draft mode or the URL may be incorrect.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Browse All Courses
            </Link>
          </div>
        )}

        {/* Generic Error State */}
        {!loading && !is404 && error && (
          <div className="bg-rose-950/40 border border-rose-800/60 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Error Loading Syllabus</h3>
            <p className="text-xs text-slate-300">{error}</p>
            <button
              onClick={loadCourseDetail}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Loaded Course Details & Syllabus */}
        {!loading && !is404 && !error && course && (
          <div className="space-y-8">
            
            {/* Hero Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b132b] via-slate-900 to-brand-950/60 border border-slate-800 p-8 sm:p-12 shadow-2xl space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {course.track || 'Track'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {course.difficultyLevel || 'Beginner to Advanced'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <Languages className="w-3.5 h-3.5" /> English & Hinglish
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3 max-w-3xl">
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {course.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {course.description || course.shortDescription}
                </p>
              </div>

              {/* Progress Bar (if authenticated / progress available) */}
              {progressData && (
                <div className="space-y-3">
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Your Learning Progress
                      </span>
                      <span className="font-bold text-sky-400">
                        {completedLessonsCount} of {totalLessons} Lessons ({completionPercentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Certificate Status & Claim Box */}
                  {progressData.certificateCode ? (
                    <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>Course Certificate Issued</span>
                            <span className="font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px]">
                              {progressData.certificateCode}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            Congratulations! Your verifiable completion credential is registered.
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/certificates/verify/${progressData.certificateCode}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex-shrink-0 shadow-md shadow-emerald-500/20"
                      >
                        <Award className="w-3.5 h-3.5" /> View Certificate
                      </Link>
                    </div>
                  ) : progressData.eligibleForCertificate ? (
                    <div className="bg-gradient-to-r from-sky-950/60 via-brand-950/60 to-purple-950/60 border border-sky-500/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Certificate Ready to Claim!
                          </div>
                          <p className="text-[11px] text-slate-300">
                            You have completed all lessons and passed all module quizzes.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleClaimCertificate}
                        disabled={claimingCertificate}
                        className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 text-white text-xs font-bold rounded-xl transition-all flex-shrink-0 shadow-lg shadow-brand-500/25 active:scale-95"
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
                    <div className="bg-rose-950/40 border border-rose-800/60 p-3 rounded-xl text-xs text-rose-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{claimError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
                <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                    <Layers className="w-3.5 h-3.5 text-sky-400" /> Modules
                  </div>
                  <div className="text-xl font-extrabold text-white">
                    {course.modules?.length || 0}
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" /> Lessons
                  </div>
                  <div className="text-xl font-extrabold text-white">
                    {totalLessons}
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-400" /> Quizzes
                  </div>
                  <div className="text-xl font-extrabold text-white">
                    {totalQuizzes}
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> Estimated
                  </div>
                  <div className="text-xl font-extrabold text-white">
                    ~{course.estimatedHours || 0} Hours
                  </div>
                </div>
              </div>
            </div>

            {/* Syllabus Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-sky-400" /> Course Syllabus & Modules
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Step-by-step interactive curriculum with bilingual explanations and self-tests.
                  </p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                  {course.modules?.length || 0} Modules Total
                </span>
              </div>

              {/* Empty Syllabus State */}
              {(!course.modules || course.modules.length === 0) && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
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
                      className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200"
                    >
                      {/* Module Header */}
                      <button
                        onClick={() => toggleModule(mId)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <span className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                            {String(mIdx + 1).padStart(2, '0')}
                          </span>
                          <div className="space-y-1">
                            <h3 className="text-base font-bold text-white">
                              {module.title}
                            </h3>
                            {module.description && (
                              <p className="text-xs text-slate-400 line-clamp-1">
                                {module.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
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
                        <div className="px-5 pb-5 pt-1 space-y-2 border-t border-slate-800/60 bg-slate-950/30">
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
                                    ? 'bg-emerald-950/10 border-emerald-800/30 hover:border-emerald-500/40'
                                    : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800/60 hover:border-sky-500/40'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className={`w-6 h-6 rounded-lg text-[11px] font-mono font-semibold flex items-center justify-center flex-shrink-0 transition-colors ${
                                    completed
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'bg-slate-800 text-slate-400 group-hover:bg-sky-500/20 group-hover:text-sky-300'
                                  }`}>
                                    {completed ? '✓' : `${mIdx + 1}.${lIdx + 1}`}
                                  </span>
                                  <div className="min-w-0 flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 transition-colors truncate">
                                      {lesson.title}
                                    </span>
                                    {bookmarked && (
                                      <Bookmark className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {lesson.hasHinglish && (
                                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                      EN/HI
                                    </span>
                                  )}
                                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {lesson.estimatedMinutes || 10} min
                                  </span>
                                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border transition-colors ${
                                    completed
                                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                      : 'text-sky-400 bg-sky-500/10 border-sky-500/20 group-hover:bg-sky-500 group-hover:text-white'
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
                              className="flex items-center justify-between p-3.5 rounded-xl bg-purple-950/20 hover:bg-purple-950/40 border border-purple-800/30 hover:border-purple-500/50 transition-all group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 text-[11px] font-bold flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                  Q
                                </span>
                                <div>
                                  <div className="text-xs font-bold text-purple-200 group-hover:text-purple-100 transition-colors">
                                    {quiz.title}
                                  </div>
                                  <div className="text-[10px] text-purple-300/70">
                                    {quiz.questionCount || 0} Questions • {quiz.minPassScorePercentage}% Pass Score
                                  </div>
                                </div>
                              </div>

                              <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-md border border-purple-500/30 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                Start Quiz &rarr;
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

          </div>
        )}

      </div>
    </div>
  );
};
