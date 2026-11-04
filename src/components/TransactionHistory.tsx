import React, { useState } from 'react';

interface HistoryItem {
  id: string;
  orderNumber: string;
  status: string;
  date: string;
  category: string;
  items: string;
  farmName: string;
  total: number;
  points: number;
  reorderProduct: string;
  reorderQty: number;
  price: number;
}

interface TransactionHistoryProps {
  historyItems: HistoryItem[];
  onReorder: (productName: string, quantity: number, price: number) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  historyItems,
  onReorder,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filtered = historyItems.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category.toLowerCase() === filterCategory.toLowerCase();
  });

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <section id="riwayat" className="py-16 bg-cream border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-forest bg-forest-50 px-3 py-1 rounded-full">
              Pembukuan & Mutasi Kas
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">Riwayat Transaksi Pembeli</h2>
          </div>

          {/* Filter Kategori Transaksi */}
          <div className="flex gap-2 text-xs">
            {['all', 'Pembelian', 'Refund', 'Poin'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-forest text-white'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? 'Semua' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ringkasan Kas Bulan Ini */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-xs">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-slate-400">Total Belanja Bulan Ini</span>
            <p className="text-lg font-black text-slate-900 mt-1">Rp 210.000</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-slate-400">Total Refund</span>
            <p className="text-lg font-black text-slate-900 mt-1">Rp 0</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-slate-400">Total Poin Diperoleh</span>
            <p className="text-lg font-black text-forest mt-1">+210 Poin</p>
          </div>
        </div>

        {/* Daftar Transaksi Pembeli dengan Tombol "Beli Lagi" */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center py-6 text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
              Tidak ada transaksi untuk kategori ini.
            </p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xs hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.orderNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-forest font-bold">
                      {item.status}
                    </span>
                    <span className="text-slate-400">{item.date}</span>
                  </div>
                  <p className="font-extrabold text-slate-800 mt-1">{item.items}</p>
                  <p className="text-[11px] text-slate-500">
                    {item.farmName} • {formatRupiah(item.total)} (+{item.points} Poin)
                  </p>
                </div>

                {/* Tombol Beli Lagi (Reorder Otomatis) */}
                <button
                  type="button"
                  onClick={() => onReorder(item.reorderProduct, item.reorderQty, item.price)}
                  className="px-4 py-2 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <i className="ti ti-refresh"></i>
                  <span>Beli Lagi</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
