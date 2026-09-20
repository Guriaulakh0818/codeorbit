import React, { useState, useEffect } from 'react';
import { ListTree, Sparkles } from 'lucide-react';

export const TableOfContents = ({ markdownContent = '' }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  // Extract headings from markdown text
  useEffect(() => {
    if (!markdownContent) {
      setHeadings([]);
      return;
    }

    const lines = markdownContent.split('\n');
    const extracted = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length; // 2 for ##, 3 for ###
        const title = match[2].replace(/[*_`]/g, '').trim();
        const id = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');

        extracted.push({ id, title, level });
      }
    });

    setHeadings(extracted);
  }, [markdownContent]);

  // ScrollSpy to highlight active heading
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map((h) => document.getElementById(h.id)).filter(Boolean);
      if (headingElements.length === 0) return;

      const scrollPos = window.scrollY + 120;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el.offsetTop <= scrollPos) {
          setActiveId(el.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
        <ListTree className="w-3.5 h-3.5 text-emerald-400" />
        <span>On This Page</span>
      </div>

      <nav className="space-y-1.5 custom-scrollbar max-h-[300px] overflow-y-auto">
        {headings.map((h, idx) => {
          const isActive = activeId === h.id || (idx === 0 && !activeId);
          return (
            <button
              key={`${h.id}-${idx}`}
              onClick={() => scrollToHeading(h.id)}
              className={`block w-full text-left text-xs transition-all truncate ${
                h.level === 3 ? 'pl-4' : 'pl-1'
              } ${
                isActive
                  ? 'text-emerald-400 font-bold border-l-2 border-emerald-500 pl-2 bg-emerald-500/5 py-0.5 rounded-r'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {h.title}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
