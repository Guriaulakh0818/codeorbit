import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { LearningProgressProvider } from './context/LearningProgressContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Code-split route components to minimize initial bundle size and boost page load speed
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const CoursesPage = lazy(() => import('./pages/CoursesPage').then(m => ({ default: m.CoursesPage })));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage').then(m => ({ default: m.CourseDetailPage })));
const LessonReaderPage = lazy(() => import('./pages/LessonReaderPage').then(m => ({ default: m.LessonReaderPage })));
const QuizPlayerPage = lazy(() => import('./pages/QuizPlayerPage').then(m => ({ default: m.QuizPlayerPage })));
const CertificateVerifyPage = lazy(() => import('./pages/CertificateVerifyPage').then(m => ({ default: m.CertificateVerifyPage })));
const StudentDashboardPage = lazy(() => import('./pages/StudentDashboardPage').then(m => ({ default: m.StudentDashboardPage })));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage').then(m => ({ default: m.ContactUsPage })));
const TermsConditionsPage = lazy(() => import('./pages/TermsConditionsPage').then(m => ({ default: m.TermsConditionsPage })));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage').then(m => ({ default: m.RefundPolicyPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Protected Route Guard for Students/Admins
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Dedicated Admin Route Gateway: If admin authenticated, load AdminDashboard; otherwise load distinct AdminLoginPage
const AdminGateway = () => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAdmin) {
    return <AdminDashboardPage />;
  }

  return <AdminLoginPage />;
};

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public CS Learning Portal Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseSlug" element={<CourseDetailPage />} />
            <Route path="/courses/:courseSlug/lessons/:lessonSlug" element={<LessonReaderPage />} />
            <Route path="/courses/:courseSlug/quizzes/:quizSlug" element={<QuizPlayerPage />} />
            
            {/* Certificate Verification */}
            <Route path="/certificates/verify/:certificateCode" element={<CertificateVerifyPage />} />
            <Route path="/certificates/verify" element={<CertificateVerifyPage />} />
            <Route path="/verify/:certificateCode" element={<CertificateVerifyPage />} />
            <Route path="/verify" element={<CertificateVerifyPage />} />

            {/* Student Dashboard & Learning History */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                  <StudentDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/library"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                  <StudentDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Dedicated Admin Portal Routes */}
            <Route path="/admin" element={<AdminGateway />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Student Authentication */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* SEO & Legal Policy Pages for AdSense Compliance */}
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/terms" element={<TermsConditionsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/refund" element={<RefundPolicyPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
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
