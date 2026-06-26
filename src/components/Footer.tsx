import React from 'react';

interface FooterProps {
  onScrollToSection: (id: string) => void;
  onSetModalConfig: (config: { isOpen: boolean; title: string; message: string } | null) => void;
}

export default function Footer({ onScrollToSection, onSetModalConfig }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Column 1: BA Soft Tech brief logo and mission */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <span className="font-display text-2xl font-bold tracking-tight text-white block">
              BA <span className="text-[#2563EB]">Soft</span> Tech
            </span>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Serving as a trusted partner to modern global enterprises. We bridge technical capacity gaps and build scalable cloud infrastructure designed to accelerate corporate velocity.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 text-left">
            <h4 className="font-mono text-xs font-bold tracking-widest uppercase text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onScrollToSection('home')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('resources')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Resources
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSetModalConfig({
                    isOpen: true,
                    title: 'Careers Portal Notice',
                    message: 'Our corporate careers and talent portal is currently being upgraded for enhanced direct LDAP and SOC2 credential sync. In the meantime, please submit your CV or professional profile directly through our general contact form and our talent team will review it immediately.'
                  })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Careers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Services Offered */}
          <div className="lg:col-span-3 text-left">
            <h4 className="font-mono text-xs font-bold tracking-widest uppercase text-white mb-4">
              Services Offered
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onScrollToSection('staffing')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Staffing Models
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('digital')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cloud Operations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('digital')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Transformations
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Corporate Info */}
          <div className="lg:col-span-3 text-left space-y-4">
            <div>
              <h4 className="font-mono text-xs font-bold tracking-widest uppercase text-white mb-3">
                Headquarters
              </h4>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                BA Software Tech Center, Tower C<br />
                Level 14, Tech Boulevard<br />
                Silicon Meadows, CA 94025
              </p>
            </div>
            
            <div>
              <h4 className="font-mono text-xs font-bold tracking-widest uppercase text-white mb-2">
                Channels
              </h4>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors text-sm font-mono font-medium">Linkedin</a>
                <a href="#" className="hover:text-white transition-colors text-sm font-mono font-medium">Twitter</a>
                <a href="#" className="hover:text-white transition-colors text-sm font-mono font-medium">Github</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Divider */}
        <div className="pt-8 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>
            © 2026 BA Soft Tech. All Rights Reserved.
          </span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
