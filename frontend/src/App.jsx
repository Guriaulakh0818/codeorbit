import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LearningProgressProvider } from './context/LearningProgressContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { LessonReaderPage } from './pages/LessonReaderPage';
import { QuizPlayerPage } from './pages/QuizPlayerPage';
import { CertificateVerifyPage } from './pages/CertificateVerifyPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

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
      </main>

      <Footer />
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <LearningProgressProvider>
          <MainLayout />
        </LearningProgressProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
