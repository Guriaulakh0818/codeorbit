import React from 'react';

/**
 * Pure 4K Ultra-Crisp Vector Logo Component for CodeOrbit
 * 100% SVG Vector - Infinite scalability without pixelation or blur at any resolution.
 * 
 * @param {Object} props
 * @param {number|string} [props.height=44] - Height of logo in px
 * @param {'light'|'dark'} [props.variant='light'] - 'light' for light backgrounds (Navbar/Auth), 'dark' for dark surfaces (Footer)
 * @param {boolean} [props.hideTagline=false] - Hide tagline on ultra-compact views
 * @param {string} [props.className=''] - Extra CSS classes
 */
export const CodeOrbitLogo = ({ 
  height = 44, 
  variant = 'light', 
  hideTagline = false,
  className = '' 
}) => {
  const isDark = variant === 'dark';
  
  // High-contrast color tokens for perfect crispness
  const codeColor = isDark ? '#FFFFFF' : '#0F172A';
  const tagColor = isDark ? '#94A3B8' : '#475569';
  const capBaseColor = isDark ? '#1E293B' : '#0F172A';
  const capTopColor = isDark ? '#334155' : '#1E293B';
  const capRimColor = isDark ? '#38BDF8' : '#10B981';

  return (
    <svg
      viewBox="0 0 380 90"
      height={height}
      className={`w-auto select-none transition-all ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', textRendering: 'geometricPrecision', shapeRendering: 'geometricPrecision' }}
    >
      <defs>
        {/* Luminous Emerald to Cyan Orbit Gradient */}
        <linearGradient id="coOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Dynamic Glowing Green Gradient for "ORBIT" Text */}
        <linearGradient id="coTextOrbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="60%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>

        {/* 3D Mortarboard Cap Gradient */}
        <linearGradient id="coCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={capTopColor} />
          <stop offset="100%" stopColor={capBaseColor} />
        </linearGradient>

        {/* Soft Ambient Glow Filter */}
        <filter id="coGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ========================================================================= */}
      {/* 1. LEFT ICON: 3D GRADUATION CAP + DYNAMIC ORBITAL RINGS                   */}
      {/* ========================================================================= */}
      <g transform="translate(6, 6)">
        
        {/* Back Orbit Arc (Behind Cap) */}
        <path
          d="M 12 50 C 4 30, 24 12, 54 10 C 74 8, 88 18, 86 34"
          stroke="url(#coOrbitGrad)"
          strokeWidth="3.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Back Orbit Satellite Node */}
        <circle cx="28" cy="18" r="4.2" fill="#10B981" filter="url(#coGlow)" />
        <circle cx="28" cy="18" r="2.2" fill="#FFFFFF" />

        {/* Graduation Cap Base / Skullcap */}
        <path
          d="M 28 44 L 28 58 C 28 67 62 67 62 58 L 62 44 Z"
          fill={capBaseColor}
          stroke={isDark ? '#334155' : '#0F172A'}
          strokeWidth="1.8"
        />
        <path
          d="M 33 54 C 33 60 57 60 57 54"
          stroke="#10B981"
          strokeWidth="1.6"
          fill="none"
          opacity="0.7"
        />

        {/* Graduation Cap Diamond Top (Rhombus in 3D Perspective) */}
        <polygon
          points="45,20 80,36 45,50 10,34"
          fill="url(#coCapGrad)"
          stroke={isDark ? '#475569' : '#0F172A'}
          strokeWidth="2.6"
          strokeLinejoin="round"
        />

        {/* Top Rim Highlight */}
        <polygon
          points="45,23 74,36 45,47 16,34"
          fill="none"
          stroke={capRimColor}
          strokeWidth="0.85"
          opacity="0.5"
        />

        {/* Cap Button / Tassel Center */}
        <circle cx="45" cy="34" r="3.4" fill="#10B981" />
        <circle cx="45" cy="34" r="1.6" fill="#FFFFFF" />

        {/* Tassel Ribbon & Cord */}
        <path
          d="M 45 34 Q 68 38 72 52 L 72 64"
          stroke="#10B981"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Tassel Fringe / Bell */}
        <polygon points="70,62 74,62 75,70 69,70" fill="#059669" />

        {/* Front Orbit Arc (Sweeps In Front of Cap) */}
        <path
          d="M 86 34 C 88 52, 68 70, 36 72 C 16 73, 2 62, 4 48 C 5 44, 8 40, 14 36"
          stroke="url(#coOrbitGrad)"
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Front Orbit Satellite Node */}
        <circle cx="68" cy="62" r="4.8" fill="#059669" filter="url(#coGlow)" />
        <circle cx="68" cy="62" r="2.4" fill="#34D399" />

        {/* Orbit Inner Ring Accent */}
        <path
          d="M 16 56 C 24 66 52 68 72 54"
          stroke="#34D399"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="2,3"
          fill="none"
          opacity="0.8"
        />

        {/* Four-Point Sparkle 1 (Top Right) */}
        <path
          d="M 82 12 Q 82 16 86 16 Q 82 16 82 20 Q 82 16 78 16 Q 82 16 82 12 Z"
          fill="#10B981"
        />

        {/* Four-Point Sparkle 2 (Bottom Left) */}
        <path
          d="M 12 66 Q 12 69 15 69 Q 12 69 12 72 Q 12 69 9 69 Q 12 69 12 66 Z"
          fill="#34D399"
        />
      </g>

      {/* ========================================================================= */}
      {/* 2. RIGHT TYPOGRAPHY: "CODE" + "ORBIT" + SUBTITLE                          */}
      {/* ========================================================================= */}
      <g transform="translate(106, 0)">
        
        {/* Main Brand Wordmark */}
        <text
          x="0"
          y="48"
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="44"
          letterSpacing="-0.02em"
        >
          {/* "CODE" */}
          <tspan fill={codeColor}>CODE</tspan>
          
          {/* "ORBIT" */}
          <tspan fill="url(#coTextOrbitGrad)" dx="2">ORBIT</tspan>
        </text>

        {/* Subtitle Tagline: "FREE CS LEARNING FOR EVERYONE" */}
        {!hideTagline && (
          <text
            x="2"
            y="69"
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="800"
            fontSize="10.8"
            letterSpacing="0.28em"
            fill={tagColor}
          >
            FREE CS LEARNING FOR EVERYONE
          </text>
        )}

      </g>
    </svg>
  );
};

export default CodeOrbitLogo;
