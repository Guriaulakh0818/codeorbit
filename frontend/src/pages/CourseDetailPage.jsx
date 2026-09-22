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
  ArrowRight,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { coursesApi } from '../services/coursesApi';
import { studentLearningApi } from '../services/studentLearningApi';
import { createPlacementReadyOrder, verifyPlacementReadyPayment, getPlacementReadyStatus } from '../services/paymentApi';
import { certificateApi } from '../services/certificateApi';
import { openRazorpayCheckout } from '../utils/useRazorpay';
import { useLearningProgress } from '../context/LearningProgressContext';
import { SeoHead } from '../components/seo/SeoHead';
import { AdSlot } from '../components/ads/AdSlot';
import { triggerConfetti } from '../utils/confettiHelper';
import { Button, Card, CardContent, Badge, ProgressBar, Skeleton, EmptyState, ErrorState } from '../components/ui';

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
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState(null);

  // Placement Ready ₹29 Payment States
  const [isPlacementReadyPurchased, setIsPlacementReadyPurchased] = useState(false);
  const [placementPaymentLoading, setPlacementPaymentLoading] = useState(false);
  const [placementPaymentError, setPlacementPaymentError] = useState(null);
  const [placementPaymentSuccess, setPlacementPaymentSuccess] = useState(null);

  // Certificate ₹9 Payment & Status States
  const [certStatus, setCertStatus] = useState(null);
  const [certPaymentLoading, setCertPaymentLoading] = useState(false);
  const [certPaymentError, setCertPaymentError] = useState(null);
  const [certPaymentSuccess, setCertPaymentSuccess] = useState(null);
  const [certDownloadLoading, setCertDownloadLoading] = useState(false);
  
  // Track open/closed state for module accordions (all open by default)
  const [openModules, setOpenModules] = useState({});
  const [openFaq, setOpenFaq] = useState({});

  const handleEnrollCourse = async () => {
    if (!courseSlug || enrolling) return;

    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setEnrolling(true);
    setEnrollMsg(null);
    try {
      const res = await studentLearningApi.enrollInCourse(courseSlug);
      if (res.success) {
        setIsEnrolled(true);
        setEnrollMsg('Enrolled successfully in this subject track!');
        triggerConfetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      }
    } catch (e) {
      setEnrollMsg('Could not complete enrollment.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnlockPlacementReady = async () => {
    if (!courseSlug || placementPaymentLoading || isPlacementReadyPurchased) return;

    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setPlacementPaymentLoading(true);
    setPlacementPaymentError(null);
    setPlacementPaymentSuccess(null);

    try {
      const orderData = await createPlacementReadyOrder(courseSlug);
      if (!orderData || !orderData.razorpayOrderId) {
        throw new Error('Failed to create payment order from server.');
      }

      await openRazorpayCheckout({
        orderData,
        onSuccess: async (verifyPayload) => {
          try {
            await verifyPlacementReadyPayment(verifyPayload);
            setIsPlacementReadyPurchased(true);
            setPlacementPaymentSuccess('Placement Ready track unlocked successfully! You now have lifetime access.');
            triggerConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            loadCourseDetail();
          } catch (vErr) {
            setPlacementPaymentError(vErr.response?.data?.message || vErr.message || 'Payment verification failed.');
          } finally {
            setPlacementPaymentLoading(false);
          }
        },
        onError: (err) => {
          setPlacementPaymentError(err.message || 'Payment transaction failed or was cancelled.');
          setPlacementPaymentLoading(false);
        },
        onDismiss: () => {
          setPlacementPaymentLoading(false);
        }
      });
    } catch (err) {
      setPlacementPaymentError(err.response?.data?.message || err.message || 'Unable to start checkout.');
      setPlacementPaymentLoading(false);
    }
  };

  const handlePurchaseCertificate = async () => {
    if (!courseSlug || certPaymentLoading) return;

    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setCertPaymentLoading(true);
    setCertPaymentError(null);
    setCertPaymentSuccess(null);

    try {
      const orderRes = await certificateApi.createCertificateOrder(courseSlug);
      if (!orderRes.success || !orderRes.data?.razorpayOrderId) {
        throw new Error(orderRes.message || 'Failed to create certificate order.');
      }

      await openRazorpayCheckout({
        orderData: orderRes.data,
        onSuccess: async (verifyPayload) => {
          try {
            const verifyRes = await certificateApi.verifyCertificatePayment(courseSlug, verifyPayload);
            if (verifyRes.success && verifyRes.data) {
              setCertPaymentSuccess('Payment verified! Your official certificate is issued and available for download.');
              triggerConfetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
              // Refresh status
              const statusRes = await certificateApi.getCertificateStatus(courseSlug);
              if (statusRes.success) setCertStatus(statusRes.data);
              fetchCourseProgress(courseSlug);
            } else {
              setCertPaymentError(verifyRes.message || 'Payment verification failed.');
            }
          } catch (vErr) {
            setCertPaymentError(vErr.message || 'Payment verification failed.');
          } finally {
            setCertPaymentLoading(false);
          }
        },
        onError: (err) => {
          setCertPaymentError(err.message || 'Payment transaction cancelled or failed.');
          setCertPaymentLoading(false);
        },
        onDismiss: () => {
          setCertPaymentLoading(false);
        }
      });
    } catch (err) {
      setCertPaymentError(err.message || 'Could not initiate certificate payment.');
      setCertPaymentLoading(false);
    }
  };

  const handleDownloadCertificate = async (certCode) => {
    if (!certCode || certDownloadLoading) return;
    setCertDownloadLoading(true);
    try {
      const res = await certificateApi.downloadCertificatePdf(certCode);
      if (!res.success) {
        alert(res.message || 'Could not download certificate PDF');
      }
    } catch (e) {
      alert('Error downloading certificate PDF');
    } finally {
      setCertDownloadLoading(false);
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

        // Check enrollment, certificate and Placement Ready status if authenticated
        if (user) {
          studentLearningApi.getEnrollmentStatus(courseSlug).then((eRes) => {
            if (eRes.success) {
              setIsEnrolled(eRes.isEnrolled);
            }
          }).catch(() => {});

          getPlacementReadyStatus(courseSlug).then((pRes) => {
            if (pRes && pRes.hasAccess) {
              setIsPlacementReadyPurchased(true);
            }
          }).catch(() => {});

          certificateApi.getCertificateStatus(courseSlug).then((cRes) => {
            if (cRes.success && cRes.data) {
              setCertStatus(cRes.data);
            }
          }).catch(() => {});
        }
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
  }, [courseSlug, user]);

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
  const progressData = (courseSlug && courseProgressMap?.[courseSlug]) || (course?.id && courseProgressMap?.[course.id]) || null;

  const faqs = useMemo(() => {
    if (!course) return [];
    return [
      {
        question: `Is the ${course.title} course completely free on CodeOrbit?`,
        answer: `Yes, all Level 1 (Beginner), Level 2 (Intermediate), and Level 3 (Advanced) lessons, notes, code examples, and module quizzes for ${course.title} are 100% free with no hidden charges.`
      },
      {
        question: `Are lessons available in both English and Hinglish?`,
        answer: `Yes! CodeOrbit provides complete bilingual support. You can seamlessly switch between polished English and conversational Hinglish explanations for every lesson.`
      },
      {
        question: `How do I earn an official academic certificate for ${course.title}?`,
        answer: `Complete all Level 1-3 module quizzes and final exams with a passing score of 80% or higher. Once eligible, you can claim your cryptographically verifiable certificate with QR code for ₹9.`
      },
      {
        question: `What is included in the Placement Ready track?`,
        answer: `The Placement Ready track contains curated FAANG & top product company interview question breakdowns, system patterns, and advanced problem-solving strategies available for a one-time ₹29 unlock.`
      }
    ];
  }, [course]);

  const toggleFaq = (idx) => {
    setOpenFaq(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* SEO Dynamic Head */}
      {course && (
        <SeoHead
          title={`${course.title} Syllabus, Tutorials & Practice Quizzes`}
          description={course.shortDescription || `Master ${course.title} from beginner to advanced. Complete syllabus, verified code examples, practice quizzes, and placement notes in English and Hinglish.`}
          canonicalUrl={`/courses/${courseSlug}`}
          course={{
            name: course.title,
            description: course.description || course.shortDescription,
            isAccessibleForFree: true,
            educationalLevel: course.difficultyLevel || 'Beginner to Advanced'
          }}
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: 'Courses', url: '/courses' },
            { name: course.title, url: `/courses/${courseSlug}` }
          ]}
          faq={faqs}
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

              {/* Enrollment Status & Actions */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                    isEnrolled ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-white text-slate-700 border-slate-200'
                  }`}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{isEnrolled ? 'You are Enrolled in this Course' : 'Free Student Enrollment'}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isEnrolled ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {isEnrolled ? 'ACTIVE ENROLLMENT' : 'NOT ENROLLED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {isEnrolled
                        ? 'Track your 4-level progress, take quizzes, and earn your certificate on your dashboard.'
                        : 'Enroll for free to add this subject to your Student Dashboard and save your learning progress.'}
                    </p>
                  </div>
                </div>

                {!isEnrolled ? (
                  <button
                    onClick={handleEnrollCourse}
                    disabled={enrolling}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex-shrink-0 cursor-pointer active:scale-95"
                  >
                    {enrolling ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Enrolling...
                      </>
                    ) : (
                      <>
                        <span>Enroll for Free</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    to="/student/dashboard"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-emerald-800 text-xs font-semibold rounded-xl transition-colors flex-shrink-0 shadow-2xs"
                  >
                    <span>View in Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {enrollMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{enrollMsg}</span>
                </div>
              )}

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

                  {/* Certificate Status & ₹9 Purchase / Download Section */}
                  <div className="bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 border-2 border-emerald-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-2xs flex-shrink-0">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                              Official Subject Academic Certificate
                            </h3>
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                              ₹9 INR
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Verifiable credential with public QR verification & official PDF download.
                          </p>
                        </div>
                      </div>

                      {/* Top Action / Status Badge */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {certStatus?.issued || progressData?.certificateCode ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ISSUED & VERIFIED
                          </span>
                        ) : certStatus?.eligible ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-300 animate-pulse">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> READY TO CLAIM
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> IN PROGRESS
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Requirements Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <div className="flex justify-between text-slate-600 font-semibold">
                          <span>1. Module Quizzes Passed (Levels 1-3)</span>
                          <span className="font-mono font-bold text-slate-900">
                            {certStatus?.completedModuleQuizzes ?? 0} / 12 (80%+ score)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all"
                            style={{ width: `${Math.min(100, ((certStatus?.completedModuleQuizzes ?? 0) / 12) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <div className="flex justify-between text-slate-600 font-semibold">
                          <span>2. Final Exams Passed (Levels 1-3)</span>
                          <span className="font-mono font-bold text-slate-900">
                            {certStatus?.completedFinalQuizzes ?? 0} / 3 (80%+ score)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all"
                            style={{ width: `${Math.min(100, ((certStatus?.completedFinalQuizzes ?? 0) / 3) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 italic">
                      * Certificate eligibility requires passing all 12 module quizzes and 3 level exams across Beginner, Intermediate, and Advanced. Placement Ready is NOT required.
                    </p>

                    {/* Action Area Based on State */}
                    {certStatus?.issued || progressData?.certificateCode ? (
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <span>Certificate ID:</span>
                            <code className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-900 font-bold">
                              {certStatus?.certificateCode || progressData?.certificateCode}
                            </code>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            Cryptographically registered in the official CodeOrbit registry.
                          </p>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => handleDownloadCertificate(certStatus?.certificateCode || progressData?.certificateCode)}
                            disabled={certDownloadLoading}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>{certDownloadLoading ? 'Downloading PDF...' : 'Download Official PDF'}</span>
                          </button>

                          <Link
                            to={`/verify/${certStatus?.certificateCode || progressData?.certificateCode}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-colors"
                          >
                            <span>Verify Online</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          </Link>
                        </div>
                      </div>
                    ) : certStatus?.eligible ? (
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-300 shadow-2xs">
                        <div>
                          <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> All Requirements Satisfied!
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            Unlock and generate your official verified certificate for a one-time fee of ₹9.
                          </p>
                        </div>

                        <button
                          onClick={handlePurchaseCertificate}
                          disabled={certPaymentLoading}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                        >
                          {certPaymentLoading ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Processing Payment...</span>
                            </>
                          ) : (
                            <>
                              <Award className="w-3.5 h-3.5" />
                              <span>Get Certificate — ₹9</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>Complete the remaining module quizzes and final exams to unlock your ₹9 certificate.</span>
                      </div>
                    )}

                    {certPaymentError && (
                      <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                        <span>{certPaymentError}</span>
                      </div>
                    )}

                    {certPaymentSuccess && (
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{certPaymentSuccess}</span>
                      </div>
                    )}
                  </div>
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
                const subcourseObj = (course.subcourses || []).find(s => s.curriculumLevel === tier.levelKey);
                const subcourseSlug = subcourseObj?.slug || tier.levelKey.toLowerCase().replace('_', '-');
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
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <Link
                          to={`/courses/${course.slug}/${subcourseSlug}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100/70 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                        >
                          <span>Track Overview</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                          {tierModules.length} Module{tierModules.length === 1 ? '' : 's'}
                        </span>
                      </div>
                    </div>

                    {tier.levelKey === 'PLACEMENT_READY' && (
                      <div className={`p-4 rounded-2xl border ${isPlacementReadyPurchased ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'} space-y-3`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${isPlacementReadyPurchased ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                              {isPlacementReadyPurchased ? '✓' : '₹29'}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">
                                {isPlacementReadyPurchased ? 'Placement Ready Track Unlocked' : 'Unlock Placement Ready Interview Kit'}
                              </h4>
                              <p className="text-xs text-slate-500">
                                {isPlacementReadyPurchased
                                  ? 'You have full lifetime access to FAANG question breakdowns and mock assessments.'
                                  : 'One-time ₹29 unlock for this subject. All other 3 levels remain 100% free.'}
                              </p>
                            </div>
                          </div>

                          {!isPlacementReadyPurchased && (
                            <button
                              onClick={handleUnlockPlacementReady}
                              disabled={placementPaymentLoading}
                              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                            >
                              {placementPaymentLoading ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Processing Payment...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Unlock for ₹29</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {placementPaymentError && (
                          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{placementPaymentError}</span>
                          </div>
                        )}

                        {placementPaymentSuccess && (
                          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            <span>{placementPaymentSuccess}</span>
                          </div>
                        )}
                      </div>
                    )}

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
                              <div className="flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-100/60 transition-colors">
                                <button
                                  onClick={() => toggleModule(mId)}
                                  className="flex items-start gap-3 text-left flex-1 cursor-pointer"
                                >
                                  <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {String(mIdx + 1).padStart(2, '0')}
                                  </span>
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-900 hover:text-emerald-800 transition-colors">
                                      {module.title}
                                    </h4>
                                    {module.description && (
                                      <p className="text-xs text-slate-500 line-clamp-1">{module.description}</p>
                                    )}
                                  </div>
                                </button>

                                <div className="flex items-center gap-2.5 flex-shrink-0 ml-3">
                                  <Link
                                    to={`/courses/${course.slug}/${subcourseSlug}/${module.slug}`}
                                    className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-200 hover:border-emerald-300 transition-colors shadow-2xs"
                                    title="View dedicated module page"
                                  >
                                    <span>Module Notes</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </Link>
                                  <span className="text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                                    {module.lessons?.length || 0} Lessons
                                  </span>
                                  <button
                                    onClick={() => toggleModule(mId)}
                                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    aria-label="Toggle Module Accordion"
                                  >
                                    {isOpen ? (
                                      <ChevronUp className="w-4 h-4 text-slate-400" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-slate-400" />
                                    )}
                                  </button>
                                </div>
                              </div>

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
                                        to={`/courses/${course.slug}/${subcourseSlug}/${module.slug}/${lesson.slug}`}
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
                                              {isFinal ? '25 Questions • 80% Pass Score (Level Exam)' : '10 Questions • 80% Pass Score (Module Quiz)'}
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

            {/* Frequently Asked Questions (FAQ) Section */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Frequently Asked Questions</h3>
                  <p className="text-xs text-slate-500">Everything you need to know about {course.title} on CodeOrbit</p>
                </div>
              </div>

              <div className="space-y-3">
                {faqs.map((faqItem, fIdx) => {
                  const isOpen = openFaq[fIdx];
                  return (
                    <div key={fIdx} className="border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/40">
                      <button
                        onClick={() => toggleFaq(fIdx)}
                        className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-800 hover:text-emerald-800 transition-colors cursor-pointer"
                      >
                        <span>{faqItem.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                          {faqItem.answer}
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
