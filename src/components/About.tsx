import React from 'react';
import { ABOUT_STATS } from '../data';

interface AboutProps {
  statValues: {
    deployed: number;
    retention: number;
    transformations: number;
  };
}

export default function About({ statValues }: AboutProps) {
  return (
    <section id="about" className="py-8 bg-transparent border-y border-slate-100/20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 space-y-4 reveal-on-scroll">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#2563EB]">
            Who We Are
          </h2>
          <p className="font-display text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Bridging potential and innovation.
          </p>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
            At BA Soft Tech, we bridge the gap between human potential and technological innovation. We serve as a trusted partner to enterprises globally, ensuring they have the specialized minds and robust digital tools to lead their industries.
          </p>
        </div>

        {/* Data Counter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {ABOUT_STATS.map((stat, index) => {
            // Dynamic counter displays based on our interval-incrementing state
            let displayValue = stat.value;
            if (stat.id === 'deployed' && statValues.deployed < 500) {
              displayValue = `${statValues.deployed}+`;
            } else if (stat.id === 'retention' && statValues.retention < 98) {
              displayValue = `${statValues.retention}%`;
            } else if (stat.id === 'transformations' && statValues.transformations < 150) {
              displayValue = `${statValues.transformations}+`;
            }

            return (
              <div
                key={stat.id}
                className="reveal-on-scroll premium-card p-8 rounded-3xl flex flex-col justify-center items-center text-center group"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#2563EB] mb-3 tracking-tight group-hover:scale-105 transition-transform duration-350 block">
                  {displayValue}
                </span>
                <span className="text-xs sm:text-sm text-slate-500 font-semibold tracking-wide uppercase font-mono">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
