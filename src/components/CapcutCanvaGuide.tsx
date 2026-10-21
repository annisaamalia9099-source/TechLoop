import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  FileText, 
  Video, 
  Layers, 
  Music, 
  Sparkles, 
  ExternalLink,
  Smartphone,
  Clock,
  Award
} from 'lucide-react';
import { SCENARIO_STEPS } from '../data/scenariosData';

interface CapcutCanvaGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CapcutCanvaGuide: React.FC<CapcutCanvaGuideProps> = ({ isOpen, onClose }) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'script' | 'guide' | 'storyboard'>('script');

  if (!isOpen) return null;

  const fullVoiceoverScript = `=== NASKAH VOICEOVER TECHLOOP PRODUCT SHOWCASE (DURASI ~1.5 MENIT) ===

[00:00 - 00:15] INTRO - KRISIS E-WASTE & TECHLOOP
"Setiap tahun, sampah elektronik terus menumpuk tanpa penanganan tepat. Seringkali kita bingung: perangkat elektronik bekas ini masih layak pakai, bisa diperbaiki, diambil suku cadangnya, atau harus didaur ulang? TechLoop hadir menghubungkan Telegram Bot dengan otomasi workflow n8n untuk menentukan keputusan sirkular terbaik secara instan."

[00:15 - 00:35] SKENARIO 1: REUSE (PERANGKAT MASIH BERFUNGSI)
"Skenario pertama: Reuse. Saat pengguna memasukkan deskripsi bahwa laptop masih berfungsi dengan baik dan bisa digunakan kembali, sistem n8n memvalidasi kondisi prima dan langsung merekomendasikan penggunaan kembali secara langsung tanpa harus dibuang."

[00:35 - 00:55] SKENARIO 2: REFURBISHMENT (RUSAK RINGAN)
"Skenario kedua: Refurbishment. Ketika ada laptop dengan kerusakan ringan yang masih bisa diperbaiki, sistem merekomendasikan perangkat masuk proses perbaikan untuk memperpanjang usia pakainya."

[00:55 - 01:15] SKENARIO 3: COMPONENT RECOVERY (SUKU CADANG MODULAR)
"Skenario ketiga: Component Recovery. Untuk perangkat yang mati sebagian tetapi suku cadangnya masih bernilai, sistem menyarankan pemisahan komponen berharga untuk digunakan pada perangkat lain."

[01:15 - 01:30] SKENARIO 4: RECYCLING (RUSAK TOTAL)
"Skenario keempat: Recycling. Untuk laptop yang rusak total dan tidak bisa diperbaiki, sistem mengarahkannya ke proses daur ulang material resmi untuk mencegah pencemaran lingkungan."

[01:30 - 01:45] CLOSING - KEPUTUSAN SIRKULAR INSTAN
"Dengan integrasi n8n dan Telegram, TechLoop membuktikan bahwa keputusan sirkular dapat diambil secara instan, konsisten, dan transparan dalam hitungan detik. TechLoop: Circular Economy, Simplified."`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullVoiceoverScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Panduan Pembuatan Video Demo (CapCut / Canva)
              </h2>
              <p className="text-xs text-slate-400">
                Naskah voiceover, storyboard 1.5 menit, dan panduan edit frame smartphone untuk juri
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-950/60 px-6 pt-2 border-b border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab('script')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'script'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Naskah Voiceover (1.5 Menit)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'guide'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Tutorial Edit CapCut & Canva</span>
          </button>

          <button
            onClick={() => setActiveTab('storyboard')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'storyboard'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Storyboard & Timestamp</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-300 text-xs leading-relaxed">
          
          {/* TAB 1: SCRIPT VOICEOVER */}
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-200 font-semibold text-xs">
                    Naskah Voiceover Siap Pakai (Bahasa Indonesia Natural)
                  </span>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Tersalin ke Clipboard!' : 'Salin Naskah'}</span>
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-sans space-y-4 text-slate-300">
                <div className="border-l-2 border-emerald-500 pl-3">
                  <span className="text-emerald-400 font-mono text-[11px] block font-semibold mb-1">
                    00:00 - 00:15 · INTRODUKSI
                  </span>
                  <p className="text-slate-200">
                    "Setiap tahun, lebih dari 62 juta ton sampah elektronik terbuang ke TPA dan meracuni lingkungan. Seringkali kita bingung: gadget lama ini masih laku dijual, bisa diperbaiki, atau harus dibuang? TechLoop hadir sebagai solusi cerdas berbasis otomasi n8n dan AI untuk menentukan keputusan sirkular terbaik hanya dalam hitungan detik lewat Telegram."
                  </p>
                </div>

                <div className="border-l-2 border-emerald-500 pl-3">
                  <span className="text-emerald-400 font-mono text-[11px] block font-semibold mb-1">
                    00:15 - 00:35 · SKENARIO 1: REUSE (PERANGKAT NORMAL)
                  </span>
                  <p className="text-slate-200">
                    "Skenario pertama: Reuse. Saat pengguna memasukkan foto Google Pixel 7 yang masih mulus dan berfungsi normal, TechLoop langsung mendeteksi kondisi Grade A dan memberikan penawaran trade-in instan senilai Rp 3.450.000 ke mitra refurbished bersertifikat, mencegah 58 kg emisi karbon dari manufaktur baru."
                  </p>
                </div>

                <div className="border-l-2 border-blue-500 pl-3">
                  <span className="text-blue-400 font-mono text-[11px] block font-semibold mb-1">
                    00:35 - 00:55 · SKENARIO 2: REPAIR / REFURBISH (RUSAK RINGAN)
                  </span>
                  <p className="text-slate-200">
                    "Skenario kedua: Repair atau Refurbish. Ketika ada ponsel dengan layar retak tetapi mesin dan sensornya masih sehat, sistem menghitung biaya ganti kaca luar hanya Rp 420.000 untuk memulihkan nilai aset Rp 2.650.000. Pengguna langsung mendapatkan booking teknisi sirkular terdekat dengan garansi 90 hari."
                  </p>
                </div>

                <div className="border-l-2 border-amber-500 pl-3">
                  <span className="text-amber-400 font-mono text-[11px] block font-semibold mb-1">
                    00:55 - 01:15 · SKENARIO 3: COMPONENT RECOVERY (SUKU CADANG)
                  </span>
                  <p className="text-slate-200">
                    "Skenario ketiga: Component Recovery. Laptop mati total kena tumpahan air tidak berarti sampah tak berguna. AI TechLoop mendeteksi modul berharga seperti RAM DDR4, SSD 512GB, dan baterai sehat, lalu menawarkan kompensasi panen suku cadang Rp 870.000 untuk membantu teknisi lokal memperbaiki perangkat lain."
                  </p>
                </div>

                <div className="border-l-2 border-teal-500 pl-3">
                  <span className="text-teal-400 font-mono text-[11px] block font-semibold mb-1">
                    01:15 - 01:30 · SKENARIO 4: CERTIFIED RECYCLING (RUSAK TOTAL)
                  </span>
                  <p className="text-slate-200">
                    "Skenario keempat: Certified Recycling. Untuk limbah PCB dan baterai yang rusak parah dan berbahaya, TechLoop mengarahkannya ke fasilitas peleburan berlisensi untuk mengekstraksi emas dan tembaga dengan prinsip zero-landfill, serta memberikan reward EcoPoints dan sertifikat ESG."
                  </p>
                </div>

                <div className="border-l-2 border-purple-500 pl-3">
                  <span className="text-purple-400 font-mono text-[11px] block font-semibold mb-1">
                    01:30 - 01:45 · CLOSING
                  </span>
                  <p className="text-slate-200">
                    "Dengan integrasi cerdas n8n dan Telegram, TechLoop mengubah kebingungan sampah elektronik menjadi aksi sirkular yang transparan, menguntungkan, dan menyelamatkan bumi. TechLoop: Closing the Loop on Electronics."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STEP BY STEP GUIDE CAPCUT & CANVA */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1 */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[11px]">
                      1
                    </div>
                    <span>Rekam Layar Bot dari Demo ini</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Klik tombol <strong>"Rekam Video"</strong> di toolbar demo ini, atau gunakan OBS / Screen Recorder bawaan laptop. Putar tombol "Putar Demo Otomatis" dari awal sampai selesai (durasi ~1.5 menit).
                  </p>
                  <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg font-mono">
                    Tips: Layar HP sudah memiliki frame smartphone profesional, status bar, dan animasi chat Telegram nyata!
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs">
                    <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-[11px]">
                      2
                    </div>
                    <span>Buat Project di CapCut atau Canva</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    • <strong>Untuk Presentasi Juri / YouTube</strong>: Pilih format <strong>16:9 (1920x1080)</strong>.<br />
                    • <strong>Untuk TikTok / Instagram Reels</strong>: Pilih format <strong>9:16 (1080x1920)</strong>.<br />
                    Tarik (drag & drop) video hasil rekaman ke timeline editor.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[11px]">
                      3
                    </div>
                    <span>Tambahkan Frame Mockup (Jika Belum Ada)</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Jika merekam full-screen bot: Di Canva, cari elemen <em>"Phone Frame Mockup"</em> lalu masukkan videonya ke dalam frame. Di CapCut, tambahkan template overlay handphone dengan background gradient modern.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-[11px]">
                      4
                    </div>
                    <span>Voiceover & Backsound Santai</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Gunakan naskah yang kami siapkan di Tab 1. Anda bisa rekam suara sendiri menggunakan mic headset, atau gunakan fitur <strong>Text-to-Speech CapCut</strong> (Pilih suara narator santai). Tambahkan musik Lo-Fi santai dengan volume 15%.
                  </p>
                </div>

                {/* Step 5 */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs">
                    <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-[11px]">
                      5
                    </div>
                    <span>Auto-Captions & Teks Penjelas (Biar Mudah Dinilai Juri)</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Di CapCut, klik menu <strong>Text → Auto Captions</strong> → Pilih Bahasa Indonesia. Font rekomendasi: <strong>Plus Jakarta Sans / Montserrat</strong> tebal dengan stroke hitam tipis atau latar rounded. Setiap skenario (Reuse, Repair, Component, Recycle) beri highlight warna berbeda!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STORYBOARD & TIMESTAMPS */}
          {activeTab === 'storyboard' && (
            <div className="space-y-3">
              {SCENARIO_STEPS.map((step, idx) => (
                <div 
                  key={step.id} 
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-black shrink-0 border border-slate-800">
                      <img 
                        src={step.devicePhoto} 
                        alt={step.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold font-mono text-xs">
                          {idx + 1}. {step.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ({step.durationSeconds} detik)
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs">{step.subtitle}</p>
                    </div>
                  </div>

                  <div className="text-right sm:shrink-0 text-[11px] font-mono text-slate-400">
                    <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                      {step.circularAction}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-slate-400 text-xs">
            Format rekomendasi juri: 1 - 1.5 Menit · MP4 Full HD 1080p · 30 FPS
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Tutup Panduan
          </button>
        </div>

      </div>
    </div>
  );
};
