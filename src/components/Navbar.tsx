import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Users, Briefcase, Cpu, Layers, ChevronRight, PhoneCall } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  onContactClick: () => void;
  onPostJobClick?: () => void;
}

export default function Navbar({ onContactClick, onPostJobClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { 
      name: 'Home', 
      id: 'home', 
      desc: 'Enterprise gateway',
      icon: <Home className="h-4 w-4" /> 
    },
    { 
      name: 'About Us', 
      id: 'about', 
      desc: 'Our capabilities',
      icon: <Users className="h-4 w-4" /> 
    },
    { 
      name: 'Jobs', 
      id: 'jobs', 
      desc: 'Current openings',
      icon: <Briefcase className="h-4 w-4" /> 
    },
    { 
      name: 'Staffing Solutions', 
      id: 'staffing', 
      desc: 'Elite workforce pipeline',
      icon: <Briefcase className="h-4 w-4" /> 
    },
    { 
      name: 'Digital Solutions', 
      id: 'digital', 
      desc: 'Next-gen engineering services',
      icon: <Cpu className="h-4 w-4" /> 
    },
    { 
      name: 'Resources', 
      id: 'resources', 
      desc: 'Active insights backlog',
      icon: <Layers className="h-4 w-4" /> 
    },
  ];

  // Monitor active scroll sections and general scroll state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Detect active section
      const scrollPosition = window.scrollY + 140;
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.id);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 85; // height of floating sticky header plus padding
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out border-b ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md shadow-md border-slate-200/60 py-2.5'
          : 'bg-white/40 backdrop-blur-sm border-slate-200/20 py-4.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* Logo Group (Left) */}
          <div
            id="brand-logo-nav"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setActiveSection('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <Logo size="md" />
            <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-slate-950 transition-colors">
              BA <span className="text-[#2563EB] group-hover:text-blue-700 transition-colors">Soft</span> Tech
            </span>
          </div>

          {/* Desktop Navigation Links (Center) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => scrollToSection(link.id)}
                className={`text-xs lg:text-sm font-semibold transition-all duration-300 relative py-2 px-3.5 rounded-full cursor-pointer ${
                  activeSection === link.id
                    ? 'text-[#2563EB] bg-blue-50/70 border border-blue-100/30'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50/50 border border-transparent'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Primary CTA (Right) */}
          <div className="hidden md:flex items-center">
            <button
              id="nav-postjob-cta"
              onClick={onPostJobClick}
              className="mr-3 px-4 py-2.5 bg-white text-[#2563EB] border border-[#2563EB] font-semibold text-xs tracking-wide uppercase rounded-full hover:bg-slate-50 transition-all duration-200 cursor-pointer"
            >
              Post Job
            </button>
            <button
              id="nav-contact-cta"
              onClick={onContactClick}
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs tracking-wide uppercase rounded-full shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer premium-btn-glow flex items-center gap-1.5"
            >
              Contact Us
            </button>
          </div>

          {/* Mobile Menu Toggle Button (Minimum 44px interactive area) */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-trigger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 flex items-center justify-center text-slate-850 hover:text-[#2563EB] transition-colors focus:outline-none rounded-full bg-slate-50/40 hover:bg-slate-50/90 border border-slate-250/20"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Glass Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-0 w-full px-4 sm:px-6">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/70 shadow-2xl rounded-3xl p-5 space-y-4 flex flex-col z-40 transition-all duration-350 ease-out animate-scaleUp">
            
            <div className="space-y-1">
              <p className="text-[9px] font-bold font-mono tracking-widest text-slate-400 uppercase px-2.5">
                Corporate Navigation
              </p>
              <div className="grid grid-cols-1 gap-1 pt-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 text-left cursor-pointer group ${
                      activeSection === link.id
                        ? 'bg-blue-50/80 text-[#2563EB] border border-blue-100/40'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                        activeSection === link.id ? 'bg-blue-100/50 text-[#2563EB]' : 'bg-slate-50 text-slate-500 group-hover:bg-slate-100'
                      }`}>
                        {link.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold tracking-tight">
                          {link.name}
                        </p>
                        <p className="text-[10px] text-slate-450 leading-none mt-0.5">
                          {link.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${
                      activeSection === link.id ? 'text-[#2563EB] translate-x-0.5' : 'text-slate-350 group-hover:translate-x-1'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100">
              <button
                  onClick={onPostJobClick}
                  className="w-full py-3.5 mb-3 bg-white text-[#2563EB] border border-[#e6eefc] font-bold rounded-2xl text-center text-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  Post Job
                </button>
                <button
                  onClick={onContactClick}
                  className="w-full py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-2xl text-center text-sm shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 premium-btn-glow"
              >
                <PhoneCall className="h-4 w-4" />
                Initiate Engagement
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
