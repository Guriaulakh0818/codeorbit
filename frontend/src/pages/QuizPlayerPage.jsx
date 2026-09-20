import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RefreshCw, 
  AlertCircle, 
  Clock, 
  Award, 
  Languages, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  LogIn,
  GraduationCap,
  Share2,
  Sparkles,
  Check
} from 'lucide-react';
import { triggerConfetti } from '../utils/confettiHelper';
import { coursesApi } from '../services/coursesApi';
import { studentLearningApi } from '../services/studentLearningApi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useLearningProgress } from '../context/LearningProgressContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { translateToHinglish } from '../utils/hinglishTranslator';

export const QuizPlayerPage = () => {
  const { courseSlug, quizSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, setLanguage, isHinglish } = useLanguage();
  const { fetchCourseProgress } = useLearningProgress();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [is404, setIs404] = useState(false);

  // Quiz taking state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: selectedOptionId }
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  // Certificate state
  const [claimedCertificate, setClaimedCertificate] = useState(null);
  const [claimingCert, setClaimingCert] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [guestName, setGuestName] = useState('');

  const loadQuiz = async () => {
    if (!courseSlug || !quizSlug) return;
    setLoading(true);
    setError(null);
    setIs404(false);
    setSubmissionResult(null);
    setClaimedCertificate(null);
    setUserAnswers({});
    setCurrentQuestionIdx(0);

    try {
      const res = await coursesApi.getQuiz(courseSlug, quizSlug, language);
      if (res.success && res.data) {
        setQuiz(res.data);
      } else {
        if (res.status === 404) {
          setIs404(true);
        } else {
          setError(res.message || 'Failed to load quiz.');
        }
      }
    } catch (err) {
      setError('Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, [courseSlug, quizSlug, language]);

  // Trigger celebratory confetti and auto-claim certificate on passing
  useEffect(() => {
    if (submissionResult && submissionResult.passed) {
      triggerConfetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });

      const issueCert = async () => {
        setClaimingCert(true);
        try {
          const studentName = user?.fullName || user?.name || guestName || 'CodeOrbit Scholar';
          const certRes = await studentLearningApi.claimCertificate(courseSlug, studentName);
          if (certRes.success && certRes.data) {
            setClaimedCertificate(certRes.data);
          }
        } catch (e) {
          // Non-blocking
        } finally {
          setClaimingCert(false);
        }
      };

      issueCert();
    }
  }, [submissionResult, courseSlug, user]);

  const handleUpdateGuestCertificate = async () => {
    if (!guestName.trim()) return;
    setClaimingCert(true);
    try {
      const certRes = await studentLearningApi.claimCertificate(courseSlug, guestName.trim());
      if (certRes.success && certRes.data) {
        setClaimedCertificate(certRes.data);
      }
    } catch (e) {
    } finally {
      setClaimingCert(false);
    }
  };

  const handleSelectOption = (questionId, optionId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSubmitQuiz = async () => {
    if (!quiz || submitting) return;

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setSubmitting(true);
    setSubmissionError(null);

    try {
      const answersPayload = (quiz.questions || []).map((q) => ({
        questionId: q.id,
        selectedOptionId: userAnswers[q.id] || null
      }));

      const payload = {
        language,
        answers: answersPayload
      };

      const res = await studentLearningApi.submitQuiz(quiz.id, payload, courseSlug, quizSlug);
      if (res.success && res.data) {
        setSubmissionResult(res.data);
        if (courseSlug) {
          fetchCourseProgress(courseSlug);
        }
      } else {
        setSubmissionError(res.message || 'Failed to submit quiz attempt.');
      }
    } catch (e) {
      setSubmissionError('Server unreachable during quiz evaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentQuestionIdx];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <Link
            to={`/courses/${courseSlug}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Syllabus
          </Link>

          {/* Bilingual Switcher (only when not submitted) */}
          {!submissionResult && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
                Assessment Language:
              </span>
              <LanguageSelector variant="pill" />
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-6 animate-pulse shadow-xs">
            <div className="h-6 bg-slate-100 rounded w-1/4" />
            <div className="h-10 bg-slate-100 rounded w-2/3" />
            <div className="space-y-4 pt-4">
              <div className="h-12 bg-slate-100 rounded w-full" />
              <div className="h-12 bg-slate-100 rounded w-full" />
              <div className="h-12 bg-slate-100 rounded w-full" />
            </div>
          </div>
        )}

        {/* 404 Not Found */}
        {!loading && is404 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-5 max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Quiz Not Found</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't find the quiz <span className="font-mono text-emerald-700 font-semibold">"{quizSlug}"</span> for this course.
            </p>
            <Link
              to={`/courses/${courseSlug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Return to Syllabus
            </Link>
          </div>
        )}

        {/* Error State */}
        {!loading && !is404 && error && (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Error Loading Quiz</h3>
            <p className="text-xs text-rose-700">{error}</p>
            <button
              onClick={loadQuiz}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Quiz Taking Mode */}
        {!loading && !is404 && !error && quiz && !submissionResult && (
          <div className="space-y-6">
            
            {/* Quiz Info Header */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  {quiz.moduleTitle || 'Module Assessment'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {quiz.minPassScorePercentage}% Pass Threshold
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {quiz.title}
              </h1>

              {quiz.description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {quiz.description}
                </p>
              )}

              {/* Progress Counters */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">
                  Question {currentQuestionIdx + 1} of {totalQuestions}
                </span>
                <span className="text-emerald-700 font-semibold">
                  {answeredCount} of {totalQuestions} Answered
                </span>
              </div>
            </div>

            {/* Question Progress Dots */}
            <div className="flex items-center gap-2 overflow-x-auto p-2.5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
              {questions.map((q, idx) => {
                const isAnswered = !userAnswers[q.id];
                const isCurrent = idx === currentQuestionIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`h-8 min-w-[32px] px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isAnswered
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Current Question Card */}
            {currentQuestion && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 font-mono uppercase tracking-wider">
                      Question {currentQuestionIdx + 1}
                    </span>
                    {isHinglish && (
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        Hinglish 🇮🇳
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {isHinglish ? (currentQuestion.promptHinglish || translateToHinglish(currentQuestion.prompt)) : currentQuestion.prompt}
                  </h2>

                  {/* Code Context if present */}
                  {currentQuestion.codeContext && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto">
                      <pre className="text-xs font-mono text-emerald-300 leading-relaxed">
                        <code>{currentQuestion.codeContext}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {(currentQuestion.options || []).map((opt, optIdx) => {
                    const isSelected = userAnswers[currentQuestion.id] === opt.id;
                    const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                    const optText = isHinglish
                      ? (opt.text_hinglish || translateToHinglish(opt.text || opt.text_en || ''))
                      : (opt.text || opt.text_en || '');

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs font-semibold'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-600'
                        }`}>
                          {letter}
                        </span>
                        <span className="text-sm font-medium leading-relaxed">
                          {optText}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error banner during submission */}
            {submissionError && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-rose-800 shadow-2xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{submissionError}</span>
                </div>
                {!user && (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" /> Login
                  </Link>
                )}
              </div>
            )}

            {/* Navigation & Submit Footer */}
            <div className="flex items-center justify-between gap-4 pt-4">
              <button
                onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIdx === 0}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {currentQuestionIdx < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Next Question <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Evaluating Server-Side...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Assessment</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        )}

        {/* Quiz Result & Audit Review Mode */}
        {!loading && submissionResult && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Score Banner Card */}
            <div className={`rounded-3xl p-8 sm:p-10 border shadow-xs space-y-6 ${
              submissionResult.passed
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-amber-50/70 border-amber-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${
                      submissionResult.passed
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {submissionResult.passed ? 'Assessment Passed' : 'Needs Retake'}
                    </span>
                    <span className="text-xs text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      Attempt #{submissionResult.attemptNumber}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {submissionResult.passed ? 'Great Job! Requirement Met.' : 'Almost there! Review & Retake.'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {submissionResult.passed 
                      ? `You scored ${submissionResult.scorePercentage}% (80% threshold required). This module assessment is complete!`
                      : `You scored ${submissionResult.scorePercentage}%. An 80% passing threshold is required for course certificate eligibility.`}
                  </p>
                </div>

                {/* Big Score Badge */}
                <div className={`p-6 rounded-2xl border text-center flex-shrink-0 bg-white ${
                  submissionResult.passed
                    ? 'border-emerald-300 text-emerald-700'
                    : 'border-amber-300 text-amber-700'
                }`}>
                  <div className="text-3xl sm:text-4xl font-extrabold">
                    {submissionResult.scorePercentage}%
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    {submissionResult.correctAnswers} of {submissionResult.totalQuestions} Correct
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200/80">
                <button
                  onClick={loadQuiz}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz (Randomized)
                </button>

                <Link
                  to={`/courses/${courseSlug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors shadow-2xs"
                >
                  Back to Syllabus
                </Link>
              </div>
            </div>

            {/* Grand Certificate Card if Passed */}
            {submissionResult.passed && (
              <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white p-8 sm:p-10 border border-emerald-500/30 shadow-xl space-y-6 relative overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0 text-amber-300 shadow-inner">
                      <Award className="w-9 h-9" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-300" /> Certificate of Completion Unlocked
                        </span>
                        {claimedCertificate && (
                          <span className="text-[11px] text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
                            ID: {claimedCertificate.certificateCode}
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                        Official Course Credential
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300">
                        Awarded for scoring <span className="font-bold text-white">{submissionResult.scorePercentage}%</span> and successfully mastering this track.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {claimedCertificate ? (
                    <div className="flex flex-wrap items-center gap-3 relative z-10">
                      <Link
                        to={`/certificates/verify/${claimedCertificate.certificateCode}`}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <GraduationCap className="w-4 h-4" /> View & Print Certificate
                      </Link>

                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/certificates/verify/${claimedCertificate.certificateCode}`;
                          navigator.clipboard.writeText(url);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2500);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/15 transition-all cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                        {copiedLink ? 'Link Copied!' : 'Copy Verification Link'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      <span className="text-xs text-emerald-300">Generating Official Certificate...</span>
                    </div>
                  )}
                </div>

                {/* Name personalization if guest */}
                {!user && (
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                      <span className="text-slate-400 whitespace-nowrap">Your Full Name:</span>
                      <input
                        type="text"
                        placeholder="Enter your name for the certificate"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 flex-1"
                      />
                      <button
                        onClick={handleUpdateGuestCertificate}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs cursor-pointer"
                      >
                        Update Name
                      </button>
                    </div>
                    <Link
                      to="/login"
                      className="text-emerald-400 hover:text-emerald-300 underline font-semibold"
                    >
                      Login to permanently save to your dashboard →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Question by Question Feedback Audit */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" /> Assessment Answer Audit & Explanations
              </h2>

              <div className="space-y-4">
                {(submissionResult.feedback || []).map((fb, idx) => (
                  <div
                    key={fb.questionId}
                    className={`rounded-2xl border p-6 space-y-4 transition-colors bg-white ${
                      fb.correct
                        ? 'border-emerald-200 shadow-2xs'
                        : 'border-rose-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-mono font-bold text-slate-500">
                          Question {idx + 1}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          {fb.prompt}
                        </h3>
                      </div>

                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                        fb.correct
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {fb.correct ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Incorrect
                          </>
                        )}
                      </span>
                    </div>

                    {fb.codeContext && (
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 overflow-x-auto">
                        <pre className="text-xs font-mono text-emerald-300">
                          <code>{fb.codeContext}</code>
                        </pre>
                      </div>
                    )}

                    {/* Options list showing user selection and correct key */}
                    <div className="space-y-2">
                      {(fb.options || []).map((opt) => {
                        const isUserChoice = fb.selectedOptionId === opt.id;
                        const isCorrectKey = fb.correctOptionId === opt.id;

                        let styleClass = 'bg-slate-50 border-slate-200 text-slate-700';
                        if (isCorrectKey) {
                          styleClass = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold';
                        } else if (isUserChoice && !fb.correct) {
                          styleClass = 'bg-rose-50 border-rose-300 text-rose-900 font-semibold';
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${styleClass}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono font-bold">{opt.id.toUpperCase()}:</span>
                              <span>{opt.text}</span>
                            </div>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {isUserChoice && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                                  Your Choice
                                </span>
                              )}
                              {isCorrectKey && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  Correct Key ✓
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {fb.explanation && (
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-emerald-800 block">Explanation:</span>
                        <p className="text-slate-700 leading-relaxed">{fb.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Student Login Required Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full shadow-2xl text-center space-y-5">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Student Login Required</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Assessment submit karne aur verified <strong>Certificate of Completion</strong> earn karne ke liye login karna zaroori hai.
                </p>
              </div>
              <div className="space-y-2.5 pt-2">
                <Link
                  to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Login to Complete Course
                </Link>
                <Link
                  to={`/register?redirect=${encodeURIComponent(window.location.pathname)}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
                >
                  Create Free Account (30 Seconds)
                </Link>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer pt-1 block w-full"
                >
                  Cancel & Continue Reviewing
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuizPlayerPage;
