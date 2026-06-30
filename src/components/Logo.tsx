import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="recruitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>

        {/* Rounded square background */}
        <rect x="1" y="1" width="38" height="38" rx="10" fill="url(#recruitGradient)" />

        {/* Center person (larger, top) */}
        <circle cx="20" cy="9" r="2.8" fill="white" />
        <path
          d="M 16.5 12.5 Q 16.5 11.5 20 11.5 Q 23.5 11.5 23.5 12.5 L 23.5 14.5 Q 23.5 15.5 20 15.5 Q 16.5 15.5 16.5 14.5 Z"
          fill="white"
        />

        {/* Left person */}
        <circle cx="10" cy="23" r="2" fill="white" opacity="0.85" />
        <path
          d="M 7 26 Q 7 25 10 25 Q 13 25 13 26 L 13 28 Q 13 29 10 29 Q 7 29 7 28 Z"
          fill="white"
          opacity="0.85"
        />

        {/* Right person */}
        <circle cx="30" cy="23" r="2" fill="white" opacity="0.85" />
        <path
          d="M 27 26 Q 27 25 30 25 Q 33 25 33 26 L 33 28 Q 33 29 30 29 Q 27 29 27 28 Z"
          fill="white"
          opacity="0.85"
        />

        {/* Connection lines */}
        <line x1="20" y1="15.5" x2="10" y2="23" stroke="white" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
        <line x1="20" y1="15.5" x2="30" y2="23" stroke="white" strokeWidth="1" opacity="0.6" strokeLinecap="round" />

        {/* Star/sparkle (top right) */}
        <g opacity="0.9">
          <path
            d="M 28 8 L 29 10 L 31 11 L 29 12 L 28 14 L 27 12 L 25 11 L 27 10 Z"
            fill="white"
          />
        </g>

        {/* Small sparkles */}
        <circle cx="25" cy="6" r="0.8" fill="white" opacity="0.6" />
        <circle cx="32" cy="7" r="0.8" fill="white" opacity="0.6" />
      </svg>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-blue-400/20 to-transparent blur-lg -z-10" />
    </div>
  );
}
