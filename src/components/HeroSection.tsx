import React from 'react';
import goatImage from '../assets/images/dairy_goat_farm_1790247733097.jpg';
import { Product } from '../types';

interface HeroSectionProps {
  featuredProducts: Product[];
  onOpenReviews: () => void;
  onNavigateToProducts: () => void;
  onNavigateToEducation: () => void;
  onBuyProduct: (product: Product) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredProducts,
  onOpenReviews,
  onNavigateToProducts,
  onNavigateToEducation,
  onBuyProduct,
}) => {
  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-16">
      {/* HERO BANNER */}
      <section className="py-12 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Kolom Kiri */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Tagline */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-forest font-bold text-xs shadow-xs">
                <span className="w-2 h-2 rounded-full bg-forest animate-pulse"></span>
                Penjualan dan Edukasi Susu Kambing Terlengkap
              </div>

              {/* Headline Wajib */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                Susu kambing segar, <span className="text-forest">langsung dari peternak</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
                Pilih peternakan mitra di Pontianak, dapatkan perahan murni harian, dan nikmati kesegaran
                alami untuk kesehatan pencernaan dan imunitas keluarga Anda.
              </p>

              {/* Dua Tombol Aksi */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  type="button"
                  onClick={onNavigateToProducts}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-forest hover:bg-forest-600 text-white font-extrabold text-sm shadow-lg shadow-forest/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="ti ti-shopping-cart text-lg"></i>
                  <span>Lihat Katalog Produk</span>
                </button>
                <button
                  type="button"
                  onClick={onNavigateToEducation}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="ti ti-book text-lg text-sky"></i>
                  <span>Penjelasan dan Edukasi</span>
                </button>
              </div>

              {/* Trust Badge Klikable untuk Review Modal */}
              <div className="pt-4 flex items-center justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={onOpenReviews}
                  className="cursor-pointer inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-colors text-xs font-bold text-slate-700"
                >
                  <span className="text-amber-500 font-black">⭐ 4.7 dari 214 pembeli</span>
                  <span className="text-sky underline">(Lihat Ulasan)</span>
                </button>
              </div>
            </div>

            {/* Kolom Kanan: Gambar Kambing & 4 Badge */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl max-w-md mx-auto">
                {/* Keterangan di atas gambar */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-forest bg-forest-50 px-3 py-1 rounded-full">
                    Ketentuan Peternakan
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Kandang Higienis Pontianak</span>
                </div>

                {/* Gambar Kambing Perah Higienis */}
                <div className="relative h-64 rounded-2xl overflow-hidden mb-4 bg-slate-100 group">
                  <img
                    src={goatImage}
                    alt="Kambing Perah Higienis Pontianak"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-xs">
                    Perahan Fajar 05:30 WIB
                  </span>
                </div>

                {/* Heading di bawah gambar */}
                <h3 className="text-xl font-black text-slate-900 mb-3">Higienis & Alami</h3>

                {/* 4 Badge Wajib */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5 p-2 bg-forest-50 rounded-xl text-forest border border-forest-100">
                    <i className="ti ti-certificate"></i>
                    <span>Peternakan Resmi</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-sky-50 rounded-xl text-sky border border-sky-100">
                    <i className="ti ti-building-community"></i>
                    <span>2 Peternakan Mitra</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-emerald-50 rounded-xl text-emerald-800 border border-emerald-100">
                    <i className="ti ti-shield-check"></i>
                    <span>Terdaftar Halal</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl text-slate-700 border border-slate-200">
                    <i className="ti ti-clipboard-check"></i>
                    <span>Melalui prosedur</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROSES 4 LANGKAH DENGAN PANAH */}
      <section className="py-6 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase font-extrabold tracking-widest text-forest bg-forest-50 px-3 py-1 rounded-full">
              Alur Transaksi Mudah
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Proses Pemesanan Susu Kambing Segar
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              4 langkah praktis dari kandang peternak hingga sampai di meja makan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {/* Langkah 1 */}
            <div className="bg-[#FDFBF7] p-5 rounded-3xl border border-slate-200 text-center relative flex flex-col items-center justify-between group hover:border-forest transition-all">
              <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center text-2xl font-black mb-3">
                1
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Pilih Peternakan</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Tentukan peternakan mitra terdekat di Pontianak (Enggano Farm / Tazayyad Farm).
              </p>
              <div className="mt-3 text-[11px] font-bold text-forest flex items-center gap-1">
                <span>Mitra Terverifikasi</span>
                <i className="ti ti-circle-check text-xs"></i>
              </div>
            </div>

            {/* Langkah 2 */}
            <div className="bg-[#FDFBF7] p-5 rounded-3xl border border-slate-200 text-center relative flex flex-col items-center justify-between group hover:border-forest transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sky/10 text-sky flex items-center justify-center text-2xl font-black mb-3">
                2
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Pesan / Pre-order</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Pilih susu segar pasteurisasi harian atau booking kuota pre-order perahan fajar.
              </p>
              <div className="mt-3 text-[11px] font-bold text-sky flex items-center gap-1">
                <span>Pilihan Slot Jam</span>
                <i className="ti ti-clock text-xs"></i>
              </div>
            </div>

            {/* Langkah 3 */}
            <div className="bg-[#FDFBF7] p-5 rounded-3xl border border-slate-200 text-center relative flex flex-col items-center justify-between group hover:border-forest transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center text-2xl font-black mb-3">
                3
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">COD / Ambil Sendiri</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Kurir antar dingin dengan cooler box atau ambil langsung ke kandang segar.
              </p>
              <div className="mt-3 text-[11px] font-bold text-amber-700 flex items-center gap-1">
                <span>Cooler Box 4°C</span>
                <i className="ti ti-snowflake text-xs"></i>
              </div>
            </div>

            {/* Langkah 4 */}
            <div className="bg-[#FDFBF7] p-5 rounded-3xl border border-slate-200 text-center relative flex flex-col items-center justify-between group hover:border-forest transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-2xl font-black mb-3">
                4
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Nilai Peternakan</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Beri ulasan dan rating 5 bintang untuk mendukung transparansi peternak lokal.
              </p>
              <div className="mt-3 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <span>Ulasan Transparan</span>
                <i className="ti ti-star text-xs"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUK UNGGULAN DENGAN TOMBOL "BELI" (LANGSUNG KE HALAMAN PRODUK) */}
      <section className="py-8 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-forest bg-forest-50 px-3 py-1 rounded-full">
                Katalog Unggulan
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Pilihan Perahan Terpopuler Hari Ini
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Klik <strong>"Beli"</strong> untuk langsung melihat rincian dan melakukan pemesanan di Halaman Produk.
              </p>
            </div>
            <button
              type="button"
              onClick={onNavigateToProducts}
              className="text-xs font-bold text-forest hover:text-forest-600 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>Lihat Semua Produk</span>
              <i className="ti ti-arrow-right"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 3).map((prod) => (
              <div
                key={prod.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
              >
                <div>
                  <div className="h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100 relative">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold text-forest shadow-xs">
                      {prod.farmName}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 bg-forest text-white px-2.5 py-0.5 rounded-lg text-xs font-black shadow-xs">
                      {formatRupiah(prod.price)}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base">{prod.name}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Stok: {prod.stock} {prod.unit}
                  </span>
                  <button
                    type="button"
                    onClick={() => onBuyProduct(prod)}
                    className="px-5 py-2 rounded-xl bg-forest hover:bg-forest-600 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
                  >
                    <i className="ti ti-shopping-cart-plus"></i>
                    <span>Beli</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
