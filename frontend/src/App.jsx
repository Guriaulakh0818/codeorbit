import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { LearningProgressProvider } from './context/LearningProgressContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { lazyWithRetry } from './utils/lazyWithRetry';

// Code-split student learning pages
const HomePage = lazyWithRetry(() => import('./pages/HomePage'));
const CoursesPage = lazyWithRetry(() => import('./pages/CoursesPage'));
const CourseDetailPage = lazyWithRetry(() => import('./pages/CourseDetailPage'));
const SubcourseDetailPage = lazyWithRetry(() => import('./pages/SubcourseDetailPage'));
const ModuleDetailPage = lazyWithRetry(() => import('./pages/ModuleDetailPage'));
const LessonReaderPage = lazyWithRetry(() => import('./pages/LessonReaderPage'));
const QuizPlayerPage = lazyWithRetry(() => import('./pages/QuizPlayerPage'));
const CertificateVerifyPage = lazyWithRetry(() => import('./pages/CertificateVerifyPage'));
const StudentDashboardPage = lazyWithRetry(() => import('./pages/StudentDashboardPage'));
const PlacementKitsPage = lazyWithRetry(() => import('./pages/PlacementKitsPage'));
const PlacementKitDetailPage = lazyWithRetry(() => import('./pages/PlacementKitDetailPage'));
const LoginPage = lazyWithRetry(() => import('./pages/LoginPage'));
const RegisterPage = lazyWithRetry(() => import('./pages/RegisterPage'));
const ContactUsPage = lazyWithRetry(() => import('./pages/ContactUsPage'));
const AboutUsPage = lazyWithRetry(() => import('./pages/AboutUsPage'));
const TermsConditionsPage = lazyWithRetry(() => import('./pages/TermsConditionsPage'));
const RefundPolicyPage = lazyWithRetry(() => import('./pages/RefundPolicyPage'));
const PrivacyPolicyPage = lazyWithRetry(() => import('./pages/PrivacyPolicyPage'));
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage'));

