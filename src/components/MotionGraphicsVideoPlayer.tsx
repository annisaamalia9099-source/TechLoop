import React, { useState, useEffect, useRef } from 'react';
import { DEFAULT_VIDEO_CONTENT, TECHLOOP_LOGO, N8N_WORKFLOW_NODES } from '../data/scenariosData';
import { EditableVideoContent } from '../types';
import { 
  ambientMusic, 
  speakNarration, 
  stopNarration, 
  playBubbleSendSound, 
  playBubbleReceiveSound,
  playSwooshTransition,
  playSuccessChime,
  playClickBeep
} from '../utils/audio';
import { PhoneFrame } from './PhoneFrame';
import { SentenceEditorModal } from './SentenceEditorModal';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Video, 
  Square, 
  Sparkles, 
  CheckCircle, 
  Maximize2, 
  Minimize2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  TrendingUp,
  Cpu,
  Wrench,
  Recycle,
  Share2,
  Leaf,
  ShieldCheck,
  MousePointer,
  Zap,
  Edit3,
  Sliders,
  Send,
  Eye,
  Camera,
  Activity,
  Layers,
  Check,
  Rotate3d,
  Gauge
} from 'lucide-react';

interface MotionGraphicsVideoPlayerProps {
  onOpenGuide?: () => void;
}

