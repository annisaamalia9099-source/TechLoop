import React, { useState } from 'react';
import { TELEGRAM_SCREENSHOTS } from '../data/scenariosData';
import { Camera, ZoomIn, X, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';

interface TelegramScreenshotsGalleryProps {
  onLoadScenarioToPhone?: (scenarioId: string) => void;
}

export const TelegramScreenshotsGallery: React.FC<TelegramScreenshotsGalleryProps> = ({
  onLoadScenarioToPhone,
}) => {
  const [selectedImage, setSelectedImage] = useState<{ src: string; label: string } | null>(null);

  const screenshotDescriptions = [
    {
      id: 1,
      title: 'Pengujian Skenario 1 (REUSE)',
      note: 'User mengirim teks "Laptop masih berfungsi dengan baik dan bisa digunakan kembali". Bot n8n membalas dengan rekomendasi REUSE secara instan.',
    },
    {
      id: 2,
      title: 'Pengujian Skenario 2 (REFURBISHMENT)',
      note: 'User mengirim teks "Laptop rusak ringan, masih sebagian berfungsi dan bisa diperbaiki". Bot n8n membalas dengan rekomendasi REFURBISHMENT.',
    },
    {
      id: 3,
      title: 'Pengujian Skenario 3 & 4 (COMPONENT & RECYCLING)',
      note: 'Menampilkan respons berurutan untuk COMPONENT RECOVERY (suku cadang bernilai) dan RECYCLING (rusak total didaur ulang).',
    },
    {
      id: 4,
      title: 'Uji Validasi Ulang REUSE & REFURB',
      note: 'Pengujian replikasi kedua untuk membuktikan determinisme logika IF/Switch di n8n tanpa deviasi keluaran.',
    },
    {
      id: 5,
      title: 'Uji Validasi Ulang COMPONENT & RECYCLE',
      note: 'Pengujian konsistensi penuh 4 pilar sirkular secara beruntun pada tanggal 30 Agustus jam 8:24 PM.',
    },
    {
      id: 6,
      title: 'Bukti Output n8n Otomatis',
      note: 'Tangkapan layar resolusi tinggi menunjukkan footer otentik: "This message was sent automatically with n8n".',
    },
  ];

  return (
    <section className="py-10 border-t border-slate-800 bg-[#0B1220] rounded-3xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1 font-mono">
            <Camera className="w-3.5 h-3.5" />
            <span>Dokumentasi Empiris Prototipe</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            6 Bukti Tangkapan Layar Asli Telegram Bot
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Tangkapan layar langsung dari pengujian prototipe TechLoop tim StarNight (SMAN 15 Jakarta) yang dilampirkan dalam dokumen karya tulis ilmiah CITE UP 2026.
          </p>
        </div>

        <span className="text-xs text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-800 px-3 py-1.5 rounded-xl shrink-0 flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4" />
          <span>100% Konsistensi 4 Skenario</span>
        </span>
      </div>

      {/* 6 Grid Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {TELEGRAM_SCREENSHOTS.map((item, idx) => {
          const desc = screenshotDescriptions[idx];
          return (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-sky-500/60 transition-all duration-300 flex flex-col justify-between group shadow-md"
            >
              {/* Image Preview with Hover Overlay */}
              <div 
                className="relative h-64 bg-slate-950 cursor-pointer overflow-hidden flex items-center justify-center"
                onClick={() => setSelectedImage({ src: item.src, label: item.label })}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay Zoom Action */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white p-2 text-center">
                  <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center shadow-lg">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold">Perbesar Bukti</span>
                </div>

                {/* Index Pill */}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  #{idx + 1}
                </div>
              </div>

              {/* Caption */}
              <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-100 line-clamp-1">
                    {desc?.title || item.label}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 line-clamp-3 leading-tight mt-1">
                    {desc?.note}
                  </p>
                </div>

                {onLoadScenarioToPhone && (
                  <button
                    onClick={() => onLoadScenarioToPhone(item.scenarioId)}
                    className="w-full mt-2 py-1 px-2 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 rounded-lg text-[10px] font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Simulasikan</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-white">
                {selectedImage.label}
              </span>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 bg-black flex items-center justify-center">
              <img
                src={selectedImage.src}
                alt={selectedImage.label}
                className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
