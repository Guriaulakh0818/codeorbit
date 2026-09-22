import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Layers, 
  ChevronRight, 
  CheckCircle2, 
  FileText, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  GraduationCap
} from 'lucide-react';
import { coursesApi } from '../services/coursesApi';
import { SeoHead } from '../components/seo/SeoHead';
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, SectionHeader, Skeleton, EmptyState } from '../components/ui';

export const ModuleDetailPage = () => {
  const { courseSlug, subcourseSlug, moduleSlug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [subcourse, setSubcourse] = useState(null);
  const [moduleData, setModuleData] = useState(null);
  const [prevModule, setPrevModule] = useState(null);
  const [nextModule, setNextModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const res = await coursesApi.getCourseBySlug(courseSlug);
        if (res.success && res.data) {
          setCourse(res.data);
          const subcourses = res.data.subcourses || [];
          const matchedSub = subcourses.find(
            (s) => s.slug === subcourseSlug || s.curriculumLevel?.toLowerCase() === subcourseSlug?.toLowerCase()
          );

          if (matchedSub) {
            setSubcourse(matchedSub);
            const modules = matchedSub.modules || [];
            const modIndex = modules.findIndex((m) => m.slug === moduleSlug || m.id === Number(moduleSlug));
            
            if (modIndex !== -1) {
              setModuleData(modules[modIndex]);
              setPrevModule(modIndex > 0 ? modules[modIndex - 1] : null);
              setNextModule(modIndex < modules.length - 1 ? modules[modIndex + 1] : null);
            } else {
              setError('Module not found in this curriculum level');
            }
          } else {
            setError('Subcourse level not found');
          }
        } else {
          setError('Course not found');
        }
      } catch (err) {
        setError('Failed to load module details');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courseSlug, subcourseSlug, moduleSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
        <Skeleton variant="text" width="40%" height="24px" />
        <Skeleton variant="rectangular" height="180px" />
        <div className="space-y-3">
          <Skeleton variant="rectangular" height="70px" />
          <Skeleton variant="rectangular" height="70px" />
          <Skeleton variant="rectangular" height="70px" />
        </div>
      </div>
    );
  }

  if (error || !course || !subcourse || !moduleData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <EmptyState
          icon={BookOpen}
          title="Module Not Found"
          description="We couldn't find the requested module in this course track."
          actionText="Back to Subcourse Overview"
          actionHref={`/courses/${courseSlug}/${subcourseSlug}`}
        />
      </div>
    );
  }

  const canonicalUrl = `https://www.codeorbit.online/courses/${courseSlug}/${subcourse.slug || subcourseSlug}/${moduleData.slug || moduleSlug}`;
  const pageTitle = `${moduleData.title} — ${course.title} (${subcourse.title}) | CodeOrbit`;
  const pageDesc = moduleData.description || `Study ${moduleData.title} in ${course.title} ${subcourse.title}. Access complete free lessons, code examples, and practice materials.`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Courses', url: '/courses' },
    { name: course.title, url: `/courses/${courseSlug}` },
    { name: subcourse.title, url: `/courses/${courseSlug}/${subcourse.slug || subcourseSlug}` },
    { name: moduleData.title, url: `/courses/${courseSlug}/${subcourse.slug || subcourseSlug}/${moduleData.slug || moduleSlug}` }
  ];

  const lessons = moduleData.lessons || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      <SeoHead
        title={pageTitle}
        description={pageDesc}
        canonicalUrl={canonicalUrl}
        breadcrumbs={breadcrumbs}
        course={{
          name: `${course.title} - ${moduleData.title}`,
          description: pageDesc,
          isAccessibleForFree: subcourse.isFree !== false,
          educationalLevel: subcourse.curriculumLevel || 'Beginner to Advanced'
        }}
      />

      <div className="max-w-5xl mx-auto w-full space-y-8 flex-1">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto pb-1">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
          <Link to="/courses" className="hover:text-emerald-600 transition-colors">Courses</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
          <Link to={`/courses/${courseSlug}`} className="hover:text-emerald-600 transition-colors truncate max-w-[120px]">
            {course.title}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
          <Link to={`/courses/${courseSlug}/${subcourse.slug || subcourseSlug}`} className="hover:text-emerald-600 transition-colors truncate max-w-[140px]">
            {subcourse.title}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
          <span className="font-semibold text-slate-800 truncate max-w-[180px]">{moduleData.title}</span>
        </nav>

        {/* Module Header Card */}
        <header className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" size="sm">
              {subcourse.title}
            </Badge>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">
              Module {moduleData.orderIndex || 1} of {subcourse.modules?.length || 4}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {moduleData.title}
          </h1>

          {moduleData.description && (
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              {moduleData.description}
            </p>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-slate-100">
            <span className="flex items-center gap-1.5 font-medium">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>{lessons.length} Detailed Lessons</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Estimated {lessons.reduce((acc, l) => acc + (l.estimatedMinutes || 15), 0)} mins read time</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Free Public Access</span>
            </span>
          </div>
        </header>

        {/* Lessons List in Module */}
        <section className="space-y-4">
          <SectionHeader
            title="Lessons in this Module"
            subtitle="Read in sequential order for optimum understanding"
            action={
              lessons.length > 0 ? (
                <Button
                  variant="primary"
                  size="sm"
                  href={`/courses/${courseSlug}/${subcourse.slug || subcourseSlug}/${moduleData.slug || moduleSlug}/${lessons[0].slug}`}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Start First Lesson
                </Button>
              ) : null
            }
          />

          <div className="space-y-3">
            {lessons.map((lesson, idx) => {
              const lessonUrl = `/courses/${courseSlug}/${subcourse.slug || subcourseSlug}/${moduleData.slug || moduleSlug}/${lesson.slug}`;
              return (
                <Link
                  key={lesson.id || idx}
                  to={lessonUrl}
                  className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-sm transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 truncate transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">
                        ~{lesson.estimatedMinutes || 15} mins • Bilingual (English & Hinglish)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="hidden sm:inline text-xs font-semibold text-emerald-700 group-hover:underline">
                      Read Lesson
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Previous / Next Module Navigation */}
        <nav aria-label="Adjacent Module Navigation" className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {prevModule ? (
            <Link
              to={`/courses/${courseSlug}/${subcourse.slug || subcourseSlug}/${prevModule.slug || prevModule.id}`}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs transition-all flex items-center gap-3 group"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:-translate-x-1 flex-shrink-0" />
              <div className="min-w-0 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400">Previous Module</span>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                  {prevModule.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextModule && (
            <Link
              to={`/courses/${courseSlug}/${subcourse.slug || subcourseSlug}/${nextModule.slug || nextModule.id}`}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs transition-all flex items-center justify-end gap-3 group text-right sm:ml-auto w-full"
            >
              <div className="min-w-0 text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Next Module</span>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                  {nextModule.title}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1 flex-shrink-0" />
            </Link>
          )}
        </nav>

      </div>
    </div>
  );
};

export default ModuleDetailPage;
