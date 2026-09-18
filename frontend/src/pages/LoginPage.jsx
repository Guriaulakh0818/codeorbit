import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl bg-[#0b132b]">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Log in to CodeOrbit</h1>
          <p className="text-xs text-slate-400">Access your student library, orders, and engineering handbooks</p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                placeholder="you@student.edu or admin@codeorbit.dev"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: null });
                  if (serverError) setServerError(null);
                }}
                disabled={loading}
                className={`w-full bg-slate-950 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700/80 focus:border-brand-500 focus:ring-brand-500'
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-400">{errors.email}</p>}
          </div>

          {/* Password with Show/Hide toggle */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Password</label>
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
                className={`w-full bg-slate-950 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.password ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700/80 focus:border-brand-500 focus:ring-brand-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-rose-400">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Log In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center text-xs text-slate-400 pt-3 border-t border-slate-800">
          Don't have a student account yet?{' '}
          <Link to="/register" className="text-sky-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
