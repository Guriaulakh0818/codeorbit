import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Coffee, 
  Code2, 
  Layers, 
  Globe, 
  Database, 
  Briefcase, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const FEATURED_CATEGORIES_LIST = [
  {
    id: 'java',
    name: 'Java',
    fullName: 'Java Programming',
    description: 'Core Java, JVM memory tuning, multithreading, and Modern Java 21 features.',
    icon: Coffee,
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    count: '2 Handbooks'
  },
  {
    id: 'python',
    name: 'Python',
    fullName: 'Python & AI Engineering',
    description: 'AsyncIO concurrency, FastAPI architectures, and PyTorch AI workflows.',
    icon: Code2,
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    count: '2 Handbooks'
  },
  {
    id: 'dsa',
    name: 'DSA',
    fullName: 'DSA & Algorithms',
    description: '250+ LeetCode visual patterns, dynamic programming, graphs & proofs.',
    icon: Layers,
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    count: '2 Handbooks'
  },
  {
    id: 'web-dev',
    name: 'Web Development',
    fullName: 'Full-Stack Web Dev',
    description: 'React 18, Spring Boot 3 REST APIs, microservices, and Docker pipelines.',
    icon: Globe,
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    count: '2 Handbooks'
  },
  {
    id: 'dbms',
    name: 'DBMS',
    fullName: 'SQL & DBMS Tuning',
    description: 'B+ Tree indexing, EXPLAIN query plans, ACID isolation, and window queries.',
    icon: Database,
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    count: '1 Handbook'
  },
  {
    id: 'interview-prep',
    name: 'Interview Preparation',
    fullName: 'Placement Interview Prep',
    description: 'Low-Level Design (LLD), System Design basics, and STAR behavioral answers.',
    icon: Briefcase,
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    count: '2 Handbooks'
  }
];

export const FeaturedCategories = () => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Curated Curriculum</span>
          <h2 className="text-2xl font-extrabold text-white mt-1">Explore by Engineering Subject</h2>
        </div>
        <Link
          to="/catalog"
          className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 group"
        >
          <span>Browse all categories</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURED_CATEGORIES_LIST.map((cat) => {
          const IconComp = cat.icon;
          return (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.id}`}
              className="glass-card p-6 rounded-2xl border border-slate-800 bg-[#0d152d] hover:border-brand-500/50 transition-all duration-300 group flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${cat.badgeColor} group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-sky-400">
                <span>Explore {cat.name} Guides</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
