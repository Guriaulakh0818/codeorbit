import React from 'react';
import { Languages, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSelector = ({ variant = 'navbar', className = '' }) => {
  const { language, setLanguage, isHinglish } = useLanguage();

  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5 shadow-2xs ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            language === 'en'
              ? 'bg-emerald-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Switch to English"
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLanguage('hinglish')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
            language === 'hinglish'
              ? 'bg-emerald-700 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Switch to Hinglish (Conversational Hindi + English)"
        >
          <span>Hinglish</span>
          <span className="text-[11px]">🇮🇳</span>
        </button>
      </div>
    );
  }

  // Default Navbar / Header Switcher
  return (
    <div className={`inline-flex items-center bg-slate-100/90 border border-slate-200 rounded-xl p-0.5 ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
          !isHinglish
            ? 'bg-white text-emerald-800 shadow-2xs font-bold border border-slate-200/80'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Read in standard English"
      >
        <span>EN</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('hinglish')}
        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
          isHinglish
            ? 'bg-emerald-600 text-white shadow-2xs font-bold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Read in conversational Hinglish (Hindi + English)"
      >
        <span>HI</span>
        <span className="text-[10px]">🇮🇳</span>
      </button>
    </div>
  );
};

export default LanguageSelector;
