import React from 'react';

/**
 * Accessible Progress Bar Component
 */
export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  color = 'emerald',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  };

  const colors = {
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
    purple: 'bg-purple-600',
    sky: 'bg-sky-600',
    rose: 'bg-rose-600'
  };

  const colorClass = colors[color] || colors.emerald;
  const heightClass = heights[size] || heights.md;

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-mono font-bold text-slate-900">{percentage}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Learning progress'}
        className={`w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 ${heightClass}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
