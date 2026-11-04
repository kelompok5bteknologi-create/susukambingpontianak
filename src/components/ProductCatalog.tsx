import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCatalogProps {
  products: Product[];
  selectedFarmName: string;
  onAddToCart: (product: Product) => void;
  onOpenReport: (targetType: string, targetName: string) => void;
  onSwitchToPartner: () => void;
  onHighlightEducation: (type: 'grass-fed' | 'pasteurisasi') => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedFarmName,
  onAddToCart,
  onOpenReport,
  onSwitchToPartner,
  onHighlightEducation,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const categories = ['Semua', 'Susu Murni', 'Varian Rasa', 'Perawatan Kulit'];

  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'Semua') return true;
    return p.category === activeCategory;
  });

  return (
    <section className="py-12 bg-white min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Katalog */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase font-extrabold tracking-widest text-forest bg-forest-50 px-3 py-1 rounded-full">
            Katalog Produk Segar
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
            Pilihan Susu Kambing Murni & Olahan
          </h1>
          <p className="text-xs text-slate-500 mt-1.5">
            Diperah segar setiap subuh dari peternakan mitra Pontianak tanpa bahan pengawet.
          </p>
        </div>

        {/* Kotak Rekomendasi Mitra Terdekat saat Stok Habis / Menipis */}
        <div className="max-w-4xl mx-auto mb-8 p-5 rounded-2xl bg-sky-50 border-2 border-sky/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky text-white flex items-center justify-center shrink-0 shadow-xs">
              <i className="ti ti-arrows-exchange text-xl"></i>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-sky tracking-wider block">
                Saling Bantu Stok Mitra
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                Stok perahan utama peternakan mitra menipis!
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Rekomendasi dari Mitra Terdekat: <strong>Susu Kambing Segar 500ml</strong> -{' '}
                <strong>Kandang Berkah Etawa</strong> (Rp 35.000)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSwitchToPartner}
            className="px-5 py-2.5 rounded-xl bg-sky hover:bg-sky-600 text-white text-xs font-bold shrink-0 shadow-xs transition-all cursor-pointer"
          >
            Beralih ke Produk Ini
          </button>
        </div>

        {/* Filter Kategori */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-forest text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Kartu Produk */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#FDFBF7] p-6 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-xs relative hover:shadow-md transition-shadow group"
            >
              {/* Tombol Laporkan Produk (Ikon Bendera) */}
              <button
                type="button"
                onClick={() => onOpenReport('produk', product.name)}
                className="absolute top-8 right-8 p-1.5 rounded-xl bg-white text-slate-400 hover:text-rose-600 border border-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs z-10"
                title="Laporkan Produk Ini"
              >
                <i className="ti ti-flag text-rose-500"></i>
                <span className="text-[11px]">Laporkan</span>
              </button>

              <div>
                <div className="h-52 rounded-2xl overflow-hidden mb-4 bg-slate-200 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-extrabold text-forest shadow-xs">
                    {product.farmName}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-xl font-black text-slate-900">{product.name}</h3>
                  <span className="text-xl font-black text-forest">
                    {formatRupiah(product.price)}
                  </span>
                </div>

                {/* Deskripsi dengan Hyperlink Biru: Grass-fed & Pasteurisasi */}
                {product.name.includes('Susu') ? (
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Susu segar murni perahan pagi hari tanpa pengawet. Dihasilkan dengan pakan rumput alami{' '}
                    <button
                      type="button"
                      onClick={() => onHighlightEducation('grass-fed')}
                      className="text-sky font-bold hover:underline cursor-pointer inline p-0 underline decoration-sky/50"
                      title="Klik untuk membaca artikel edukasi Grass-fed"
                    >
                      Grass-fed
                    </button>{' '}
                    dan melalui sterilisasi suhu rendah{' '}
                    <button
                      type="button"
                      onClick={() => onHighlightEducation('pasteurisasi')}
                      className="text-sky font-bold hover:underline cursor-pointer inline p-0 underline decoration-sky/50"
                      title="Klik untuk membaca artikel edukasi Pasteurisasi"
                    >
                      Pasteurisasi
                    </button>{' '}
                    untuk membunuh bakteri berbahaya tanpa merusak nutrisi.
                  </p>
                ) : (
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Stok: <strong className="text-slate-800">{product.stock}</strong> {product.unit}
                </span>
                <button
                  type="button"
                  onClick={() => onAddToCart(product)}
                  className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <i className="ti ti-plus"></i>
                  <span>Tambah ke Keranjang</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
