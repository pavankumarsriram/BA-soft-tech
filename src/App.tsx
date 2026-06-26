import React, { useState, useEffect, useRef } from 'react';
import {
  UserCheck,
  Zap,
  Terminal,
  Cloud,
  RefreshCw,
  Server,
  Mail,
  Phone,
  ArrowRight,
  ChevronRight,
  BookOpen,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Building,
  Globe,
  Award,
  Users,
  Briefcase,
  UserPlus,
  TrendingUp,
  Cpu,
  Target,
  Code,
  Layers,
  Smartphone,
  MousePointer,
  GitBranch,
  Brain,
  Database,
  BarChart2,
  Settings,
  Smile,
  Activity,
  Shield,
  CheckCircle,
  X
} from 'lucide-react';

import Navbar from './components/Navbar';
import NetworkGraphic from './components/NetworkGraphic';
import PremiumBackground from './components/PremiumBackground';
import { ABOUT_STATS, STAFFING_SERVICES, DIGITAL_SERVICES, BLOG_POSTS } from './data';

export default function App() {
  // Intersection Observer for scroll-driven animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.15,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [ticketId, setTicketId] = useState('');

  // Blog dynamic loader state
  const [blogItems, setBlogItems] = useState(BLOG_POSTS);
  const [hasLoadedAllBlogs, setHasLoadedAllBlogs] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; message: string } | null>(null);

  // Stats increment simulation
  const [statValues, setStatValues] = useState<Record<string, number>>({
    deployed: 100,
    retention: 70,
    transformations: 50,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStatValues((prev) => {
        const next = { ...prev };
        if (next.deployed < 500) next.deployed += 20;
        if (next.retention < 98) next.retention += 1;
        if (next.transformations < 150) next.transformations += 5;
        return next;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Business Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.message.trim()) errors.message = 'Message is required';
    return errors;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormStatus('submitting');
    
    // Simulate API delay
    setTimeout(() => {
      const generatedId = `BA-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedId);
      setFormStatus('success');
    }, 1200);
  };

  // Dynamic Blog Loading function
  const loadMoreBlogs = () => {
    const extraBlogs = [
      {
        id: 'post-4',
        imageAlt: 'AI workflows in software engineering',
        category: 'Artificial Intelligence',
        title: 'Accelerating CI/CD Pipelines with Generative AI workflows',
        summary: 'How modern DevOps squads integrate generative code assistants into their automated deployment infrastructure to slash software pipeline latencies.',
        meta: 'March 2026 • 4 min read',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'post-5',
        imageAlt: 'Remote dev collaboration security',
        category: 'Staffing Strategy',
        title: 'Managing High-Performance Distributed Tech Teams',
        summary: 'Essential team management models and key productivity tools to maintain architectural synchronization across several overlapping time zones.',
        meta: 'February 2026 • 7 min read',
        imageUrl: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'post-6',
        imageAlt: 'SaaS Multi-tenant DB isolation',
        category: 'Cloud Engineering',
        title: 'Tenant Database Partitioning and Sharding Strategies',
        summary: 'A deep architectural review of physical versus logical data segregation systems for secure high-volume corporate software architectures.',
        meta: 'January 2026 • 8 min read',
        imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
      }
    ];

    setBlogItems((prev) => [...prev, ...extraBlogs]);
    setHasLoadedAllBlogs(true);
    
    // Trigger intersection observer refresh
    setTimeout(() => {
      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.15,
      };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      }, observerOptions);
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }, 100);
  };

  // Helper to scroll to any section smoothly
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // height of sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Icon mapper for grid cards
  const renderIcon = (name: string, className: string) => {
    switch (name) {
      case 'UserCheck': return <UserCheck className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Terminal': return <Terminal className={className} />;
      case 'Cloud': return <Cloud className={className} />;
      case 'RefreshCw': return <RefreshCw className={className} />;
      case 'Server': return <Server className={className} />;
      case 'UserPlus': return <UserPlus className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Globe': return <Globe className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      case 'Target': return <Target className={className} />;
      case 'Code': return <Code className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Smartphone': return <Smartphone className={className} />;
      case 'MousePointer': return <MousePointer className={className} />;
      case 'GitBranch': return <GitBranch className={className} />;
      case 'Brain': return <Brain className={className} />;
      case 'Database': return <Database className={className} />;
      case 'BarChart2': return <BarChart2 className={className} />;
      case 'Settings': return <Settings className={className} />;
      case 'Smile': return <Smile className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'CheckCircle': return <CheckCircle className={className} />;
      default: return <Zap className={className} />;
    }
  };

  return (
    <div className="min-h-screen relative bg-slate-50/20 text-slate-900 font-sans selection:bg-blue-100 selection:text-[#2563EB]">
      {/* 0. Premium Dynamic Background Layer */}
      <PremiumBackground />

      {/* 1. Header & Glassmorphism Navigation */}
      <Navbar onContactClick={() => scrollToSection('contact')} />

      {/* Spacing for sticky nav */}
      <div className="h-20"></div>

      {/* 2. Hero Section (#home) */}
      <section
        id="home"
        className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-28 bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column Text Content */}
            <div className="lg:col-span-7 space-y-8 text-left reveal-on-scroll is-visible">
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-extrabold text-[#2563EB] bg-blue-50/95 backdrop-blur px-3.5 py-1.5 rounded-full border border-blue-100/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]"></span>
                </span>
                ENGINEERING FUTURE GROWTH
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] lg:leading-[1.12] font-extrabold text-slate-950 tracking-tight">
                Empowering Modern Enterprises:{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-indigo-600 to-blue-700">
                  Transforming businesses
                </span>{' '}
                through top-tier talent and next-gen technology.
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-light">
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
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-4 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group premium-btn-glow"
                >
                  Get Started Now
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  id="hero-explore-btn"
                  onClick={() => scrollToSection('staffing')}
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
            <div className="lg:col-span-5 relative mt-10 lg:mt-0 select-none">
              {/* Outer light glowing pulse background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none" />
              
              {/* Main Stack Container with Parallax Float */}
              <div className="relative animate-float mx-auto max-w-[420px] lg:max-w-none">
                {/* Visual Image */}
                <div className="relative z-10 overflow-hidden rounded-3xl border border-slate-200/60 bg-white/50 backdrop-blur p-3 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
                    alt="Enterprise Software Development"
                    referrerPolicy="no-referrer"
                    className="w-full h-[320px] lg:h-[400px] object-cover rounded-2xl hover:scale-105 transition-transform duration-700"
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
                  <span className="text-xs font-bold text-slate-850 tracking-tight">SOC2 Type II Secured</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. About Us Section (#about) */}
      <section id="about" className="py-20 sm:py-24 bg-transparent border-y border-slate-100/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4 reveal-on-scroll">
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

      {/* 4. Staffing Solutions Section (#staffing) */}
      <section id="staffing" className="py-20 sm:py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4 reveal-on-scroll">
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
                onClick={() => scrollToSection('contact')}
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
                        {renderIcon(card.iconName, 'h-4.5 w-4.5')}
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
                    scrollToSection('contact');
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

      {/* 5. Digital Solutions Section (#digital) */}
      <section id="digital" className="py-20 sm:py-24 bg-transparent border-t border-slate-100/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4 reveal-on-scroll">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#2563EB]">
              Next-Gen Services
            </h2>
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Digital Solutions
            </p>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
              Modernize infrastructure, protect data assets, and drive digital acceleration.
            </p>
          </div>

          {/* Responsive Service Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {DIGITAL_SERVICES.map((card, index) => (
              <div
                key={card.id}
                onClick={() => scrollToSection('contact')}
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
                        {renderIcon(card.iconName, 'h-4.5 w-4.5')}
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
                    scrollToSection('contact');
                  }}
                  className="mt-6 text-xs font-bold uppercase tracking-wider text-[#2563EB] hover:text-blue-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  Consult Architecture
                  <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Resources Section (#resources) */}
      <section id="resources" className="py-12 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-10 space-y-3 reveal-on-scroll">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#2563EB]">
              Corporate Backlog
            </h2>
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Latest Insights & Technical Resources
            </p>
          </div>

          {/* 3-Column Blog Post Card Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogItems.map((blog, index) => (
              <article
                key={blog.id}
                className="reveal-on-scroll premium-card rounded-2xl overflow-hidden flex flex-col justify-between"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div>
                  {/* Styled geometric placeholder header representing specific content */}
                  <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-6 group">
                    {blog.imageUrl ? (
                      <img
                        src={blog.imageUrl}
                        alt={blog.imageAlt}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />
                    
                    {blog.category === 'Tech Trends' && (
                      <div className="relative z-10 w-12 h-12 rounded border border-blue-500/40 rotate-12 flex items-center justify-center text-[#2563EB] bg-slate-900/80 backdrop-blur-sm">
                        <Terminal className="h-5 w-5" />
                      </div>
                    )}
                    {blog.category === 'Staffing Strategy' && (
                      <div className="relative z-10 w-12 h-12 rounded-full border border-green-500/40 flex items-center justify-center text-green-500 bg-slate-900/80 backdrop-blur-sm">
                        <Users className="h-5 w-5" />
                      </div>
                    )}
                    {blog.category === 'Cloud Security' && (
                      <div className="relative z-10 w-12 h-12 rounded-xl border border-[#2563EB]/40 -rotate-12 flex items-center justify-center text-blue-400 bg-slate-900/80 backdrop-blur-sm">
                        <Cloud className="h-5 w-5" />
                      </div>
                    )}
                    {blog.category === 'Artificial Intelligence' && (
                      <div className="relative z-10 w-12 h-12 rounded border border-purple-500/40 flex items-center justify-center text-purple-400 bg-slate-900/80 backdrop-blur-sm">
                        <RefreshCw className="h-5 w-5" />
                      </div>
                    )}
                    {blog.category === 'Cloud Engineering' && (
                      <div className="relative z-10 w-12 h-12 rounded border border-cyan-500/40 flex items-center justify-center text-cyan-400 bg-slate-900/80 backdrop-blur-sm">
                        <Server className="h-5 w-5" />
                      </div>
                    )}
                    
                    {/* Floating Title Tag overlay */}
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-white bg-[#2563EB] px-2.5 py-1 rounded">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3 text-left">
                    <span className="text-xs font-mono text-slate-400 block">{blog.meta}</span>
                    <h3 className="font-display text-lg font-bold text-slate-900 hover:text-[#2563EB] transition-colors leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {blog.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 text-left">
                  <button
                    onClick={() => setModalConfig({
                      isOpen: true,
                      title: 'Research Study Queued',
                      message: `The technical paper "${blog.title}" is currently queued for digital and print distribution in our upcoming Q3 Technical Review. If you have any immediate architectural questions, please contact our enterprise solutions desk below.`
                    })}
                    className="text-xs font-bold text-slate-900 hover:text-[#2563EB] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    Read Technical Paper
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Under the Grid CTA */}
          <div className="text-center reveal-on-scroll">
            {!hasLoadedAllBlogs ? (
              <button
                id="view-all-insights-btn"
                onClick={loadMoreBlogs}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 font-bold text-xs uppercase tracking-wider rounded transition-all duration-300 cursor-pointer"
              >
                View All Insights
              </button>
            ) : (
              <p className="text-sm text-slate-500 font-semibold max-w-lg mx-auto">
                Our active engineering insights backlog is fully up-to-date. Check back weekly for new cloud architecture, cybersecurity, and strategic staffing reviews.
              </p>
            )}
          </div>

        </div>
      </section>

      {/* 7. Contact Us Section (#contact) */}
      <section id="contact" className="py-12 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column (Contact Details) */}
            <div className="lg:col-span-5 space-y-6 text-left reveal-on-scroll">
              <span className="inline-block text-xs uppercase tracking-widest font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded">
                CONNECT TO BASE
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Let's Start a Conversation
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
                Have an ambitious project blueprint or need to fill crucial technical capacity gaps? Reach out to our strategy teams. We consistently answer all verified business inquiries within 24 business hours.
              </p>

              <div className="pt-6 space-y-4 border-t border-slate-100">
                <div className="flex items-center gap-3.5 group">
                  <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-mono block">ENTERPRISE INQUIRIES</span>
                    <a
                      href="mailto:growth@basofttech.com"
                      className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#2563EB] transition-colors"
                    >
                      growth@basofttech.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 group">
                  <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-mono block">DIRECT SECURE CALLBACK LINE</span>
                    <a
                      href="tel:+15550192831"
                      className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#2563EB] transition-colors"
                    >
                      +1 (555) 019-2831
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Lead Generation Form) */}
            <div className="lg:col-span-7 reveal-on-scroll">
              <div className="premium-card p-6 sm:p-10 rounded-2xl shadow-lg border border-slate-200/50">
                
                {formStatus !== 'success' ? (
                  <form onSubmit={handleFormSubmit} className="space-y-5 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name input */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">
                          Full Name *
                        </label>
                        <input
                          id="contact-form-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Dr. Evelyn Vance"
                          className={`w-full bg-white/85 border ${
                            formErrors.name ? 'border-red-400' : 'border-slate-200'
                          } focus:border-[#2563EB] rounded px-4 py-3 text-sm focus:outline-none transition font-sans`}
                        />
                        {formErrors.name && (
                          <span className="text-xs text-red-500 font-mono flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {formErrors.name}
                          </span>
                        )}
                      </div>

                      {/* Email input */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">
                          Business Email *
                        </label>
                        <input
                          id="contact-form-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="vance@ba-softtech.com"
                          className={`w-full bg-white/85 border ${
                            formErrors.email ? 'border-red-400' : 'border-slate-200'
                          } focus:border-[#2563EB] rounded px-4 py-3 text-sm focus:outline-none transition font-sans`}
                        />
                        {formErrors.email && (
                          <span className="text-xs text-red-500 font-mono flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {formErrors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Company name (Optional) */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">
                        Company Name
                      </label>
                      <input
                        id="contact-form-company"
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="BA Software Technologies Ltd"
                        className="w-full bg-white/85 border border-slate-200 focus:border-[#2563EB] rounded px-4 py-3 text-sm focus:outline-none transition font-sans"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">
                        Detailed Message *
                      </label>
                      <textarea
                        id="contact-form-message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Describe your technical capacity gaps, infrastructure modernization objectives, or workload scale requirements..."
                        className={`w-full bg-white/85 border ${
                          formErrors.message ? 'border-red-400' : 'border-slate-200'
                        } focus:border-[#2563EB] rounded px-4 py-3 text-sm focus:outline-none transition font-sans resize-none`}
                      />
                      {formErrors.message && (
                        <span className="text-xs text-red-500 font-mono flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {formErrors.message}
                        </span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      id="contact-submit-btn"
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="w-full py-4 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold uppercase tracking-widest text-xs rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 premium-btn-glow"
                    >
                      {formStatus === 'submitting' ? (
                        <>
                          <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                          Establishing direct gateway tunnel...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                ) : (
                  // Elegant, high-craftsmanship Success State
                  <div className="text-center py-10 space-y-6 animate-fadeIn">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-[#2563EB] animate-bounce">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl font-bold text-slate-900">Message Received</h3>
                      <p className="text-sm text-slate-500 max-w-md mx-auto">
                        Thank you, {formData.name}. Your secure pipeline query has bypassed public routing layers and logged directly into our engineering backlog.
                      </p>
                    </div>

                    <div className="bg-white border border-slate-100 p-5 rounded-lg text-left max-w-sm mx-auto space-y-3 font-mono text-xs shadow-sm">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                        <span className="text-slate-400 font-semibold">TICKET ID:</span>
                        <span className="text-[#2563EB] font-bold">{ticketId}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">ROUTING STATUS:</span>
                        <span className="text-green-600 font-bold uppercase text-[10px] bg-green-50 px-2 py-0.5 rounded border border-green-100">
                          Priority Engineering
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">ESTIMATED RESPONSE:</span>
                        <span className="text-slate-700 font-semibold">Under 60 Minutes (SLA)</span>
                      </div>
                    </div>

                    <button
                      id="reset-form-btn"
                      onClick={() => {
                        setFormData({ name: '', email: '', company: '', message: '' });
                        setFormStatus('idle');
                      }}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-semibold text-xs rounded transition-all duration-300 cursor-pointer"
                    >
                      Submit Another Request
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Monolithic Utility Footer */}
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
                    onClick={() => scrollToSection('home')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('resources')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Resources
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalConfig({
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
                    onClick={() => scrollToSection('staffing')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Staffing Models
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('digital')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Cloud Operations
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('digital')}
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

      {/* 9. Premium Glassmorphic Modal Notification */}
      {modalConfig && modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <div 
            onClick={() => setModalConfig(null)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
          />
          
          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-250/30 rounded-3xl p-6 sm:p-8 shadow-2xl animate-scaleUp text-left">
            <button
              onClick={() => setModalConfig(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-mono tracking-widest text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/50">
                BA SOFT TECH ADVISORY
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight leading-tight">
                {modalConfig.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                {modalConfig.message}
              </p>
              
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setModalConfig(null)}
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs uppercase tracking-wider rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  Close Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
