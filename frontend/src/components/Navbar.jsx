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
  Code2,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CodeOrbitLogo } from './brand/CodeOrbitLogo';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
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
    { name: '☕ Java Master Track', slug: 'java', icon: Code2, color: 'text-amber-600' },
    { name: '🐍 Python Programming Track', slug: 'python', icon: Terminal, color: 'text-emerald-600' },
    { name: '🧠 Data Structures & Algorithms (DSA)', slug: 'dsa', icon: Terminal, color: 'text-sky-500' },
    { name: '⚛️ React.js & Frontend Dev', slug: 'react', icon: Code2, color: 'text-cyan-500' },
    { name: '🌱 Spring & Spring Boot Backend', slug: 'spring-boot', icon: Server, color: 'text-emerald-600' },
    { name: '🗄️ SQL & Database Engineering', slug: 'sql', icon: Database, color: 'text-indigo-500' },
    { name: '🏗️ System Design (LLD + HLD)', slug: 'system-design', icon: Server, color: 'text-purple-500' },
    { name: '☁️ Cloud Computing (AWS / Azure)', slug: 'cloud-computing', icon: Network, color: 'text-blue-500' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <CodeOrbitLogo variant="light" height={42} className="hover:opacity-95 transition-opacity" />
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-2">
            <div className="relative w-full group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="text"
                placeholder="Search DSA, OS, DBMS, System Design..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/90 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-emerald-500 rounded-xl pl-10 pr-12 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <kbd className="hidden sm:inline-flex items-center absolute right-2.5 top-2.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white rounded border border-slate-200">
                ⌘K
              </kbd>
            </div>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
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
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Tutorials</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${subjectsDropdownOpen ? 'rotate-180 text-emerald-600' : ''}`} />
              </button>

              {subjectsDropdownOpen && (
                <div className="absolute top-full left-0 w-84 p-2.5 bg-white border border-slate-200 rounded-2xl shadow-xl space-y-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-700 font-bold">
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
                        className="flex items-center gap-3 p-2.5 rounded-xl text-xs text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 transition-colors group/item"
                      >
                        <div className={`p-2 rounded-lg bg-slate-50 border border-slate-200 ${sub.color} group-hover/item:scale-105 transition-transform`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="font-semibold truncate group-hover/item:text-emerald-700 transition-colors">{sub.name}</span>
                      </Link>
                    );
                  })}
                  <div className="p-2 border-t border-slate-100">
                    <Link
                      to="/courses"
                      onClick={() => setSubjectsDropdownOpen(false)}
                      className="block text-center text-xs font-bold text-emerald-600 hover:text-emerald-700 py-1 transition-colors"
                    >
                      View All Tutorials & Roadmaps →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/courses"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
            >
              All Tracks
            </Link>

            <Link
              to="/placement-kits"
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-emerald-600 hover:bg-emerald-50/60 transition-colors flex items-center gap-1.5 group"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Placement Kits</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-600 text-white shadow-2xs">₹99</span>
            </Link>

            <Link
              to="/ebooks"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
            >
              Ebooks
            </Link>

            <Link
              to="/about"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
            >
              About
            </Link>

            <Link
              to="/certificates/verify"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Verify Cert</span>
            </Link>
          </nav>

          {/* Right Action: User Menu / Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/student/dashboard"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">{user?.fullName || 'Profile'}</span>
                </Link>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  Sign up Free
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 space-y-4 animate-in fade-in">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search CS topics & notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </form>

            <nav className="flex flex-col space-y-1 text-xs font-semibold">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-slate-100"
              >
                Home
              </Link>
              <Link
                to="/courses"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-slate-100"
              >
                Tutorials & Roadmaps
              </Link>
              <Link
                to="/placement-kits"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span>Placement Prep Kits</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">₹99</span>
              </Link>
              <Link
                to="/ebooks"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-slate-100"
              >
                Official Ebooks & Handbooks
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-slate-100"
              >
                About CodeOrbit
              </Link>
              <Link
                to="/certificates/verify"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>Verify Certificate</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
