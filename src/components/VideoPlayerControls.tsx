import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Subtitles, 
  Video, 
  Square, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Download,
  FastForward,
  Layers
} from 'lucide-react';
import { SCENARIO_STEPS, SEQUENTIAL_CHAT_BUBBLES } from '../data/scenariosData';
import { ScenarioId } from '../types';

interface VideoPlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  activeBubbleIndex: number;
  totalBubbles: number;
  onSelectBubble: (index: number) => void;
  onNextBubble: () => void;
  onPrevBubble: () => void;
  currentScenarioIndex: number;
  onSelectScenario: (index: number) => void;
  isBgmActive: boolean;
  onToggleBgm: () => void;
  isVoiceoverActive: boolean;
  onToggleVoiceover: () => void;
  showCaptions: boolean;
  onToggleCaptions: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
}

export const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onReset,
  activeBubbleIndex,
  totalBubbles,
  onSelectBubble,
  onNextBubble,
  onPrevBubble,
  currentScenarioIndex,
  onSelectScenario,
  isBgmActive,
  onToggleBgm,
  isVoiceoverActive,
  onToggleVoiceover,
  showCaptions,
  onToggleCaptions,
  soundEnabled,
  onToggleSound,
  isRecording,
  onStartRecording,
  onStopRecording,
  playbackSpeed,
  onChangeSpeed,
}) => {
  const currentBubble = SEQUENTIAL_CHAT_BUBBLES[activeBubbleIndex] || SEQUENTIAL_CHAT_BUBBLES[0];
  const progressPercent = ((activeBubbleIndex + 1) / totalBubbles) * 100;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
      {/* Top Scrubber & Bubble Progress */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">
              Bubble {activeBubbleIndex + 1} / {totalBubbles}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-200 font-sans font-semibold">
              {currentBubble.scenarioTitle}
            </span>
            <span className="text-slate-600">·</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase ${
              currentBubble.sender === 'user' ? 'bg-sky-950 text-sky-400' : 'bg-emerald-950 text-emerald-400'
            }`}>
              {currentBubble.sender === 'user' ? '👤 Input Pengguna' : '🤖 Output Bot n8n'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isRecording && (
              <span className="flex items-center gap-1.5 text-rose-400 font-semibold animate-pulse text-[11px]">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                RECORDING DEMO
              </span>
            )}
            <span className="text-[11px] text-slate-400">
              Pilar: <strong className="text-white">{currentBubble.category}</strong>
            </span>
          </div>
        </div>

        {/* Timeline Progress Bar with Clickable Bubble Segments */}
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden relative flex p-0.5 gap-0.5">
          {SEQUENTIAL_CHAT_BUBBLES.map((b, idx) => {
            const isCompleted = idx <= activeBubbleIndex;
            const isCurrent = idx === activeBubbleIndex;
            return (
              <div
                key={b.id}
                onClick={() => onSelectBubble(idx)}
                className={`flex-1 h-full rounded-xs cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-emerald-400 shadow-sm ring-1 ring-white'
                    : isCompleted
                    ? 'bg-emerald-600/80 hover:bg-emerald-500'
                    : 'bg-slate-700/60 hover:bg-slate-600'
                }`}
                title={`Bubble ${idx + 1}: ${b.scenarioTitle} (${b.sender})`}
              />
            );
          })}
        </div>
      </div>

      {/* Main Playback & Audio Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        
        {/* Play/Pause & Stepper 1-per-1 Buttons */}
        <div className="flex items-center gap-2">
          {/* Step Back */}
          <button
            onClick={onPrevBubble}
            disabled={activeBubbleIndex <= 0}
            aria-label="Previous Bubble"
            className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Bubble Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Main Play / Pause */}
          <button
            onClick={onTogglePlay}
            className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Jeda Demo</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Putar Demo 1 per 1</span>
              </>
            )}
          </button>

          {/* Step Next */}
          <button
            onClick={onNextBubble}
            disabled={activeBubbleIndex >= totalBubbles - 1}
            aria-label="Next Bubble"
            className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Tampilkan Bubble Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            aria-label="Reset demo to start"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Ulangi dari Awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Toggle */}
          <button
            onClick={() => {
              const speeds = [1, 1.25, 1.5];
              const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
              onChangeSpeed(speeds[nextIdx]);
            }}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-mono font-semibold transition-colors border border-slate-700"
            title="Kecepatan Animasi Typewriter & Delay"
          >
            {playbackSpeed}x
          </button>
        </div>

        {/* Audio, Sound & Recording Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Suara Bubble Chat Telegram */}
          <button
            onClick={onToggleSound}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border ${
              soundEnabled
                ? 'bg-teal-950/80 text-teal-300 border-teal-700/60 shadow-xs'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Efek Suara Bubble Chat (Pop / Ping)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Suara Bubble: {soundEnabled ? 'ON 🔊' : 'OFF 🔇'}</span>
          </button>

          {/* Relaxing BGM */}
          <button
            onClick={onToggleBgm}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border ${
              isBgmActive
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Backsound Santai / Lofi Synthesizer"
          >
            {isBgmActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Backsound</span>
          </button>

          {/* Voiceover Narration */}
          <button
            onClick={onToggleVoiceover}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border ${
              isVoiceoverActive
                ? 'bg-sky-950/80 text-sky-300 border-sky-700/60'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Voiceover Suara Narasi Otomatis (Bahasa Indonesia)"
          >
            {isVoiceoverActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>Voiceover</span>
          </button>

          {/* Teks Penjelas / Subtitles */}
          <button
            onClick={onToggleCaptions}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border ${
              showCaptions
                ? 'bg-purple-950/80 text-purple-300 border-purple-700/60'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Teks Penjelas / Subtitles Ala CapCut"
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span>Teks Penjelas</span>
          </button>

          {/* Browser Screen Recorder Button */}
          {!isRecording ? (
            <button
              onClick={onStartRecording}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
              title="Rekam Layar HP & Download Video untuk CapCut / Canva"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Rekam Video</span>
            </button>
          ) : (
            <button
              onClick={onStopRecording}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all bg-slate-100 hover:bg-white text-slate-900 shadow-md"
            >
              <Square className="w-3.5 h-3.5 text-rose-600 fill-current" />
              <span>Selesai & Unduh</span>
            </button>
          )}
        </div>
      </div>

      {/* Scenario Jump Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-800/80 pb-1 text-xs">
        {SCENARIO_STEPS.map((scenario, idx) => {
          const isActive = currentScenarioIndex === idx;
          return (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(idx)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all text-[11px] flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{idx + 1}.</span>
              <span>{scenario.category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
