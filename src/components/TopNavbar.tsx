import React from 'react';
import { Sparkles } from 'lucide-react';

interface TopNavbarProps {
  onOpenGuide: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenGuide, activeSection, onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); onNavigate('demo'); }}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>TechLoop</span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button 
            onClick={() => onNavigate('demo')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'demo' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Showcase Demo
          </button>
          
          <button 
            onClick={() => onNavigate('scenarios')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'scenarios' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            4 Skenario Sirkular
          </button>

          <button 
            onClick={() => onNavigate('workflow')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'workflow' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Workflow n8n
          </button>

          <button 
            onClick={() => onNavigate('impact')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'impact' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Kalkulator Dampak
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenGuide}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Naskah & Panduan Video</span>
          </button>
        </div>

      </div>
    </header>
  );
};
