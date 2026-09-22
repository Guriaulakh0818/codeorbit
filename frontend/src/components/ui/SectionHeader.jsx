import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * Standardized SectionHeader Component
 */
export const SectionHeader = ({
  title,
  subtitle,
  badge,
  actionText,
  actionHref,
  onAction,
  pulseDot = false,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4 ${className}`}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {pulseDot && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />}
          {badge && (
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
              {badge}
            </span>
          )}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {(actionText && (actionHref || onAction)) && (
        <div className="self-start sm:self-auto flex-shrink-0">
          {actionHref ? (
            <a
              href={actionHref}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 group transition-colors"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 group cursor-pointer transition-colors"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
