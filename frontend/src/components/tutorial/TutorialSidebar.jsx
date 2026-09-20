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
  const { progress } = useLearningProgress();
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
        className={`fixed lg:sticky top-16 lg:top-20 inset-y-0 left-0 z-50 lg:z-10 w-72 sm:w-80 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] bg-[#090d16] lg:bg-slate-950/60 backdrop-blur-xl border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800/80 space-y-3 bg-slate-900/40">
          <div className="flex items-center justify-between">
            <Link
              to={`/courses/${course.slug}`}
              className="group flex items-center gap-2.5 min-w-0"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400 group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                  {course.title}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {course.track || 'CS Track'} • {course.estimatedHours || 30}h
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* In-Track Lesson Search */}
          <div className="relative group">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              placeholder="Search topics in this track..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
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
                className="rounded-2xl bg-slate-900/40 border border-slate-800/70 overflow-hidden"
              >
                {/* Module Header Button */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      {mIdx + 1}.
                    </span>
                    <span className="text-xs font-bold text-slate-200 truncate">
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
                  <div className="px-2 pb-2 pt-1 space-y-1 border-t border-slate-800/50">
                    {lessons.map((lesson) => {
                      const isActive = lesson.slug === activeLessonSlug;
                      const isCompleted = progress.completedLessonIds.includes(lesson.id);

                      return (
                        <Link
                          key={lesson.id}
                          to={`/courses/${course.slug}/lessons/${lesson.slug}`}
                          onClick={onClose}
                          className={`group flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                            isActive
                              ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/25'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            {isCompleted ? (
                              <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                            ) : (
                              <Circle className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>

                          {lesson.hasHinglish && (
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex-shrink-0 ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              HI
                            </span>
                          )}
                        </Link>
                      );
                    })}

                    {/* Quiz Links */}
                    {quizzes.map((quiz) => {
                      const isPassed = progress.passedQuizIds.includes(quiz.id);

                      return (
                        <Link
                          key={quiz.id}
                          to={`/courses/${course.slug}/quizzes/${quiz.slug}`}
                          onClick={onClose}
                          className="flex items-center justify-between p-2 rounded-xl text-xs text-amber-300 hover:text-white hover:bg-amber-500/10 border border-amber-500/20 transition-all font-medium"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                            <span className="truncate">{quiz.title}</span>
                          </div>
                          {isPassed && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          )}
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
