import React, { useState } from 'react';
import { EditableVideoContent } from '../types';
import { 
  X, 
  Save, 
  RotateCcw, 
  Type, 
  MessageSquare, 
  Mic, 
  Sparkles, 
  CheckCircle2, 
  FileText,
  Share2
} from 'lucide-react';

interface SentenceEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: EditableVideoContent;
  onSave: (updated: EditableVideoContent) => void;
  onReset: () => void;
}

export const SentenceEditorModal: React.FC<SentenceEditorModalProps> = ({
  isOpen,
  onClose,
  content,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<EditableVideoContent>(content);
  const [activeTab, setActiveTab] = useState<'intro' | 'chat' | 'voiceover' | 'closing'>('intro');
  const [savedNotification, setSavedNotification] = useState(false);

  // Sync if prop changes
  React.useEffect(() => {
    setFormData(content);
  }, [content]);

  if (!isOpen) return null;

  const handleBubbleTextChange = (index: number, newText: string) => {
    setFormData((prev) => {
      const updatedBubbles = [...prev.bubbles];
      updatedBubbles[index] = { ...updatedBubbles[index], text: newText };
      return { ...prev, bubbles: updatedBubbles };
    });
  };

  const handleBubbleNarrationChange = (index: number, newNarration: string) => {
    setFormData((prev) => {
      const updatedBubbles = [...prev.bubbles];
      updatedBubbles[index] = { ...updatedBubbles[index], narrationText: newNarration };
      return { ...prev, bubbles: updatedBubbles };
    });
  };

  const handleSave = () => {
    onSave(formData);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-noto">
      <div className="bg-[#081026] border-2 border-[#1E2E5D] w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#050B18] border-b border-[#1E2E5D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FACC15] text-[#060B19]">
              <Type className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase text-white font-noto flex items-center gap-2">
                <span>EDIT KALIMAT & TEKS VIDEO DEMO</span>
                <span className="text-[10px] bg-[#1E2E5D] text-[#FACC15] px-2 py-0.5 rounded font-mono">
                  1920 × 1080
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Ubah teks judul, isi chat Telegram, skenario, dan voiceover secara instan tanpa data palsu.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 bg-[#060B19] border-b border-[#1E2E5D] flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('intro')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 ${
              activeTab === 'intro' ? 'bg-[#FACC15] text-[#060B19]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Intro & Identitas</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 ${
              activeTab === 'chat' ? 'bg-[#FACC15] text-[#060B19]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>2. Chat 4 Skenario Telegram</span>
          </button>

          <button
            onClick={() => setActiveTab('voiceover')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 ${
              activeTab === 'voiceover' ? 'bg-[#FACC15] text-[#060B19]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>3. Naskah Voiceover</span>
          </button>

          <button
            onClick={() => setActiveTab('closing')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 ${
              activeTab === 'closing' ? 'bg-[#FACC15] text-[#060B19]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>4. Ekosistem & Closing</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          
          {/* TAB 1: INTRO & IDENTITAS */}
          {activeTab === 'intro' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Nama Brand:
                  </label>
                  <input
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl px-3 py-2 text-white font-bold focus:border-[#FACC15] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Tagline Utama:
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl px-3 py-2 text-white font-bold focus:border-[#FACC15] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Kredit Tim & Kompetisi:
                </label>
                <input
                  type="text"
                  value={formData.teamCredit}
                  onChange={(e) => setFormData({ ...formData, teamCredit: e.target.value })}
                  className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl px-3 py-2 text-white font-bold focus:border-[#FACC15] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#FACC15] uppercase block mb-1">
                  Badge Label Intro:
                </label>
                <input
                  type="text"
                  value={formData.introBadge}
                  onChange={(e) => setFormData({ ...formData, introBadge: e.target.value })}
                  className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl px-3 py-2 text-white font-bold focus:border-[#FACC15] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Headline Baris 1:
                  </label>
                  <input
                    type="text"
                    value={formData.introHeadline1}
                    onChange={(e) => setFormData({ ...formData, introHeadline1: e.target.value })}
                    className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl px-3 py-2 text-white font-bold focus:border-[#FACC15] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Headline Baris 2 (Warna Aksen):
                  </label>
                  <input
                    type="text"
                    value={formData.introHeadline2}
                    onChange={(e) => setFormData({ ...formData, introHeadline2: e.target.value })}
                    className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl px-3 py-2 text-white font-bold focus:border-[#FACC15] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Kalimat Penjelas Intro:
                </label>
                <textarea
                  rows={3}
                  value={formData.introSubtitle}
                  onChange={(e) => setFormData({ ...formData, introSubtitle: e.target.value })}
                  className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl p-3 text-white font-medium focus:border-[#FACC15] outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CHAT TELEGRAM 4 SKENARIO */}
          {activeTab === 'chat' && (
            <div className="space-y-5">
              <div className="p-3 bg-emerald-950/40 border border-emerald-600/50 rounded-xl text-xs text-emerald-300">
                💡 Seluruh teks pesan di bawah ini dapat Anda sesuaikan. Video demo akan langsung merefleksikan perubahan ini secara instan pada balon chat Telegram.
              </div>

              <div className="space-y-4">
                {formData.bubbles.map((bubble, idx) => (
                  <div key={bubble.id} className="bg-[#050B18] border border-[#1E2E5D] rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#FACC15] uppercase font-mono">
                        #{idx + 1} {bubble.scenarioTitle}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        bubble.sender === 'user' ? 'bg-sky-950 text-sky-300 border border-sky-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {bubble.sender === 'user' ? 'Pesan Pengguna' : 'Respon Bot TechLoop'}
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 uppercase font-semibold">
                        Isi Balon Chat:
                      </label>
                      <textarea
                        rows={bubble.text.includes('\n') ? 4 : 2}
                        value={bubble.text}
                        onChange={(e) => handleBubbleTextChange(idx, e.target.value)}
                        className="w-full bg-[#081026] border border-[#1E2E5D] rounded-xl p-2.5 text-white text-xs font-sans focus:border-[#FACC15] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 uppercase font-semibold">
                        Voiceover Penjelas Skenario Ini:
                      </label>
                      <input
                        type="text"
                        value={bubble.narrationText}
                        onChange={(e) => handleBubbleNarrationChange(idx, e.target.value)}
                        className="w-full bg-[#081026] border border-[#1E2E5D] rounded-xl px-3 py-1.5 text-slate-200 text-xs focus:border-[#FACC15] outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: NASKAH VOICEOVER LENGKAP */}
          {activeTab === 'voiceover' && (
            <div className="space-y-5">
              <div className="p-3 bg-sky-950/40 border border-sky-600/50 rounded-xl text-xs text-sky-300">
                🎙️ Suara Google Ad-style akan membaca naskah ini sesuai fase video yang sedang berlangsung.
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Voiceover Fase 1 (Intro):
                </label>
                <textarea
                  rows={3}
                  value={formData.introVoiceover}
                  onChange={(e) => setFormData({ ...formData, introVoiceover: e.target.value })}
                  className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl p-3 text-white text-xs leading-relaxed focus:border-[#FACC15] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Voiceover Fase 2 (SaaS Dashboard & n8n):
                </label>
                <textarea
                  rows={3}
                  value={formData.workflowVoiceover}
                  onChange={(e) => setFormData({ ...formData, workflowVoiceover: e.target.value })}
                  className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl p-3 text-white text-xs leading-relaxed focus:border-[#FACC15] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Voiceover Fase 4 (Ekosistem Orbit):
                </label>
                <textarea
                  rows={3}
                  value={formData.orbitVoiceover}
                  onChange={(e) => setFormData({ ...formData, orbitVoiceover: e.target.value })}
                  className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl p-3 text-white text-xs leading-relaxed focus:border-[#FACC15] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Voiceover Fase 5 (Closing & Slogan):
                </label>
                <textarea
                  rows={3}
                  value={formData.closingVoiceover}
                  onChange={(e) => setFormData({ ...formData, closingVoiceover: e.target.value })}
                  className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl p-3 text-white text-xs leading-relaxed focus:border-[#FACC15] outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 4: CLOSING & KESIMPULAN */}
          {activeTab === 'closing' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#FACC15] uppercase block mb-1">
                  Badge Status Closing:
                </label>
                <input
                  type="text"
                  value={formData.closingBadge}
                  onChange={(e) => setFormData({ ...formData, closingBadge: e.target.value })}
                  className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl px-3 py-2 text-white font-bold focus:border-[#FACC15] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Closing Headline 1:
                  </label>
                  <input
                    type="text"
                    value={formData.closingHeadline1}
                    onChange={(e) => setFormData({ ...formData, closingHeadline1: e.target.value })}
                    className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl px-3 py-2 text-white font-bold focus:border-[#FACC15] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Closing Headline 2 (Aksen Kuning):
                  </label>
                  <input
                    type="text"
                    value={formData.closingHeadline2}
                    onChange={(e) => setFormData({ ...formData, closingHeadline2: e.target.value })}
                    className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl px-3 py-2 text-white font-bold focus:border-[#FACC15] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Kalimat Kesimpulan Penutup:
                </label>
                <textarea
                  rows={3}
                  value={formData.closingSubtitle}
                  onChange={(e) => setFormData({ ...formData, closingSubtitle: e.target.value })}
                  className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl p-3 text-white text-xs leading-relaxed focus:border-[#FACC15] outline-none"
                />
              </div>

              <div className="pt-2 border-t border-[#1E2E5D]">
                <h4 className="text-xs font-bold text-slate-300 uppercase mb-2">Teks Ekosistem Orbit (Fase 4):</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      value={formData.orbitTitle1}
                      onChange={(e) => setFormData({ ...formData, orbitTitle1: e.target.value })}
                      className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl px-3 py-1.5 text-white text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={formData.orbitTitle2}
                      onChange={(e) => setFormData({ ...formData, orbitTitle2: e.target.value })}
                      className="w-full bg-[#050B18] border border-[#1E2E5D] rounded-xl px-3 py-1.5 text-white text-xs font-bold outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#050B18] border-t border-[#1E2E5D] flex items-center justify-between">
          <button
            onClick={() => {
              onReset();
              setSavedNotification(true);
              setTimeout(() => setSavedNotification(false), 2000);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset ke Teks Awal</span>
          </button>

          <div className="flex items-center gap-3">
            {savedNotification && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tersimpan & Diterapkan ke Video!</span>
              </span>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold uppercase transition-colors"
            >
              Tutup
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#FACC15] hover:bg-yellow-400 text-[#060B19] rounded-xl text-xs font-black uppercase flex items-center gap-1.5 shadow-lg shadow-yellow-500/20 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Simpan & Terapkan</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
