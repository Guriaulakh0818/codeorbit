import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Search, 
  HelpCircle, 
  Sparkles,
  Award,
  Layers,
  X
} from 'lucide-react';
import { useLearningProgress } from '../../context/LearningProgressContext';

export const TutorialSidebar = ({
  course,
  activeLessonSlug,
  isOpen = false,
  onClose = () => {}
}) => {
  const { courseSlug } = useParams();
  const { isLessonCompleted } = useLearningProgress();
  const [searchTerm, setSearchTerm] = useState('');
  const [openModules, setOpenModules] = useState({});

  if (!course) return null;

  const toggleModule = (moduleId) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Filter lessons based on search query
  const filteredModules = (course.modules || []).map((module) => {
    const matchingLessons = (module.lessons || []).filter((lesson) =>
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchingQuizzes = (module.quizzes || []).filter((quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return {
      ...module,
      matchingLessons,
      matchingQuizzes,
      hasMatches: matchingLessons.length > 0 || matchingQuizzes.length > 0
    };
  }).filter((module) => !searchTerm || module.hasMatches);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 lg:top-20 inset-y-0 left-0 z-50 lg:z-10 w-72 sm:w-80 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] bg-slate-50 border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <Link
              to={`/courses/${course.slug}`}
              className="group flex items-center gap-2.5 min-w-0"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 text-emerald-700 group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                  {course.title}
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  {course.track || 'CS Track'} • {course.estimatedHours || 30}h
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* In-Track Lesson Search */}
          <div className="relative group">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none group-focus-within:text-emerald-600 transition-colors" />
            <input
              type="text"
              placeholder="Search topics in this track..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Scrollable Syllabus List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          {filteredModules.map((module, mIdx) => {
            const isModuleOpen = openModules[module.id] !== false; // Default open
            const lessons = searchTerm ? module.matchingLessons : (module.lessons || []);
            const quizzes = searchTerm ? module.matchingQuizzes : (module.quizzes || []);

            return (
              <div
                key={module.id}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs"
              >
                {/* Module Header Button */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="text-[11px] font-mono text-emerald-700 font-bold">
                      {mIdx + 1}.
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {module.title}
                    </span>
                  </div>
                  {isModuleOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {/* Lessons & Quizzes List */}
                {isModuleOpen && (
                  <div className="px-2 pb-2 pt-1 space-y-1 border-t border-slate-100">
                    {lessons.map((lesson) => {
                      const isActive = lesson.slug === activeLessonSlug;
                      const isCompleted = isLessonCompleted ? isLessonCompleted(lesson.id) : false;

                      return (
                        <Link
                          key={lesson.id}
                          to={`/courses/${course.slug}/lessons/${lesson.slug}`}
                          onClick={onClose}
                          className={`group flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                            isActive
                              ? 'bg-emerald-600 text-white font-bold shadow-xs'
                              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            {isCompleted ? (
                              <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                            ) : (
                              <Circle className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>

                          {lesson.hasHinglish && (
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex-shrink-0 ${
                              isActive
                                ? 'bg-white/25 text-white'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}>
                              HI
                            </span>
                          )}
                        </Link>
                      );
                    })}

                    {/* Quiz Links */}
                    {quizzes.map((quiz) => {
                      return (
                        <Link
                          key={quiz.id}
                          to={`/courses/${course.slug}/quizzes/${quiz.slug}`}
                          onClick={onClose}
                          className="flex items-center justify-between p-2 rounded-xl text-xs text-amber-800 hover:text-amber-900 hover:bg-amber-50 border border-amber-200 transition-all font-medium"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                            <span className="truncate">{quiz.title}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};
