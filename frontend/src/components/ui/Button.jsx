import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Standardized Button Component with variants, sizes, and states.
 */
export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]';

  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs focus-visible:ring-emerald-500 border border-transparent',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs focus-visible:ring-slate-700 border border-transparent',
    outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-2xs focus-visible:ring-emerald-500',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus-visible:ring-slate-400 border border-transparent',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus-visible:ring-rose-500 border border-transparent',
    success: 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200 focus-visible:ring-emerald-500',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs focus-visible:ring-amber-500 border border-transparent',
    amber: 'bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-300 focus-visible:ring-amber-500',
    purple: 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs focus-visible:ring-purple-500 border border-transparent'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 min-h-[32px]',
    md: 'text-xs sm:text-sm px-4 py-2 rounded-xl gap-2 min-h-[40px]',
    lg: 'text-sm sm:text-base px-5 py-2.5 rounded-xl gap-2.5 min-h-[48px]'
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {LeftIcon && <LeftIcon className="w-4 h-4 flex-shrink-0" />}
          <span>{children}</span>
          {RightIcon && <RightIcon className="w-4 h-4 flex-shrink-0" />}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';
