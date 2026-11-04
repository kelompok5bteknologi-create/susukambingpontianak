import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-black text-lg">
            <div className="w-8 h-8 rounded-lg bg-forest text-white flex items-center justify-center">
              <i className="ti ti-bottle"></i>
            </div>
            <span>
              Susu Kambing <span className="text-emerald-400">Pontianak</span>
            </span>
          </div>
          <p className="text-slate-400 text-center md:text-left">
            Platform terintegrasi penjualan dan edukasi susu kambing segar pertama di Pontianak.
          </p>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
          <p>© 2026 Susu Kambing Pontianak. Hak Cipta Dilindungi.</p>
          <p>Design System: Forest Green (#2C5F2D) • Soft Cream (#FDFBF7) • Sky Blue (#1976D2)</p>
        </div>
      </div>
    </footer>
  );
};
