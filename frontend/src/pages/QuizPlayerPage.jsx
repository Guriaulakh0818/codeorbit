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
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { coursesApi } from '../services/coursesApi';
import { studentLearningApi } from '../services/studentLearningApi';
import { useAuth } from '../context/AuthContext';
import { useLearningProgress } from '../context/LearningProgressContext';

export const QuizPlayerPage = () => {
  const { courseSlug, quizSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchCourseProgress } = useLearningProgress();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [is404, setIs404] = useState(false);

  // Language state: 'en' | 'hinglish'
  const [language, setLanguage] = useState('en');

  // Quiz taking state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: selectedOptionId }
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  const loadQuiz = async () => {
    if (!courseSlug || !quizSlug) return;
    setLoading(true);
    setError(null);
    setIs404(false);
    setSubmissionResult(null);
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

  // Trigger celebratory confetti on passing
  useEffect(() => {
    if (submissionResult && submissionResult.passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [submissionResult]);

  const handleSelectOption = (questionId, optionId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || submitting) return;

    if (!user) {
      setSubmissionError('Please login to submit your quiz and record your progress.');
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

      const res = await studentLearningApi.submitQuiz(quiz.id, payload);
      if (res.success && res.data) {
        setSubmissionResult(res.data);
        // Refresh course-level progress
        fetchCourseProgress(courseSlug);
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
    <div className="min-h-screen bg-[#080d1e] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <Link
            to={`/courses/${courseSlug}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-sky-400 transition-colors bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Syllabus
          </Link>

          {/* Bilingual Switcher (only when not submitted) */}
          {!submissionResult && (
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
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6 animate-pulse">
            <div className="h-6 bg-slate-800 rounded w-1/4" />
            <div className="h-10 bg-slate-800 rounded w-2/3" />
            <div className="space-y-4 pt-4">
              <div className="h-12 bg-slate-800 rounded w-full" />
              <div className="h-12 bg-slate-800 rounded w-full" />
              <div className="h-12 bg-slate-800 rounded w-full" />
            </div>
          </div>
        )}

        {/* 404 Not Found */}
        {!loading && is404 && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center space-y-5 max-w-lg mx-auto">
            <div className="w-14 h-14 bg-slate-800 text-purple-400 rounded-2xl flex items-center justify-center mx-auto">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white">Quiz Not Found</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              We couldn't find the quiz <span className="font-mono text-sky-300">"{quizSlug}"</span> for this course.
            </p>
            <Link
              to={`/courses/${courseSlug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Return to Syllabus
            </Link>
          </div>
        )}

        {/* Error State */}
        {!loading && !is404 && error && (
          <div className="bg-rose-950/40 border border-rose-800/60 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Error Loading Quiz</h3>
            <p className="text-xs text-slate-300">{error}</p>
            <button
              onClick={loadQuiz}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Quiz Taking Mode */}
        {!loading && !is404 && !error && quiz && !submissionResult && (
          <div className="space-y-6">
            
            {/* Quiz Info Header */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                  {quiz.moduleTitle || 'Module Assessment'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {quiz.minPassScorePercentage}% Pass Threshold
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {quiz.title}
              </h1>

              {quiz.description && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {quiz.description}
                </p>
              )}

              {/* Progress Counters */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 font-medium">
                  Question {currentQuestionIdx + 1} of {totalQuestions}
                </span>
                <span className="text-sky-400 font-semibold">
                  {answeredCount} of {totalQuestions} Answered
                </span>
              </div>
            </div>

            {/* Question Progress Dots */}
            <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
              {questions.map((q, idx) => {
                const isAnswered = !!userAnswers[q.id];
                const isCurrent = idx === currentQuestionIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`h-8 min-w-[32px] px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                      isCurrent
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30 ring-2 ring-sky-400/50'
                        : isAnswered
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Current Question Card */}
            {currentQuestion && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-sky-400 font-mono uppercase tracking-wider">
                    Question {currentQuestionIdx + 1}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {currentQuestion.prompt}
                  </h2>

                  {/* Code Context if present */}
                  {currentQuestion.codeContext && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto">
                      <pre className="text-xs font-mono text-sky-200 leading-relaxed">
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

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                          isSelected
                            ? 'bg-sky-500/15 border-sky-400/60 text-white shadow-lg shadow-sky-500/10'
                            : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 text-slate-200'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          isSelected
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {letter}
                        </span>
                        <span className="text-sm font-medium leading-relaxed">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error banner during submission */}
            {submissionError && (
              <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-rose-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{submissionError}</span>
                </div>
                {!user && (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-500 transition-colors"
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
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-200 text-xs font-bold rounded-xl border border-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {currentQuestionIdx < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all"
                >
                  Next Question <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
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
            <div className={`rounded-3xl p-8 sm:p-10 border shadow-2xl space-y-6 ${
              submissionResult.passed
                ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border-emerald-500/40'
                : 'bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-900 border-amber-500/40'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${
                      submissionResult.passed
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {submissionResult.passed ? 'Assessment Passed' : 'Needs Retake'}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                      Attempt #{submissionResult.attemptNumber}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-black text-white">
                    {submissionResult.passed ? 'Great Job! Requirement Met.' : 'Almost there! Review & Retake.'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {submissionResult.passed 
                      ? `You scored ${submissionResult.scorePercentage}% (80% threshold required). This module assessment is complete!`
                      : `You scored ${submissionResult.scorePercentage}%. An 80% passing threshold is required for course certificate eligibility.`}
                  </p>
                </div>

                {/* Big Score Badge */}
                <div className={`p-6 rounded-2xl border text-center flex-shrink-0 ${
                  submissionResult.passed
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                    : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                }`}>
                  <div className="text-3xl sm:text-4xl font-black">
                    {submissionResult.scorePercentage}%
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                    {submissionResult.correctAnswers} of {submissionResult.totalQuestions} Correct
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={loadQuiz}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/20 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz (Randomized)
                </button>

                <Link
                  to={`/courses/${courseSlug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
                >
                  Back to Syllabus
                </Link>
              </div>
            </div>

            {/* Question by Question Feedback Audit */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-400" /> Assessment Answer Audit & Explanations
              </h2>

              <div className="space-y-4">
                {(submissionResult.feedback || []).map((fb, idx) => (
                  <div
                    key={fb.questionId}
                    className={`rounded-2xl border p-6 space-y-4 transition-colors ${
                      fb.correct
                        ? 'bg-slate-900/60 border-emerald-500/30'
                        : 'bg-slate-900/60 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          Question {idx + 1}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-white">
                          {fb.prompt}
                        </h3>
                      </div>

                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                        fb.correct
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {fb.correct ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-400" /> Incorrect
                          </>
                        )}
                      </span>
                    </div>

                    {fb.codeContext && (
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-x-auto">
                        <pre className="text-xs font-mono text-sky-200">
                          <code>{fb.codeContext}</code>
                        </pre>
                      </div>
                    )}

                    {/* Options list showing user selection and correct key */}
                    <div className="space-y-2">
                      {(fb.options || []).map((opt) => {
                        const isUserChoice = fb.selectedOptionId === opt.id;
                        const isCorrectKey = fb.correctOptionId === opt.id;

                        let styleClass = 'bg-slate-950/60 border-slate-800 text-slate-300';
                        if (isCorrectKey) {
                          styleClass = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200';
                        } else if (isUserChoice && !fb.correct) {
                          styleClass = 'bg-rose-950/40 border-rose-500/50 text-rose-200';
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
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                                  Your Choice
                                </span>
                              )}
                              {isCorrectKey && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  Correct Key
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {fb.explanation && (
                      <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-sky-300 block">Explanation:</span>
                        <p className="text-slate-300 leading-relaxed">{fb.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
