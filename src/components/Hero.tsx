import React from 'react';

interface HeroProps {
  onScrollToSection: (id: string) => void;
}

export default function Hero({ onScrollToSection }: HeroProps) {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center pt-20"
    >
      {/* Video Background */}
      <div className="absolute inset-0 -z-10 w-full h-full">
       <video
  autoPlay
  muted
  loop
  playsInline
  className="w-full h-full object-cover"
>
  <source
    src={`${import.meta.env.BASE_URL}Videofinal.mp4`}
    type="video/mp4"
  /></video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 w-full text-center">
        <div className="space-y-8 py-20">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex animate-fadeIn justify-center w-full">
            <div className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-md px-4 py-2 rounded-full border border-blue-400/40">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-bold text-green-300 tracking-wider uppercase">Your Partner in Growth</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-6 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg">
              Connecting Talent.
              <br />
              <span className="text-blue-400">Building Futures.</span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto font-light animate-slideUp drop-shadow-lg" style={{ animationDelay: '0.2s' }}>
            We help organizations hire smarter and faster with innovative recruitment solutions and a human-first approach.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 animate-slideUp justify-center" style={{ animationDelay: '0.3s' }}>
            <button
              id="hero-explore-btn"
              onClick={() => onScrollToSection('staffing')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              Explore Services
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              id="hero-contact-btn"
              onClick={() => onScrollToSection('contact')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/40 hover:border-white/60 font-bold rounded-lg shadow-lg backdrop-blur-sm hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </section>
  );
}
