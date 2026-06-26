import React, { useEffect, useRef } from 'react';
import { Server } from 'lucide-react';

export default function NetworkGraphic() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Handle Resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === canvas) {
          width = canvas.width = canvas.offsetWidth;
          height = canvas.height = canvas.offsetHeight;
        }
      }
    });
    resizeObserver.observe(canvas);

    // Nodes definition
    const nodeCount = 35;
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulse: number;
      pulseSpeed: number;
    }> = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      });
    }

    // Interactive mouse coordinates
    let mouse = { x: -1000, y: -1000, radius: 100 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background grid/circles for depth
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.35, 0, Math.PI * 2);
      ctx.stroke();

      // Update and Draw connecting lines
      ctx.lineWidth = 1;
      for (let i = 0; i < nodeCount; i++) {
        const nodeA = nodes[i];
        for (let j = i + 1; j < nodeCount; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.15;
            // Draw tech-blue connection lines if they're close, white/slate otherwise
            if (i % 4 === 0) {
              ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 2.0})`;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
            }
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      // Update and Draw nodes
      nodes.forEach((node, index) => {
        // Move nodes
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off bounds
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Constrain positions to canvas bounds
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));

        // Interactive mouse pull/repel
        const mdx = mouse.x - node.x;
        const mdy = mouse.y - node.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.radius) {
          const force = (mouse.radius - mdist) / mouse.radius;
          node.x -= (mdx / mdist) * force * 1.0;
          node.y -= (mdy / mdist) * force * 1.0;
        }

        // Pulse logic
        node.pulse += node.pulseSpeed;
        const currentRadius = node.radius + Math.sin(node.pulse) * 0.4;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);

        // Tech-blue accent node vs normal white/slate node
        if (index % 4 === 0) {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
          // outer glowing pulse
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(59, 130, 246, 1)';
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full h-[340px] sm:h-[420px] lg:h-[500px] rounded-2xl overflow-hidden border border-slate-200/60 shadow-2xl bg-slate-950 group">
      {/* Background High-Quality Optimized Tech Hero Image */}
      <img
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80"
        alt="BA Soft Tech Enterprise Data Connectivity Network"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover filter brightness-[0.5] contrast-[1.1] scale-100 group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
      />

      {/* Modern gradient tint mix blend overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-[#2563EB]/15 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950/80 pointer-events-none" />

      {/* Absolute canvas on top */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen" />
      
      {/* Decorative center ring overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-blue-500/20 bg-slate-950/60 backdrop-blur-md shadow-lg shadow-blue-500/5 flex items-center justify-center pointer-events-none group-hover:border-blue-500/35 transition-all duration-500">
        <div className="w-22 h-22 rounded-full border border-blue-500/30 bg-blue-500/5 flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold font-mono text-blue-400 tracking-widest uppercase">BA CORE</span>
          <span className="text-[8px] font-medium text-slate-300">INTEGRATION</span>
        </div>
      </div>


    </div>
  );
}
