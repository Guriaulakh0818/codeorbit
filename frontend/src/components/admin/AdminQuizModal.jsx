import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, RefreshCw, HelpCircle, Plus, Trash2, CheckCircle2, Languages } from 'lucide-react';
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

  // Add / Edit Question helpers
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

    // If quiz is already persisted, save question to backend immediately
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
      // Local addition before quiz creation
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

  const handleDeleteQuestion = async (idx) => {
    const q = questions[idx];
    if (q?.id) {
      if (!window.confirm('Are you sure you want to delete this question?')) return;
      try {
        const res = await adminCurriculumApi.deleteQuestion(q.id);
        if (res.success) {
          loadQuizDetails(quizId);
        }
      } catch (e) {
        setError('Failed to delete question.');
      }
    } else {
      const updated = questions.filter((_, i) => i !== idx);
      setQuestions(updated);
    }
  };

  const handleSubmitQuiz = async (e) => {
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
        res = await adminCurriculumApi.createQuiz(moduleId, formData);
        // If there were draft questions, add them now
        if (res.success && res.data?.id && questions.length > 0) {
          for (const q of questions) {
            await adminCurriculumApi.addQuestion(res.data.id, q);
          }
        }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {quizId ? 'Edit Quiz Assessment' : 'Create Module Quiz'}
              </h2>
              <p className="text-xs text-slate-400">Configure passing threshold (80%), attempts, and questions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-800/60 p-3.5 rounded-2xl text-xs text-rose-200 flex items-center gap-2.5 flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="space-y-6 flex-1 overflow-y-auto pr-1 text-xs">
          
          {/* Quiz Metadata */}
          <form onSubmit={handleSubmitQuiz} className="space-y-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Quiz Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Module 1 Assessment: Complexity"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Slug (Identifier) *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. module-1-quiz"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pass Score % *</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={formData.minPassScorePercentage}
                  onChange={(e) => setFormData({ ...formData, minPassScorePercentage: parseInt(e.target.value, 10) || 80 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Max Attempts (Blank=Unlimited)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxAttempts || ''}
                  onChange={(e) => setFormData({ ...formData, maxAttempts: e.target.value ? parseInt(e.target.value, 10) : null })}
                  placeholder="Unlimited"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Publish Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400 font-semibold"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-md shadow-purple-500/20"
              >
                <Save className="w-3.5 h-3.5" /> Save Quiz Settings
              </button>
            </div>
          </form>

          {/* Question List & Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Quiz Questions</span>
                <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-[10px]">
                  {questions.length} Questions
                </span>
              </h3>
            </div>

            {/* List of existing questions */}
            {questions.length > 0 && (
              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-200">
                        <span className="text-purple-400 font-bold mr-2">Q{idx + 1}.</span>
                        {q.promptEn}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3">
                        <span>{q.options?.length || 0} Options</span>
                        <span className="text-emerald-400 font-mono">Correct: {q.correctOptionId}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingQuestionIdx(idx);
                          setCurrentQuestion({
                            promptEn: q.promptEn || '',
                            promptHinglish: q.promptHinglish || '',
                            codeContext: q.codeContext || '',
                            options: q.options || [],
                            correctOptionId: q.correctOptionId || 'opt_a',
                            explanationEn: q.explanationEn || '',
                            explanationHinglish: q.explanationHinglish || ''
                          });
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(idx)}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Question Builder Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-xs flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                {editingQuestionIdx !== null ? `Edit Question #${editingQuestionIdx + 1}` : 'Add New Question'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">English Prompt *</label>
                  <textarea
                    rows="2"
                    value={currentQuestion.promptEn}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, promptEn: e.target.value })}
                    placeholder="Question prompt in English..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Hinglish Prompt</label>
                  <textarea
                    rows="2"
                    value={currentQuestion.promptHinglish}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, promptHinglish: e.target.value })}
                    placeholder="Hinglish me question prompt..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Options & Correct Answer Radio */}
              <div className="space-y-2">
                <label className="block text-slate-400 font-medium">Multiple Choice Options (Select radio for correct answer)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentQuestion.options.map((opt, oIdx) => (
                    <div key={opt.id} className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-2">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={currentQuestion.correctOptionId === opt.id}
                        onChange={() => setCurrentQuestion({ ...currentQuestion, correctOptionId: opt.id })}
                        className="text-emerald-500 focus:ring-0 ml-1 cursor-pointer"
                      />
                      <span className="font-mono text-slate-400 text-[11px] font-bold uppercase">{opt.id}:</span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...currentQuestion.options];
                          updated[oIdx] = { ...opt, text: e.target.value };
                          setCurrentQuestion({ ...currentQuestion, options: updated });
                        }}
                        placeholder={`Option ${opt.id.slice(-1).toUpperCase()} text...`}
                        className="w-full bg-transparent text-white text-xs focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">English Explanation *</label>
                  <textarea
                    rows="2"
                    value={currentQuestion.explanationEn}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanationEn: e.target.value })}
                    placeholder="Why this answer is correct..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Hinglish Explanation</label>
                  <textarea
                    rows="2"
                    value={currentQuestion.explanationHinglish}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanationHinglish: e.target.value })}
                    placeholder="Hinglish explanation..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                {editingQuestionIdx !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingQuestionIdx(null);
                      resetQuestionForm();
                    }}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveQuestion}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-500/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  {editingQuestionIdx !== null ? 'Update Question' : 'Add Question to Quiz'}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
