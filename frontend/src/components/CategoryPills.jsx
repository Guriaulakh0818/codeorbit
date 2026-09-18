import React from 'react';
import { 
  Sparkles, 
  Coffee, 
  Code2, 
  Binary, 
  Layers, 
  Globe, 
  Database, 
  Cpu, 
  Briefcase, 
  FolderGit2 
} from 'lucide-react';
import { CATEGORIES } from '../data/ebooksData';

const iconMap = {
  Sparkles,
  Coffee,
  Code2,
  Binary,
  Layers,
  Globe,
  Database,
  Cpu,
  Briefcase,
  FolderGit2
};

export const CategoryPills = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      {CATEGORIES.map((cat) => {
        const IconComponent = iconMap[cat.icon] || Sparkles;
        const isSelected = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
              isSelected
                ? 'bg-brand-600 border-brand-400 text-white shadow-lg shadow-brand-500/25 scale-105'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800/80'
            }`}
          >
            <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-sky-400'}`} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};
