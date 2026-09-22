import React from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

/**
 * Standardized Error State Component
 */
export const ErrorState = ({
  title = 'Something went wrong',
  description = 'Unable to load content right now. Please try again or check your network connection.',
  onRetry,
  retryLabel = 'Retry',
  onBack,
  backLabel = 'Go Back',
  className = ''
}) => {
  return (
    <div className={`p-8 sm:p-10 rounded-3xl bg-rose-50/70 border border-rose-200 text-center space-y-4 max-w-lg mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-2xs">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-rose-700/90 leading-relaxed">{description}</p>
      </div>
      <div className="flex items-center justify-center gap-2 pt-2">
        {onBack && (
          <Button size="sm" variant="outline" onClick={onBack} leftIcon={ArrowLeft}>
            {backLabel}
          </Button>
        )}
        {onRetry && (
          <Button size="sm" variant="primary" onClick={onRetry} leftIcon={RefreshCw}>
            {retryLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
