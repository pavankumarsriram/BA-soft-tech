import React, { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import PremiumBackground from './components/PremiumBackground';
import Hero from './components/Hero';
import About from './components/About';
import StaffingSection from './components/StaffingSection';
import DigitalSolutionsSection from './components/DigitalSolutionsSection';
import ResourcesSection from './components/ResourcesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import PremiumModal from './components/PremiumModal';

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

  // Modal notice state
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; message: string } | null>(null);

  // Stats increment simulation for About segment
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

  return (
    <div className="min-h-screen relative bg-slate-50/20 text-slate-900 font-sans selection:bg-blue-100 selection:text-[#2563EB]">
      {/* 0. Premium Dynamic Background Layer */}
      <PremiumBackground />

      {/* 1. Header & Glassmorphism Navigation */}
      <Navbar onContactClick={() => scrollToSection('contact')} />

      {/* Spacing for sticky nav */}
      <div className="h-20"></div>

      {/* 2. Hero Section */}
      <Hero onScrollToSection={scrollToSection} />

      {/* 3. About Us Section */}
      <About statValues={{
        deployed: statValues.deployed,
        retention: statValues.retention,
        transformations: statValues.transformations
      }} />

      {/* 4. Staffing Solutions Section */}
      <StaffingSection onScrollToSection={scrollToSection} />

      {/* 5. Digital Solutions Section */}
      <DigitalSolutionsSection onScrollToSection={scrollToSection} />

      {/* 6. Resources Section (Insights/Technical Papers) */}
      <ResourcesSection onSetModalConfig={setModalConfig} />

      {/* 7. Contact Us Section (Secure inquiry gateway) */}
      <ContactSection />

      {/* 8. Monolithic Utility Footer */}
      <Footer 
        onScrollToSection={scrollToSection} 
        onSetModalConfig={setModalConfig} 
      />

      {/* 9. Premium Glassmorphic Modal Notification */}
      <PremiumModal 
        config={modalConfig} 
        onClose={() => setModalConfig(null)} 
      />
    </div>
  );
}
