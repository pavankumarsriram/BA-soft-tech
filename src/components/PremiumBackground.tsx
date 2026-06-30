import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export default function PremiumBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Parallax on mouse move
  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 15; // Shift max 15px
      const y = (e.clientY / innerHeight - 0.5) * 15;
      setParallax({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [reducedMotion]);

  // Particle Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic sizing helper
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Setup particles
    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: (Math.random() - 0.5) * 0.12 - 0.05, // Slight upward drift
        opacity: Math.random() * 0.5 + 0.1,
        pulseSpeed: 0.005 + Math.random() * 0.015,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Active mouse influence for subtle gravity
    const mouse = { x: -1000, y: -1000, active: false };

    const handleCanvasMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleCanvasMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleCanvasMouseMove);
    document.addEventListener('mouseleave', handleCanvasMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (reducedMotion) return;

      particles.forEach((p) => {
        // Apply slight drift
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse gravity influence: gently nudge particles
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            p.x += (dx / dist) * force * 0.2;
            p.y += (dy / dist) * force * 0.2;
          }
        }

        // Pulse logic
        p.pulsePhase += p.pulseSpeed;
        const currentOpacity = p.opacity + Math.sin(p.pulsePhase) * 0.15;
        const boundedOpacity = Math.max(0.05, Math.min(0.7, currentOpacity));

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${boundedOpacity})`;
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleCanvasMouseMove);
      document.removeEventListener('mouseleave', handleCanvasMouseLeave);
    };
  }, [reducedMotion]);

  // Apply parallax translate3d
  const bgTransform = reducedMotion
    ? 'none'
    : `translate3d(${parallax.x}px, ${parallax.y - scrollY * 0.05}px, 0)`;

  const blobTransform1 = reducedMotion
    ? 'none'
    : `translate3d(${parallax.x * 1.5}px, ${parallax.y * 1.5 - scrollY * 0.08}px, 0)`;

  const blobTransform2 = reducedMotion
    ? 'none'
    : `translate3d(${parallax.x * -1.2}px, ${parallax.y * -1.2 - scrollY * 0.03}px, 0)`;

  const blobTransform3 = reducedMotion
    ? 'none'
    : `translate3d(${parallax.x * 0.8}px, ${parallax.y * 0.8 - scrollY * 0.06}px, 0)`;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none"
    >
      {/* 1. Base Aurora Gradient & Deep Palette Overlays */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-blue-50/80 via-white to-indigo-50/80 transition-transform duration-300 ease-out"
        style={{ transform: bgTransform }}
      />
      
      {/* Elegant layout grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-90" />

      {/* 2. Floating Animated Mesh Gradient Blobs */}
      <div className="absolute inset-0 filter blur-[100px] sm:blur-[130px] opacity-80">
        {/* Sky Blue/Teal Orb */}
        <div
          className="absolute top-[-5%] left-[-10%] w-[55vw] h-[55vh] rounded-full bg-sky-200/55 animate-blob-1 transition-transform duration-300 ease-out"
          style={{ transform: blobTransform1 }}
        />
        {/* Rich Indigo/Purple Orb */}
        <div
          className="absolute top-[20%] right-[-5%] w-[50vw] h-[55vh] rounded-full bg-indigo-200/50 animate-blob-2 transition-transform duration-300 ease-out"
          style={{ transform: blobTransform2 }}
        />
        {/* Rose Peach Orb */}
        <div
          className="absolute bottom-[-10%] left-[15%] w-[45vw] h-[45vh] rounded-full bg-rose-200/45 animate-blob-3 transition-transform duration-300 ease-out"
          style={{ transform: blobTransform3 }}
        />
        {/* Ambient Cyan Accent */}
        <div
          className="absolute top-[50%] left-[-8%] w-[38vw] h-[38vh] rounded-full bg-cyan-200/40 animate-blob-2 transition-transform duration-300 ease-out"
          style={{ transform: blobTransform1 }}
        />
      </div>

      {/* 3. Subtle Film Grain/Noise Texture Layer to eliminate banding */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 4. Canvas Floating Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full mix-blend-normal opacity-90"
      />

      {/* 5. Ambient Top Vignette & Subtle Blur */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]" />
    </div>
  );
}
