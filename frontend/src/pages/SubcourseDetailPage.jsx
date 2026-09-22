import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Layers, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  FileText, 
  Award,
  ArrowRight,
  ShieldCheck,
  Zap,
  GraduationCap
} from 'lucide-react';
import { coursesApi } from '../services/coursesApi';
import { SeoHead } from '../components/seo/SeoHead';
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, SectionHeader, Skeleton, EmptyState } from '../components/ui';

export const SubcourseDetailPage = () => {
  const { courseSlug, subcourseSlug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [subcourse, setSubcourse] = useState(null);
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
          const matched = subcourses.find(
            (s) => s.slug === subcourseSlug || s.curriculumLevel?.toLowerCase() === subcourseSlug?.toLowerCase()
          );
          if (matched) {
            setSubcourse(matched);
          } else {
            const byLevel = subcourses.find(
              (s) => s.curriculumLevel?.toLowerCase() === subcourseSlug?.replace('-tier', '')?.toLowerCase()
            );
            if (byLevel) {
              setSubcourse(byLevel);
            } else {
              setError('Subcourse level not found');
            }
          }
        } else {
          setError('Course not found');
        }
      } catch (err) {
        setError('Failed to load subcourse details');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courseSlug, subcourseSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
        <Skeleton variant="text" width="30%" height="24px" />
        <Skeleton variant="rectangular" height="200px" />
        <div className="grid grid-cols-1 gap-4">
          <Skeleton variant="rectangular" height="120px" />
          <Skeleton variant="rectangular" height="120px" />
        </div>
      </div>
    );
  }

  if (error || !course || !subcourse) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <EmptyState
          icon={BookOpen}
          title="Subcourse Track Not Found"
          description="We couldn't find the requested learning tier for this course subject."
          actionText="View Full Subject Syllabus"
          actionHref={`/courses/${courseSlug}`}
        />
      </div>
    );
  }

  const isFree = subcourse.isFree !== false && subcourse.priceInr === 0;
  const canonicalUrl = `https://www.codeorbit.online/courses/${courseSlug}/${subcourse.slug || subcourseSlug}`;
  const pageTitle = `${course.title} — ${subcourse.title} | CodeOrbit Free CS Curriculum`;
  const pageDesc = subcourse.description || `Master ${subcourse.title} for ${course.title}. Complete 4 structured modules with free theory, code examples, and practice quizzes.`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Courses', url: '/courses' },
    { name: course.title, url: `/courses/${courseSlug}` },
    { name: subcourse.title, url: `/courses/${courseSlug}/${subcourse.slug || subcourseSlug}` }
  ];

  const modules = subcourse.modules || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      <SeoHead
        title={pageTitle}
        description={pageDesc}
        canonicalUrl={canonicalUrl}
        breadcrumbs={breadcrumbs}
        course={{
          name: `${course.title} - ${subcourse.title}`,
          description: pageDesc,
          isAccessibleForFree: isFree,
          educationalLevel: subcourse.curriculumLevel || 'Beginner to Advanced'
        }}
      />

      <div className="max-w-6xl mx-auto w-full space-y-8 flex-1">
        
        {/* Visible Accessible Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto pb-1">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
          <Link to="/courses" className="hover:text-emerald-600 transition-colors">Courses</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
          <Link to={`/courses/${courseSlug}`} className="hover:text-emerald-600 transition-colors truncate max-w-[140px]">
            {course.title}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
          <span className="font-semibold text-slate-800 truncate max-w-[180px]">{subcourse.title}</span>
        </nav>

        {/* Hero Header Card */}
        <header className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" size="sm">
              {subcourse.curriculumLevel || 'Curriculum Tier'}
            </Badge>
            <Badge variant={isFree ? 'success' : 'warning'} size="sm">
              {isFree ? '100% FREE' : `₹${subcourse.priceInr || 29}`}
            </Badge>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">
              Part of {course.title}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {course.title}: {subcourse.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {subcourse.description || course.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-slate-100">
            <span className="flex items-center gap-1.5 font-medium">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>{modules.length} Structured Modules</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>~{subcourse.estimatedHours || 10} Hours Learning Path</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Free Bilingual Lessons (EN & Hinglish)</span>
            </span>
          </div>
        </header>

        {/* 4 Modules Progression Roadmap */}
        <section className="space-y-6">
          <SectionHeader
            title="Curriculum Modules & Lessons"
            subtitle="Step-by-step topic breakdown designed for deep mastery"
            action={
              <Button
                variant="ghost"
                size="sm"
                href={`/courses/${courseSlug}`}
                icon={ArrowRight}
                iconPosition="right"
              >
                All 4 Levels
              </Button>
            }
          />

          <div className="grid grid-cols-1 gap-5">
            {modules.map((mod, idx) => {
              const lessons = mod.lessons || [];
              const moduleUrl = `/courses/${courseSlug}/${subcourse.slug || subcourseSlug}/${mod.slug || `module-${idx + 1}`}`;
              return (
                <Card key={mod.id || idx} hover={true} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{mod.title}</h3>
                      </div>
                      {mod.description && (
                        <p className="text-xs text-slate-500 mt-1 pl-8">{mod.description}</p>
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      href={moduleUrl}
                      icon={ChevronRight}
                      iconPosition="right"
                      className="self-start sm:self-auto"
                    >
                      Explore Module
                    </Button>
                  </div>

                  {/* Lesson List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {lessons.map((lesson, lIdx) => {
                      const lessonUrl = `/courses/${courseSlug}/${subcourse.slug || subcourseSlug}/${mod.slug || `module-${idx + 1}`}/${lesson.slug}`;
                      return (
                        <Link
                          key={lesson.id || lIdx}
                          to={lessonUrl}
                          className="p-3 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-medium text-slate-800 group-hover:text-emerald-700 truncate">
                              {lesson.title}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 flex-shrink-0">
                            {lesson.estimatedMinutes || 15}m
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Sibling Subcourse Navigation */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Complete 4-Level Learning Progression</span>
          </div>
          <h3 className="text-lg font-bold text-white">Explore Other Tiers in {course.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            {(course.subcourses || []).map((s, i) => {
              const isCurrent = s.id === subcourse.id || s.slug === subcourse.slug;
              const linkUrl = `/courses/${courseSlug}/${s.slug || s.curriculumLevel?.toLowerCase()}`;
              return (
                <Link
                  key={s.id || i}
                  to={linkUrl}
                  className={`p-3.5 rounded-2xl border transition-all text-xs flex flex-col justify-between space-y-2 ${
                    isCurrent
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-400'
                  }`}
                >
                  <div className="font-bold">{s.title}</div>
                  <div className="text-[10px] opacity-80 uppercase font-mono">
                    {s.isFree !== false ? '100% Free' : `₹${s.priceInr || 29}`}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};

export default SubcourseDetailPage;
