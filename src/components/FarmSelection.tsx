import React, { useState } from 'react';
import { Farm, FarmOtherProduct } from '../types';

interface FarmProfileProps {
  farms: Farm[];
  selectedFarmId: string;
  onSelectFarm: (farm: Farm) => void;
  otherProducts: FarmOtherProduct[];
  onOpenReport: (targetType: string, targetName: string) => void;
  onNavigateToProducts: () => void;
  onOrderOtherProduct: (item: FarmOtherProduct) => void;
}

export const FarmSelection: React.FC<FarmProfileProps> = ({
  farms,
  selectedFarmId,
  onSelectFarm,
  otherProducts,
  onOpenReport,
  onNavigateToProducts,
  onOrderOtherProduct,
}) => {
  const currentFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];
  const farmOtherItems = otherProducts.filter((item) => item.farmId === currentFarm.id);

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <section className="py-12 bg-cream min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Profil Peternak */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-widest text-forest bg-forest-50 px-3 py-1 rounded-full">
            Mitra Peternak Resmi Pontianak
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
            Profil Peternakan Kambing Perah
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Pilih peternakan mitra di bawah ini untuk melihat spesifikasi kandang, jenis kambing, dan produk unggulan lainnya.
          </p>
        </div>

        {/* Tab Pemilih Peternakan */}
        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {farms.map((farm) => {
            const isSelected = farm.id === currentFarm.id;
            return (
              <button
                key={farm.id}
                type="button"
                onClick={() => onSelectFarm(farm)}
                className={`p-4 rounded-3xl border text-left transition-all cursor-pointer flex items-center gap-3.5 flex-1 min-w-[260px] ${
                  isSelected
                    ? 'bg-white border-2 border-forest shadow-md ring-2 ring-forest/20'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${
                    isSelected ? 'bg-forest text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {farm.code}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 truncate">
                      {farm.name}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-forest animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{farm.address}</p>
                  <span className="text-[10px] font-bold text-amber-500">
                    ⭐ {farm.rating} ({farm.reviewCount} ulasan)
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Kartu Profil Detail Peternak yang Terpilih */}
        <div className="max-w-4xl mx-auto bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-sm relative">
          {/* Tombol Laporkan Peternakan (Ikon Bendera) */}
          <button
            type="button"
            onClick={() => onOpenReport('peternak', currentFarm.name)}
            className="absolute top-7 right-7 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Laporkan Peternakan Ini"
          >
            <i className="ti ti-flag"></i>
            <span>Laporkan</span>
          </button>

          <div className="flex flex-col sm:flex-row items-start gap-5 pb-6 border-b border-slate-100">
            <div className="w-20 h-20 rounded-3xl bg-forest/10 text-forest font-black text-3xl flex items-center justify-center shrink-0">
              {currentFarm.code}
            </div>
            <div className="space-y-1.5 flex-1 pr-12">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900">{currentFarm.name}</h2>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold ${currentFarm.badgeBg} ${currentFarm.badgeColor}`}
                >
                  {currentFarm.breed}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <i className="ti ti-map-pin text-forest"></i>
                <span>{currentFarm.address}</span>
                <span>•</span>
                <i className="ti ti-clock text-sky"></i>
                <span>{currentFarm.milkedTimeAgo}</span>
              </p>
              <div className="flex items-center gap-3 pt-1 text-xs">
                <span className="font-extrabold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md">
                  ⭐ Rating: {currentFarm.rating} / 5.0 ({currentFarm.reviewCount} ulasan konsumen)
                </span>
                <span className="text-slate-500">
                  Kapasitas Perah: <strong>{currentFarm.capacity}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Deskripsi Spesifikasi Peternakan */}
          <div className="py-6 space-y-3 border-b border-slate-100 text-xs sm:text-sm">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">
              Deskripsi & Spesifikasi Kandang
            </h3>
            <p className="text-slate-600 leading-relaxed">{currentFarm.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-forest-50 text-forest border border-emerald-100 font-semibold">
                ✓ Pakan 100% Rumput Segar & Indigofera
              </div>
              <div className="p-3 rounded-2xl bg-sky-50 text-sky border border-sky-100 font-semibold">
                ✓ Pemerahan Higienis Standar Higiene Sanitasi
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-800 border border-amber-100 font-semibold">
                ✓ Pemeriksaan Berkala Dokter Hewan Dinas
              </div>
            </div>
          </div>

          {/* SECTION: PRODUK UNGGULAN LAINNYA (KOHE, Kunjungan Peternakan, Kambing Jantan) */}
          <div className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Produk Unggulan Lainnya
                </h3>
                <p className="text-xs text-slate-500">
                  Layanan dan produk sampingan dari kandang {currentFarm.name}: <strong>KOHE</strong>,{' '}
                  <strong>Kunjungan Peternakan</strong>, dan <strong>Kambing Jantan</strong>.
                </p>
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                Dapat dikelola oleh peternak saat login
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {farmOtherItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#FDFBF7] border border-slate-200 hover:border-forest transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div>
                    <div className="h-32 rounded-xl overflow-hidden mb-2.5 bg-slate-100 relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/95 text-[10px] font-black text-forest shadow-xs">
                        {item.category}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-xs">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-forest block">
                        {formatRupiah(item.price)}
                      </span>
                      <span className="text-[10px] text-slate-400">/{item.unit}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOrderOtherProduct(item)}
                      className="px-3 py-1.5 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <i className="ti ti-shopping-cart-plus"></i>
                      <span>Pesan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tombol kembali ke Katalog Produk Susu */}
            <div className="pt-6 text-center">
              <button
                type="button"
                onClick={onNavigateToProducts}
                className="px-6 py-3 rounded-2xl bg-white border border-slate-300 hover:border-forest text-forest font-bold text-xs shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <i className="ti ti-bottle"></i>
                <span>Lihat Katalog Produk Susu dari {currentFarm.name}</span>
                <i className="ti ti-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
