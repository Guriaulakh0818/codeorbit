import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  ShieldCheck, 
  Code2, 
  Cpu, 
  Database, 
  Terminal, 
  Smartphone, 
  BarChart3, 
  Globe, 
  FileCheck2, 
  Lock
} from 'lucide-react';
import { placementKitApi } from '../services/placementKitApi';
import { SeoHead } from '../components/seo/SeoHead';
import { Button, Badge, Card, Skeleton, EmptyState, SectionHeader } from '../components/ui';

const ROLE_ICONS = {
  'Full Stack Developer': Globe,
  'Frontend Developer': Code2,
  'Backend Developer': Cpu,
  'App Developer': Smartphone,
  'Data Analyst': BarChart3,
  'Java Developer': Terminal,
  'Python Developer': Terminal,
  'QA Automation Engineer': FileCheck2,
  'DevOps Engineer': Layers,
  'General Placement': Briefcase,
};

export const PlacementKitsPage = () => {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  useEffect(() => {
    loadKits();
  }, []);

  const loadKits = async () => {
    setLoading(true);
    try {
      const res = await placementKitApi.getAllKits();
      if (res.success && res.data) {
        setKits(res.data);
      }
    } catch (e) {
      console.error('Failed to load kits', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredKits = kits.filter((kit) => {
    const matchesSearch = 
      kit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kit.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kit.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || kit.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const uniqueRoles = ['ALL', ...new Set(kits.map((k) => k.role))];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Placement Prep Kits — Role-Based Question Banks & Interview Prep | CodeOrbit"
        description="Comprehensive ₹99 Placement Preparation Kits for Full Stack, Java, Python, Frontend, Backend, DevOps, Data Analyst, and QA Engineers. Topic categories, question banks, and CodeOrbit lesson references."
        canonicalUrl="https://www.codeorbit.online/placement-kits"
      />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="success" size="md" className="gap-2">
            <Sparkles className="w-4 h-4" /> ₹99 Career-Focused Placement Preparation
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Role-Based Placement Prep Kits
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Targeted technical question banks, preparation roadmaps, model answers, and direct links to CodeOrbit lessons designed for tech campus and lateral interviews.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role, keyword, technology..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-2xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-center">
            {uniqueRoles.slice(0, 6).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedRole === role
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {role === 'ALL' ? 'All Roles' : role}
              </button>
            ))}
          </div>
        </div>

        {/* Kits Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} variant="card" height="320px" />
            ))}
          </div>
        ) : filteredKits.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No Placement Kits Found"
            description="No prep kits matched your current search filters. Try clearing search keywords."
            actionText="Clear Filters"
            onAction={() => { setSearchTerm(''); setSelectedRole('ALL'); }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKits.map((kit) => {
              const RoleIcon = ROLE_ICONS[kit.role] || Briefcase;

              return (
                <Card
                  key={kit.id}
                  hover={true}
                  className="p-6 sm:p-7 flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                        <RoleIcon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-2">
                        {kit.isPurchased ? (
                          <Badge variant="success" size="sm">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm">
                            ₹{kit.priceInr} Only
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">
                        {kit.role}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {kit.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {kit.shortDescription}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-medium">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        {kit.totalCategories || 4} Topic Modules
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        {kit.totalQuestions || 25}+ Questions & Answers
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">One-time Access</span>
                      <span className="text-lg font-black text-slate-900">₹{kit.priceInr}</span>
                    </div>

                    <Button
                      variant={kit.isPurchased ? 'secondary' : 'primary'}
                      size="sm"
                      href={`/placement-kits/${kit.slug}`}
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      {kit.isPurchased ? 'Continue Practice' : 'View Prep Kit'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Feature Highlights */}
        <Card className="p-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
            <h3 className="text-xl font-bold text-slate-900">What’s Inside Every CodeOrbit Placement Kit?</h3>
            <p className="text-xs text-slate-500">Curated by experienced software engineers to maximize placement conversion rates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-600">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">1</div>
              <h4 className="font-bold text-slate-900">Role-Specific Roadmaps</h4>
              <p className="text-[11px] leading-relaxed">Step-by-step topic sequencing tailored exactly to what recruiters evaluate.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">2</div>
              <h4 className="font-bold text-slate-900">Model Answers & Explanations</h4>
              <p className="text-[11px] leading-relaxed">In-depth rationale, time-space complexities, and key talking points for interviews.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">3</div>
              <h4 className="font-bold text-slate-900">CodeOrbit Lesson Links</h4>
              <p className="text-[11px] leading-relaxed">Direct 1-click links to CodeOrbit CS curriculum lessons to brush up on theory instantly.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">4</div>
              <h4 className="font-bold text-slate-900">Interactive Practice & Tracking</h4>
              <p className="text-[11px] leading-relaxed">Interactive MCQ and technical problem submission with saved student progress.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PlacementKitsPage;