export const MotionGraphicsVideoPlayer: React.FC<MotionGraphicsVideoPlayerProps> = ({
  onOpenGuide,
}) => {
  // Video Phases matching the product showcase demo:
  // 'intro' (0-12s) -> Kinetic typography & 4 proven circular pillars
  // 'reveal' (12-20s) -> Logo reveal & n8n workflow pipeline
  // 'chat-demo' (20-66s) -> Authentic Telegram smartphone interaction (4 scenarios)
  // 'orbit' (66-76s) -> Concentric orbital circular ecosystem
  // 'closing' (76-86s) -> TechLoop instant circular decision finale
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'reveal' | 'chat-demo' | 'orbit' | 'closing'>('intro');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const totalDurationSec = 86; // ~1.4 menit (1 - 1.5 menit)

  // Interactive Playback Speed
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Editable video content state loaded from localStorage or default
  const [videoContent, setVideoContent] = useState<EditableVideoContent>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('techloop_video_content_v2');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // Fallback to default
      }
    }
    return DEFAULT_VIDEO_CONTENT;
  });

  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  // In-Canvas Interactive Quick-Edit Mode
  const [isLiveEditMode, setIsLiveEditMode] = useState<boolean>(false);
  const [inlineEditKey, setInlineEditKey] = useState<string | null>(null);
  const [inlineEditText, setInlineEditText] = useState<string>('');

  // Bubble-by-bubble chat state
  const [activeBubbleIndex, setActiveBubbleIndex] = useState<number>(0);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [isUserTyping, setIsUserTyping] = useState<boolean>(false);
  const [typingInputText, setTypingInputText] = useState<string>('');

  // Audio state - Voiceover OFF by default as user requested ("suara AI nya kaku dan patah patah")
  const [isBgmActive, setIsBgmActive] = useState<boolean>(true);
  const [isVoiceoverActive, setIsVoiceoverActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [bgmVolume, setBgmVolume] = useState<number>(0.14);

  // Interactive Camera Viewport & 3D Tilt
  const [isScaleToFit, setIsScaleToFit] = useState<boolean>(true);
  const [cameraMode, setCameraMode] = useState<'widescreen' | 'zoom-phone' | 'split-n8n'>('widescreen');
  const [is3DParallax, setIs3DParallax] = useState<boolean>(true);
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Interactive Sandbox Custom Chat Input
  const [sandboxInput, setSandboxInput] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Parallax mouse move handler on the 1920x1080 canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!is3DParallax || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: x * 6, y: -y * 6 }); // Smooth subtle tilt angle
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  // Phase & Bubble Synchronizer based on currentTimeSec
  useEffect(() => {
    // 00:00 - 00:12 -> INTRO
    // 00:12 - 00:20 -> WORKFLOW PIPELINE
    // 00:20 - 00:66 -> DEMO CHAT TELEGRAM
    // 00:66 - 00:76 -> ORBITAL ECOSYSTEM
    // 00:76 - 00:86 -> CLOSING & SLOGAN
    if (currentTimeSec < 12) {
      if (currentPhase !== 'intro') {
        setCurrentPhase('intro');
        playSwooshTransition();
        if (isVoiceoverActive) speakNarration(videoContent.introVoiceover, 'id-ID');
      }
    } else if (currentTimeSec >= 12 && currentTimeSec < 20) {
      if (currentPhase !== 'reveal') {
        setCurrentPhase('reveal');
        playSwooshTransition();
        if (isVoiceoverActive) speakNarration(videoContent.workflowVoiceover, 'id-ID');
      }
    } else if (currentTimeSec >= 20 && currentTimeSec < 66) {
      if (currentPhase !== 'chat-demo') {
        setCurrentPhase('chat-demo');
        playSwooshTransition();
      }

      // Map 46s across 11 bubbles (~4.1s per bubble)
      const chatElapsed = currentTimeSec - 20;
      const targetBubble = Math.min(
        videoContent.bubbles.length - 1,
        Math.floor(chatElapsed / 4.1)
      );

      if (targetBubble !== activeBubbleIndex) {
        setActiveBubbleIndex(targetBubble);
        const b = videoContent.bubbles[targetBubble];

        // Trigger sounds
        if (soundEnabled) {
          if (b.sender === 'user') {
            setIsUserTyping(true);
            setTypingInputText(b.text.slice(0, 24));
            setTimeout(() => {
              setIsUserTyping(false);
              setTypingInputText('');
              playBubbleSendSound();
            }, 500);
          } else {
            setIsBotTyping(true);
            setTimeout(() => {
              setIsBotTyping(false);
              playBubbleReceiveSound();
              if (b.text.includes('REUSE') || b.text.includes('REFURBISHMENT') || b.text.includes('COMPONENT') || b.text.includes('RECYCLING')) {
                playSuccessChime();
              }
            }, 900);
          }
        }

        // Trigger voiceover for the bubble only if explicitly enabled
        if (isVoiceoverActive) {
          speakNarration(b.narrationText, 'id-ID');
        }
      }
    } else if (currentTimeSec >= 66 && currentTimeSec < 76) {
      if (currentPhase !== 'orbit') {
        setCurrentPhase('orbit');
        playSwooshTransition();
        if (isVoiceoverActive) speakNarration(videoContent.orbitVoiceover, 'id-ID');
      }
    } else {
      if (currentPhase !== 'closing') {
        setCurrentPhase('closing');
        playSuccessChime();
        if (isVoiceoverActive) speakNarration(videoContent.closingVoiceover, 'id-ID');
      }
    }
  }, [currentTimeSec, currentPhase, activeBubbleIndex, soundEnabled, isVoiceoverActive, videoContent]);

  // Main playback loop with adjustable speed
  useEffect(() => {
    let interval: number | null = null;

    if (isPlaying) {
      if (isBgmActive) ambientMusic.start();

      const tickIntervalMs = Math.round(1000 / playbackSpeed);

      interval = window.setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev + 1 >= totalDurationSec) {
            setIsPlaying(false);
            return totalDurationSec;
          }
          return prev + 1;
        });
      }, tickIntervalMs);
    } else {
      ambientMusic.stop();
      stopNarration();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isBgmActive, playbackSpeed]);

  const handleTogglePlay = () => {
    playClickBeep();
    if (!isPlaying) {
      setIsPlaying(true);
      if (currentTimeSec < 12 && isVoiceoverActive) {
        speakNarration(videoContent.introVoiceover, 'id-ID');
      }
    } else {
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    playClickBeep();
    setIsPlaying(false);
    setCurrentTimeSec(0);
    setCurrentPhase('intro');
    setActiveBubbleIndex(0);
    setIsBotTyping(false);
    setIsUserTyping(false);
    setTypingInputText('');
    stopNarration();
    ambientMusic.stop();
  };

  const handleJumpToPhase = (phase: 'intro' | 'reveal' | 'chat-demo' | 'orbit' | 'closing') => {
    playSwooshTransition();
    if (phase === 'intro') {
      setCurrentTimeSec(0);
      setCurrentPhase('intro');
    } else if (phase === 'reveal') {
      setCurrentTimeSec(12);
      setCurrentPhase('reveal');
    } else if (phase === 'chat-demo') {
      setCurrentTimeSec(20);
      setCurrentPhase('chat-demo');
    } else if (phase === 'orbit') {
      setCurrentTimeSec(66);
      setCurrentPhase('orbit');
    } else {
      setCurrentTimeSec(76);
      setCurrentPhase('closing');
    }
  };

  // Direct Jump to a specific circular scenario inside the chat
  const handleJumpToScenario = (scenarioKey: 'reuse' | 'repair' | 'component' | 'recycle') => {
    playSwooshTransition();
    setCurrentPhase('chat-demo');
    let targetIndex = 3; // REUSE default
    if (scenarioKey === 'reuse') targetIndex = 3;
    else if (scenarioKey === 'repair') targetIndex = 5;
    else if (scenarioKey === 'component') targetIndex = 7;
    else if (scenarioKey === 'recycle') targetIndex = 9;

    setActiveBubbleIndex(targetIndex);
    setCurrentTimeSec(20 + Math.floor(targetIndex * 4.1));
  };

  // Interactive Live Chat Sandbox Handler
  const handleTriggerCustomChat = (customText: string, expectedPillar: 'REUSE' | 'REFURBISHMENT' | 'COMPONENT RECOVERY' | 'RECYCLING') => {
    playClickBeep();
    setCurrentPhase('chat-demo');
    setIsUserTyping(true);
    setTypingInputText(customText.slice(0, 30));

    setTimeout(() => {
      setIsUserTyping(false);
      setTypingInputText('');
      playBubbleSendSound();

      // Find or jump to corresponding bubble
      if (expectedPillar === 'REUSE') handleJumpToScenario('reuse');
      else if (expectedPillar === 'REFURBISHMENT') handleJumpToScenario('repair');
      else if (expectedPillar === 'COMPONENT RECOVERY') handleJumpToScenario('component');
      else handleJumpToScenario('recycle');
    }, 600);
  };

  // Save edited content
  const handleSaveEditedContent = (updated: EditableVideoContent) => {
    setVideoContent(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('techloop_video_content_v2', JSON.stringify(updated));
    }
  };

  const handleResetToDefaultContent = () => {
    setVideoContent(DEFAULT_VIDEO_CONTENT);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('techloop_video_content_v2');
    }
  };

  // In-canvas quick edit trigger
  const handleStartInlineEdit = (key: string, currentVal: string) => {
    if (!isLiveEditMode) return;
    playClickBeep();
    setInlineEditKey(key);
    setInlineEditText(currentVal);
  };

  const handleSaveInlineEdit = () => {
    if (!inlineEditKey) return;
    playSuccessChime();

    setVideoContent((prev) => {
      const updated = { ...prev };
      if (inlineEditKey === 'brandName') updated.brandName = inlineEditText;
      else if (inlineEditKey === 'introBadge') updated.introBadge = inlineEditText;
      else if (inlineEditKey === 'introHeadline1') updated.introHeadline1 = inlineEditText;
      else if (inlineEditKey === 'introHeadline2') updated.introHeadline2 = inlineEditText;
      else if (inlineEditKey === 'introSubtitle') updated.introSubtitle = inlineEditText;
      else if (inlineEditKey === 'workflowTitle') updated.workflowTitle = inlineEditText;
      else if (inlineEditKey === 'workflowSubtitle') updated.workflowSubtitle = inlineEditText;
      else if (inlineEditKey === 'orbitTitle1') updated.orbitTitle1 = inlineEditText;
      else if (inlineEditKey === 'orbitTitle2') updated.orbitTitle2 = inlineEditText;
      else if (inlineEditKey === 'closingHeadline1') updated.closingHeadline1 = inlineEditText;
      else if (inlineEditKey === 'closingHeadline2') updated.closingHeadline2 = inlineEditText;
      else if (inlineEditKey === 'closingSubtitle') updated.closingSubtitle = inlineEditText;

      if (typeof window !== 'undefined') {
        localStorage.setItem('techloop_video_content_v2', JSON.stringify(updated));
      }
      return updated;
    });

    setInlineEditKey(null);
  };

  // Screen recorder at full 1920 x 1080
  const handleStartRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        alert('Browser tidak mendukung perekaman layar otomatis.');
        return;
      }
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        audio: true,
      });

      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TechLoop_Product_Showcase_Demo_1920x1080_${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      handleReset();
      setIsPlaying(true);
    } catch (err) {
      console.error('Error starting screen recording:', err);
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const displayedBubbles = videoContent.bubbles.slice(0, activeBubbleIndex + 1).map((b, idx) => ({
    id: b.id,
    bubbleIndex: idx,
    scenarioId: (idx <= 2 ? 'intro' : idx <= 4 ? 'reuse' : idx <= 6 ? 'repair' : idx <= 8 ? 'component' : 'recycle') as any,
    scenarioTitle: b.scenarioTitle,
    category: b.category as any,
    sender: b.sender,
    text: b.text,
    timestamp: b.timestamp,
    activeN8nNodeId: b.sender === 'user' ? 'n8n-gemini-vision' : 'n8n-decision-router',
    narrationText: b.narrationText,
    keyTakeaway: b.keyTakeaway,
  }));

  const currentBubble = videoContent.bubbles[activeBubbleIndex] || videoContent.bubbles[0];

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-full font-noto select-none">
      
      {/* =========================================================================
          TOP INTERACTIVE DIRECTOR & VIDEO EDITOR CONTROLS (TIDAK BORING!)
          ========================================================================= */}
      <div className="w-full max-w-[1920px] bg-[#081026] border border-[#1E2E5D] rounded-3xl p-4 mb-4 shadow-2xl flex flex-col gap-3 text-white">
        
        {/* Main Row: Title, Speed Selector, Live Edit Mode, Full Editor, 3D Parallax */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-[#FACC15] animate-ping" />
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-wider uppercase text-white font-noto flex items-center gap-2">
                <span>INTERACTIVE PRODUCT SHOWCASE DEMO</span>
                <span className="text-[10px] bg-[#FACC15] text-[#060B19] font-black px-2 py-0.5 rounded font-mono">
                  1920 × 1080 FULL HD
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-mono">
                  SUTRADARA INTERAKTIF
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                TechLoop · SMAN 15 Jakarta · CITE UP 2026 · Pengeditan Kalimat Interaktif & Navigasi Dinamis
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Speed Multiplier */}
            <div className="flex items-center bg-[#050B18] border border-[#1E2E5D] rounded-xl p-1 gap-1 text-[11px]">
              <span className="text-slate-400 px-1 font-mono flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-[#FACC15]" />
              </span>
              {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => {
                    playClickBeep();
                    setPlaybackSpeed(speed);
                  }}
                  className={`px-2 py-0.5 rounded-lg font-bold font-mono transition-all ${
                    playbackSpeed === speed
                      ? 'bg-[#FACC15] text-[#060B19] shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* 3D Mouse Parallax Toggle */}
            <button
              onClick={() => {
                playClickBeep();
                setIs3DParallax(!is3DParallax);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border font-mono ${
                is3DParallax
                  ? 'bg-purple-950/80 text-purple-300 border-purple-500/60 shadow-xs'
                  : 'bg-[#050B18] text-slate-400 border-[#1E2E5D] hover:text-white'
              }`}
              title="Gerakkan kursor di atas kanvas untuk rotasi perspektif 3D futuristik"
            >
              <Rotate3d className="w-3.5 h-3.5" />
              <span>{is3DParallax ? '3D TILT: ON' : '3D TILT: OFF'}</span>
            </button>

            {/* Live In-Canvas Inline Edit Mode Button */}
            <button
              onClick={() => {
                playClickBeep();
                setIsLiveEditMode(!isLiveEditMode);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all border font-noto tracking-wider uppercase ${
                isLiveEditMode
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-md ring-2 ring-rose-500/30'
                  : 'bg-[#050B18] text-amber-400 border-amber-500/40 hover:bg-[#1E2E5D]'
              }`}
              title="Klik langsung teks mana saja di video untuk mengedit kalimat secara instan"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isLiveEditMode ? 'KLIK TEKS UNTUK EDIT' : 'MODE EDIT LANGSUNG'}</span>
            </button>

            {/* Full Script Sentence Editor Modal Button */}
            <button
              onClick={() => {
                playClickBeep();
                setIsEditorOpen(true);
              }}
              className="px-3.5 py-1.5 bg-[#1E2E5D] hover:bg-[#2b417e] text-[#FACC15] font-black rounded-xl text-xs flex items-center gap-1.5 transition-all border border-[#FACC15]/40 shadow-sm uppercase tracking-wider font-noto"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>EDIT SEMUA KALIMAT</span>
            </button>

            {/* Screen Recorder */}
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="px-4 py-1.5 bg-[#FACC15] hover:bg-yellow-400 text-[#060B19] font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 uppercase tracking-wider font-noto"
              >
                <Video className="w-4 h-4" />
                <span>REKAM VIDEO FULL HD</span>
              </button>
            ) : (
              <button
                onClick={handleStopRecording}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 uppercase tracking-wider font-noto animate-pulse"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>STOP & SIMPAN (.WEBM)</span>
              </button>
            )}

            {/* Scale toggle */}
            <button
              onClick={() => setIsScaleToFit(!isScaleToFit)}
              className="p-2 bg-[#050B18] hover:bg-[#1E2E5D] rounded-xl text-slate-300 hover:text-white border border-[#1E2E5D] text-xs font-semibold"
              title="Toggle Fit to Screen / 100% Size"
            >
              {isScaleToFit ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* Second Row: Interactive Director Timeline Jump Ribbon with 9 Milestones */}
        <div className="pt-2 border-t border-[#1E2E5D]/60 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-noto">
          <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0 font-mono flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
            LOMPAT KE:
          </span>

          <button
            onClick={() => handleJumpToPhase('intro')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all shrink-0 flex items-center gap-1.5 ${
              currentPhase === 'intro' ? 'bg-[#FACC15] text-[#060B19] shadow-md' : 'bg-[#050B18] text-slate-300 hover:text-white border border-[#1E2E5D]'
            }`}
          >
            <span>01. INTRO MASALAH</span>
            <span className="text-[10px] font-mono opacity-80">(0s)</span>
          </button>

          <button
            onClick={() => handleJumpToPhase('reveal')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all shrink-0 flex items-center gap-1.5 ${
              currentPhase === 'reveal' ? 'bg-[#FACC15] text-[#060B19] shadow-md' : 'bg-[#050B18] text-slate-300 hover:text-white border border-[#1E2E5D]'
            }`}
          >
            <span>02. WORKFLOW N8N</span>
            <span className="text-[10px] font-mono opacity-80">(12s)</span>
          </button>

          <button
            onClick={() => handleJumpToPhase('chat-demo')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all shrink-0 flex items-center gap-1.5 ${
              currentPhase === 'chat-demo' && activeBubbleIndex <= 2 ? 'bg-[#FACC15] text-[#060B19] shadow-md' : 'bg-[#050B18] text-slate-300 hover:text-white border border-[#1E2E5D]'
            }`}
          >
            <span>03. INISIALISASI CHAT</span>
            <span className="text-[10px] font-mono opacity-80">(20s)</span>
          </button>

          {/* 4 Interactive Circular Pathway Jump Buttons */}
          <button
            onClick={() => handleJumpToScenario('reuse')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all shrink-0 flex items-center gap-1.5 border ${
              activeBubbleIndex >= 3 && activeBubbleIndex <= 4
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black'
                : 'bg-[#050B18] text-emerald-400 border-emerald-500/40 hover:bg-emerald-950/40'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>04. REUSE (32s)</span>
          </button>

          <button
            onClick={() => handleJumpToScenario('repair')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all shrink-0 flex items-center gap-1.5 border ${
              activeBubbleIndex >= 5 && activeBubbleIndex <= 6
                ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-md font-black'
                : 'bg-[#050B18] text-yellow-400 border-yellow-500/40 hover:bg-yellow-950/40'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>05. REFURBISH (41s)</span>
          </button>

          <button
            onClick={() => handleJumpToScenario('component')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all shrink-0 flex items-center gap-1.5 border ${
              activeBubbleIndex >= 7 && activeBubbleIndex <= 8
                ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-md font-black'
                : 'bg-[#050B18] text-cyan-400 border-cyan-500/40 hover:bg-cyan-950/40'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>06. COMPONENT (49s)</span>
          </button>

          <button
            onClick={() => handleJumpToScenario('recycle')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all shrink-0 flex items-center gap-1.5 border ${
              activeBubbleIndex >= 9
                ? 'bg-purple-400 text-slate-950 border-purple-300 shadow-md font-black'
                : 'bg-[#050B18] text-purple-400 border-purple-500/40 hover:bg-purple-950/40'
            }`}
          >
            <Recycle className="w-3.5 h-3.5" />
            <span>07. RECYCLING (58s)</span>
          </button>

          <button
            onClick={() => handleJumpToPhase('orbit')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all shrink-0 flex items-center gap-1.5 ${
              currentPhase === 'orbit' ? 'bg-[#FACC15] text-[#060B19] shadow-md' : 'bg-[#050B18] text-slate-300 hover:text-white border border-[#1E2E5D]'
            }`}
          >
            <span>08. ORBIT (66s)</span>
          </button>

          <button
            onClick={() => handleJumpToPhase('closing')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all shrink-0 flex items-center gap-1.5 ${
              currentPhase === 'closing' ? 'bg-[#FACC15] text-[#060B19] shadow-md' : 'bg-[#050B18] text-slate-300 hover:text-white border border-[#1E2E5D]'
            }`}
          >
            <span>09. CLOSING (76s)</span>
          </button>
        </div>

      </div>

      {/* =========================================================================
          MAIN 1920 x 1080 WIDESCREEN CANVAS CONTAINER WITH 3D PERSPECTIVE PARALLAX
          ========================================================================= */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative bg-[#060B19] border-2 border-[#1E2E5D] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between transition-transform duration-200 ease-out ${
          isScaleToFit ? 'w-full max-w-[1920px] aspect-[1920/1080]' : 'w-[1920px] h-[1080px]'
        }`}
        style={{
          boxShadow: '0 0 100px rgba(6, 11, 25, 0.98), 0 0 50px rgba(250, 204, 21, 0.18)',
          transform: is3DParallax
            ? `perspective(1400px) rotateX(${mouseTilt.y}deg) rotateY(${mouseTilt.x}deg)`
            : 'none',
        }}
      >
        
        {/* Navy & Yellow Ambient Gradient Flares */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-[#FACC15]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[550px] h-[550px] bg-[#2AABEE]/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#0A132C]/70 rounded-full blur-3xl pointer-events-none" />

        {/* Motion Graphic High-Tech Grid Lines */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #FACC15 1px, transparent 1px), linear-gradient(to bottom, #1E2E5D 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />

        {/* Top Floating Alert if Live Edit Mode is Active */}
        {isLiveEditMode && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-amber-500/90 text-slate-950 font-black text-xs px-4 py-1 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
            <Edit3 className="w-3.5 h-3.5" />
            <span>MODE EDIT LANGSUNG AKTIF: Klik teks apa pun pada layar untuk mengubah kalimatnya</span>
          </div>
        )}

        {/* TOP MOTION GRAPHICS TITLE BAR */}
        <div className="relative z-20 px-8 pt-6 pb-3 flex items-center justify-between border-b border-[#1E2E5D]/60 bg-[#060B19]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-lg px-3 py-1 flex items-center justify-center border border-yellow-400 shadow-md">
              <img src={TECHLOOP_LOGO} alt="TechLoop" className="h-7 w-auto object-contain" />
            </div>
            <div>
              <span className="text-[11px] font-black tracking-widest text-[#FACC15] uppercase block font-noto">
                CIRCULAR ECONOMY E-WASTE PLATFORM
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase font-noto flex items-center gap-2">
                <span>PRODUCT SHOWCASE DEMO</span>
                <span 
                  onClick={() => handleStartInlineEdit('brandName', videoContent.brandName)}
                  className={`text-xs bg-[#FACC15] text-[#060B19] font-black px-2 py-0.5 rounded cursor-pointer transition-all ${
                    isLiveEditMode ? 'ring-2 ring-rose-500 hover:scale-105' : ''
                  }`}
                  title={isLiveEditMode ? 'Klik untuk edit nama brand' : ''}
                >
                  {videoContent.brandName.toUpperCase()}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 font-noto text-right">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                {videoContent.teamCredit}
              </span>
              <span className="text-xs font-bold text-[#FACC15] font-mono">
                1920 × 1080 FULL HD
              </span>
            </div>
          </div>
        </div>

        {/* CENTRAL VIEWPORT (1920x1080 16:9 RATIO) */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-6 overflow-hidden">
          
          {/* =========================================================================
              PHASE 1: KINETIC PROBLEM INTRO (0 - 12s)
              Clean, verified e-waste overview with 4 authentic circular pillars
              ========================================================================= */}
          {currentPhase === 'intro' && (
            <div className="w-full max-w-4xl flex flex-col items-center text-center space-y-6 animate-springSlideUp">
              
              {/* Animated Glowing Yellow Badge */}
              <div 
                onClick={() => handleStartInlineEdit('introBadge', videoContent.introBadge)}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A132C] border-2 border-[#FACC15] shadow-lg shadow-yellow-500/20 cursor-pointer transition-all ${
                  isLiveEditMode ? 'ring-2 ring-rose-500 hover:scale-105' : ''
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#FACC15]" />
                <span className="text-xs font-black tracking-widest text-[#FACC15] uppercase font-noto">
                  {videoContent.introBadge}
                </span>
              </div>

              {/* Kinetic Typography with Highlighted Glowing Words */}
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase font-noto">
                <span 
                  onClick={() => handleStartInlineEdit('introHeadline1', videoContent.introHeadline1)}
                  className={isLiveEditMode ? 'cursor-pointer hover:underline decoration-amber-400' : ''}
                >
                  {videoContent.introHeadline1}
                </span> <br />
                <span 
                  onClick={() => handleStartInlineEdit('introHeadline2', videoContent.introHeadline2)}
                  className={`text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-400 to-[#FACC15] drop-shadow-[0_0_25px_rgba(244,63,94,0.4)] ${
                    isLiveEditMode ? 'cursor-pointer hover:underline decoration-yellow-400' : ''
                  }`}
                >
                  {videoContent.introHeadline2}
                </span>
              </h2>

              <p 
                onClick={() => handleStartInlineEdit('introSubtitle', videoContent.introSubtitle)}
                className={`text-sm sm:text-base text-slate-300 max-w-2xl font-medium leading-relaxed font-noto uppercase ${
                  isLiveEditMode ? 'cursor-pointer p-1 rounded bg-[#0A132C]/60 hover:ring-2 hover:ring-rose-500' : ''
                }`}
              >
                {videoContent.introSubtitle}
              </p>

              {/* 4 Authentic Circular Pillars (100% verified from the research paper) */}
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div 
                  onClick={() => handleJumpToScenario('reuse')}
                  className="bg-[#0A132C]/90 border border-emerald-500/50 hover:border-emerald-400 rounded-2xl p-4 text-center shadow-xl cursor-pointer hover:scale-103 transition-transform"
                >
                  <Leaf className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <span className="text-xs font-black text-white block uppercase">01. REUSE</span>
                  <span className="text-[11px] text-emerald-300 block uppercase font-bold mt-0.5">PAKAI ULANG NORMAL</span>
                  <span className="text-[9.5px] text-slate-400 block mt-1">Perangkat masih berfungsi</span>
                </div>

                <div 
                  onClick={() => handleJumpToScenario('repair')}
                  className="bg-[#0A132C]/90 border border-yellow-500/50 hover:border-yellow-400 rounded-2xl p-4 text-center shadow-xl cursor-pointer hover:scale-103 transition-transform"
                >
                  <Wrench className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <span className="text-xs font-black text-white block uppercase">02. REFURBISH</span>
                  <span className="text-[11px] text-yellow-300 block uppercase font-bold mt-0.5">PERBAIKAN RINGAN</span>
                  <span className="text-[9.5px] text-slate-400 block mt-1">Masuk servis sebelum dipakai</span>
                </div>

                <div 
                  onClick={() => handleJumpToScenario('component')}
                  className="bg-[#0A132C]/90 border border-cyan-500/50 hover:border-cyan-400 rounded-2xl p-4 text-center shadow-xl cursor-pointer hover:scale-103 transition-transform"
                >
                  <Cpu className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <span className="text-xs font-black text-white block uppercase">03. COMPONENT</span>
                  <span className="text-[11px] text-cyan-300 block uppercase font-bold mt-0.5">PANEN SUKU CADANG</span>
                  <span className="text-[9.5px] text-slate-400 block mt-1">Komponen bernilai dipisahkan</span>
                </div>

                <div 
                  onClick={() => handleJumpToScenario('recycle')}
                  className="bg-[#0A132C]/90 border border-purple-500/50 hover:border-purple-400 rounded-2xl p-4 text-center shadow-xl cursor-pointer hover:scale-103 transition-transform"
                >
                  <Recycle className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <span className="text-xs font-black text-white block uppercase">04. RECYCLING</span>
                  <span className="text-[11px] text-purple-300 block uppercase font-bold mt-0.5">DAUR ULANG MATERIAL</span>
                  <span className="text-[9.5px] text-slate-400 block mt-1">Peleburan resmi nol-sampah</span>
                </div>
              </div>

              {/* Quick Launch Button */}
              <button
                onClick={() => handleJumpToPhase('reveal')}
                className="mt-4 px-6 py-2.5 bg-[#FACC15] hover:bg-yellow-300 text-[#060B19] font-black rounded-xl text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 shadow-xl shadow-yellow-500/20 active:scale-95 transition-all font-noto"
              >
                <span>LIHAT ARSITEKTUR WORKFLOW N8N</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          )}

          {/* =========================================================================
              PHASE 2: N8N WORKFLOW AUTOMATION ARCHITECTURE (12 - 20s)
              100% Verified Logic (No fake stats, only actual node stages & rules)
              ========================================================================= */}
          {currentPhase === 'reveal' && (
            <div className="w-full max-w-5xl flex flex-col items-center space-y-6 animate-springSlideUp">
              
              <div className="relative flex items-center justify-center py-2">
                <div className="w-24 h-24 rounded-2xl bg-[#0A132C] border-2 border-[#FACC15] p-2 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(250,204,21,0.3)] z-10">
                  <img src={TECHLOOP_LOGO} alt={videoContent.brandName} className="h-8 w-auto object-contain" />
                  <span className="text-[9px] font-black text-[#FACC15] font-mono tracking-widest mt-1">
                    {videoContent.brandName.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <h3 
                  onClick={() => handleStartInlineEdit('workflowTitle', videoContent.workflowTitle)}
                  className={`text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-noto ${
                    isLiveEditMode ? 'cursor-pointer hover:underline decoration-yellow-400' : ''
                  }`}
                >
                  {videoContent.workflowTitle}
                </h3>
                <p 
                  onClick={() => handleStartInlineEdit('workflowSubtitle', videoContent.workflowSubtitle)}
                  className={`text-xs sm:text-sm text-slate-300 font-medium uppercase font-noto mt-1 max-w-2xl ${
                    isLiveEditMode ? 'cursor-pointer p-1 rounded bg-[#0A132C]/60 hover:ring-2 hover:ring-rose-500' : ''
                  }`}
                >
                  {videoContent.workflowSubtitle}
                </p>
              </div>

              {/* Clean Widescreen Pipeline Architecture (100% verified from essay) */}
              <div className="w-full bg-[#081026] border-2 border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                
                <div className="flex items-center justify-between pb-3 border-b border-[#1E2E5D] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-white uppercase font-noto">n8n Automated Decision Pipeline</span>
                  </div>
                  <span className="font-mono text-[#FACC15] text-[11px]">RULE-BASED + AI CLASSIFICATION</span>
                </div>

                {/* 4 Pipeline Stages */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 my-4">
                  <div className="bg-[#050B18] p-4 rounded-xl border border-sky-500/30">
                    <span className="text-[10px] text-sky-400 uppercase block font-bold">TAHAP 1: INPUT</span>
                    <span className="text-sm font-bold text-white block mt-1">Telegram Webhook</span>
                    <span className="text-[11px] text-slate-400 block mt-1">Menerima deskripsi kondisi laptop dari user</span>
                  </div>

                  <div className="bg-[#050B18] p-4 rounded-xl border border-purple-500/30">
                    <span className="text-[10px] text-purple-400 uppercase block font-bold">TAHAP 2: DIAGNOSA</span>
                    <span className="text-sm font-bold text-white block mt-1">AI Diagnostic Agent</span>
                    <span className="text-[11px] text-slate-400 block mt-1">Mengekstrak kelayakan & fungsional perangkat</span>
                  </div>

                  <div className="bg-[#050B18] p-4 rounded-xl border border-yellow-500/30">
                    <span className="text-[10px] text-[#FACC15] uppercase block font-bold">TAHAP 3: KEPUTUSAN</span>
                    <span className="text-sm font-bold text-white block mt-1">Rule-Based Switch</span>
                    <span className="text-[11px] text-slate-400 block mt-1">Memetakan ke 4 jalur: Reuse, Refurb, Component, Recycle</span>
                  </div>

                  <div className="bg-[#050B18] p-4 rounded-xl border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-400 uppercase block font-bold">TAHAP 4: OUTPUT</span>
                    <span className="text-sm font-bold text-white block mt-1">Telegram Auto-Reply</span>
                    <span className="text-[11px] text-slate-400 block mt-1">Mengirimkan pesan rekomendasi sirkular resmi</span>
                  </div>
                </div>

                <div className="relative h-10 w-full bg-[#050B18]/70 rounded-xl border border-[#1E2E5D] flex items-center justify-between px-4 text-xs">
                  <span className="text-slate-400 font-mono">STATUS PENGUJIAN PROTOTIPE:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" /> 4 DARI 4 SKENARIO REKOMENDASI TERVERIFIKASI KONSISTEN
                  </span>
                </div>
              </div>

              {/* Jump Button */}
              <button
                onClick={() => handleJumpToPhase('chat-demo')}
                className="px-6 py-2 bg-[#FACC15] hover:bg-yellow-300 text-[#060B19] font-black rounded-xl text-xs uppercase flex items-center gap-2 shadow-lg font-noto"
              >
                <span>BUKA DEMO CHAT TELEGRAM HP</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

            </div>
          )}

          {/* =========================================================================
              PHASE 3: DEMO CHAT TELEGRAM (20 - 66s)
              100% Persis Screenshot Tanpa Tanggal, Bubble 1-per-1 + Live Interactive Sandbox!
              ========================================================================= */}
          {currentPhase === 'chat-demo' && (
            <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-8 animate-springSlideUp">
              
              {/* Authentic Smartphone Frame */}
              <div className="shrink-0 flex justify-center">
                <PhoneFrame
                  bubbles={displayedBubbles}
                  activeBubbleIndex={activeBubbleIndex}
                  isBotTyping={isBotTyping}
                  isUserTyping={isUserTyping}
                  typingInputText={typingInputText}
                  soundEnabled={soundEnabled}
                  is3DTilt={true}
                  onToggle3D={() => {}}
                  totalBubbles={videoContent.bubbles.length}
                  botName={videoContent.brandName}
                />
              </div>

              {/* Side Motion Graphic Telemetry & Interactive Chat Sandbox */}
              <div className="flex-1 max-w-md flex flex-col gap-3 text-white">
                
                {/* Active Pillar Highlight Card */}
                <div className="bg-[#081026] border-2 border-[#FACC15] rounded-2xl p-4 shadow-2xl relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-[#FACC15]/15 rounded-full blur-xl pointer-events-none" />

                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black tracking-widest text-[#FACC15] uppercase block font-noto">
                      SKENARIO AKTIF ({activeBubbleIndex + 1} / {videoContent.bubbles.length})
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                      LIVE n8n EXECUTION
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white uppercase tracking-tight font-noto">
                    {currentBubble.scenarioTitle}
                  </h3>

                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-noto uppercase">
                    {currentBubble.keyTakeaway}
                  </p>

                  {/* Active n8n Node Badge */}
                  <div className="mt-3 pt-2.5 border-t border-[#1E2E5D] flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">ACTIVE n8n NODE:</span>
                    <span className="text-[#FACC15] font-bold bg-[#050B18] px-2 py-0.5 rounded border border-[#1E2E5D]">
                      {currentBubble.sender === 'user' ? 'n8n-gemini-vision' : 'n8n-decision-router'}
                    </span>
                  </div>
                </div>

                {/* INTERACTIVE LIVE CHAT SANDBOX: Uji 4 Skenario Sekali Klik */}
                <div className="bg-[#060B19]/95 border-2 border-cyan-500/40 rounded-2xl p-3.5 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#FACC15]" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-white font-noto">
                        UJI INTERAKTIF 4 SKENARIO CHAT:
                      </span>
                    </div>
                    <span className="text-[9.5px] font-mono text-slate-400">KLIK UNTUK TES</span>
                  </div>

                  {/* 4 Interactive Test Presets */}
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <button
                      onClick={() => handleTriggerCustomChat('Laptop masih berfungsi dengan baik dan bisa digunakan kembali', 'REUSE')}
                      className="p-2 rounded-xl bg-[#081026] hover:bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all group"
                    >
                      <div className="flex items-center gap-1 text-emerald-400 font-black text-[11px]">
                        <Leaf className="w-3 h-3" />
                        <span>01. TES REUSE</span>
                      </div>
                      <span className="text-[9.5px] text-slate-400 block line-clamp-1 mt-0.5">Laptop normal & berfungsi</span>
                    </button>

                    <button
                      onClick={() => handleTriggerCustomChat('Laptop rusak ringan, masih sebagian berfungsi dan bisa diperbaiki', 'REFURBISHMENT')}
                      className="p-2 rounded-xl bg-[#081026] hover:bg-yellow-950/40 border border-yellow-500/40 hover:border-yellow-400 text-left transition-all group"
                    >
                      <div className="flex items-center gap-1 text-yellow-400 font-black text-[11px]">
                        <Wrench className="w-3 h-3" />
                        <span>02. TES REFURBISH</span>
                      </div>
                      <span className="text-[9.5px] text-slate-400 block line-clamp-1 mt-0.5">Rusak ringan & servis</span>
                    </button>

                    <button
                      onClick={() => handleTriggerCustomChat('Laptop menyala sebagian, komponen bernilai bisa dipisahkan', 'COMPONENT RECOVERY')}
                      className="p-2 rounded-xl bg-[#081026] hover:bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all group"
                    >
                      <div className="flex items-center gap-1 text-cyan-400 font-black text-[11px]">
                        <Cpu className="w-3 h-3" />
                        <span>03. TES COMPONENT</span>
                      </div>
                      <span className="text-[9.5px] text-slate-400 block line-clamp-1 mt-0.5">Pemisahan suku cadang</span>
                    </button>

                    <button
                      onClick={() => handleTriggerCustomChat('Laptop rusak total tidak bisa diperbaiki, untuk didaur ulang', 'RECYCLING')}
                      className="p-2 rounded-xl bg-[#081026] hover:bg-purple-950/40 border border-purple-500/40 hover:border-purple-400 text-left transition-all group"
                    >
                      <div className="flex items-center gap-1 text-purple-400 font-black text-[11px]">
                        <Recycle className="w-3 h-3" />
                        <span>04. TES RECYCLE</span>
                      </div>
                      <span className="text-[9.5px] text-slate-400 block line-clamp-1 mt-0.5">Daur ulang resmi total</span>
                    </button>
                  </div>
                </div>

                {/* Next / Prev Stepper for Presenter */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playClickBeep();
                      if (activeBubbleIndex > 0) {
                        setCurrentTimeSec(Math.max(20, 20 + (activeBubbleIndex - 1) * 4.1));
                      }
                    }}
                    disabled={activeBubbleIndex <= 0}
                    className="flex-1 py-2 bg-[#081026] hover:bg-[#1E2E5D] disabled:opacity-30 text-white font-bold text-xs rounded-xl border border-[#1E2E5D] flex items-center justify-center gap-1 uppercase font-noto"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>BUBBLE SEBELUMNYA</span>
                  </button>

                  <button
                    onClick={() => {
                      playClickBeep();
                      if (activeBubbleIndex < videoContent.bubbles.length - 1) {
                        setCurrentTimeSec(20 + (activeBubbleIndex + 1) * 4.1);
                      } else {
                        handleJumpToPhase('orbit');
                      }
                    }}
                    className="flex-1 py-2 bg-[#FACC15] hover:bg-yellow-400 text-[#060B19] font-black text-xs rounded-xl flex items-center justify-center gap-1 shadow-md uppercase font-noto"
                  >
                    <span>BUBBLE BERIKUTNYA</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              PHASE 4: CONCENTRIC ORBIT ECOSYSTEM (66 - 76s)
              Exact Match to TikTok Reference Video (00:37): Concentric Orbit Rings & Dashed Lasers
              ========================================================================= */}
          {currentPhase === 'orbit' && (
            <div className="w-full max-w-4xl flex flex-col items-center text-center space-y-6 animate-springSlideUp">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A132C] border-2 border-[#FACC15] shadow-lg shadow-yellow-500/20">
                <Share2 className="w-4 h-4 text-[#FACC15]" />
                <span className="text-xs font-black tracking-widest text-[#FACC15] uppercase font-noto">
                  INTEGRASI EKOSISTEM SIRKULAR TERPADU
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-noto">
                <span 
                  onClick={() => handleStartInlineEdit('orbitTitle1', videoContent.orbitTitle1)}
                  className={isLiveEditMode ? 'cursor-pointer hover:underline decoration-yellow-400' : ''}
                >
                  {videoContent.orbitTitle1}
                </span> <br />
                <span 
                  onClick={() => handleStartInlineEdit('orbitTitle2', videoContent.orbitTitle2)}
                  className={`text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-[#FACC15] to-emerald-400 ${
                    isLiveEditMode ? 'cursor-pointer hover:underline decoration-emerald-400' : ''
                  }`}
                >
                  {videoContent.orbitTitle2}
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 uppercase font-medium">
                {videoContent.orbitSubtitle}
              </p>

              {/* Concentric Orbiting Rings Graphic */}
              <div className="relative w-[360px] h-[360px] flex items-center justify-center">
                
                {/* Orbit 1: Outer cyan ring */}
                <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-spin [animation-duration:30s]" />
                
                {/* Orbit 2: Middle yellow dashed ring */}
                <div className="absolute inset-8 rounded-full border-2 border-dashed border-[#FACC15]/40 animate-spin [animation-duration:20s] [animation-direction:reverse]" />

                {/* Orbit 3: Inner purple ring */}
                <div className="absolute inset-16 rounded-full border border-purple-500/30 animate-spin [animation-duration:15s]" />

                {/* Central Core Glowing Logo */}
                <div className="relative z-20 w-24 h-24 rounded-2xl bg-[#081026] border-2 border-[#FACC15] p-2 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(250,204,21,0.4)]">
                  <img src={TECHLOOP_LOGO} alt={videoContent.brandName} className="h-8 w-auto object-contain" />
                  <span className="text-[9px] font-black text-[#FACC15] font-mono mt-0.5">CORE ENGINE</span>
                </div>

                {/* Orbit Node 1: REUSE */}
                <div 
                  onClick={() => handleJumpToScenario('reuse')}
                  className="absolute -top-2 left-10 bg-[#081026] border-2 border-emerald-400 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 z-20 animate-bounce [animation-duration:3s] cursor-pointer"
                >
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <span className="text-[10px] font-black text-white block uppercase">01. REUSE</span>
                    <span className="text-[8px] text-emerald-300 font-mono">PAKAI ULANG</span>
                  </div>
                </div>

                {/* Orbit Node 2: REFURBISH */}
                <div 
                  onClick={() => handleJumpToScenario('repair')}
                  className="absolute -top-2 right-10 bg-[#081026] border-2 border-yellow-400 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 z-20 animate-bounce [animation-duration:3.2s] cursor-pointer"
                >
                  <Wrench className="w-4 h-4 text-yellow-400" />
                  <div className="text-left">
                    <span className="text-[10px] font-black text-white block uppercase">02. REFURBISH</span>
                    <span className="text-[8px] text-yellow-300 font-mono">PERBAIKAN</span>
                  </div>
                </div>

                {/* Orbit Node 3: COMPONENT RECOVERY */}
                <div 
                  onClick={() => handleJumpToScenario('component')}
                  className="absolute -bottom-2 left-10 bg-[#081026] border-2 border-cyan-400 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 z-20 animate-bounce [animation-duration:2.8s] cursor-pointer"
                >
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <div className="text-left">
                    <span className="text-[10px] font-black text-white block uppercase">03. COMPONENT</span>
                    <span className="text-[8px] text-cyan-300 font-mono">SUKU CADANG</span>
                  </div>
                </div>

                {/* Orbit Node 4: RECYCLING */}
                <div 
                  onClick={() => handleJumpToScenario('recycle')}
                  className="absolute -bottom-2 right-10 bg-[#081026] border-2 border-purple-400 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 z-20 animate-bounce [animation-duration:3.5s] cursor-pointer"
                >
                  <Recycle className="w-4 h-4 text-purple-400" />
                  <div className="text-left">
                    <span className="text-[10px] font-black text-white block uppercase">04. RECYCLING</span>
                    <span className="text-[8px] text-purple-300 font-mono">DAUR ULANG</span>
                  </div>
                </div>

                {/* Connecting Laser Lines (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <line x1="180" y1="180" x2="60" y2="40" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                  <line x1="180" y1="180" x2="300" y2="40" stroke="#FACC15" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                  <line x1="180" y1="180" x2="60" y2="320" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                  <line x1="180" y1="180" x2="300" y2="320" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                </svg>

              </div>

              {/* Jump to Closing */}
              <button
                onClick={() => handleJumpToPhase('closing')}
                className="px-6 py-2 bg-[#FACC15] hover:bg-yellow-300 text-[#060B19] font-black rounded-xl text-xs uppercase flex items-center gap-2 shadow-lg font-noto"
              >
                <span>LIHAT KESIMPULAN AKHIR</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

            </div>
          )}

          {/* =========================================================================
              PHASE 5: SAAS CLOSING & SLOGAN (76 - 86s)
              100% Authentic Summary & Prototype Verification
              ========================================================================= */}
          {currentPhase === 'closing' && (
            <div className="w-full max-w-4xl flex flex-col items-center text-center space-y-6 animate-springSlideUp">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A132C] border-2 border-[#FACC15] shadow-lg shadow-yellow-500/20">
                <CheckCircle className="w-4 h-4 text-[#FACC15]" />
                <span className="text-xs font-black tracking-widest text-[#FACC15] uppercase font-noto">
                  {videoContent.closingBadge}
                </span>
              </div>

              {/* Big Slogan Reveal */}
              <div className="space-y-2">
                <div className="inline-block bg-white rounded-2xl px-5 py-2.5 border-2 border-yellow-400 shadow-xl mb-2">
                  <img src={TECHLOOP_LOGO} alt={videoContent.brandName} className="h-10 w-auto object-contain" />
                </div>

                <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase font-noto">
                  <span 
                    onClick={() => handleStartInlineEdit('closingHeadline1', videoContent.closingHeadline1)}
                    className={isLiveEditMode ? 'cursor-pointer hover:underline decoration-yellow-400' : ''}
                  >
                    {videoContent.closingHeadline1}
                  </span> <br />
                  <span 
                    onClick={() => handleStartInlineEdit('closingHeadline2', videoContent.closingHeadline2)}
                    className={`text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] via-yellow-200 to-amber-400 drop-shadow-[0_0_35px_rgba(250,204,21,0.5)] ${
                      isLiveEditMode ? 'cursor-pointer hover:underline decoration-amber-400' : ''
                    }`}
                  >
                    {videoContent.closingHeadline2}
                  </span>
                </h2>
              </div>

              <p 
                onClick={() => handleStartInlineEdit('closingSubtitle', videoContent.closingSubtitle)}
                className={`text-sm sm:text-base text-slate-300 max-w-2xl font-medium leading-relaxed font-noto uppercase ${
                  isLiveEditMode ? 'cursor-pointer p-1 rounded bg-[#0A132C]/60 hover:ring-2 hover:ring-rose-500' : ''
                }`}
              >
                {videoContent.closingSubtitle}
              </p>

              {/* 3 Verified Conclusion Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-2">
                <div className="bg-[#081026] border border-[#FACC15]/40 rounded-2xl p-4 text-center shadow-lg">
                  <span className="text-2xl font-black text-[#FACC15] font-mono block">4 / 4</span>
                  <span className="text-xs font-bold text-white uppercase font-noto">SKENARIO TERUJI</span>
                  <span className="text-[10px] text-slate-400 block mt-1 uppercase">REUSE, REFURB, COMPONENT, RECYCLE</span>
                </div>

                <div className="bg-[#081026] border border-[#FACC15]/40 rounded-2xl p-4 text-center shadow-lg">
                  <span className="text-2xl font-black text-cyan-400 font-mono block">INSTAN</span>
                  <span className="text-xs font-bold text-white uppercase font-noto">KEPUTUSAN OTOMATIS</span>
                  <span className="text-[10px] text-slate-400 block mt-1 uppercase">DIJALANKAN DENGAN WORKFLOW N8N</span>
                </div>

                <div className="bg-[#081026] border border-[#FACC15]/40 rounded-2xl p-4 text-center shadow-lg">
                  <span className="text-2xl font-black text-emerald-400 font-mono block">OBJEKTIF</span>
                  <span className="text-xs font-bold text-white uppercase font-noto">ATURAN TRANSPARAN</span>
                  <span className="text-[10px] text-slate-400 block mt-1 uppercase">MENCEGAH BIAS KEPUTUSAN</span>
                </div>
              </div>

              {/* Replay or Download Video */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-[#081026] hover:bg-[#1E2E5D] text-white font-bold rounded-xl text-xs uppercase flex items-center gap-2 border border-[#1E2E5D] transition-colors font-noto"
                >
                  <RotateCcw className="w-4 h-4 text-[#FACC15]" />
                  <span>PUTAR ULANG VIDEO DEMO</span>
                </button>

                <button
                  onClick={handleStartRecording}
                  className="px-6 py-2.5 bg-[#FACC15] hover:bg-yellow-400 text-[#060B19] font-black rounded-xl text-xs uppercase flex items-center gap-2 shadow-xl shadow-yellow-500/20 active:scale-95 transition-all font-noto"
                >
                  <Video className="w-4 h-4" />
                  <span>UNDUH REKAMAN VIDEO (1920×1080)</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* BOTTOM VIDEO TIMELINE & AUDIO VISUALIZER CONTROLLER */}
        <div className="relative z-20 px-8 py-4 bg-[#060B19]/90 border-t border-[#1E2E5D]/60 backdrop-blur-md flex flex-col gap-2">
          
          {/* Timeline Scrubber */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-[#FACC15] font-black font-mono text-sm">
                {formatTime(currentTimeSec)}
              </span>
              <span>/</span>
              <span>{formatTime(totalDurationSec)}</span>
              <span className="text-slate-600">·</span>
              <span className="text-white font-bold uppercase font-noto">
                {currentPhase === 'intro' ? 'FASE 1: INTRO (APA ITU TECHLOOP)' : 
                 currentPhase === 'reveal' ? 'FASE 2: ARSITEKTUR WORKFLOW N8N' :
                 currentPhase === 'chat-demo' ? 'FASE 3: DEMO CHAT TELEGRAM 4 SKENARIO' : 
                 currentPhase === 'orbit' ? 'FASE 4: EKOSISTEM ORBITAL SIRKULAR' :
                 'FASE 5: CLOSING & SLOGAN'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Dynamic Animated 8-bar Audio Equalizer Visualizer */}
              {isBgmActive && isPlaying && (
                <div className="flex items-end gap-1 h-3.5 px-2 bg-[#081026] rounded-md border border-cyan-500/30">
                  {[0.4, 0.8, 0.3, 0.95, 0.5, 0.7, 0.35, 0.9].map((h, i) => (
                    <span 
                      key={i} 
                      className="w-1 bg-[#FACC15] rounded-full animate-pulse"
                      style={{ 
                        height: `${Math.round(h * 100)}%`,
                        animationDuration: `${0.3 + i * 0.1}s` 
                      }} 
                    />
                  ))}
                  <span className="text-[9px] text-cyan-300 font-mono ml-1">AUDIO BEAT</span>
                </div>
              )}

              {isRecording && (
                <span className="text-rose-400 font-bold flex items-center gap-1.5 animate-pulse text-[11px] uppercase">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  RECORDING 1920x1080
                </span>
              )}
            </div>
          </div>

          {/* Progress bar with clickable scrubbing */}
          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              setCurrentTimeSec(Math.floor(ratio * totalDurationSec));
            }}
            className="w-full bg-[#081026] h-2.5 rounded-full overflow-hidden border border-[#1E2E5D] relative cursor-pointer"
          >
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-[#FACC15] to-amber-500 transition-all duration-300"
              style={{ width: `${(currentTimeSec / totalDurationSec) * 100}%` }}
            />
          </div>

          {/* Media Playback & Audio Controls */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className="px-4 py-1.5 rounded-xl bg-[#FACC15] text-[#060B19] hover:bg-yellow-300 font-black text-xs flex items-center gap-1.5 uppercase font-noto shadow-sm active:scale-95 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'JEDA' : 'PUTAR VIDEO DEMO'}</span>
              </button>

              <button
                onClick={handleReset}
                className="p-1.5 rounded-xl bg-[#081026] hover:bg-[#1E2E5D] text-slate-300 hover:text-white border border-[#1E2E5D] transition-colors"
                title="Reset ke Awal"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Audio & Sound Effect Toggles */}
            <div className="flex items-center gap-2">
              
              {/* Backsound Toggle */}
              <button
                onClick={() => {
                  playClickBeep();
                  if (isBgmActive) ambientMusic.stop();
                  else ambientMusic.start();
                  setIsBgmActive(!isBgmActive);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors border ${
                  isBgmActive 
                    ? 'bg-[#081026] text-[#FACC15] border-[#FACC15]/60' 
                    : 'bg-[#060B19] text-slate-400 border-[#1E2E5D]'
                }`}
              >
                {isBgmActive ? 'BACKSOUND: ON' : 'BACKSOUND: OFF'}
              </button>

              {/* Chat Sound Effects Toggle */}
              <button
                onClick={() => {
                  playClickBeep();
                  setSoundEnabled(!soundEnabled);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors border ${
                  soundEnabled 
                    ? 'bg-[#081026] text-emerald-400 border-emerald-500/60' 
                    : 'bg-[#060B19] text-slate-400 border-[#1E2E5D]'
                }`}
              >
                {soundEnabled ? 'SUARA CHAT: ON' : 'SUARA CHAT: OFF'}
              </button>

              {/* Stiff AI Voiceover is OFF by default, can be toggled if requested */}
              <button
                onClick={() => {
                  playClickBeep();
                  if (isVoiceoverActive) stopNarration();
                  setIsVoiceoverActive(!isVoiceoverActive);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors border ${
                  isVoiceoverActive 
                    ? 'bg-[#081026] text-sky-400 border-sky-500/60' 
                    : 'bg-[#060B19] text-slate-400 border-[#1E2E5D]'
                }`}
                title="Pengisi suara AI sintesis (Default mati agar tidak kaku)"
              >
                {isVoiceoverActive ? 'VOICEOVER: ON' : 'VOICEOVER: MATI (BEBAS KAKU)'}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          INLINE EDIT POPOVER MODAL (When user clicks on any canvas text)
          ========================================================================= */}
      {inlineEditKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#081026] border-2 border-[#FACC15] rounded-3xl p-6 w-full max-w-lg shadow-2xl text-white animate-springSlideUp">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#FACC15]" />
                <h3 className="text-base font-black uppercase text-white font-noto">
                  EDIT KALIMAT LANGSUNG
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                {inlineEditKey}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              Ketikkan teks baru di bawah ini. Kalimat pada video demo akan terbarui secara instan.
            </p>

            <textarea
              value={inlineEditText}
              onChange={(e) => setInlineEditText(e.target.value)}
              rows={3}
              className="w-full bg-[#050B18] border border-[#1E2E5D] focus:border-[#FACC15] rounded-xl p-3 text-sm text-white focus:outline-hidden font-noto resize-none"
              autoFocus
            />

            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => setInlineEditKey(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl uppercase font-noto"
              >
                Batal
              </button>
              <button
                onClick={handleSaveInlineEdit}
                className="px-5 py-2 bg-[#FACC15] hover:bg-yellow-400 text-[#060B19] font-black text-xs rounded-xl flex items-center gap-1.5 uppercase font-noto shadow-md"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Sentence & Script Editor Modal */}
      <SentenceEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        content={videoContent}
        onSave={(updated) => {
          handleSaveEditedContent(updated);
          setIsEditorOpen(false);
        }}
        onReset={() => {
          handleResetToDefaultContent();
        }}
      />

    </div>
  );
};
