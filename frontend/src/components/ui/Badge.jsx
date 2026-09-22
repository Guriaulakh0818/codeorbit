import React from 'react';

/**
 * Standardized Badge Component for levels, pricing, status pills.
 */
export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    success: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold',
    danger: 'bg-rose-50 text-rose-800 border-rose-200 font-semibold',
    info: 'bg-sky-50 text-sky-800 border-sky-200 font-semibold',
    teal: 'bg-teal-50 text-teal-800 border-teal-200 font-semibold',
    purple: 'bg-purple-50 text-purple-800 border-purple-200 font-semibold',
    gold: 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-950 border-amber-300 font-extrabold shadow-2xs'
  };

  const sizes = {
    xs: 'text-[9px] px-1.5 py-0.5 rounded',
    sm: 'text-[10px] px-2.5 py-0.5 rounded-md',
    md: 'text-xs px-3 py-1 rounded-lg'
  };

  const dotColors = {
    default: 'bg-slate-400',
    primary: 'bg-emerald-500',
    success: 'bg-emerald-600',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    teal: 'bg-teal-500',
    purple: 'bg-purple-500',
    gold: 'bg-amber-600'
  };

  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.sm;
  const dotColorClass = dotColors[variant] || dotColors.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider border ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColorClass}`} />}
      <span>{children}</span>
    </span>
  );
};
