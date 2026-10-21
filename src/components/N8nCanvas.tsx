import React, { useState, useEffect, useRef } from 'react';
import { N8N_WORKFLOW_NODES } from '../data/scenariosData';
import { 
  Bot, 
  Sparkles, 
  GitFork, 
  Calculator, 
  Share2, 
  Send, 
  CheckCircle2, 
  ChevronRight, 
  Code2, 
  Layers,
  ArrowRight,
  Activity,
  Zap,
  Play
} from 'lucide-react';

interface N8nCanvasProps {
  activeNodeId: string;
  className?: string;
  onSelectNode?: (nodeId: string) => void;
}

export const N8nCanvas: React.FC<N8nCanvasProps> = ({ 
  activeNodeId, 
  className = '',
  onSelectNode 
}) => {
  const [selectedNode, setSelectedNode] = useState<string>(activeNodeId || 'n8n-gemini-vision');
  const [prevActiveNodeId, setPrevActiveNodeId] = useState<string | null>(null);
  const [isCrossfading, setIsCrossfading] = useState<boolean>(false);
  const prevRef = useRef<string>(activeNodeId);

  // Sync selected node and trigger fading-cross animation on activeNodeId change
  useEffect(() => {
    if (activeNodeId && activeNodeId !== prevRef.current) {
      setPrevActiveNodeId(prevRef.current);
      prevRef.current = activeNodeId;
      setSelectedNode(activeNodeId);
      setIsCrossfading(true);

      const timer = window.setTimeout(() => {
        setIsCrossfading(false);
      }, 650);

      return () => window.clearTimeout(timer);
    }
  }, [activeNodeId]);

  const activeIndex = N8N_WORKFLOW_NODES.findIndex((n) => n.id === activeNodeId);
  const prevActiveIndex = N8N_WORKFLOW_NODES.findIndex((n) => n.id === prevActiveNodeId);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'trigger':
        return <Bot className="w-4 h-4 text-sky-400" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'router':
        return <GitFork className="w-4 h-4 text-emerald-400" />;
      case 'valuation':
        return <Calculator className="w-4 h-4 text-amber-400" />;
      case 'db':
        return <Share2 className="w-4 h-4 text-teal-400" />;
      case 'telegram':
        return <Send className="w-4 h-4 text-blue-400" />;
      default:
        return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  const getNodeDetails = (id: string) => {
    switch (id) {
      case 'n8n-telegram-trigger':
        return {
          title: 'Telegram Webhook Trigger',
          input: 'HTTP POST from api.telegram.org/bot<TOKEN>',
          parameters: {
            allowedUpdates: ['message', 'callback_query'],
            parseMode: 'HTML',
            sessionStore: 'Redis In-Memory Session',
          },
          outputSample: '{\n  "chat_id": 98214022,\n  "text": "Laptop masih berfungsi...",\n  "status": "received"\n}',
        };
      case 'n8n-gemini-vision':
        return {
          title: 'Gemini Multimodal AI Diagnostic',
          input: 'Hardware Condition Text + Device Description',
          parameters: {
            model: 'gemini-2.5-flash',
            task: 'e-waste_physical_defect_detection',
            systemPrompt: 'Classify gadget condition into: functional_grade, cosmetic_defect, salvageable_modules, toxic_hazard',
          },
          outputSample: '{\n  "device": "Laptop Portable",\n  "hardware_health": 1.0,\n  "cosmetic_grade": "A",\n  "decision": "REUSE"\n}',
        };
      case 'n8n-decision-router':
        return {
          title: 'Circular Economy Switch Matrix',
          input: 'Diagnostic Payload',
          parameters: {
            rule_1: 'If health == 1.0 -> Route: REUSE',
            rule_2: 'If minor_defect & repairable -> Route: REFURBISHMENT',
            rule_3: 'If board_dead & parts_viable -> Route: COMPONENT_RECOVERY',
            rule_4: 'Else -> Route: CERTIFIED_RECYCLING',
          },
          outputSample: '{\n  "selected_pilar": "REUSE",\n  "priority_rank": 1,\n  "routing_status": "matched"\n}',
        };
      case 'n8n-valuation-api':
        return {
          title: 'Format & Validasi Keputusan',
          input: 'Kategori Sirkular & Deskripsi Perangkat',
          parameters: {
            classificationRule: 'TechLoop Decision Matrix v1.0',
            validationMode: 'Automated n8n Logic Router',
          },
          outputSample: '{\n  "route": "REUSE",\n  "status": "validated",\n  "action": "Pakai Ulang Secara Langsung"\n}',
        };
      case 'n8n-partner-dispatch':
        return {
          title: 'Pencatatan Riwayat Uji',
          input: 'Hasil Diagnosa & Riwayat Skenario',
          parameters: {
            logType: 'Audit Trail Keputusan Sirkular',
            dbTarget: 'TechLoop Research Evaluation Archive',
          },
          outputSample: '{\n  "timestamp": "12:20 PM",\n  "scenario_tested": "REUSE",\n  "status": "archived"\n}',
        };
      case 'n8n-telegram-response':
        return {
          title: 'Kirim Pesan Telegram Otomatis',
          input: 'Teks Rekomendasi Resmi',
          parameters: {
            botHandle: '@TechLoop_bot',
            watermark: 'This message was sent automatically with n8n',
          },
          outputSample: '{\n  "sent": true,\n  "chat_id": 98214022,\n  "status": "delivered_automatically_with_n8n"\n}',
        };
      default:
        return {
          title: 'n8n Execution Node',
          input: 'Standard JSON',
          parameters: {},
          outputSample: '{}',
        };
    }
  };

  const details = getNodeDetails(selectedNode || activeNodeId);

  return (
    <div className={`flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl ${className}`}>
      
      {/* n8n Header Toolbar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-500/30">
            n8n
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-100 flex items-center gap-2 font-noto">
              <span>TechLoop_Decision_Workflow</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800 font-mono">
                Active · v2.4
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Otomasi Backend Alur Keputusan E-Waste secara Real-Time
            </div>
          </div>
        </div>

        {/* Fading-Cross Transition Status Badge */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all duration-300 ${
            isCrossfading
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isCrossfading ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'}`} />
            <span className="uppercase text-[10px] font-bold">
              {isCrossfading ? 'Fading-Cross Transitioning...' : 'Pipeline Synchronized'}
            </span>
          </div>

          <span className="text-slate-500 hidden sm:inline">
            Node {activeIndex >= 0 ? activeIndex + 1 : 1} of {N8N_WORKFLOW_NODES.length}
          </span>
        </div>
      </div>

      {/* Workflow Canvas Grid with Smooth Fading-Cross Transition Nodes */}
      <div className="p-5 bg-[#070D1E] relative overflow-x-auto select-none">
        {/* Subtle grid lines background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient Glow Aura */}
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-64 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Node Flow Sequence */}
        <div className="relative z-10 flex items-center gap-3 py-3 min-w-[740px]">
          {N8N_WORKFLOW_NODES.map((node, index) => {
            const isActive = activeNodeId === node.id;
            const wasActive = prevActiveNodeId === node.id;
            const isSelected = selectedNode === node.id;
            const isPassed = activeIndex > index;

            return (
              <React.Fragment key={node.id}>
                {/* Node Box with Fading-Cross Transitions */}
                <div
                  onClick={() => {
                    setSelectedNode(node.id);
                    if (onSelectNode) onSelectNode(node.id);
                  }}
                  className={`cursor-pointer rounded-xl p-3 w-[156px] shrink-0 border relative group overflow-hidden transition-all duration-500 ease-out ${
                    isActive
                      ? 'bg-slate-800/95 border-emerald-400 ring-2 ring-emerald-500/80 shadow-[0_0_25px_rgba(16,185,129,0.35)] scale-103 z-20 animate-fadingCrossIn animate-nodeAuraCrossfade'
                      : wasActive && isCrossfading
                      ? 'bg-slate-800/80 border-emerald-600/50 scale-100 z-10 animate-fadingCrossOut'
                      : isSelected
                      ? 'bg-slate-800/80 border-slate-500 ring-1 ring-slate-400/50 z-10'
                      : isPassed
                      ? 'bg-slate-900/90 border-emerald-800/40 opacity-85 hover:border-slate-700'
                      : 'bg-slate-900/80 border-slate-800 opacity-65 hover:opacity-90 hover:border-slate-700'
                  }`}
                  style={{
                    transformOrigin: 'center center',
                  }}
                >
                  {/* Cross-Beam Light Scanner on newly active node */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent pointer-events-none animate-crossBeamScan" />
                  )}

                  {/* Fading Cross Active Status Badge */}
                  {isActive && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg shadow-emerald-500/30 animate-fadingCrossIn">
                      <Zap className="w-2.5 h-2.5 fill-current" />
                      <span>{node.executionTime}</span>
                    </div>
                  )}

                  {/* Header: Icon + Label */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`p-1.5 rounded-lg border transition-colors duration-300 ${
                      isActive 
                        ? 'bg-emerald-950 border-emerald-500/70 shadow-sm' 
                        : 'bg-slate-800 border-slate-700'
                    }`}>
                      {getNodeIcon(node.type)}
                    </div>
                    <span className={`text-[11px] font-bold truncate transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-slate-200'
                    }`}>
                      {node.label}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                    {node.description}
                  </p>

                  {/* Footer metadata */}
                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                    <span className="capitalize">{node.type}</span>
                    <span className={isActive ? 'text-emerald-400 font-bold' : isPassed ? 'text-emerald-600' : 'text-slate-600'}>
                      {isActive ? '● executing' : isPassed ? '✓ completed' : 'idle'}
                    </span>
                  </div>
                </div>

                {/* Connecting Pipe & Arrow with Fading-Cross Animated Packet */}
                {index < N8N_WORKFLOW_NODES.length - 1 && (
                  <div className="shrink-0 flex items-center justify-center relative w-7 h-8">
                    {/* Background pipe */}
                    <div className={`h-[2.5px] w-full rounded-full transition-colors duration-500 ${
                      index < activeIndex
                        ? 'bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : index === activeIndex
                        ? 'bg-gradient-to-r from-emerald-500 to-slate-700'
                        : 'bg-slate-800'
                    }`} />

                    {/* Fading-Cross Animated Data Packet travelling from previous to active node */}
                    {(index === activeIndex - 1 || (index === activeIndex && isCrossfading)) && (
                      <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_#34d399] animate-packetTravel" />
                    )}

                    {/* Arrow head */}
                    <ArrowRight className={`w-3.5 h-3.5 absolute -right-1 transition-colors duration-500 ${
                      index < activeIndex
                        ? 'text-emerald-400'
                        : index === activeIndex
                        ? 'text-emerald-400/80 animate-pulse'
                        : 'text-slate-700'
                    }`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspector Drawer with Smooth Crossfade on Change */}
      <div 
        key={selectedNode}
        className="bg-slate-950 p-4 border-t border-slate-800 text-xs text-slate-300 animate-fadingCrossIn"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-100 font-noto">{details.title}</span>
            <span className="text-[11px] text-slate-400 font-mono">[{selectedNode}]</span>
            {selectedNode === activeNodeId && (
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.2 rounded-full font-mono">
                Live Executing
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Node Inspector (JSON)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
          {/* Config / Input */}
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 shadow-inner">
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1 font-bold">
              Configuration / Parameters:
            </span>
            <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
              {JSON.stringify(details.parameters, null, 2)}
            </pre>
          </div>

          {/* Sample Output */}
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 shadow-inner">
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1 font-bold">
              Execution JSON Output:
            </span>
            <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
              {details.outputSample}
            </pre>
          </div>
        </div>
      </div>

    </div>
  );
};
