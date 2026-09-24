import React, { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  FolderGit2, 
  Users, 
  UserCog, 
  CreditCard, 
  Briefcase, 
  Award, 
  BarChart3, 
  FileSpreadsheet, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search, 
  ChevronRight, 
  Globe, 
  CheckCircle2, 
  Sparkles,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children, title, subtitle }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const navSections = [
    {
      label: 'ADMIN CONSOLE',
      items: [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      label: 'LEARNING',
      items: [
        { path: '/admin/courses', label: 'Courses', icon: BookOpen },
        { path: '/admin/modules', label: 'Modules & Lessons', icon: Layers },
        { path: '/admin/quizzes', label: 'Quizzes', icon: HelpCircle },
        { path: '/admin/curriculum', label: 'Curriculum Tree', icon: FolderGit2 }
      ]
    },
    {
      label: 'STUDENTS',
      items: [
        { path: '/admin/students', label: 'Students', icon: Users },
        { path: '/admin/users', label: 'Users & Roles', icon: UserCog }
      ]
    },
    {
      label: 'MONETIZATION',
      items: [
        { path: '/admin/payments', label: 'Payments', icon: CreditCard },
        { path: '/admin/placement-ready', label: 'Placement Ready', icon: Briefcase, badge: '₹29' },
        { path: '/admin/certificates', label: 'Certificates', icon: Award, badge: '₹9' }
      ]
    },
    {
      label: 'INSIGHTS',
      items: [
        { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/admin/reports', label: 'Reports', icon: FileSpreadsheet }
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { path: '/admin/settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  // Breadcrumb generator
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, idx) => {
    const url = `/${pathParts.slice(0, idx + 1).join('/')}`;
    const name = part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' ');
    return { name, url, isLast: idx === pathParts.length - 1 };
  });

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/admin/students?search=${encodeURIComponent(searchQuery)}`);
  };

  const adminName = user?.fullName || 'Gurvinder';
  const adminRole = user?.role || 'SUPER_ADMIN';

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-[#111827] flex flex-col md:flex-row antialiased font-sans">
      
      {/* ========================================================================= */}
      {/* SIDEBAR - DESKTOP & MOBILE DRAWER */}
      {/* ========================================================================= */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-[#E5E7EB] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Logo */}
        <div>
          <div className="h-16 px-6 border-b border-[#E5E7EB] flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-[#111827]">CodeOrbit</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-[#4F46E5] border border-indigo-200">ADMIN</span>
                </div>
                <p className="text-[11px] text-[#667085] font-medium leading-none mt-0.5">Control Center</p>
              </div>
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-[#667085] hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <div className="px-3 text-[11px] font-bold tracking-wider text-[#667085] uppercase mb-2">
                  {section.label}
                </div>
                {section.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
                  return (
                    <NavLink
                      key={iIdx}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[#4F46E5] text-white shadow-sm shadow-indigo-200 font-semibold'
                          : 'text-[#667085] hover:bg-slate-50 hover:text-[#111827]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#667085]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-indigo-50 text-[#4F46E5] border border-indigo-100'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* User Profile / Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-slate-50/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-[#4F46E5] font-bold flex items-center justify-center text-sm border border-indigo-200">
                {adminName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-[#111827] truncate leading-tight">{adminName}</p>
                <p className="text-[11px] text-[#667085] capitalize leading-tight mt-0.5">{adminRole.toLowerCase().replace('_', ' ')}</p>
              </div>
            </div>
            <button 
              onClick={() => logout()}
              title="Logout"
              className="p-1.5 text-[#667085] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-[#667085] hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Path */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#667085]">
              <Link to="/admin/dashboard" className="hover:text-[#4F46E5] font-medium">Admin</Link>
              {breadcrumbs.map((b, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  {b.isLast ? (
                    <span className="font-semibold text-[#111827]">{b.name}</span>
                  ) : (
                    <Link to={b.url} className="hover:text-[#4F46E5] font-medium">{b.name}</Link>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Center / Right: Global Search & Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Global Search Bar */}
            <form onSubmit={handleGlobalSearch} className="relative hidden lg:block">
              <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text"
                placeholder="Search students, courses, payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-72 pl-9 pr-4 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F6F8FC] text-xs text-[#111827] placeholder-[#667085] focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all"
              />
            </form>

            {/* Platform Live Link */}
            <a 
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 text-xs font-medium text-[#667085] hover:text-[#4F46E5] px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-slate-50 transition-colors"
            >
              <span>View Site</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-[#667085] hover:text-[#111827] hover:bg-slate-100 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-[#4F46E5] absolute top-1.5 right-1.5" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                    <h4 className="text-xs font-bold text-[#111827]">System Notifications</h4>
                    <span className="text-[10px] font-semibold text-[#4F46E5] bg-indigo-50 px-2 py-0.5 rounded-full">3 New</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs py-2 space-y-2">
                    <div className="pt-2">
                      <p className="font-semibold text-[#111827]">New Placement Ready Purchase</p>
                      <p className="text-[11px] text-[#667085]">Student enrolled in Java Placement Ready (₹29).</p>
                    </div>
                    <div className="pt-2">
                      <p className="font-semibold text-[#111827]">Certificate Generated</p>
                      <p className="text-[11px] text-[#667085]">Verified Certificate #CO-JAVA-88912 issued (₹9).</p>
                    </div>
                    <div className="pt-2">
                      <p className="font-semibold text-[#111827]">System Integrity Verified</p>
                      <p className="text-[11px] text-[#667085]">Server-enforced pricing active on all 20 domains.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB]">
              <div className="w-8 h-8 rounded-full bg-[#4F46E5] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {adminName.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-semibold text-[#111827] block leading-none">{adminName}</span>
                <span className="text-[10px] text-[#667085] leading-none mt-0.5 block">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE HEADER */}
        {title && (
          <div className="bg-white border-b border-[#E5E7EB] px-4 md:px-8 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#111827]">{title}</h1>
                {subtitle && <p className="text-sm text-[#667085] mt-1">{subtitle}</p>}
              </div>
            </div>
          </div>
        )}

        {/* MAIN BODY CONTAINER */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
