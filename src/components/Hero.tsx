import React from 'react';
import { ArrowRight, Users, CheckCircle2, Shield } from 'lucide-react';

interface HeroProps {
  onScrollToSection: (id: string) => void;
}

export default function Hero({ onScrollToSection }: HeroProps) {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-12 pb-8 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column Text Content */}
          <div className="lg:col-span-7 space-y-8 text-left reveal-on-scroll is-visible">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-4xl lg:leading-tight font-extrabold text-slate-950 tracking-tight">
              Empowering Modern Enterprises:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-indigo-600 to-blue-700">
                Transforming businesses
              </span>{' '}
              through top-tier talent and next-gen technology.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-light">
              BA Soft Tech delivers elite digital solutions and flexible workforce staffing models built to accelerate organizational velocity in a rapidly changing world.
            </p>
            
            {/* Technology badges */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {['React / Next.js', 'Node.js', 'Amazon AWS', 'Kubernetes', 'Terraform', 'Python / AI'].map((tech) => (
                <span key={tech} className="text-xs font-semibold px-3.5 py-1 bg-white/75 backdrop-blur-sm border border-slate-200/50 text-slate-700 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                  {tech}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                id="hero-get-started-btn"
                onClick={() => onScrollToSection('contact')}
                className="px-8 py-4 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group premium-btn-glow"
              >
                Get Started Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                id="hero-explore-btn"
                onClick={() => onScrollToSection('staffing')}
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/60 hover:border-slate-300/80 font-semibold rounded-full shadow-sm hover:scale-[1.02] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                Explore Solutions
              </button>
            </div>

            {/* Client trust indicators */}
            <div className="pt-6 border-t border-slate-200/50 space-y-3">
              <p className="text-[10px] font-bold font-mono tracking-widest text-slate-450 uppercase">
                TRUSTED COMPLIANCE & PARTNERSHIPS
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-500 font-semibold text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-slate-900 font-extrabold">Microsoft</span> Partner
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-1">
                  <span className="text-slate-900 font-extrabold">AWS</span> Consultant
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-1">
                  <span className="text-slate-900 font-extrabold">Google Cloud</span> Member
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-1">
                  <span className="text-slate-900 font-extrabold">SOC2</span> Certified
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Visual (Premium Floating Interactive Layout) */}
          <div className="lg:col-span-5 relative mt-10 lg:mt-0 select-none flex justify-center">
            {/* Outer light glowing pulse background */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none" />
            
            {/* Main Stack Container with Parallax Float */}
            <div className="relative animate-float w-full max-w-[420px] lg:max-w-[450px]">
              {/* Visual Image */}
              <div className="relative z-10 overflow-hidden rounded-3xl border border-slate-200/60 bg-white/50 backdrop-blur p-3 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
                  alt="Enterprise Software Development"
                  referrerPolicy="no-referrer"
                  className="w-full h-[300px] sm:h-[350px] lg:h-[380px] object-cover rounded-2xl hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent rounded-2xl pointer-events-none" />
              </div>

              {/* Floating Metric Card 1 (Top Left) */}
              <div className="absolute top-10 -left-6 lg:-left-10 z-20 animate-float-slow bg-white/90 backdrop-blur-md border border-slate-200/50 p-4 rounded-2xl shadow-[0_15px_30px_-10px_rgba(37,99,235,0.15)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2563EB] shadow-inner">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold font-mono text-slate-400 block tracking-wider uppercase">ACTIVE SQUADS</span>
                  <span className="text-sm font-extrabold text-slate-950">500+ Experts Deployed</span>
                </div>
              </div>

              {/* Floating Metric Card 2 (Bottom Right) */}
              <div className="absolute -bottom-6 -right-4 lg:-right-6 z-20 animate-float-fast bg-white/90 backdrop-blur-md border border-slate-200/50 p-4 rounded-2xl shadow-[0_15px_30px_-10px_rgba(37,99,235,0.15)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500 shadow-inner">
                  <CheckCircle2 className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] font-bold font-mono text-slate-400 block tracking-wider uppercase">SLA COMPLIANCE</span>
                  <span className="text-sm font-extrabold text-slate-950 flex items-center gap-1.5">
                    99.99% Availability
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                  </span>
                </div>
              </div>

              {/* Floating Badge 3 (Middle Right) */}
              <div className="absolute top-1/2 -right-8 z-20 translate-y-[-50%] bg-white/95 backdrop-blur-md border border-slate-200/60 px-3.5 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#2563EB]" />
                <span className="text-xs font-bold text-slate-850 tracking-tight">SOC2 Secured</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
