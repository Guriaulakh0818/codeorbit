import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Menu, 
  X,
  Sparkles, 
  Layers, 
  ChevronDown, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Compass, 
  ShieldCheck, 
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/ebooksData';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const getDashboardPath = () => {
    if (user?.role === 'ADMIN') return '/admin/dashboard';
    return '/student/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080d1e]/90 backdrop-blur-xl">
      {/* Top Demo Notice Banner */}
      <div className="bg-gradient-to-r from-[#0b132b] via-brand-900/50 to-[#0b132b] border-b border-brand-500/20 py-1.5 px-4 text-xs text-center text-brand-200 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 font-semibold bg-brand-500/20 px-2.5 py-0.5 rounded-full text-sky-300">
          <Sparkles className="w-3 h-3 text-sky-400" /> CodeOrbit Official Store
        </span>
        <span className="text-slate-300">Curated digital e-books & handbooks for CSE & IT engineering students.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                Code<span className="text-sky-400">Orbit</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Engineering E-Books</span>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Java, Python, DSA, DBMS, Web Dev..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-full pl-10 pr-20 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-inner"
            />
            <button 
              type="submit" 
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-full transition-colors"
            >
              Search
            </button>
          </form>

          {/* Main Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'text-white bg-slate-800/80' : 'hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </Link>

            <Link 
              to="/courses" 
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/courses') ? 'text-white bg-slate-800/80' : 'hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
              Courses
            </Link>

            <Link 
              to="/certificates/verify" 
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                location.pathname.startsWith('/certificates/verify') ? 'text-white bg-slate-800/80' : 'hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              Verify
            </Link>

            <Link 
              to="/catalog" 
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/catalog') ? 'text-white bg-slate-800/80' : 'hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              E-books
            </Link>

            {/* Categories dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                onBlur={() => setTimeout(() => setCategoryDropdownOpen(false), 200)}
                className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                Categories
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-60 glass-panel rounded-2xl shadow-2xl p-2 border border-slate-700 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {CATEGORIES.slice(1).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/catalog?category=${cat.id}`}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-800 text-xs font-medium text-slate-200 hover:text-sky-300 transition-colors"
                      onClick={() => setCategoryDropdownOpen(false)}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">{cat.count}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* User Auth Section */}
            {user ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  onBlur={() => setTimeout(() => setUserDropdownOpen(false), 200)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/80 border border-slate-700/80 transition-all"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-sky-400"
                  />
                  <div className="flex flex-col text-left pr-1">
                    <span className="text-xs font-bold text-white leading-tight">{user.name}</span>
                    <span className="text-[9px] text-sky-400 uppercase tracking-wider font-mono">{user.role}</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass-panel rounded-2xl shadow-2xl p-2 border border-slate-700 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to={getDashboardPath()}
                        className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        {user.role === 'ADMIN' ? (
                          <>
                            <ShieldCheck className="w-4 h-4 text-purple-400" />
                            <span>Store Admin Console</span>
                          </>
                        ) : (
                          <>
                            <GraduationCap className="w-4 h-4 text-sky-400" />
                            <span>My Library & Orders</span>
                          </>
                        )}
                      </Link>
                    </div>

                    <div className="border-t border-slate-800 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#080d1e] px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search engineering e-books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white"
            />
          </form>

          <div className="flex flex-col gap-1 text-xs font-semibold pt-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-800 text-slate-200"
            >
              Home
            </Link>
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-sky-400" /> Free Courses
            </Link>
            <Link
              to="/certificates/verify"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400" /> Verify Certificate
            </Link>
            <Link
              to="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-sky-400" /> E-books Catalog
            </Link>

            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sky-300 flex items-center gap-2"
                >
                  {user.role === 'ADMIN' ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-purple-400" /> Store Admin Console
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4 text-sky-400" /> My Library & Dashboard
                    </>
                  )}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-center font-bold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-brand-600 text-white text-center font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
