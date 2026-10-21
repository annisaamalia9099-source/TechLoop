import React, { useState } from 'react';
import { 
  SCENARIO_STEPS, 
  N8N_WORKFLOW_NODES, 
  SEQUENTIAL_CHAT_BUBBLES, 
  TECHLOOP_LOGO, 
  ESSAY_PDF_PATH 
} from './data/scenariosData';

import { TopNavbar } from './components/TopNavbar';
import { MotionGraphicsVideoPlayer } from './components/MotionGraphicsVideoPlayer';
import { ProjectHeaderBanner } from './components/ProjectHeaderBanner';
import { PhoneFrame } from './components/PhoneFrame';
import { VideoPlayerControls } from './components/VideoPlayerControls';
import { CaptionsOverlay } from './components/CaptionsOverlay';
import { N8nCanvas } from './components/N8nCanvas';
import { TelegramScreenshotsGallery } from './components/TelegramScreenshotsGallery';
import { ScenarioCardsSection } from './components/ScenarioCardsSection';
import { ImpactStatsSection } from './components/ImpactStatsSection';
import { CapcutCanvaGuide } from './components/CapcutCanvaGuide';

import { 
  Film, 
  Smartphone, 
  FileText, 
  Sparkles, 
  Video, 
  CheckCircle,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function App() {
  // Main view mode: 'motion-video' (the requested 920x1080 motion graphics video) or 'interactive-studio'
  const [activeTab, setActiveTab] = useState<'motion-video' | 'interactive-studio'>('motion-video');
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // Stepper state for the interactive studio tab
  const [activeBubbleIndex, setActiveBubbleIndex] = useState<number>(0);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [isUserTyping, setIsUserTyping] = useState<boolean>(false);
  const [typingInputText, setTypingInputText] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [is3DTilt, setIs3DTilt] = useState<boolean>(false);

  const displayedBubbles = SEQUENTIAL_CHAT_BUBBLES.slice(0, activeBubbleIndex + 1);
  const currentBubble = SEQUENTIAL_CHAT_BUBBLES[activeBubbleIndex] || SEQUENTIAL_CHAT_BUBBLES[0];
  const currentScenarioIndex = SCENARIO_STEPS.findIndex((s) => s.id === currentBubble.scenarioId);
  const currentScenario = SCENARIO_STEPS[Math.max(0, currentScenarioIndex)];

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#060B19] text-slate-100 font-noto selection:bg-[#FACC15] selection:text-[#060B19]">
      
      {/* Top Navbar adhering to Constitution */}
      <TopNavbar
        onOpenGuide={() => setShowGuideModal(true)}
        activeSection="demo"
        onNavigate={(sec) => {
          if (sec === 'scenarios') scrollToSection('section-scenarios');
          else if (sec === 'workflow') scrollToSection('section-workflow');
          else if (sec === 'impact') scrollToSection('section-impact');
          else scrollToSection('section-demo');
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8" id="section-demo">
        
        {/* Project Header Banner: Logo, Essay PDF File, Telegram Bot Info */}
        <ProjectHeaderBanner
          onStartAutoDemo={() => {
            setActiveTab('motion-video');
            scrollToSection('section-motion-video');
          }}
          onOpenGuide={() => setShowGuideModal(true)}
        />

        {/* Studio View Mode Switcher Tabs */}
        <div className="flex items-center justify-center">
          <div className="bg-[#0A132C] border-2 border-[#1E2E5D] p-1.5 rounded-2xl flex items-center gap-2 shadow-2xl">
            <button
              onClick={() => setActiveTab('motion-video')}
              className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2 font-noto ${
                activeTab === 'motion-video'
                  ? 'bg-[#FACC15] text-[#060B19] shadow-lg shadow-yellow-500/20 scale-102'
                  : 'text-slate-300 hover:text-white hover:bg-[#1E2E5D]/50'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>PRODUCT SHOWCASE DEMO (1920×1080)</span>
            </button>

            <button
              onClick={() => setActiveTab('interactive-studio')}
              className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2 font-noto ${
                activeTab === 'interactive-studio'
                  ? 'bg-[#FACC15] text-[#060B19] shadow-lg shadow-yellow-500/20 scale-102'
                  : 'text-slate-300 hover:text-white hover:bg-[#1E2E5D]/50'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>SIMULATOR INTERAKTIF & WORKFLOW N8N</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PRODUCT SHOWCASE DEMO (1920 x 1080 MOTION GRAPHICS VIDEO) */}
        {activeTab === 'motion-video' && (
          <div id="section-motion-video" className="animate-fadeIn flex flex-col items-center">
            <MotionGraphicsVideoPlayer 
              onOpenGuide={() => setShowGuideModal(true)} 
            />
          </div>
        )}

        {/* TAB 2: INTERACTIVE STEP-BY-STEP SIMULATOR */}
        {activeTab === 'interactive-studio' && (
          <div className="animate-fadeIn space-y-8">
            
            {/* Interactive Dual Studio Layout: Smartphone Frame + Live n8n Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Simulated Smartphone with Telegram Bot */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-2 px-2 text-xs text-slate-400">
                  <span className="font-bold text-white uppercase flex items-center gap-1.5 font-noto">
                    <span className="w-2 h-2 rounded-full bg-[#FACC15]"></span>
                    LAYAR HP TELEGRAM OTENTIK
                  </span>
                  <span className="font-mono text-[11px] text-[#FACC15]">
                    TANPA TANGGAL · 100% PERSIS SCREENSHOT
                  </span>
                </div>

                {/* The Phone Device */}
                <PhoneFrame
                  bubbles={displayedBubbles}
                  activeBubbleIndex={activeBubbleIndex}
                  isBotTyping={isBotTyping}
                  isUserTyping={isUserTyping}
                  typingInputText={typingInputText}
                  soundEnabled={soundEnabled}
                  is3DTilt={is3DTilt}
                  onToggle3D={() => setIs3DTilt(!is3DTilt)}
                  onNextBubble={() => {
                    if (activeBubbleIndex < SEQUENTIAL_CHAT_BUBBLES.length - 1) {
                      setActiveBubbleIndex(activeBubbleIndex + 1);
                    }
                  }}
                  onPrevBubble={() => {
                    if (activeBubbleIndex > 0) {
                      setActiveBubbleIndex(activeBubbleIndex - 1);
                    }
                  }}
                  totalBubbles={SEQUENTIAL_CHAT_BUBBLES.length}
                />
              </div>

              {/* Right Column: Live Captions & Synced n8n Workflow Visualizer */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Live Subtitles & Explanatory Lower Third */}
                <CaptionsOverlay
                  currentScenario={currentScenario}
                  activeBubble={currentBubble}
                  visible={true}
                />

                {/* Live n8n Workflow Visualizer */}
                <div id="section-workflow">
                  <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-noto">
                    <span className="font-bold text-white uppercase flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                      VISUALISASI WORKFLOW N8N (LIVE SYNC BUBBLE #{activeBubbleIndex + 1})
                    </span>
                    <span className="font-mono text-[11px] text-[#FACC15]">
                      NODE: {currentBubble.activeN8nNodeId}
                    </span>
                  </div>

                  <N8nCanvas
                    activeNodeId={currentBubble.activeN8nNodeId}
                  />
                </div>

              </div>

            </div>
          </div>
        )}

        {/* 6 Real Telegram Screenshots Gallery */}
        <TelegramScreenshotsGallery
          onLoadScenarioToPhone={(scenarioId) => {
            const bIdx = SEQUENTIAL_CHAT_BUBBLES.findIndex((b) => b.scenarioId === scenarioId);
            if (bIdx >= 0) {
              setActiveBubbleIndex(bIdx);
              setActiveTab('interactive-studio');
              scrollToSection('section-demo');
            }
          }}
        />

        {/* 4 Circular Scenarios Detailed Section */}
        <div id="section-scenarios">
          <ScenarioCardsSection
            onSelectScenario={(idx) => {
              const targetScenarioId = SCENARIO_STEPS[idx].id;
              const bIdx = SEQUENTIAL_CHAT_BUBBLES.findIndex((b) => b.scenarioId === targetScenarioId);
              if (bIdx >= 0) {
                setActiveBubbleIndex(bIdx);
                setActiveTab('interactive-studio');
                scrollToSection('section-demo');
              }
            }}
            currentIndex={Math.max(0, currentScenarioIndex)}
          />
        </div>

        {/* Macro Impact Statistics & Comparison Section */}
        <div id="section-impact">
          <ImpactStatsSection />
        </div>

      </main>

      {/* Script & CapCut/Canva Production Guide Modal */}
      <CapcutCanvaGuide
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />

      {/* Quiet Footer following Constitution */}
      <footer className="mt-16 border-t border-[#1E2E5D] bg-[#040814] py-8 px-6 text-xs text-slate-400 font-noto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-white uppercase">TECHLOOP</span>
            <span>·</span>
            <span>TIM STARNIGHT (SMAN 15 JAKARTA)</span>
            <span>·</span>
            <span className="text-[#FACC15] font-bold">CITE UP 2026</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>CANVAS: 920 × 1080</span>
            <span>·</span>
            <span>DURASI: 1 - 1.5 MENIT</span>
            <span>·</span>
            <span className="text-[#FACC15] font-bold">NOTO SANS KR</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
