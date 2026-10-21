import React, { useState } from 'react';
import { TECHLOOP_LOGO, ESSAY_PDF_PATH } from '../data/scenariosData';
import { 
  FileText, 
  ExternalLink, 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  Layers, 
  Award, 
  Eye, 
  X,
  Play
} from 'lucide-react';

interface ProjectHeaderBannerProps {
  onStartAutoDemo: () => void;
  onOpenGuide: () => void;
}

export const ProjectHeaderBanner: React.FC<ProjectHeaderBannerProps> = ({
  onStartAutoDemo,
  onOpenGuide,
}) => {
  const [showPdfModal, setShowPdfModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* 3-Card Showcase Grid: Logo + Essay Paper + Telegram Bot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Official Logo & Brand */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-800 font-mono">
                Brand & Identitas
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Tim StarNight</span>
            </div>

            {/* Official Logo Image */}
            <div className="bg-white rounded-xl p-3 flex items-center justify-center border border-slate-700 shadow-inner h-24">
              <img
                src={TECHLOOP_LOGO}
                alt="Logo TechLoop"
                className="max-h-16 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
              />
            </div>

            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>TechLoop Circular Engine</span>
                <span className="text-[10px] bg-[#FACC15] text-[#060B19] font-black px-1.5 py-0.2 rounded font-mono">
                  SaaS
                </span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Platform otomasi sirkular e-waste berbasis AI & n8n untuk mengalihkan gadget bekas dari TPA ke 4 jalur bernilai tinggi.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>SMAN 15 Jakarta</span>
            <span className="text-emerald-400 font-semibold">CITE UP 2026</span>
          </div>
        </div>

        {/* Card 2: Research Essay File */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800 font-mono flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>Dokumen Essay Ilmiah</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">PDF 16 Halaman</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-[10px] text-emerald-400 font-mono font-bold uppercase">
                Judul Karya Tulis:
              </div>
              <h4 className="text-xs font-semibold text-white leading-snug line-clamp-2">
                TechLoop: Strategi Sistemik Berbasis AI Waste Matching untuk Mendorong Ekonomi Sirkular dalam Pengelolaan E-Waste
              </h4>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 flex items-center justify-between">
                <span>Penulis: <strong>Risma Yolanda & Annisa Amalia</strong></span>
              </p>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2">
              Berisi latar belakang krisis 62 juta ton e-waste, arsitektur workflow n8n, matriks aturan IF/Switch, dan hasil pengujian prototipe.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
            <button
              onClick={() => setShowPdfModal(true)}
              className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Buka File Essay</span>
            </button>
            <a
              href={ESSAY_PDF_PATH}
              download="TechLoop_Essay_SMAN_15_Jakarta.pdf"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors border border-slate-700"
              title="Unduh PDF"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Card 3: Chat Bot TechLoop Telegram */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-sky-500/50 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-800 font-mono flex items-center gap-1">
                <Bot className="w-3 h-3" />
                <span>Chat Bot Telegram</span>
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                n8n Webhook Live
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#4CAF50] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                T
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>TechLoop bot</span>
                  <span className="text-[10px] text-sky-400 bg-sky-950 px-1.5 py-0.2 rounded font-mono">Telegram</span>
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  Antarmuka pengguna 4 pilar keputusan sirkular
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-300">
                <span className="text-slate-500 block text-[9.5px]">ORCHESTRATION</span>
                <span className="text-emerald-400 font-bold">n8n Workflow</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-300">
                <span className="text-slate-500 block text-[9.5px]">AI CLASSIFIER</span>
                <span className="text-purple-400 font-bold">Gemini Agent</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={onStartAutoDemo}
              className="w-full py-1.5 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Mulai Rekaman Demo Chat Bot</span>
            </button>
          </div>
        </div>

      </div>

      {/* PDF Modal Viewer */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    File Essay Karya Tulis Ilmiah: TechLoop (SMAN 15 Jakarta)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Risma Yolanda & Annisa Amalia · CITE UP 2026
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={ESSAY_PDF_PATH}
                  download="TechLoop_Essay_SMAN_15_Jakarta.pdf"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </a>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded PDF iframe */}
            <div className="flex-1 bg-slate-950 p-2 overflow-hidden">
              <iframe
                src={`${ESSAY_PDF_PATH}#toolbar=1`}
                title="TechLoop Essay PDF"
                className="w-full h-full rounded-xl border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
