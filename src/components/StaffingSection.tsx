import React from 'react';
import { ChevronRight } from 'lucide-react';
import { STAFFING_SERVICES } from '../data';
import IconRenderer from './IconRenderer';

interface StaffingSectionProps {
  onScrollToSection: (id: string) => void;
}

export default function StaffingSection({ onScrollToSection }: StaffingSectionProps) {
  return (
    <section id="staffing" className="py-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 space-y-4 reveal-on-scroll">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#2563EB]">
            Talent Pipeline
          </h2>
          <p className="font-display text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Staffing Solutions
          </p>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
            Scale your technical workforce instantly with highly-vetted domain experts.
          </p>
        </div>

        {/* Responsive Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {STAFFING_SERVICES.map((card, index) => (
            <div
              key={card.id}
              onClick={() => onScrollToSection('contact')}
              className="reveal-on-scroll premium-card p-6 rounded-3xl flex flex-col justify-between items-start text-left group"
              style={{ transitionDelay: `${(index % 3) * 80}ms` }}
            >
              <div className="w-full">
                {/* Card Image */}
                {card.imageUrl && (
                  <div className="h-44 w-full overflow-hidden rounded-2xl mb-6 relative">
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#2563EB] shadow-sm">
                      <IconRenderer name={card.iconName} className="h-4.5 w-4.5" />
                    </div>
                  </div>
                )}
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-950 mb-2.5 tracking-tight group-hover:text-[#2563EB] transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-light">
                  {card.description}
                </p>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onScrollToSection('contact');
                }}
                className="mt-6 text-xs font-bold uppercase tracking-wider text-[#2563EB] hover:text-blue-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                Learn More
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
