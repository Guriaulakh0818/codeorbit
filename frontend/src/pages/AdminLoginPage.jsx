import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2, 
  KeyRound,
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CodeOrbitLogo } from '../components/brand/CodeOrbitLogo';

export const AdminLoginPage = () => {
  const { user, login, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  // If already logged in as ADMIN, redirect to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);

  const validateForm = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Admin email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Admin password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      setLoading(false);

      if (res.success) {
        if (res.role === 'ADMIN' || res.user?.role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          setServerError('Access Restricted: This account does not possess Administrator privileges. Please login with an authorized Admin account.');
        }
      } else {
        setServerError(res.message || 'Invalid administrator credentials. Please check and try again.');
      }
    } catch (err) {
      setLoading(false);
      setServerError('Unable to connect to the authentication server. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 animate-in fade-in duration-300">
        
        {/* Portal Header Badge */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <Link to="/" className="inline-block hover:opacity-95 transition-opacity mb-1">
            <CodeOrbitLogo variant="light" height={48} />
          </Link>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>CodeOrbit Central Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Portal Sign In
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Restricted access for curriculum authors, track editors, and platform administrators.
          </p>
        </div>

        {/* Admin Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-8 shadow-sm space-y-6">
          
          {/* User currently logged in as non-admin notice */}
          {user && !isAdmin && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Logged in as Student: {user.email}</p>
                <p className="text-amber-700 text-[11px]">
                  Sign in with administrator credentials below to access the management console.
                </p>
              </div>
            </div>
          )}

          {/* Server Error Alert */}
          {serverError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLoginSubmit} className="space-y-4.5 text-xs">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold block">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  placeholder="admin@codeorbit.dev"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                    if (serverError) setServerError(null);
                  }}
                  disabled={loading}
                  autoComplete="email"
                  className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${
                    errors.email ? 'border-rose-400 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-600 font-medium">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-700 font-semibold block">
                  Admin Master Password
                </label>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                    if (serverError) setServerError(null);
                  }}
                  disabled={loading}
                  autoComplete="current-password"
                  className={`w-full bg-slate-50 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${
                    errors.password ? 'border-rose-400 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-rose-600 font-medium">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Unlock Admin Console</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              256-Bit SSL Encrypted Access
            </span>
            <Link to="/login" className="text-slate-600 hover:text-emerald-700 font-semibold hover:underline">
              Student Login →
            </Link>
          </div>
        </div>

        {/* Back to Homepage */}
        <div className="text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium">
            ← Return to CodeOrbit Learning Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;
