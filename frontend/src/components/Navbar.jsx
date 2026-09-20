import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Award,
  Terminal,
  Cpu,
  Database,
  Network,
  Server,
  Code2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subjectsDropdownOpen, setSubjectsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const csSubjects = [
    { name: 'Data Structures & Algorithms', slug: 'dsa', icon: Terminal, color: 'text-sky-400' },
    { name: 'Operating Systems', slug: 'operating-systems', icon: Cpu, color: 'text-amber-400' },
    { name: 'Database Management (DBMS)', slug: 'dbms', icon: Database, color: 'text-emerald-400' },
    { name: 'Computer Networks', slug: 'computer-networks', icon: Network, color: 'text-indigo-400' },
    { name: 'System Design & Distributed Systems', slug: 'system-design-track-2026', icon: Server, color: 'text-purple-400' },
    { name: 'Core Java & Python Programming', slug: 'dsa', icon: Code2, color: 'text-rose-400' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/85 backdrop-blur-xl border-b border-slate-800/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 group-hover:shadow-emerald-500/30 transition-all duration-300">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                  Code<span className="text-emerald-400">Orbit</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider">
                  FREE CS
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                Open Computer Science Library
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="text"
                placeholder="Search DSA, OS, DBMS, System Design topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-emerald-500/80 rounded-xl pl-10 pr-12 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
              />
              <kbd className="hidden sm:inline-flex items-center absolute right-2.5 top-2.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 rounded border border-slate-700">
                ⌘K
              </kbd>
            </div>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Home
            </Link>

            {/* Subjects Mega Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setSubjectsDropdownOpen(true)}
              onMouseLeave={() => setSubjectsDropdownOpen(false)}
            >
              <button
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
              >
                <span>Tutorials</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${subjectsDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} />
              </button>

              {subjectsDropdownOpen && (
                <div className="absolute top-full left-0 w-84 p-2.5 bg-[#0e1424] border border-slate-800/90 rounded-2xl shadow-2xl space-y-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold">
                      Core Computer Science Tracks
                    </span>
                  </div>
                  {csSubjects.map((sub, idx) => {
                    const IconComponent = sub.icon;
                    return (
                      <Link
                        key={idx}
                        to={`/courses/${sub.slug}`}
                        onClick={() => setSubjectsDropdownOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-slate-800/60 transition-colors group/item"
                      >
                        <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${sub.color} group-hover/item:scale-105 transition-transform`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="font-medium truncate group-hover/item:text-emerald-300 transition-colors">{sub.name}</span>
                      </Link>
                    );
                  })}
                  <div className="p-2 border-t border-slate-800">
                    <Link
                      to="/courses"
                      onClick={() => setSubjectsDropdownOpen(false)}
                      className="block text-center text-xs font-bold text-emerald-400 hover:text-emerald-300 py-1 transition-colors"
                    >
                      View All Tutorials & Roadmaps →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/courses"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              All Tracks
            </Link>

            <Link
              to="/certificates/verify"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Verify Cert</span>
            </Link>
          </nav>

          {/* Right Action Icons & User Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Admin Panel</span>
                  </Link>
                )}

                <Link
                  to="/student/dashboard"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{user?.fullName || 'Profile'}</span>
                </Link>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
                >
                  Sign up Free
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 space-y-4 animate-in fade-in">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search CS topics & notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </form>

            <nav className="flex flex-col space-y-1 text-xs font-semibold">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900"
              >
                Home
              </Link>
              <Link
                to="/courses"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900"
              >
                Tutorials & Roadmaps
              </Link>
              <Link
                to="/certificates/verify"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Verify Certificate</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
