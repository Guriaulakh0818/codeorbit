import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { EbookDetailPage } from './pages/EbookDetailPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

import { RazorpayCheckoutModal } from './components/RazorpayCheckoutModal';

function MainLayout() {
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#080d1e] text-slate-100 selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onBuyNow={() => setIsCheckoutOpen(true)} />} />
          <Route path="/catalog" element={<CatalogPage onBuyNow={() => setIsCheckoutOpen(true)} />} />
          <Route path="/ebook/:id" element={<EbookDetailPage onBuyNow={() => setIsCheckoutOpen(true)} />} />
          
          {/* Student Dashboard & Library */}
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

          {/* Store Owner / Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Policy Pages for Cashfree Whitelisting */}
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/terms" element={<TermsConditionsPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/cancellation-refund-policy" element={<RefundPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />
      <RazorpayCheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <LibraryProvider>
          <CartProvider>
            <MainLayout />
          </CartProvider>
        </LibraryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;


