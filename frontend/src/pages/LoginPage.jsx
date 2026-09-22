import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle, Loader2, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CodeOrbitLogo } from '../components/brand/CodeOrbitLogo';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!validateForm()) return;

    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);

    if (res.success) {
      if (res.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setServerError(res.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <Link to="/" className="inline-block hover:opacity-95 transition-opacity mb-1">
            <CodeOrbitLogo variant="light" height={48} />
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Sign In</h1>
          <p className="text-xs text-slate-500">Access your learning history, quiz results, and verified certificates</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-8 shadow-sm space-y-5">
          
          {/* Server Error Alert */}
          {serverError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Google One-Click Login */}
          <div>
            <GoogleSignInButton onError={(msg) => setServerError(msg)} />
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider relative">
              Or continue with email
            </span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@student.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                    if (serverError) setServerError(null);
                  }}
                  disabled={loading}
                  autoComplete="email"
                  className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${
                    errors.email ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-600 font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                    if (serverError) setServerError(null);
                  }}
                  disabled={loading}
                  autoComplete="current-password"
                  className={`w-full bg-slate-50 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${
                    errors.password ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
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
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Student Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
            Don't have a free student account yet?{' '}
            <Link to="/register" className="text-emerald-700 font-semibold hover:underline">
              Register here
            </Link>
          </div>
        </div>

        {/* Dedicated Admin Portal Link */}
        <div className="text-center">
          <Link to="/admin" className="text-[11px] text-slate-500 hover:text-emerald-700 font-medium transition-colors">
            Are you a teacher or staff member? Access Admin Portal →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
