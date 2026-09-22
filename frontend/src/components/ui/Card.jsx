import React from 'react';

/**
 * Standardized Card Surface Component
 */
export const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) => {
  const hoverStyles = hover
    ? 'hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200'
    : 'transition-colors';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-2xs ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-5 sm:p-6 border-b border-slate-100 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-base sm:text-lg font-extrabold text-slate-900 tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-xs text-slate-500 mt-1 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-5 sm:p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`p-4 sm:p-5 bg-slate-50/60 rounded-b-2xl border-t border-slate-100 flex items-center justify-between gap-3 ${className}`} {...props}>
    {children}
  </div>
);
