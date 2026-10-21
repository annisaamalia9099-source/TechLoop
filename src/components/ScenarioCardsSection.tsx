import React from 'react';
import { SCENARIO_STEPS } from '../data/scenariosData';
import { TrendingUp, Wrench, Cpu, Recycle, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';

interface ScenarioCardsSectionProps {
  onSelectScenario: (index: number) => void;
  currentIndex: number;
}

export const ScenarioCardsSection: React.FC<ScenarioCardsSectionProps> = ({
  onSelectScenario,
  currentIndex,
}) => {
  // Filter out intro and closing to focus on the 4 core circular pathways
  const circularScenarios = SCENARIO_STEPS.filter(
    (s) => s.id !== 'intro' && s.id !== 'closing'
  );

  const getPillarBadge = (category: string) => {
    switch (category) {
      case 'Reuse':
        return {
          icon: <TrendingUp className="w-4 h-4 mr-1 text-emerald-400" />,
          title: '01. REUSE',
          badge: 'High Residual Value',
          color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40',
        };
      case 'Repair':
        return {
          icon: <Wrench className="w-4 h-4 mr-1 text-blue-400" />,
          title: '02. REPAIR / REFURBISH',
          badge: 'High Repair ROI',
          color: 'border-blue-500/40 text-blue-400 bg-blue-950/40',
        };
      case 'Component Recovery':
        return {
          icon: <Cpu className="w-4 h-4 mr-1 text-amber-400" />,
          title: '03. COMPONENT RECOVERY',
          badge: 'Modular Harvesting',
          color: 'border-amber-500/40 text-amber-400 bg-amber-950/40',
        };
      case 'Recycling':
        return {
          icon: <Recycle className="w-4 h-4 mr-1 text-teal-400" />,
          title: '04. RECYCLING',
          badge: 'Zero Landfill Extraction',
          color: 'border-teal-500/40 text-teal-400 bg-teal-950/40',
        };
      default:
        return {
          icon: <Leaf className="w-4 h-4 mr-1 text-slate-400" />,
          title: 'CIRCULAR OPTION',
          badge: 'Standard',
          color: 'border-slate-700 text-slate-300 bg-slate-900',
        };
    }
  };

  return (
    <section className="py-12 border-t border-slate-800/80 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 font-mono">
              <span>Decision Matrix Framework</span>
              <span>·</span>
              <span>4 Pilar Sirkular TechLoop</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              4 Skenario Rekomendasi Sirkular E-Waste
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Algoritma AI dan n8n mengevaluasi foto kerusakan fisik, kesehatan sensor, dan rasio biaya perbaikan untuk mengarahkan gadget ke jalur yang paling bernilai.
            </p>
          </div>

          <span className="text-xs text-slate-400 font-mono shrink-0">
            Klik kartu untuk memuat skenario ke frame smartphone
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {circularScenarios.map((step) => {
            const pillar = getPillarBadge(step.category);
            const globalIndex = SCENARIO_STEPS.findIndex((s) => s.id === step.id);
            const isCurrentlyActive = currentIndex === globalIndex;

            return (
              <div
                key={step.id}
                onClick={() => onSelectScenario(globalIndex)}
                className={`group cursor-pointer rounded-2xl bg-slate-900/90 border transition-all duration-300 overflow-hidden flex flex-col justify-between hover:scale-[1.02] shadow-lg ${
                  isCurrentlyActive
                    ? 'border-emerald-500 ring-1 ring-emerald-500/60 shadow-emerald-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Device Photo Thumbnail */}
                <div className="h-44 w-full relative overflow-hidden bg-slate-950">
                  <img
                    src={step.devicePhoto}
                    alt={step.deviceTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                  
                  {/* Top Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md border ${pillar.color}`}>
                      {pillar.icon}
                      {pillar.title}
                    </span>
                  </div>

                  {/* Active Indicator Badge */}
                  {isCurrentlyActive && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                      Sedang Aktif di HP
                    </div>
                  )}

                  {/* Device Name on bottom of photo */}
                  <div className="absolute bottom-2 left-3 right-3">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {step.deviceTitle}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.conditionDesc}
                  </p>

                  {/* Verified Pathway Details */}
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Jalur Sirkular:</span>
                      <span className="text-emerald-400 font-bold">
                        {step.circularAction}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#FACC15] text-[11px] border-t border-slate-800/60 pt-1">
                      <span className="text-slate-400">Aturan n8n:</span>
                      <span>{step.activeN8nNodeId}</span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-2 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                    <span>Lihat Simulasi Chat</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
