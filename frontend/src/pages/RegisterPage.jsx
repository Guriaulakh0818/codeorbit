import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Lock, Mail, User, ArrowRight, Eye, EyeOff, Info, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errs = {};

    if (!fullName.trim()) {
      errs.fullName = 'Full name is required';
    }

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

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm your password';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      errs.agreeTerms = 'You must agree to the Terms of Service & Privacy Policy';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await register({ fullName, email, password });
      if (res.success) {
        navigate('/student/dashboard');
      } else {
        setErrors({ form: res.message });
      }
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl bg-[#0b132b]">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Student Account</h1>
          <p className="text-xs text-slate-400">Unlock curated CSE & IT engineering handbooks & study notes</p>
        </div>

        {/* Demo Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
          <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-200">Student Registration:</strong> Public registration creates Student accounts for browsing and purchasing e-books. Store Admin accounts cannot be self-registered.
          </span>
        </div>

        {errors.form && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
            {errors.form}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Rohit Sharma"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: null });
                }}
                className={`w-full bg-slate-950 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.fullName ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700/80 focus:border-brand-500 focus:ring-brand-500'
                }`}
              />
            </div>
            {errors.fullName && <p className="text-[11px] text-rose-400">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                placeholder="rohit@university.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                className={`w-full bg-slate-950 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700/80 focus:border-brand-500 focus:ring-brand-500'
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-400">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Confirm Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                }}
                className={`w-full bg-slate-950 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.confirmPassword ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700/80 focus:border-brand-500 focus:ring-brand-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-[11px] text-rose-400">{errors.confirmPassword}</p>}
          </div>

          {/* Terms Checkbox */}
          <div className="space-y-1 pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-slate-300 text-xs">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: null });
                }}
                className="mt-0.5 rounded border-slate-700 bg-slate-900 text-brand-600 focus:ring-brand-500"
              />
              <span>
                I agree to the <a href="#terms" className="text-sky-400 hover:underline">Terms of Service</a> and <a href="#privacy" className="text-sky-400 hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.agreeTerms && <p className="text-[11px] text-rose-400">{errors.agreeTerms}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Create Student Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center text-xs text-slate-400 pt-3 border-t border-slate-800">
          Already registered?{' '}
          <Link to="/login" className="text-sky-400 font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
