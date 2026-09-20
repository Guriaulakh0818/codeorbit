import React, { useEffect, useRef } from 'react';

/**
 * Google AdSense Responsive AdSlot Component
 * Standardized ad placements compliant with Google AdSense Publisher Policies.
 *
 * Types:
 * - 'leaderboard': 728x90 (Desktop) / 320x50 (Mobile)
 * - 'sidebar': 300x250 / 300x600 sticky display banner
 * - 'in_article': Fluid in-feed article responsive ad unit
 * - 'footer_banner': Wide horizontal responsive banner
 */
export const AdSlot = ({
  slotType = 'in_article',
  adSlotId = '1234567890', // Replace with real AdSense data-ad-slot in production
  adClient = 'ca-pub-XXXXXXXXXXXXXXXX', // Replace with publisher ca-pub ID
  className = ''
}) => {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      // AdSense script not loaded yet or ad blocker active
    }
  }, []);

  // Size configurations
  const getContainerStyles = () => {
    switch (slotType) {
      case 'leaderboard':
        return 'w-full min-h-[90px] max-w-[728px] mx-auto my-6';
      case 'sidebar':
        return 'w-full min-h-[250px] max-w-[300px] mx-auto my-4';
      case 'footer_banner':
        return 'w-full min-h-[90px] max-w-[970px] mx-auto my-8';
      case 'in_article':
      default:
        return 'w-full min-h-[120px] max-w-[800px] mx-auto my-8';
    }
  };

  return (
    <div className={`ad-slot-wrapper flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900/30 border border-slate-800/60 overflow-hidden ${getContainerStyles()} ${className}`}>
      {/* Google AdSense Label (Mandatory for AdSense compliance) */}
      <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1.5 self-center">
        ADVERTISEMENT
      </span>

      {/* Actual AdSense Slot */}
      <div ref={adRef} className="w-full flex items-center justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center', width: '100%' }}
          data-ad-client={adClient}
          data-ad-slot={adSlotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        {/* Development Placeholder (Visible when AdSense JS is not loaded) */}
        <div className="flex flex-col items-center justify-center text-center p-4 text-slate-600">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse"></span>
            <span>Google AdSense Slot — {slotType.toUpperCase()}</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            Monetized high-CTR placement zone
          </p>
        </div>
      </div>
    </div>
  );
};
