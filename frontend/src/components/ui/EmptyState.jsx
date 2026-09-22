import React from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from './Button';

/**
 * Standardized Empty State Component
 */
export const EmptyState = ({
  icon: Icon = BookOpen,
  title = 'No items found',
  description = 'There is currently no data or items to display.',
  actionLabel,
  onAction,
  actionHref,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 px-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs max-w-md mx-auto space-y-4 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto shadow-2xs">
        <Icon className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">{description}</p>
      </div>
      {actionLabel && (
        <div className="pt-2">
          {actionHref ? (
            <a
              href={actionHref}
              className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              {actionLabel}
            </a>
          ) : (
            <Button size="sm" variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
