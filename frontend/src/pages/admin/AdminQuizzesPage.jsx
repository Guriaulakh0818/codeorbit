import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  CheckCircle2, 
  Edit, 
  Trash2, 
  ShieldCheck, 
  BookOpen, 
  Layers, 
  ListOrdered,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminQuizModal from '../../components/admin/AdminQuizModal';
import { fetchAdminCourses } from '../../services/adminCurriculumApi';

export default function AdminQuizzesPage() {
  const [activeTab, setActiveTab] = useState('MODULE'); // 'MODULE' or 'FINAL'
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: 'Java Basics & Data Types Quiz',
      courseTitle: 'Java Programming',
      type: 'MODULE_QUIZ',
      questionCount: 10,
      passPercentage: 80,
      status: 'PUBLISHED',
      maxAttempts: 3
    },
    {
      id: 2,
      title: 'Java Beginner Level Final Exam',
      courseTitle: 'Java Programming',
      type: 'LEVEL_FINAL_QUIZ',
      questionCount: 25,
      passPercentage: 80,
      status: 'PUBLISHED',
      maxAttempts: 3
    },
    {
      id: 3,
      title: 'Arrays & Strings Module Quiz',
      courseTitle: 'Data Structures & Algorithms',
      type: 'MODULE_QUIZ',
      questionCount: 10,
      passPercentage: 80,
      status: 'PUBLISHED',
      maxAttempts: 3
    },
    {
      id: 4,
      title: 'DSA Intermediate Level Final Exam',
      courseTitle: 'Data Structures & Algorithms',
      type: 'LEVEL_FINAL_QUIZ',
      questionCount: 25,
      passPercentage: 80,
      status: 'PUBLISHED',
      maxAttempts: 3
    },
    {
      id: 5,
      title: 'React Hooks & State Management Quiz',
      courseTitle: 'React Full-Stack Architecture',
      type: 'MODULE_QUIZ',
      questionCount: 10,
      passPercentage: 80,
      status: 'PUBLISHED',
      maxAttempts: 3
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await fetchAdminCourses({ size: 100 });
      setCourses(res.content || []);
    } catch (err) {
      console.warn('Failed to load courses for quizzes:', err);
    }
  };

  const filteredQuizzes = quizzes.filter((q) => {
    if (activeTab === 'MODULE' && q.type !== 'MODULE_QUIZ') return false;
    if (activeTab === 'FINAL' && q.type !== 'LEVEL_FINAL_QUIZ') return false;
    if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCreateNew = () => {
    setEditingQuiz(null);
    setModalOpen(true);
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(q => q.id !== id));
    }
  };

  return (
    <AdminLayout 
      title="Quiz Management"
      subtitle="Manage module assessments (10 questions) and level final exams (25 questions) with zero answer leakage."
    >
      {/* ========================================================================= */}
      {/* 1. QUIZ RULES BANNER */}
      {/* ========================================================================= */}
      <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111827]">Server-Side Scoring & Zero Leakage Integrity</h4>
            <p className="text-[11px] text-[#667085] mt-0.5">
              Module Quizzes are strictly 10 questions. Level Final Exams are 25 questions. Correct answers are evaluated only on the backend.
            </p>
          </div>
        </div>
        <button
          onClick={handleCreateNew}
          className="py-2 px-4 rounded-xl bg-[#4F46E5] text-white text-xs font-semibold shadow-xs shadow-indigo-200 hover:bg-indigo-700 flex items-center gap-2 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Quiz</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. TABS & SEARCH */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-[#F6F8FC] p-1 rounded-xl border border-[#E5E7EB]">
          <button
            onClick={() => setActiveTab('MODULE')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'MODULE'
                ? 'bg-white text-[#4F46E5] shadow-xs'
                : 'text-[#667085] hover:text-[#111827]'
            }`}
          >
            Module Quizzes (10 Questions)
          </button>
          <button
            onClick={() => setActiveTab('FINAL')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'FINAL'
                ? 'bg-white text-[#4F46E5] shadow-xs'
                : 'text-[#667085] hover:text-[#111827]'
            }`}
          >
            Level Final Exams (25 Questions)
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search quizzes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F6F8FC] text-xs text-[#111827] focus:outline-none focus:border-[#4F46E5] focus:bg-white"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. QUIZZES TABLE */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F6F8FC] text-[#667085] font-semibold">
              <th className="py-3 px-4">Quiz Title</th>
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Questions</th>
              <th className="py-3 px-4">Passing Score</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
            {filteredQuizzes.map((quiz) => (
              <tr key={quiz.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-bold text-[#111827]">{quiz.title}</td>
                <td className="py-3 px-4 text-[#667085] font-medium">{quiz.courseTitle}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    quiz.type === 'MODULE_QUIZ'
                      ? 'bg-blue-50 text-[#2563EB] border border-blue-200'
                      : 'bg-purple-50 text-purple-600 border border-purple-200'
                  }`}>
                    {quiz.type === 'MODULE_QUIZ' ? 'Module Quiz' : 'Level Final Exam'}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold">{quiz.questionCount} Qs</td>
                <td className="py-3 px-4 font-semibold text-emerald-600">{quiz.passPercentage}%</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200">
                    {quiz.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleEdit(quiz)}
                      className="p-1.5 text-[#667085] hover:text-[#4F46E5] hover:bg-slate-100 rounded-lg"
                      title="Edit Quiz & Questions"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="p-1.5 text-[#667085] hover:text-[#DC2626] hover:bg-red-50 rounded-lg"
                      title="Delete Quiz"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <AdminQuizModal
          isOpen={modalOpen}
          quiz={editingQuiz}
          onClose={() => setModalOpen(false)}
          onSave={() => { setModalOpen(false); }}
        />
      )}
    </AdminLayout>
  );
}
