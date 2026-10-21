import React from 'react';
import { ScenarioStep, ChatBubbleItem } from '../types';
import { Sparkles, TrendingUp, Wrench, Cpu, Recycle, ShieldCheck, MessageSquare } from 'lucide-react';

interface CaptionsOverlayProps {
  currentScenario: ScenarioStep;
  activeBubble?: ChatBubbleItem;
  visible: boolean;
}

export const CaptionsOverlay: React.FC<CaptionsOverlayProps> = ({ 
  currentScenario, 
  activeBubble,
  visible 
}) => {
  if (!visible) return null;

  const category = activeBubble ? activeBubble.category : currentScenario.category;
  const title = activeBubble ? `${activeBubble.scenarioTitle} (${activeBubble.sender === 'user' ? 'Input' : 'Output'})` : currentScenario.title;
  const narration = activeBubble ? activeBubble.narrationText : currentScenario.narrationId;
  const takeaway = activeBubble ? activeBubble.keyTakeaway : currentScenario.keyTakeaway;
  const economicVal = activeBubble?.economicValueIdr || currentScenario.economicValueIdr;
  const carbonOffset = activeBubble?.carbonOffsetKg || currentScenario.carbonOffsetKg;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Reuse':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60';
      case 'Repair':
        return 'text-blue-400 border-blue-500/40 bg-blue-950/60';
      case 'Component Recovery':
        return 'text-amber-400 border-amber-500/40 bg-amber-950/60';
      case 'Recycling':
        return 'text-teal-400 border-teal-500/40 bg-teal-950/60';
      default:
        return 'text-slate-300 border-slate-700 bg-slate-900/80';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Reuse':
        return <TrendingUp className="w-3.5 h-3.5 mr-1" />;
      case 'Repair':
        return <Wrench className="w-3.5 h-3.5 mr-1" />;
      case 'Component Recovery':
        return <Cpu className="w-3.5 h-3.5 mr-1" />;
      case 'Recycling':
        return <Recycle className="w-3.5 h-3.5 mr-1" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 mr-1" />;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fadeIn">
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
        
        {/* Subtle accent top border line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getCategoryColor(category)}`}>
              {getCategoryIcon(category)}
              {title}
            </span>
          </div>

          <span className="text-[10.5px] font-mono text-[#FACC15] bg-[#0A132C] border border-[#1E2E5D] px-2 py-0.5 rounded-md flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-[#FACC15]" />
            <span>TechLoop n8n Bot</span>
          </span>
        </div>

        {/* Narration Script (Teks Penjelas Voiceover) */}
        <p className="text-sm font-medium text-slate-100 leading-relaxed mb-2.5">
          "{narration}"
        </p>

        {/* Key Takeaway / Value Highlight */}
        <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-[#FACC15] font-bold shrink-0">Poin Kunci:</span>
            <span className="line-clamp-1">{takeaway}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
