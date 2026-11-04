import React, { useState } from 'react';

export const ProcessFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const stepDetails = [
    {
      num: '01',
      title: 'Pilih Peternakan',
      desc: 'Tentukan mitra peternakan terdekat di wilayah Pontianak.',
      icon: 'ti-home-check',
      detail:
        'Langkah 1: Tentukan peternakan mitra kami yang telah lolos verifikasi resmi dengan kandang panggung bersih dan higienis.',
    },
    {
      num: '02',
      title: 'Pesan / Pre-order',
      desc: 'Pilih susu segar pasteurisasi harian atau susu mentah fajar.',
      icon: 'ti-bottle',
      detail:
        'Langkah 2: Pilih susu pasteurisasi harian atau pesan pre-order perahan fajar sebelum pukul 06:00 WIB untuk jaminan kesegaran maksimal.',
    },
    {
      num: '03',
      title: 'COD / Ambil Sendiri',
      desc: 'Kurir cooler box mengantar atau jemput langsung di kandang.',
      icon: 'ti-truck',
      detail:
        'Langkah 3: Kurir membawa cooler box bersuhu terjaga 4°C tepat waktu ke rumah Anda, atau Anda bisa jemput langsung ke lokasi kandang mitra.',
    },
    {
      num: '04',
      title: 'Nilai Peternakan',
      desc: 'Beri ulasan dan kumpulkan poin loyalitas untuk diskon belanja.',
      icon: 'ti-star',
      detail:
        'Langkah 4: Bagikan ulasan rasa dan kesegaran susu untuk membantu peternak lokal sekaligus mengumpulkan koin poin loyalitas.',
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-extrabold tracking-widest text-forest bg-forest-50 px-3 py-1 rounded-full">
            Alur Pemesanan
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Cara Kerja Rantai Segar</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stepDetails.map((step, idx) => (
            <div
              key={step.num}
              onClick={() => setActiveStep(activeStep === idx ? null : idx)}
              className={`cursor-pointer p-5 rounded-2xl bg-cream border transition-all ${
                activeStep === idx
                  ? 'border-forest ring-2 ring-forest/20 shadow-md bg-white'
                  : 'border-slate-200 hover:border-forest hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-forest/10 text-forest font-black flex items-center justify-center text-xs">
                  {step.num}
                </span>
                <i className={`ti ${step.icon} text-slate-400 text-lg`}></i>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">{step.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
              {activeStep === idx && (
                <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-forest font-medium animate-fadeIn">
                  💡 {step.detail}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
