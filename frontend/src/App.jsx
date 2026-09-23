import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { LearningProgressProvider } from './context/LearningProgressContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { lazyWithRetry } from './utils/lazyWithRetry';

// Code-split route components with automated recovery from new deployment chunk invalidations
const HomePage = lazyWithRetry(() => import('./pages/HomePage'));
const CoursesPage = lazyWithRetry(() => import('./pages/CoursesPage'));
const CourseDetailPage = lazyWithRetry(() => import('./pages/CourseDetailPage'));
const SubcourseDetailPage = lazyWithRetry(() => import('./pages/SubcourseDetailPage'));
const ModuleDetailPage = lazyWithRetry(() => import('./pages/ModuleDetailPage'));
const LessonReaderPage = lazyWithRetry(() => import('./pages/LessonReaderPage'));
const QuizPlayerPage = lazyWithRetry(() => import('./pages/QuizPlayerPage'));
const CertificateVerifyPage = lazyWithRetry(() => import('./pages/CertificateVerifyPage'));
const StudentDashboardPage = lazyWithRetry(() => import('./pages/StudentDashboardPage'));
const AdminDashboardPage = lazyWithRetry(() => import('./pages/AdminDashboardPage'));
const AdminLoginPage = lazyWithRetry(() => import('./pages/AdminLoginPage'));
const LoginPage = lazyWithRetry(() => import('./pages/LoginPage'));
const RegisterPage = lazyWithRetry(() => import('./pages/RegisterPage'));
const ContactUsPage = lazyWithRetry(() => import('./pages/ContactUsPage'));
const AboutUsPage = lazyWithRetry(() => import('./pages/AboutUsPage'));
const PlacementKitsPage = lazyWithRetry(() => import('./pages/PlacementKitsPage'));
const PlacementKitDetailPage = lazyWithRetry(() => import('./pages/PlacementKitDetailPage'));
const TermsConditionsPage = lazyWithRetry(() => import('./pages/TermsConditionsPage'));
const RefundPolicyPage = lazyWithRetry(() => import('./pages/RefundPolicyPage'));
const PrivacyPolicyPage = lazyWithRetry(() => import('./pages/PrivacyPolicyPage'));
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage'));

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

            {/* SEO, About & Legal Policy Pages for AdSense Compliance */}
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
