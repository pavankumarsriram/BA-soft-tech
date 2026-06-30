import React, { useState } from 'react';
import { Terminal, Users, Cloud, RefreshCw, Server, ArrowUpRight } from 'lucide-react';
import { BLOG_POSTS } from '../data';
import { BlogPost } from '../types';

interface ResourcesSectionProps {
  onSetModalConfig: (config: { isOpen: boolean; title: string; message: string } | null) => void;
}

export default function ResourcesSection({ onSetModalConfig }: ResourcesSectionProps) {
  const [blogItems, setBlogItems] = useState<BlogPost[]>(BLOG_POSTS);
  const [hasLoadedAllBlogs, setHasLoadedAllBlogs] = useState(false);

  const loadMoreBlogs = () => {
    const extraBlogs: BlogPost[] = [
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
    
    // Trigger intersection observer refresh for newly loaded elements
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

  return (
    <section id="resources" className="py-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 space-y-3 reveal-on-scroll">
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
                  onClick={() => onSetModalConfig({
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
  );
}
