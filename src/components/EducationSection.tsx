import React, { useEffect, useRef } from 'react';

interface EducationSectionProps {
  highlightedTopic: 'grass-fed' | 'pasteurisasi' | null;
  onNavigateToProducts: () => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  highlightedTopic,
  onNavigateToProducts,
}) => {
  const grassfedRef = useRef<HTMLDivElement>(null);
  const pasteurisasiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightedTopic === 'grass-fed' && grassfedRef.current) {
      grassfedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (highlightedTopic === 'pasteurisasi' && pasteurisasiRef.current) {
      pasteurisasiRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedTopic]);

  return (
    <div className="py-12 bg-cream min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Edukasi */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-widest text-sky bg-sky-50 px-3 py-1 rounded-full">
            Pusat Pengetahuan & Literasi
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
            Edukasi Susu Kambing Segar Terlengkap
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Pelajari standar kebersihan kandang, proses pakan alami, serta khasiat klinis susu kambing
            untuk daya tahan tubuh dan penderita asam lambung.
          </p>
        </div>

        {/* 2 Artikel Utama (Grass-fed & Pasteurisasi) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Artikel 1: Grass-fed */}
          <div
            ref={grassfedRef}
            className={`p-7 rounded-3xl bg-white border shadow-xs transition-all duration-500 ${
              highlightedTopic === 'grass-fed'
                ? 'ring-4 ring-forest border-forest scale-[1.02] shadow-lg'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-forest bg-forest-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Standar Pakan Alami
              </span>
              <span className="text-xs text-slate-400 font-semibold">100% Organik</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Apa itu Susu Kambing Grass-fed?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              Kambing <strong>Grass-fed</strong> hanya diberi makan hijauan segar alami seperti rumput gajah,
              daun gamal, dan legum indigofera tanpa pakan kimia atau konsentrat hormonal.
            </p>
            <div className="mt-4 p-4 rounded-2xl bg-forest-50/70 border border-emerald-100 space-y-2 text-xs">
              <p className="font-bold text-forest">Keunggulan Nutrisi Grass-fed:</p>
              <ul className="space-y-1.5 text-slate-700">
                <li className="flex items-start gap-2">
                  <i className="ti ti-check text-forest mt-0.5"></i>
                  <span>Asam Lemak Omega-3 & CLA hingga 2 kali lipat lebih melimpah.</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ti ti-check text-forest mt-0.5"></i>
                  <span>Aroma susu lebih harum segar, tidak berbau prengus/apek kandang.</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ti ti-check text-forest mt-0.5"></i>
                  <span>Bebas residu antibiotik dan hormon pemacu pertumbuhan hewan.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Artikel 2: Pasteurisasi */}
          <div
            ref={pasteurisasiRef}
            className={`p-7 rounded-3xl bg-white border shadow-xs transition-all duration-500 ${
              highlightedTopic === 'pasteurisasi'
                ? 'ring-4 ring-sky border-sky scale-[1.02] shadow-lg'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-sky bg-sky-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Keamanan & Higienitas
              </span>
              <span className="text-xs text-slate-400 font-semibold">Suhu Rendah LTLT</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Mengapa Memilih Susu Pasteurisasi?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              <strong>Pasteurisasi</strong> adalah pemanasan terkontrol pada suhu 63°C selama 30 menit.
              Metode ini membunuh bakteri patogen tanpa merusak struktur vitamin dan protein susu.
            </p>
            <div className="mt-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2 text-xs">
              <p className="font-bold text-sky">Manfaat Standar Pasteurisasi:</p>
              <ul className="space-y-1.5 text-slate-700">
                <li className="flex items-start gap-2">
                  <i className="ti ti-check text-sky mt-0.5"></i>
                  <span>Menjamin keamanan dari bakteri Salmonella, E. Coli, dan Listeria.</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ti ti-check text-sky mt-0.5"></i>
                  <span>Enzim pencernaan dan kalsium alami tetap utuh dan mudah diserap tubuh.</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ti ti-check text-sky mt-0.5"></i>
                  <span>Masa simpan tahan 5-7 hari di kulkas 4°C atau 3 bulan di freezer beku.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Artikel 3 & 4: Khasiat Susu Kambing vs Susu Sapi & Penanganan di Rumah */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-xs">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl font-bold mb-3">
              <i className="ti ti-heart-rate-monitor"></i>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Ramah Bagi Lambung (GERD/Maag)</h3>
            <p className="text-slate-600 leading-relaxed">
              Kandungan protein A2 Beta-Kasein dan gumpalan curd yang lebih lembut membuat susu kambing
              dicerna hanya dalam 20 menit, berbeda dengan susu sapi yang butuh 2-3 jam.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-forest flex items-center justify-center text-xl font-bold mb-3">
              <i className="ti ti-shield-half-filled"></i>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Alergi Rendah & Kaya Kalsium</h3>
            <p className="text-slate-600 leading-relaxed">
              Kadar alpha-s1-kasein penyebab alergi pada susu kambing sangat rendah, menjadikannya alternatif
              terbaik untuk anak atau lansia yang memiliki intoleransi laktosa ringan.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky flex items-center justify-center text-xl font-bold mb-3">
              <i className="ti ti-snowflake"></i>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Tips Simpan di Lemari Es</h3>
            <p className="text-slate-600 leading-relaxed">
              Selalu letakkan botol di rak tengah kulkas (bukan di pintu kulkas) pada suhu 2°C - 4°C.
              Jangan biarkan botol terbuka di suhu ruangan lebih dari 2 jam.
            </p>
          </div>
        </div>

        {/* CTA Beralih ke Katalog */}
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-forest text-white text-center space-y-4 shadow-xl">
          <h3 className="text-2xl font-black">Siap Merasakan Khasiat Susu Kambing Segar?</h3>
          <p className="text-xs text-emerald-100 max-w-md mx-auto">
            Pesan sekarang dari peternakan mitra kami di Pontianak. Dikirim dingin menggunakan cooler box langsung ke depan pintu Anda.
          </p>
          <button
            type="button"
            onClick={onNavigateToProducts}
            className="px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-forest font-black text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <i className="ti ti-shopping-cart text-base"></i>
            <span>Beli Susu Kambing Segar Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
