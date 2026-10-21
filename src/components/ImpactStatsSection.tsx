import React from 'react';
import { Leaf, Clock, TrendingUp, ShieldCheck, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export const ImpactStatsSection: React.FC = () => {
  return (
    <section className="py-12 border-t border-slate-800 bg-[#070D18]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Headline */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 font-mono">
            <Leaf className="w-3.5 h-3.5" />
            <span>Kalkulator Dampak Sirkular Terukur</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Mengubah Sampah Beracun Menjadi Nilai Nyata
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Perbandingan pendekatan konvensional vs ekosistem TechLoop bertenaga n8n dalam memulihkan siklus hidup gadget.
          </p>
        </div>

        {/* 4 Quantitative Rigor KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">
              Kecepatan Keputusan Sirkular
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
              &lt; 15 detik
            </div>
            <span className="text-[11px] text-emerald-400 mt-1 block font-mono">
              vs 3-5 hari survei manual
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">
              Akurasi Matriks Aturan n8n
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tabular-nums">
              100%
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block font-mono">
              4 dari 4 skenario terpetakan
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">
              Transparansi Keputusan
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#FACC15] tabular-nums">
              100%
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block font-mono">
              alasan logis tanpa bias
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">
              Zero Landfill Target
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
              100%
            </div>
            <span className="text-[11px] text-emerald-400 mt-1 block font-mono">
              0% material beracun ke TPA
            </span>
          </div>
        </div>

        {/* Side-by-Side Comparison: Tradisional vs TechLoop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Way */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Cara Konvensional (Sebelum TechLoop)</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Gadget lama menumpuk di laci bertahun-tahun hingga baterai kembung dan rusak total.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Pengguna tidak tahu apakah hp retak masih layak diservis atau sudah harus dibuang.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Seringkali dibuang sembarangan ke tempat sampah basah, mencemari air tanah dengan timbal dan merkuri.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Komponen sehat seperti RAM dan SSD hilang sia-sia padahal dicari bengkel servis lokal.</span>
              </li>
            </ul>
          </div>

          {/* TechLoop Circular Way */}
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-lg shadow-emerald-500/5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Dengan TechLoop & Workflow n8n</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Cukup foto perangkat di Telegram, AI langsung mendeteksi jenis kerusakan dan nilai pasaran.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Keputusan 4 jalur sirkular yang transparan: Pakai Ulang, Servis, Kanibal Komponen, atau Peleburan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Terhubung langsung ke mitra kurir pickup, teknisi sirkular, dan fasilitas daur ulang resmi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Pengguna memperoleh insentif rupiah, reward EcoPoints, dan sertifikat reduksi jejak karbon.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};
