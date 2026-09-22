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
  ShieldCheck, 
  Lock, 
  CheckCircle, 
  FileCheck, 
  HelpCircle, 
  TrendingUp, 
  CreditCard, 
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLearningProgress } from '../context/LearningProgressContext';
import { studentLearningApi } from '../services/studentLearningApi';
import { getMyPayments } from '../services/paymentApi';
import { placementKitApi } from '../services/placementKitApi';
import { SeoHead } from '../components/seo/SeoHead';
import { Button, Badge, Card, ProgressBar, Skeleton, EmptyState, Tabs, SectionHeader } from '../components/ui';

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

  const [dashboardData, setDashboardData] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [payments, setPayments] = useState([]);
  const [purchasedKits, setPurchasedKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'placement-kits' | 'certificates' | 'payments' | 'profile'
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
      setLoading(true);
      try {
        const [dashRes, certsRes, paymentsRes, kitsRes] = await Promise.all([
          studentLearningApi.getStudentDashboard(),
          studentLearningApi.getStudentCertificates(),
          getMyPayments().catch(() => []),
          placementKitApi.getMyPurchasedKits().catch(() => ({ data: [] }))
        ]);
        if (dashRes.success && dashRes.data) {
          setDashboardData(dashRes.data);
          (dashRes.data.enrolledCourses || []).forEach((c) => {
            if (c.slug) fetchCourseProgress(c.slug);
          });
        }
        if (certsRes.success && certsRes.data) {
          setCertificates(certsRes.data);
        }
        if (Array.isArray(paymentsRes)) {
          setPayments(paymentsRes);
        }
        if (kitsRes && kitsRes.data) {
          setPurchasedKits(kitsRes.data);
        }
      } catch (e) {
        console.error('Failed to load student dashboard', e);
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

  const enrolledCourses = dashboardData?.enrolledCourses || [];
  const completedCount = completedLessonIds?.length || 0;
  const bookmarkedCount = bookmarkedLessonIds?.length || 0;
  const totalEnrolled = dashboardData?.totalEnrolledCourses ?? enrolledCourses.length;

  const dashboardTabs = [
    { id: 'courses', label: 'My Enrolled Subjects', icon: BookOpen, badge: enrolledCourses.length },
    { id: 'placement-kits', label: 'Placement Kits', icon: Briefcase, badge: purchasedKits.length },
    { id: 'certificates', label: 'Certificates', icon: Award, badge: certificates.length },
    { id: 'payments', label: 'Payments & Orders', icon: CreditCard, badge: payments.length },
    { id: 'profile', label: 'Profile & Account', icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 flex flex-col selection:bg-emerald-500 selection:text-white">
      <SeoHead
        title="Student Dashboard — CodeOrbit"
        description="Track your enrolled computer science subjects, 4-tier learning progression, quiz achievements, and verified certificates."
        canonicalUrl="https://www.codeorbit.online/student/dashboard"
      />

      <div className="max-w-6xl mx-auto w-full space-y-8 flex-1">
        
        {/* Top Student Banner Card */}
        <Card className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName || 'Student'}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-extrabold text-2xl shadow-2xs flex-shrink-0">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : (user?.name ? user.name.charAt(0).toUpperCase() : 'S')}
              </div>
            )}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Enrolled Student Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Welcome back, {user?.fullName || user?.name || 'Student'}!
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {user?.email || 'Logged in student'} • {user?.authProvider === 'GOOGLE' ? 'Google Account' : 'Standard Student Account'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              href="/courses"
              icon={Sparkles}
            >
              Browse All Subjects
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              icon={LogOut}
            >
              Logout
            </Button>
          </div>
        </Card>

        {/* Quick Stats Counter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Enrolled Subjects</span>
              <div className="text-2xl font-extrabold text-slate-900">{totalEnrolled}</div>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Completed Topics</span>
              <div className="text-2xl font-extrabold text-slate-900">{completedCount}</div>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Saved Bookmarks</span>
              <div className="text-2xl font-extrabold text-slate-900">{bookmarkedCount}</div>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Verified Certificates</span>
              <div className="text-2xl font-extrabold text-slate-900">
                {certificates.length || Object.values(courseProgressMap || {}).filter(p => p.certificateCode).length}
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs
          tabs={dashboardTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
        />

        {/* TAB 1: ENROLLED SUBJECTS & 4-TIER PROGRESSION */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <SectionHeader
              title="Your Enrolled Computer Science Subjects"
              subtitle="Only tracks you have explicitly enrolled in appear on your dashboard"
              action={
                <Button variant="ghost" size="sm" href="/courses" icon={ArrowRight} iconPosition="right">
                  Enroll in more subjects
                </Button>
              }
            />

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton variant="card" height="240px" />
                <Skeleton variant="card" height="240px" />
              </div>
            ) : enrolledCourses.length === 0 ? (
              <Card className="p-12 text-center max-w-lg mx-auto">
                <EmptyState
                  icon={GraduationCap}
                  title="No Subjects Enrolled Yet"
                  description="You haven't enrolled in any computer science tracks yet. Browse our open curriculum to enroll in DSA, Java, Python, DBMS, and more for 100% free."
                  actionText="Explore & Enroll in Subjects"
                  actionHref="/courses"
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {enrolledCourses.map((course) => {
                  const overallPct = course.overallProgressPercentage || 0;
                  const subcourses = course.subcourses || [];

                  return (
                    <Card
                      key={course.courseId || course.slug}
                      hover={true}
                      className="p-6 sm:p-8 space-y-6"
                    >
                      {/* Course Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="primary" size="xs">
                              {course.category || 'Computer Science'}
                            </Badge>
                            <Badge variant="default" size="xs">
                              4-Level Curriculum
                            </Badge>
                          </div>
                          <h3 className="text-xl font-extrabold text-slate-900">{course.title}</h3>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-xs font-bold text-emerald-700">{overallPct}% Overall</div>
                            <span className="text-[10px] text-slate-400">Completion</span>
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            href={`/courses/${course.slug}`}
                            icon={ArrowRight}
                            iconPosition="right"
                          >
                            Resume Track
                          </Button>
                        </div>
                      </div>

                      {/* 4-Tier Subcourse Breakdown Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {subcourses.map((sc, idx) => {
                          const levelLabels = {
                            BEGINNER: '1. Beginner',
                            INTERMEDIATE: '2. Intermediate',
                            ADVANCED: '3. Advanced',
                            PLACEMENT_READY: '4. Placement Ready'
                          };
                          const label = levelLabels[sc.level] || `Level ${idx + 1}`;
                          const isPaid = sc.isPaid || sc.level === 'PLACEMENT_READY';

                          return (
                            <div
                              key={sc.subcourseId || idx}
                              className={`p-4 rounded-2xl border text-xs space-y-3 transition-colors ${
                                sc.completionPercentage === 100
                                  ? 'bg-emerald-50/70 border-emerald-200'
                                  : isPaid
                                  ? 'bg-amber-50/40 border-amber-200/80'
                                  : 'bg-slate-50/70 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 text-xs">{label}</span>
                                <Badge variant={isPaid ? 'warning' : 'success'} size="xs">
                                  {isPaid ? `₹${sc.priceInr || 29}` : 'FREE'}
                                </Badge>
                              </div>

                              {/* Progress metric */}
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-[11px] text-slate-500">
                                  <span>Progress</span>
                                  <span className="font-semibold text-slate-700">{sc.completionPercentage || 0}%</span>
                                </div>
                                <ProgressBar
                                  value={sc.completionPercentage || 0}
                                  max={100}
                                  variant="primary"
                                  size="xs"
                                  showPercentage={false}
                                />
                              </div>

                              {/* Status checklist */}
                              <div className="space-y-1 text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="w-3 h-3 text-slate-400" /> Lessons
                                  </span>
                                  <span className="font-mono font-medium">
                                    {sc.completedLessonsCount || 0} / {sc.totalLessonsCount || 0}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <HelpCircle className="w-3 h-3 text-purple-500" /> Quizzes
                                  </span>
                                  <span className="font-mono font-medium">
                                    {sc.moduleQuizzesPassed || 0} / {sc.totalModuleQuizzes || 4}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <Award className="w-3 h-3 text-amber-500" /> Level Exam
                                  </span>
                                  <span className={`text-[10px] font-bold ${sc.finalExamPassed ? 'text-emerald-700' : 'text-slate-400'}`}>
                                    {sc.finalExamPassed ? 'PASSED ✓' : 'PENDING'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Certificate readiness status */}
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Award className="w-4 h-4 text-emerald-600" />
                          <span>
                            {course.certificateClaimable
                              ? '🎉 Course completed! Your verifiable certificate is ready to claim.'
                              : 'Complete Levels 1, 2, and 3 with 80%+ on assessments to unlock your certificate.'}
                          </span>
                        </div>
                        <Link
                          to={`/courses/${course.slug}`}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 self-start sm:self-auto"
                        >
                          View Syllabus & Quizzes →
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PLACEMENT PREP KITS */}
        {activeTab === 'placement-kits' && (
          <div className="space-y-6">
            <SectionHeader
              title={`Your Unlocked Placement Preparation Kits (${purchasedKits.length})`}
              subtitle="Role-based interview question banks with model answers, lesson references, and live practice"
              action={
                <Button
                  variant="primary"
                  size="sm"
                  href="/placement-kits"
                  icon={Sparkles}
                >
                  Explore All 10 Role Kits
                </Button>
              }
            />

            {purchasedKits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {purchasedKits.map((kit) => {
                  const percent = kit.totalQuestions > 0 ? Math.round(((kit.attemptedQuestions || 0) / kit.totalQuestions) * 100) : 0;
                  return (
                    <Card
                      key={kit.slug}
                      hover={true}
                      className="p-6 flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="primary" size="xs">
                            {kit.targetRole || 'Interview Prep'}
                          </Badge>
                          <Badge variant="success" size="xs">
                            LIFETIME UNLOCKED
                          </Badge>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-slate-900 line-clamp-1">{kit.title}</h3>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">{kit.shortDescription}</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 pt-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700">Practice Completion</span>
                            <span className="font-mono font-bold text-emerald-700">
                              {kit.attemptedQuestions || 0}/{kit.totalQuestions} ({percent}%)
                            </span>
                          </div>
                          <ProgressBar
                            value={kit.attemptedQuestions || 0}
                            max={kit.totalQuestions || 1}
                            variant="primary"
                            size="sm"
                            showPercentage={false}
                          />
                        </div>

                        {/* Category Badges */}
                        {kit.categories && kit.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {kit.categories.slice(0, 3).map((cat, i) => (
                              <Badge key={i} variant="default" size="xs">
                                {cat.name} ({cat.questionCount || 0})
                              </Badge>
                            ))}
                            {kit.categories.length > 3 && (
                              <Badge variant="default" size="xs">
                                +{kit.categories.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <span className="text-xs text-slate-500">
                          {kit.correctAnswers || 0} Correct Answers
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          href={`/placement-kits/${kit.slug}`}
                          icon={ArrowRight}
                          iconPosition="right"
                        >
                          Resume Practice
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-10 text-center max-w-lg mx-auto">
                <EmptyState
                  icon={Briefcase}
                  title="No Placement Prep Kits Unlocked Yet"
                  description="Accelerate your campus and industry job preparation with curated question banks, verified solutions, and direct links back to CodeOrbit theory lessons for only ₹99 per role."
                  actionText="Browse All 10 Placement Kits (₹99)"
                  actionHref="/placement-kits"
                />
              </Card>
            )}
          </div>
        )}

        {/* TAB 3: CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <SectionHeader
              title={`Your Verified Certificates (${certificates.length})`}
              subtitle="Official completion credentials registered in the public verification database"
              action={
                <Button variant="ghost" size="sm" href="/certificates/verify">
                  Open verification registry →
                </Button>
              }
            />

            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <Card
                    key={cert.certificateCode}
                    hover={true}
                    className="p-6 space-y-4 border-emerald-200/80 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <Badge variant="success" size="xs">
                            Verified Credential
                          </Badge>
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
                      <Button
                        variant="primary"
                        size="sm"
                        href={`/verify/${cert.certificateCode}`}
                        icon={GraduationCap}
                        className="flex-1"
                      >
                        View & Download PDF
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(cert.certificateCode)}
                      >
                        {copiedCode === cert.certificateCode ? 'Copied!' : 'Copy Link'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : null}

            <Card className="p-8 space-y-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-base font-bold text-slate-900">How to Earn More Certificates</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complete all modules in Levels 1, 2, and 3 and pass all assessments with at least 80% to instantly unlock your verifiable certificate of completion.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  href="/courses"
                  icon={BookOpen}
                >
                  Start Studying Now
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 4: PAYMENTS & ORDERS */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <SectionHeader
              title={`Payment & Entitlement History (${payments.length})`}
              subtitle="Official records of Placement Ready unlocks and verified transactions"
            />

            {payments.length > 0 ? (
              <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">Order #</th>
                        <th className="p-4">Subject Track</th>
                        <th className="p-4">Subcourse Tier</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Entitlement</th>
                        <th className="p-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.map((p) => (
                        <tr key={p.id || p.orderNumber} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-800">{p.orderNumber}</td>
                          <td className="p-4 font-bold text-slate-900">{p.courseTitle || p.courseSlug}</td>
                          <td className="p-4 text-slate-600">{p.subcourseTitle || 'Placement Ready'}</td>
                          <td className="p-4 font-extrabold text-slate-900">₹{p.amountInr}</td>
                          <td className="p-4">
                            <Badge variant={p.status === 'PAID' ? 'success' : 'warning'} size="xs">
                              {p.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant={p.entitlementActive ? 'success' : 'default'} size="xs">
                              {p.entitlementActive ? 'ACTIVE ✓' : 'LOCKED'}
                            </Badge>
                          </td>
                          <td className="p-4 text-slate-500 font-mono text-[11px]">
                            {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : (p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center max-w-lg mx-auto">
                <EmptyState
                  icon={CreditCard}
                  title="No payment records yet"
                  description="The first three subcourses (Beginner, Intermediate, Advanced) are 100% free. You can unlock Placement Ready interview kits for ₹29 directly inside any course syllabus."
                  actionText="Browse Subjects"
                  actionHref="/courses"
                />
              </Card>
            )}
          </div>
        )}

        {/* TAB 5: PROFILE */}
        {activeTab === 'profile' && (
          <Card className="p-8 max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName || 'Student'}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xl">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : (user?.name ? user.name.charAt(0).toUpperCase() : 'S')}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-slate-900">{user?.fullName || user?.name || 'Student Name'}</h3>
                <p className="text-xs text-slate-500 font-mono">{user?.email || 'email@example.com'}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Account Role:</span>
                <Badge variant="primary" size="xs">
                  {user?.role || 'STUDENT'}
                </Badge>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Authentication Provider:</span>
                <span className="font-bold text-slate-800">
                  {user?.authProvider === 'GOOGLE' ? 'Google OAuth' : 'Email / Password'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Enrolled Subjects:</span>
                <span className="font-bold text-emerald-700">{totalEnrolled} Tracks</span>
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
          </Card>
        )}

      </div>
    </div>
  );
};

export default StudentDashboardPage;
