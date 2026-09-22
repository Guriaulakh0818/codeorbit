import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Layers, 
  BookOpen, 
  ExternalLink, 
  Lock, 
  Unlock, 
  HelpCircle, 
  Loader2, 
  AlertCircle, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { placementKitApi } from '../services/placementKitApi';
import { openRazorpayCheckout } from '../utils/useRazorpay';
import { SeoHead } from '../components/seo/SeoHead';
import { Button, Badge, Card, ProgressBar, Skeleton, EmptyState } from '../components/ui';

export const PlacementKitDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [kit, setKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submittingQuestionId, setSubmittingQuestionId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [practiceResults, setPracticeResults] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    loadKitDetails();
  }, [slug, isAuthenticated]);

  const loadKitDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await placementKitApi.getKitBySlug(slug);
      if (res.success && res.data) {
        setKit(res.data);
        if (res.data.categories && res.data.categories.length > 0) {
          setSelectedCategory(res.data.categories[0].id);
        }
      } else {
        setError(res.message || 'Placement Kit not found');
      }
    } catch (e) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/placement-kits/${slug}`);
      return;
    }

    setPurchasing(true);
    setError(null);

    try {
      const orderRes = await placementKitApi.createKitOrder(slug);
      if (!orderRes.success || !orderRes.data) {
        setError(orderRes.message || 'Could not initiate purchase');
        setPurchasing(false);
        return;
      }

      const orderData = {
        ...orderRes.data,
        courseTitle: kit.title,
        userName: user?.fullName,
        userEmail: user?.email,
      };

      await openRazorpayCheckout({
        orderData,
        onSuccess: async (rzpPayload) => {
          const verifyRes = await placementKitApi.verifyKitPayment(slug, {
            razorpayOrderId: rzpPayload.razorpayOrderId,
            razorpayPaymentId: rzpPayload.razorpayPaymentId,
            razorpaySignature: rzpPayload.razorpaySignature
          });

          if (verifyRes.success && verifyRes.data) {
            setKit(verifyRes.data);
          } else {
            setError(verifyRes.message || 'Verification failed. Please contact support.');
          }
          setPurchasing(false);
        },
        onError: (err) => {
          setError(err.message || 'Payment failed or cancelled.');
          setPurchasing(false);
        },
        onDismiss: () => {
          setPurchasing(false);
        }
      });
    } catch (err) {
      setError('Checkout failed. Please try again.');
      setPurchasing(false);
    }
  };

  const handleOptionSelect = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], selectedOptionId: optionId }
    }));
  };

  const handleTextAnswerChange = (questionId, text) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], textAnswer: text }
    }));
  };

  const handleSubmitAnswer = async (questionId) => {
    if (!kit.isPurchased) return;
    const currentAnswer = answers[questionId] || {};
    setSubmittingQuestionId(questionId);

    try {
      const res = await placementKitApi.submitPracticeAnswer(slug, questionId, {
        selectedOptionId: currentAnswer.selectedOptionId,
        userAnswer: currentAnswer.textAnswer
      });

      if (res.success && res.data) {
        setPracticeResults((prev) => ({
          ...prev,
          [questionId]: res.data
        }));
        setKit((prev) => {
          if (!prev || !prev.progress) return prev;
          return {
            ...prev,
            progress: {
              ...prev.progress,
              attemptedQuestions: res.data.totalAttempted,
              correctQuestions: res.data.totalCorrect,
              percentageComplete: (res.data.totalAttempted / prev.totalQuestions) * 100
            }
          };
        });
      }
    } catch (e) {
      console.error('Submission failed', e);
    } finally {
      setSubmittingQuestionId(null);
    }
  };

  const toggleQuestionExpand = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
        <Skeleton variant="text" width="30%" height="24px" />
        <Skeleton variant="rectangular" height="200px" />
        <div className="space-y-4">
          <Skeleton variant="rectangular" height="100px" />
          <Skeleton variant="rectangular" height="100px" />
        </div>
      </div>
    );
  }

  if (error && !kit) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <EmptyState
          icon={AlertCircle}
          title="Placement Kit Not Found"
          description={error}
          actionText="Back to Placement Kits"
          actionHref="/placement-kits"
        />
      </div>
    );
  }

  const activeCategoryObj = kit?.categories?.find((c) => c.id === selectedCategory) || kit?.categories?.[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title={`${kit?.title || 'Placement Prep Kit'} (₹99) | CodeOrbit`}
        description={kit?.shortDescription || 'Role-based placement preparation kit on CodeOrbit.'}
        canonicalUrl={`https://www.codeorbit.online/placement-kits/${slug}`}
      />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            href="/placement-kits"
            icon={ArrowLeft}
          >
            All Placement Kits
          </Button>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" /> {kit?.role} Career Track
          </span>
        </div>

        {/* Hero Card */}
        <Card className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="sm">
                {kit?.role}
              </Badge>
              {kit?.isPurchased ? (
                <Badge variant="success" size="sm">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Full Kit Unlocked
                </Badge>
              ) : (
                <Badge variant="warning" size="sm">
                  ₹{kit?.priceInr} One-Time Fee
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {kit?.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {kit?.fullDescription || kit?.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1 font-semibold">
                <Layers className="w-4 h-4 text-slate-400" /> {kit?.totalCategories || 4} Topic Modules
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <BookOpen className="w-4 h-4 text-slate-400" /> {kit?.totalQuestions || 25}+ Questions & Answers
              </span>
            </div>
          </div>

          {/* Checkout / Status CTA Box */}
          <div className="w-full md:w-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center space-y-3 flex-shrink-0">
            {kit?.isPurchased ? (
              <>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Unlock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Access Active</span>
                  <span className="text-[11px] text-slate-500">Practice questions below</span>
                </div>
                {kit?.progress && (
                  <div className="w-full bg-white rounded-xl p-2.5 border border-slate-200 text-[11px] space-y-1">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>Progress</span>
                      <span>{kit.progress.attemptedQuestions}/{kit.totalQuestions}</span>
                    </div>
                    <ProgressBar
                      value={kit.progress.attemptedQuestions || 0}
                      max={kit.totalQuestions || 1}
                      variant="primary"
                      size="xs"
                      showPercentage={false}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Price</span>
                  <span className="text-2xl font-black text-slate-900">₹{kit?.priceInr}</span>
                  <span className="text-[10px] text-slate-500 block">Lifetime Access</span>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth={true}
                  onClick={handlePurchase}
                  loading={purchasing}
                  icon={Lock}
                >
                  Unlock Complete Kit (₹99)
                </Button>
              </>
            )}
          </div>
        </Card>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-rose-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Unlocked Full Kit Experience */}
        {kit?.isPurchased ? (
          <div className="space-y-6">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {kit.categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.title} ({cat.questions?.length || 0})
                </button>
              ))}
            </div>

            {/* Active Category Questions */}
            {activeCategoryObj && (
              <div className="space-y-4">
                <Card className="p-5">
                  <h3 className="text-base font-extrabold text-slate-900">{activeCategoryObj.title}</h3>
                  {activeCategoryObj.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{activeCategoryObj.description}</p>
                  )}
                </Card>

                <div className="space-y-4">
                  {activeCategoryObj.questions?.map((q, qIdx) => {
                    const result = practiceResults[q.id];
                    const hasSubmitted = !!result || q.userAttempted;
                    const isCorrect = result ? result.correct : q.userCorrect;
                    const modelAnswer = result?.modelAnswer || q.modelAnswer;
                    const explanation = result?.explanation || q.explanation;
                    const isExpanded = expandedQuestions[q.id] || hasSubmitted;

                    return (
                      <Card
                        key={q.id}
                        className="p-6 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-extrabold flex items-center justify-center flex-shrink-0">
                              Q{qIdx + 1}
                            </span>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="default" size="xs">
                                  {q.questionType}
                                </Badge>
                                <Badge
                                  variant={q.difficulty === 'EASY' ? 'success' : q.difficulty === 'HARD' ? 'danger' : 'warning'}
                                  size="xs"
                                >
                                  {q.difficulty}
                                </Badge>
                              </div>
                              <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                                {q.questionText}
                              </h4>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleQuestionExpand(q.id)}
                            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Question Interaction Area */}
                        {q.questionType === 'MCQ' && (
                          <div className="space-y-2 pt-2">
                            {q.options?.map((opt) => {
                              const isSelected = answers[q.id]?.selectedOptionId === opt.id || q.selectedOptionId === opt.id;
                              const isOptionCorrect = hasSubmitted && (result?.correctOptionId === opt.id || opt.isCorrect);

                              return (
                                <button
                                  key={opt.id}
                                  disabled={hasSubmitted}
                                  onClick={() => handleOptionSelect(q.id, opt.id)}
                                  className={`w-full text-left p-3.5 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                    isOptionCorrect
                                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                                      : isSelected && !isCorrect && hasSubmitted
                                      ? 'bg-rose-50 border-rose-500 text-rose-900'
                                      : isSelected
                                      ? 'bg-slate-900 border-slate-900 text-white'
                                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  <span>{opt.optionText}</span>
                                  {isOptionCorrect && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {q.questionType !== 'MCQ' && (
                          <div className="space-y-2 pt-2">
                            <textarea
                              rows={3}
                              disabled={hasSubmitted}
                              placeholder="Type your brief answer or talking points here..."
                              value={answers[q.id]?.textAnswer || q.userAnswer || ''}
                              onChange={(e) => handleTextAnswerChange(q.id, e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
                            />
                          </div>
                        )}

                        {/* Submit Answer Action */}
                        {!hasSubmitted && (
                          <div className="flex justify-end pt-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleSubmitAnswer(q.id)}
                              disabled={!answers[q.id]?.selectedOptionId && !answers[q.id]?.textAnswer}
                              loading={submittingQuestionId === q.id}
                              icon={Send}
                            >
                              Check Answer
                            </Button>
                          </div>
                        )}

                        {/* Explanation & Model Answer */}
                        {isExpanded && (hasSubmitted || isExpanded) && (
                          <div className="pt-4 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
                            {modelAnswer && (
                              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1 text-xs">
                                <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  Model Answer & Talking Points:
                                </span>
                                <p className="text-emerald-800 leading-relaxed whitespace-pre-line">
                                  {modelAnswer}
                                </p>
                              </div>
                            )}

                            {explanation && (
                              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                                <span className="font-extrabold text-slate-900 block">Explanation:</span>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                  {explanation}
                                </p>
                              </div>
                            )}

                            {/* Internal CodeOrbit Lesson Reference */}
                            {q.courseSlug && q.lessonSlug && (
                              <div className="pt-1 flex items-center justify-between">
                                <span className="text-[11px] text-slate-500 font-medium">
                                  Need a refresher on this concept?
                                </span>
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  href={`/courses/${q.courseSlug}/lessons/${q.lessonSlug}`}
                                  icon={BookOpen}
                                  className="text-emerald-700 bg-emerald-50 border border-emerald-200"
                                >
                                  Learn this on CodeOrbit
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Locked / Preview Mode Experience */
          <div className="space-y-8">
            {/* Locked Content Notice & Roadmap */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  Preparation Roadmap & Modules
                </h3>
                <p className="text-xs text-slate-500">
                  Structured categories covered in this ₹99 Placement Kit.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {kit?.categories?.map((cat, idx) => (
                  <div key={cat.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Module {idx + 1}: {cat.title}</span>
                      <Badge variant="default" size="xs">
                        {cat.questionCount} Questions
                      </Badge>
                    </div>
                    {cat.description && (
                      <p className="text-[11px] text-slate-500">{cat.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Sample Preview Questions (3 questions without answers) */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <Badge variant="warning" size="xs">
                  <Sparkles className="w-3 h-3" /> Free Preview
                </Badge>
                <h3 className="text-lg font-bold text-slate-900">
                  Sample Preview Questions (3 Questions)
                </h3>
                <p className="text-xs text-slate-500">
                  Preview the format and quality of questions. Unlock the complete kit to reveal all answers, explanations, and lesson links.
                </p>
              </div>

              <div className="space-y-4">
                {kit?.sampleQuestions?.map((q, idx) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" size="xs">
                        Sample {idx + 1} • {q.questionType}
                      </Badge>
                      <Badge variant="default" size="xs">{q.difficulty}</Badge>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{q.questionText}</h4>

                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt) => (
                          <div key={opt.id} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 font-medium">
                            {opt.optionText}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Lock className="w-3.5 h-3.5" /> Model Answer & Explanations Locked
                      </span>
                      <button
                        onClick={handlePurchase}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                      >
                        Unlock for ₹99 &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Unlock Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-base font-extrabold">Ready to Ace Your {kit?.role} Interviews?</h4>
                  <p className="text-xs text-emerald-100">Unlock all {kit?.totalQuestions}+ questions, model answers, code explanations, and progress tracking for just ₹99.</p>
                </div>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handlePurchase}
                  loading={purchasing}
                  className="bg-white text-emerald-800 hover:bg-emerald-50 font-extrabold whitespace-nowrap flex-shrink-0"
                >
                  Unlock Now (₹99)
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacementKitDetailPage;