// Code-split production Admin Panel pages
const AdminDashboardPage = lazyWithRetry(() => import('./pages/admin/AdminDashboardPage'));
const AdminCoursesPage = lazyWithRetry(() => import('./pages/admin/AdminCoursesPage'));
const AdminModulesLessonsPage = lazyWithRetry(() => import('./pages/admin/AdminModulesLessonsPage'));
const AdminQuizzesPage = lazyWithRetry(() => import('./pages/admin/AdminQuizzesPage'));
const AdminStudentsPage = lazyWithRetry(() => import('./pages/admin/AdminStudentsPage'));
const AdminStudentDetailPage = lazyWithRetry(() => import('./pages/admin/AdminStudentDetailPage'));
const AdminPaymentsPage = lazyWithRetry(() => import('./pages/admin/AdminPaymentsPage'));
const AdminPlacementReadyPage = lazyWithRetry(() => import('./pages/admin/AdminPlacementReadyPage'));
const AdminCertificatesPage = lazyWithRetry(() => import('./pages/admin/AdminCertificatesPage'));
const AdminAnalyticsPage = lazyWithRetry(() => import('./pages/admin/AdminAnalyticsPage'));
const AdminReportsPage = lazyWithRetry(() => import('./pages/admin/AdminReportsPage'));
const AdminUsersRolesPage = lazyWithRetry(() => import('./pages/admin/AdminUsersRolesPage'));
const AdminSettingsPage = lazyWithRetry(() => import('./pages/admin/AdminSettingsPage'));
const AdminLoginPage = lazyWithRetry(() => import('./pages/AdminLoginPage'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Protected Route Guard for Admin Roles (SUPER_ADMIN, ADMIN, CONTENT_MANAGER, SUPPORT)
const AdminProtectedRoute = ({ children, allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER', 'SUPPORT'] }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// Protected Route Guard for Students
const StudentProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Admin Gateway Redirect
const AdminGateway = () => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <AdminLoginPage />;
};

function MainLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 selection:bg-emerald-500 selection:text-white">
      {/* Show public Navbar only for non-admin views */}
      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ================================================================= */}
            {/* 1. PUBLIC CS LEARNING PORTAL ROUTES */}
            {/* ================================================================= */}
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseSlug" element={<CourseDetailPage />} />
            <Route path="/courses/:courseSlug/:subcourseSlug" element={<SubcourseDetailPage />} />
            <Route path="/courses/:courseSlug/:subcourseSlug/:moduleSlug" element={<ModuleDetailPage />} />
            <Route path="/courses/:courseSlug/:subcourseSlug/:moduleSlug/:lessonSlug" element={<LessonReaderPage />} />
            <Route path="/courses/:courseSlug/lessons/:lessonSlug" element={<LessonReaderPage />} />
            <Route path="/courses/:courseSlug/quizzes/:quizSlug" element={<QuizPlayerPage />} />
            
            {/* Placement Prep Kits */}
            <Route path="/placement-kits" element={<PlacementKitsPage />} />
            <Route path="/placement-kits/:slug" element={<PlacementKitDetailPage />} />

            {/* Certificate Verification */}
            <Route path="/certificates/verify/:certificateCode" element={<CertificateVerifyPage />} />
            <Route path="/certificates/verify" element={<CertificateVerifyPage />} />
            <Route path="/verify/:certificateCode" element={<CertificateVerifyPage />} />
            <Route path="/verify" element={<CertificateVerifyPage />} />

            {/* Student Dashboard & Learning History */}
            <Route
              path="/student/dashboard"
              element={
                <StudentProtectedRoute>
                  <StudentDashboardPage />
                </StudentProtectedRoute>
              }
            />
            <Route
              path="/library"
              element={
                <StudentProtectedRoute>
                  <StudentDashboardPage />
                </StudentProtectedRoute>
              }
            />

            {/* ================================================================= */}
            {/* 2. DEDICATED ADMIN CONTROL CENTER ROUTES */}
            {/* ================================================================= */}
            <Route path="/admin" element={<AdminGateway />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            {/* Admin Dashboard */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboardPage />
                </AdminProtectedRoute>
              }
            />

            {/* Admin Courses & Curriculum */}
            <Route
              path="/admin/courses"
              element={
                <AdminProtectedRoute>
                  <AdminCoursesPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/courses/:id"
              element={
                <AdminProtectedRoute>
                  <AdminCoursesPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/curriculum"
              element={
                <AdminProtectedRoute>
                  <AdminCoursesPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/modules"
              element={
                <AdminProtectedRoute>
                  <AdminModulesLessonsPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/lessons"
              element={
                <AdminProtectedRoute>
                  <AdminModulesLessonsPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/quizzes"
              element={
                <AdminProtectedRoute>
                  <AdminQuizzesPage />
                </AdminProtectedRoute>
              }
            />

            {/* Admin Student Management */}
            <Route
              path="/admin/students"
              element={
                <AdminProtectedRoute>
                  <AdminStudentsPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/students/:id"
              element={
                <AdminProtectedRoute>
                  <AdminStudentDetailPage />
                </AdminProtectedRoute>
              }
            />

            {/* Admin Monetization Management */}
            <Route
              path="/admin/payments"
              element={
                <AdminProtectedRoute>
                  <AdminPaymentsPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/placement-ready"
              element={
                <AdminProtectedRoute>
                  <AdminPlacementReadyPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/certificates"
              element={
                <AdminProtectedRoute>
                  <AdminCertificatesPage />
                </AdminProtectedRoute>
              }
            />

            {/* Admin Insights & Analytics */}
            <Route
              path="/admin/analytics"
              element={
                <AdminProtectedRoute>
                  <AdminAnalyticsPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <AdminProtectedRoute>
                  <AdminReportsPage />
                </AdminProtectedRoute>
              }
            />

            {/* Admin Users & Settings */}
            <Route
              path="/admin/users"
              element={
                <AdminProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                  <AdminUsersRolesPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                  <AdminSettingsPage />
                </AdminProtectedRoute>
              }
            />

            {/* Student Authentication */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* SEO, About & Legal Policy Pages */}
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/terms" element={<TermsConditionsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/refund" element={<RefundPolicyPage />} />

            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* Show public Footer only for non-admin views */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <LearningProgressProvider>
            <MainLayout />
          </LearningProgressProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
