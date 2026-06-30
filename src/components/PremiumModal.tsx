import React from 'react';
import { X } from 'lucide-react';

interface PremiumModalProps {
  config: {
    isOpen: boolean;
    title: string;
    message: string;
  } | null;
  onClose: () => void;
}

export default function PremiumModal({ config, onClose }: PremiumModalProps) {
  if (!config || !config.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Blur Overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      />
      
      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-250/30 rounded-3xl p-6 sm:p-8 shadow-2xl animate-scaleUp text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-mono tracking-widest text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/50">
            BA SOFT TECH ADVISORY
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight leading-tight">
            {config.title}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-light">
            {config.message}
          </p>
          
          <div className="pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs uppercase tracking-wider rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              Close Notice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
