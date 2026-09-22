import React from 'react';

/**
 * Standardized Shimmer Skeleton Loader
 */
export const Skeleton = ({
  className = '',
  variant = 'rectangular', // 'text' | 'circular' | 'rectangular' | 'card'
  ...props
}) => {
  const baseStyles = 'animate-pulse bg-slate-200/80 rounded-xl';

  if (variant === 'text') {
    return <div className={`h-4 w-3/4 rounded-md ${baseStyles} ${className}`} {...props} />;
  }

  if (variant === 'circular') {
    return <div className={`rounded-full ${baseStyles} ${className}`} {...props} />;
  }

  if (variant === 'card') {
    return (
      <div className={`p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 ${className}`} {...props}>
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
          <div className="w-20 h-5 rounded-md bg-slate-200 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-2/3 rounded-md bg-slate-200 animate-pulse" />
          <div className="h-3.5 w-full rounded-md bg-slate-200 animate-pulse" />
          <div className="h-3.5 w-4/5 rounded-md bg-slate-200 animate-pulse" />
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="h-4 w-16 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-20 rounded bg-slate-200 animate-pulse" />
        </div>
      </div>
    );
  }

  return <div className={`${baseStyles} ${className}`} {...props} />;
};
