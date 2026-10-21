import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleItem } from '../types';
import { TELEGRAM_SCREENSHOTS } from '../data/scenariosData';
import { 
  Send, 
  Paperclip, 
  Mic, 
  CheckCheck, 
  ArrowLeft, 
  MoreVertical, 
  Camera,
  ChevronLeft,
  ChevronRight,
  Rotate3d,
  Smile,
  Keyboard
} from 'lucide-react';

interface PhoneFrameProps {
  bubbles: ChatBubbleItem[];
  activeBubbleIndex: number;
  isBotTyping: boolean;
  typingInputText?: string;
  isUserTyping?: boolean;
  soundEnabled?: boolean;
  onSendMessage?: (text: string) => void;
  className?: string;
  is3DTilt?: boolean;
  onToggle3D?: () => void;
  onNextBubble?: () => void;
  onPrevBubble?: () => void;
  totalBubbles?: number;
  botName?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  bubbles,
  activeBubbleIndex,
  isBotTyping,
  typingInputText = '',
  isUserTyping = false,
  soundEnabled = true,
  onSendMessage,
  className = '',
  is3DTilt = false,
  onToggle3D,
  onNextBubble,
  onPrevBubble,
  totalBubbles = 11,
  botName = 'TechLoop',
}) => {
  const [manualInput, setManualInput] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // View Mode: 'live-chat' or 'real-screenshot'
  const [viewMode, setViewMode] = useState<'live-chat' | 'real-screenshot'>('live-chat');
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState(0);

  // Auto-scroll when new bubbles appear or bot is typing
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [bubbles.length, isBotTyping, isUserTyping]);

  const handleSendManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    if (onSendMessage) {
      onSendMessage(manualInput.trim());
    }
    setManualInput('');
  };

  const displayedInputText = isUserTyping ? typingInputText : manualInput;

  return (
    <div className={`relative mx-auto select-none ${className}`}>
      
      {/* Top Floating Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
        
        {/* Mode Switcher */}
        <div className="bg-slate-900 border border-slate-800 p-0.5 rounded-xl flex items-center gap-1 text-[11px] shadow-md">
          <button
            onClick={() => setViewMode('live-chat')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              viewMode === 'live-chat'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💬 Chat 1-per-1
          </button>
          <button
            onClick={() => setViewMode('real-screenshot')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              viewMode === 'real-screenshot'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📸 Bukti Asli
          </button>
        </div>

        {/* 3D Cinematic Perspective Toggle */}
        {onToggle3D && (
          <button
            onClick={onToggle3D}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border flex items-center gap-1.5 transition-all shadow-md ${
              is3DTilt
                ? 'bg-purple-950/80 text-purple-300 border-purple-600/80'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Tampilan 3D Tilt"
          >
            <Rotate3d className="w-3.5 h-3.5" />
            <span>{is3DTilt ? '3D Tilt ON' : '3D Tilt'}</span>
          </button>
        )}
      </div>

      {/* 3D Perspective Wrapper */}
      <div 
        style={{ 
          perspective: is3DTilt ? '1400px' : 'none',
        }}
        className="transition-all duration-700 ease-out"
      >
        {/* Smartphone Chassis Container */}
        <div 
          className="w-[335px] sm:w-[370px] h-[690px] sm:h-[720px] bg-slate-900 rounded-[44px] p-2.5 shadow-2xl ring-1 ring-slate-800 relative flex flex-col justify-between border-[5px] border-slate-800 transition-all duration-700 ease-out"
          style={{
            transform: is3DTilt 
              ? 'rotateY(-12deg) rotateX(10deg) rotateZ(-1.5deg) scale(0.96)' 
              : 'none',
            boxShadow: is3DTilt 
              ? '25px 35px 60px -15px rgba(0, 0, 0, 0.8), -10px 10px 30px rgba(16, 185, 129, 0.15)' 
              : '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          }}
        >
          
          {/* Subtle 3D Glass Light Reflection */}
          {is3DTilt && (
            <div className="absolute inset-0 rounded-[38px] bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-30" />
          )}

          {/* Outer hardware buttons */}
          <div className="absolute -left-[8px] top-24 w-[3.5px] h-8 bg-slate-700 rounded-l-md" />
          <div className="absolute -left-[8px] top-36 w-[3.5px] h-11 bg-slate-700 rounded-l-md" />
          <div className="absolute -left-[8px] top-50 w-[3.5px] h-11 bg-slate-700 rounded-l-md" />
          <div className="absolute -right-[8px] top-32 w-[3.5px] h-14 bg-slate-700 rounded-r-md" />

          {/* Screen Bezel */}
          <div className="w-full h-full bg-[#99BA92] rounded-[34px] overflow-hidden flex flex-col relative border border-slate-700/40">
            
            {/* Status Bar - exact match to screenshot */}
            <div className="h-9 bg-[#2AABEE] text-white px-4 flex items-center justify-between text-xs z-20 shrink-0 select-none shadow-xs">
              <div className="flex items-center gap-1.5 font-sans font-medium text-[12px]">
                <span>6:06</span>
                <span className="text-[10px] opacity-90">💬</span>
                <span className="text-[10px] opacity-90">💬</span>
                <span className="text-[10px] opacity-90">❌</span>
                <span className="text-[10px] opacity-90">⏰</span>
              </div>
              
              {/* Camera cutout */}
              <div className="h-4 w-4 bg-black rounded-full border border-black/30" />

              <div className="flex items-center gap-1.5 text-white text-[11px] font-mono">
                <span className="text-[9.5px]">32.6 KB/s</span>
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z" opacity="0.3"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <div className="w-4 h-2 border border-white rounded-xs p-0.5 flex items-center">
                  <div className="w-full h-full bg-white rounded-xs"></div>
                </div>
                <span className="text-[10px]">37</span>
              </div>
            </div>

            {/* Telegram App Header - exact match to screenshot */}
            <div className="bg-white text-slate-800 px-3 py-2 flex items-center justify-between border-b border-slate-200 shrink-0 z-10 shadow-xs">
              <div className="flex items-center gap-2.5">
                <button 
                  type="button" 
                  aria-label="Back" 
                  className="text-slate-800 hover:text-black p-0.5 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                {/* Bot Avatar: Circular Green with letter */}
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-[#4CAF50] flex items-center justify-center text-white font-bold text-base shadow-xs">
                    {botName.charAt(0)}
                  </div>
                </div>

                {/* Bot Details - exact as screenshot */}
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-slate-900 tracking-tight leading-tight">
                    {botName}
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    bot
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-600">
                <button 
                  type="button" 
                  aria-label="More options" 
                  className="p-1 hover:text-black rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Subtitle Banner: Pasang Foto Profil */}
            <div className="bg-white/95 px-3 py-1 flex items-center justify-center gap-1.5 border-b border-slate-200 text-[#2AABEE] text-xs font-medium shrink-0">
              <Camera className="w-3.5 h-3.5" />
              <span>Pasang Foto Profil</span>
            </div>

            {/* MAIN CONTENT CANVAS */}
            {viewMode === 'live-chat' ? (
              /* Mode 1: Pure Telegram Chat Bubbles matching screenshot with zero additions & no dates */
              <div 
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto p-3 space-y-2.5 relative scroll-smooth text-slate-900"
                style={{
                  backgroundColor: '#95b790',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%237da078' fill-opacity='0.25' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`
                }}
              >
                {/* Render Bubbles 1-by-1 sequentially without any date headers or added badges */}
                {bubbles.map((bubble, idx) => {
                  const isUser = bubble.sender === 'user';
                  const isLatest = idx === bubbles.length - 1;

                  return (
                    <div 
                      key={bubble.id} 
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full transition-all duration-300 ${
                        isLatest ? 'animate-springScale' : ''
                      }`}
                    >
                      <div
                        className={`rounded-xl p-2.5 shadow-sm max-w-[88%] text-[13px] leading-relaxed relative ${
                          isUser
                            ? 'bg-[#E1FFC7] text-slate-900 rounded-tr-xs'
                            : 'bg-white text-slate-900 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        {/* Pure text content matching screenshot exactly */}
                        <div className="whitespace-pre-line font-sans leading-normal">
                          {bubble.text}
                        </div>

                        {/* Timestamp & read ticks */}
                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400 font-sans">
                          <span>{bubble.timestamp}</span>
                          {isUser && <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Bot Typing Indicator */}
                {isBotTyping && (
                  <div className="flex items-start max-w-full animate-fadeIn">
                    <div className="bg-white rounded-xl rounded-tl-xs p-2.5 flex items-center gap-2 text-xs text-slate-500 shadow-sm">
                      <span className="text-[11px] font-sans">TechLoop is typing...</span>
                      <div className="flex space-x-1 items-center">
                        <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Mode 2: Real 6 Screenshots from the user's research */
              <div className="flex-1 bg-black overflow-y-auto relative flex flex-col">
                <div className="relative flex-1 flex items-center justify-center p-1 bg-slate-950">
                  <img
                    src={TELEGRAM_SCREENSHOTS[activeScreenshotIdx].src}
                    alt={TELEGRAM_SCREENSHOTS[activeScreenshotIdx].label}
                    className="w-full h-full object-contain max-h-[520px] rounded-lg shadow-inner"
                  />
                </div>

                {/* Screenshot Selector Bar */}
                <div className="bg-slate-900/95 p-2 border-t border-slate-800 flex items-center justify-between text-xs text-white">
                  <button
                    onClick={() => setActiveScreenshotIdx((prev) => (prev > 0 ? prev - 1 : TELEGRAM_SCREENSHOTS.length - 1))}
                    className="p-1 hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="text-center">
                    <span className="font-semibold block text-[11px]">
                      {TELEGRAM_SCREENSHOTS[activeScreenshotIdx].label}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      Foto {activeScreenshotIdx + 1} dari {TELEGRAM_SCREENSHOTS.length}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveScreenshotIdx((prev) => (prev < TELEGRAM_SCREENSHOTS.length - 1 ? prev + 1 : 0))}
                    className="p-1 hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Telegram Chat Input Bar - exact match to screenshot */}
            <form 
              onSubmit={handleSendManual}
              className="p-2 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0 z-10"
            >
              {/* Smiley icon */}
              <button
                type="button"
                aria-label="Emoji"
                className="p-1 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Smile className="w-5 h-5" />
              </button>

              {/* Text input with placeholder "Pesan" */}
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={displayedInputText}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Pesan"
                  className={`w-full bg-transparent text-slate-900 text-xs px-2 py-1.5 focus:outline-hidden placeholder:text-slate-400 ${
                    isUserTyping ? 'font-medium text-slate-950' : ''
                  }`}
                />
                {isUserTyping && (
                  <span className="inline-block w-1 h-3.5 bg-[#2AABEE] animate-pulse ml-0.5" />
                )}
              </div>

              {/* Keyboard / Attachment icons matching screenshot */}
              <button
                type="button"
                aria-label="Keyboard"
                className="p-1 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Keyboard className="w-4 h-4" />
              </button>

              <button
                type="button"
                aria-label="Attach File"
                className="p-1 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Blue Circular Mic / Send Button matching screenshot */}
              {displayedInputText.trim() ? (
                <button
                  type="submit"
                  aria-label="Send"
                  className="w-8 h-8 bg-[#2AABEE] text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-transform active:scale-95 shadow-xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  aria-label="Voice Message"
                  className="w-8 h-8 bg-[#2AABEE] text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-transform active:scale-95 shadow-xs shrink-0"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Bottom Home Indicator Bar */}
            <div className="h-3 bg-white flex items-center justify-center shrink-0">
              <div className="w-24 h-1 bg-slate-300 rounded-full"></div>
            </div>

          </div>
        </div>
      </div>

      {/* Stepper Navigation Below Phone (Next / Prev Bubble) */}
      <div className="mt-3 flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 max-w-[370px] mx-auto shadow-md">
        <button
          onClick={onPrevBubble}
          disabled={activeBubbleIndex <= 0}
          className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 rounded-lg bg-slate-800/80 transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Sebelumnya</span>
        </button>

        <div className="text-center font-mono text-[11px] text-slate-400">
          <span className="text-emerald-400 font-bold">Bubble {activeBubbleIndex + 1}</span>
          <span className="text-slate-600"> / </span>
          <span>{totalBubbles}</span>
        </div>

        <button
          onClick={onNextBubble}
          disabled={activeBubbleIndex >= totalBubbles - 1}
          className="px-2.5 py-1 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-30 disabled:bg-slate-800 disabled:text-slate-500 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
        >
          <span>Berikutnya</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
