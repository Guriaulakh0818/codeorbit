import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookmarkCheck, 
  BookOpen, 
  User, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Layers, 
  GraduationCap, 
  Award,
  Bookmark,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLearningProgress } from '../context/LearningProgressContext';
import { coursesApi } from '../services/coursesApi';
import { studentLearningApi } from '../services/studentLearningApi';
import { SeoHead } from '../components/seo/SeoHead';

export const StudentDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { 
    completedLessonIds, 
    bookmarkedLessonIds, 
    courseProgressMap, 
    getTrackProgress,
    fetchCourseProgress 
  } = useLearningProgress();

  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'certificates' | 'profile'
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyLink = (code) => {
    const isLocal = typeof window !== 'undefined' && window.location.hostname.includes('localhost');
    const origin = isLocal ? window.location.origin : 'https://www.codeorbit.online';
    const url = `${origin}/verify/${code}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    });
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [coursesRes, certsRes] = await Promise.all([
          coursesApi.getCourses({ size: 20 }),
          studentLearningApi.getStudentCertificates()
        ]);
        if (coursesRes.success && coursesRes.data) {
          setCourses(coursesRes.data);
          // Fetch authoritative progress for all tracks in parallel
          coursesRes.data.forEach((c) => {
            if (c.slug) fetchCourseProgress(c.slug);
          });
        }
        if (certsRes.success && certsRes.data) {
          setCertificates(certsRes.data);
        }
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [fetchCourseProgress]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const completedCount = completedLessonIds?.length || 0;
  const bookmarkedCount = bookmarkedLessonIds?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 flex flex-col selection:bg-emerald-500 selection:text-white">
      <SeoHead
        title="Student Dashboard — CodeOrbit"
        description="Track your computer science syllabus progress, verified certificates, and completed topics on CodeOrbit."
        canonicalUrl="https://www.codeorbit.online/student/dashboard"
      />

      <div className="max-w-6xl mx-auto w-full space-y-8 flex-1">
        
        {/* Top Student Banner Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-extrabold text-2xl shadow-2xs flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Learning Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Welcome back, {user?.name || 'Student'}!
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {user?.email || 'Logged in student'} • 100% Free Lifetime Learning Access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/courses"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Browse All Tutorials</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Counter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Completed Topics</span>
              <div className="text-2xl font-extrabold text-slate-900">{completedCount}</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Saved Bookmarks</span>
              <div className="text-2xl font-extrabold text-slate-900">{bookmarkedCount}</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Verified Credentials</span>
              <div className="text-2xl font-extrabold text-slate-900">
                {Object.values(courseProgressMap || {}).filter(p => p.certificateCode).length}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Subject Tracks ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'certificates'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>My Certificates</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Settings</span>
          </button>
        </div>

        {/* TAB 1: SUBJECT TRACKS PROGRESS */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Enrolled Computer Science Tracks</h2>
                <p className="text-xs text-slate-500">Step-by-step verified syllabus and placement interview preparation</p>
              </div>
              <Link to="/courses" className="text-xs font-semibold text-emerald-700 hover:underline">
                Explore all subjects →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 h-44" />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No Tracks Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse our open-access CS curriculum to start your learning journey.
                </p>
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => {
                  const trackProgress = getTrackProgress(course);
                  const pct = trackProgress.completionPercentage;
                  const completedLessons = trackProgress.completedLessons;
                  const totalLessons = trackProgress.totalLessons;

                  return (
                    <div
                      key={course.id}
                      className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all space-y-5 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase">
                            {course.track || 'CS CORE'}
                          </span>
                          <span className="text-emerald-700 font-bold font-mono">{pct}% Complete</span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-slate-900">{course.title}</h3>
                          <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                            {course.shortDescription || course.description}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-mono text-[11px]">
                            {completedLessons} / {totalLessons} Lessons Completed
                          </span>
                          <Link
                            to={`/courses/${course.slug}`}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Resume Track</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Your Verified Certificates ({certificates.length})</h2>
                <p className="text-xs text-slate-500">Official completion credentials registered in the public verification database</p>
              </div>
              <Link to="/certificates/verify" className="text-xs font-semibold text-emerald-700 hover:underline">
                Open verification registry →
              </Link>
            </div>

            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <div
                    key={cert.certificateCode}
                    className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-xs space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Verified Credential
                          </span>
                          <h3 className="text-base font-bold text-slate-900 mt-1">
                            {cert.courseTitle}
                          </h3>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                        {cert.certificateCode}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                      <span>Awarded To: <strong>{cert.studentFullName}</strong></span>
                      <span>{cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : 'Verified'}</span>
                    </div>

                    <div className="flex items-center gap-2.5 pt-2">
                      <Link
                        to={`/verify/${cert.certificateCode}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer flex-1 justify-center"
                      >
                        <GraduationCap className="w-3.5 h-3.5" /> View & Download PDF
                      </Link>

                      <button
                        onClick={() => handleCopyLink(cert.certificateCode)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                        title="Copy live verification link for resume or recruiter"
                      >
                        {copiedCode === cert.certificateCode ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-center max-w-md mx-auto space-y-2">
                <h3 className="text-base font-bold text-slate-900">How to Earn More Certificates</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complete all lessons in any course track and pass the module assessment with at least 80% to instantly unlock your verifiable certificate of completion.
                </p>
              </div>
              <div className="text-center pt-2">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <BookOpen className="w-4 h-4" /> Start Studying Now
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xl">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{user?.name || 'Student Name'}</h3>
                <p className="text-xs text-slate-500 font-mono">{user?.email || 'email@example.com'}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Account Role:</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {user?.role || 'STUDENT'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Membership Status:</span>
                <span className="font-bold text-slate-800">100% Free Lifetime Access</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Language Preference:</span>
                <span className="font-bold text-slate-800">English / Hinglish 🇮🇳</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentDashboardPage;
