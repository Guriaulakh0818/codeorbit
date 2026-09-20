import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, RefreshCw, HelpCircle, Plus, Trash2, CheckCircle2, Languages, Edit3 } from 'lucide-react';
import { adminCurriculumApi } from '../../services/adminCurriculumApi';

export const AdminQuizModal = ({ isOpen, onClose, moduleId, quizId, onSaved }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    minPassScorePercentage: 80,
    maxAttempts: null,
    status: 'DRAFT'
  });

  const [questions, setQuestions] = useState([]);
  const [editingQuestionIdx, setEditingQuestionIdx] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState({
    promptEn: '',
    promptHinglish: '',
    codeContext: '',
    options: [
      { id: 'opt_a', text: '' },
      { id: 'opt_b', text: '' },
      { id: 'opt_c', text: '' },
      { id: 'opt_d', text: '' }
    ],
    correctOptionId: 'opt_a',
    explanationEn: '',
    explanationHinglish: ''
  });

  const [saving, setSaving] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (quizId) {
      loadQuizDetails(quizId);
    } else {
      setFormData({
        title: '',
        slug: '',
        description: '',
        minPassScorePercentage: 80,
        maxAttempts: null,
        status: 'DRAFT'
      });
      setQuestions([]);
      setEditingQuestionIdx(null);
    }
    setError(null);
  }, [quizId, isOpen]);

  const loadQuizDetails = async (id) => {
    setLoadingQuiz(true);
    try {
      const res = await adminCurriculumApi.getQuizById(id);
      if (res.success && res.data) {
        setFormData({
          title: res.data.title || '',
          slug: res.data.slug || '',
          description: res.data.description || '',
          minPassScorePercentage: res.data.minPassScorePercentage || 80,
          maxAttempts: res.data.maxAttempts || null,
          status: res.data.status || 'DRAFT'
        });
        setQuestions(res.data.questions || []);
      }
    } catch (e) {
      setError('Failed to fetch quiz details.');
    } finally {
      setLoadingQuiz(false);
    }
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !quizId ? generateSlug(val) : prev.slug
    }));
  };

  const resetQuestionForm = () => {
    setCurrentQuestion({
      promptEn: '',
      promptHinglish: '',
      codeContext: '',
      options: [
        { id: 'opt_a', text: '' },
        { id: 'opt_b', text: '' },
        { id: 'opt_c', text: '' },
        { id: 'opt_d', text: '' }
      ],
      correctOptionId: 'opt_a',
      explanationEn: '',
      explanationHinglish: ''
    });
  };

  const handleSaveQuestion = async () => {
    if (!currentQuestion.promptEn.trim() || !currentQuestion.explanationEn.trim()) {
      setError('Question prompt and English explanation are required.');
      return;
    }

    const filledOptions = currentQuestion.options.filter((o) => o.text && o.text.trim());
    if (filledOptions.length < 2) {
      setError('At least 2 options with non-empty text are required.');
      return;
    }

    if (!filledOptions.some((o) => o.id === currentQuestion.correctOptionId)) {
      setError('Please select one of the valid options as the correct answer.');
      return;
    }

    if (quizId) {
      setSaving(true);
      try {
        const payload = {
          ...currentQuestion,
          options: filledOptions,
          orderIndex: editingQuestionIdx !== null ? questions[editingQuestionIdx]?.orderIndex : questions.length + 1
        };

        let res;
        if (editingQuestionIdx !== null && questions[editingQuestionIdx]?.id) {
          res = await adminCurriculumApi.updateQuestion(questions[editingQuestionIdx].id, payload);
        } else {
          res = await adminCurriculumApi.addQuestion(quizId, payload);
        }

        if (res.success) {
          loadQuizDetails(quizId);
          setEditingQuestionIdx(null);
          resetQuestionForm();
        } else {
          setError(res.message || 'Failed to save question.');
        }
      } catch (err) {
        setError('Server connection error.');
      } finally {
        setSaving(false);
      }
    } else {
      const updated = [...questions];
      if (editingQuestionIdx !== null) {
        updated[editingQuestionIdx] = { ...currentQuestion, options: filledOptions };
      } else {
        updated.push({ ...currentQuestion, options: filledOptions, orderIndex: updated.length + 1 });
      }
      setQuestions(updated);
      setEditingQuestionIdx(null);
      resetQuestionForm();
    }
    setError(null);
  };

  const handleDeleteQuestion = async (idx, questionId) => {
    if (!window.confirm('Delete this question?')) return;
    if (quizId && questionId) {
      try {
        const res = await adminCurriculumApi.deleteQuestion(questionId);
        if (res.success) {
          loadQuizDetails(quizId);
        }
      } catch (e) {
        // ignore
      }
    } else {
      setQuestions((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) {
      setError('Quiz title and slug are required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let res;
      if (quizId) {
        res = await adminCurriculumApi.updateQuiz(quizId, formData);
      } else {
        res = await adminCurriculumApi.createQuiz(moduleId, {
          ...formData,
          questions: questions
        });
      }

      if (res.success) {
        onSaved();
        onClose();
      } else {
        setError(res.message || 'Failed to save quiz.');
      }
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {quizId ? 'Edit Chapter Quiz' : 'Create Module Practice Quiz'}
              </h2>
              <p className="text-xs text-slate-500">Configure quiz questions, pass percentage, and bilingual answer explanations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-xs text-rose-800 flex items-center gap-2.5 flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="space-y-6 flex-1 overflow-y-auto pr-1 text-xs">
          
          {/* Metadata */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-xs">1. Quiz General Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Quiz Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Algorithmic Complexity Checkpoint Quiz"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. complexity-checkpoint-quiz"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pass Score (%)</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={formData.minPassScorePercentage}
                  onChange={(e) => setFormData({ ...formData, minPassScorePercentage: parseInt(e.target.value, 10) || 80 })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Max Attempts</label>
                <input
                  type="number"
                  placeholder="Unlimited (Leave blank)"
                  value={formData.maxAttempts || ''}
                  onChange={(e) => setFormData({ ...formData, maxAttempts: e.target.value ? parseInt(e.target.value, 10) : null })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                </select>
              </div>
            </div>
          </div>

          {/* Question List Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <span>2. Questions in this Quiz</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {questions.length} Total
                </span>
              </h3>

              {editingQuestionIdx !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingQuestionIdx(null);
                    resetQuestionForm();
                  }}
                  className="text-slate-500 hover:text-slate-800 underline font-semibold text-[11px] cursor-pointer"
                >
                  + Add New Question
                </button>
              )}
            </div>

            {questions.length === 0 ? (
              <p className="text-slate-400 italic text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No questions added yet. Use the question editor below to create practice questions.
              </p>
            ) : (
              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      editingQuestionIdx === idx ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        {idx + 1}
                      </span>
                      <p className="font-medium text-slate-800 truncate">{q.promptEn}</p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingQuestionIdx(idx);
                          setCurrentQuestion({
                            promptEn: q.promptEn || '',
                            promptHinglish: q.promptHinglish || '',
                            codeContext: q.codeContext || '',
                            options: q.options?.length ? q.options : [
                              { id: 'opt_a', text: '' },
                              { id: 'opt_b', text: '' },
                              { id: 'opt_c', text: '' },
                              { id: 'opt_d', text: '' }
                            ],
                            correctOptionId: q.correctOptionId || 'opt_a',
                            explanationEn: q.explanationEn || '',
                            explanationHinglish: q.explanationHinglish || ''
                          });
                        }}
                        className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                        title="Edit question"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(idx, q.id)}
                        className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Question Editor Section */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-900 text-xs">
              {editingQuestionIdx !== null ? `Edit Question #${editingQuestionIdx + 1}` : 'Add New Question'}
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Question Prompt (English) *</label>
                <input
                  type="text"
                  value={currentQuestion.promptEn}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, promptEn: e.target.value })}
                  placeholder="e.g. What is the worst-case time complexity of QuickSort?"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-emerald-600" /> Question Prompt (Hinglish)
                </label>
                <input
                  type="text"
                  value={currentQuestion.promptHinglish}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, promptHinglish: e.target.value })}
                  placeholder="e.g. QuickSort ki worst-case time complexity kya hoti hai?"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Optional Code Block / Context</label>
                <textarea
                  rows="3"
                  value={currentQuestion.codeContext}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, codeContext: e.target.value })}
                  placeholder="int x = 5; while(x > 0) { ... }"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-emerald-300 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold">Options & Correct Answer Selection *</label>
                
                {currentQuestion.options.map((opt, i) => (
                  <div key={opt.id || i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={currentQuestion.correctOptionId === opt.id}
                      onChange={() => setCurrentQuestion({ ...currentQuestion, correctOptionId: opt.id })}
                      className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      title="Select as correct answer"
                    />
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const newOpts = [...currentQuestion.options];
                        newOpts[i] = { ...newOpts[i], text: e.target.value };
                        setCurrentQuestion({ ...currentQuestion, options: newOpts });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Explanation (English) *</label>
                  <textarea
                    rows="2"
                    value={currentQuestion.explanationEn}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanationEn: e.target.value })}
                    placeholder="When the array is already sorted and the pivot is the first/last element..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Explanation (Hinglish)</label>
                  <textarea
                    rows="2"
                    value={currentQuestion.explanationHinglish}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanationHinglish: e.target.value })}
                    placeholder="Jab array pehle se sorted ho to pivot selection se O(N^2) ban jata hai..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveQuestion}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors cursor-pointer"
              >
                {editingQuestionIdx !== null ? 'Update Question' : '+ Add Question to Quiz'}
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveQuiz}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Saving Quiz...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Entire Quiz
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminQuizModal;
