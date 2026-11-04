import React from 'react';
import { PreorderType, PreorderSlot } from '../types';

interface PreorderCalendarProps {
  preorderType: PreorderType;
  setPreorderType: (type: PreorderType) => void;
  slots: PreorderSlot[];
  selectedSlotDate: string | null;
  onSelectSlot: (slot: PreorderSlot) => void;
}

export const PreorderCalendar: React.FC<PreorderCalendarProps> = ({
  preorderType,
  setPreorderType,
  slots,
  selectedSlotDate,
  onSelectSlot,
}) => {
  return (
    <section id="preorder" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase font-extrabold tracking-widest text-forest bg-forest-50 px-3 py-1 rounded-full">
            Pre-order Perahan Fajar
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-2">Kalender Slot Pemesanan</h2>
          <p className="text-xs text-slate-500 mt-1">
            Pilih tanggal perahan sebelum susu masuk tahap pasteurisasi atau susu siap minum.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-cream p-6 rounded-3xl border border-slate-200 shadow-sm">
          {/* Pilihan Jenis Susu Pre-order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <label
              className={`p-4 rounded-2xl bg-white border-2 cursor-pointer flex items-start gap-3 shadow-xs transition-all ${
                preorderType === 'raw'
                  ? 'border-forest ring-2 ring-forest/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="preorder-type"
                value="raw"
                checked={preorderType === 'raw'}
                onChange={() => setPreorderType('raw')}
                className="mt-1 accent-forest cursor-pointer"
              />
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                  Pre-order Susu Mentah (Segar)
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm mt-1">
                  Susu Segar (Sebelum Pasteurisasi)
                </h4>
                <p className="text-[11px] text-rose-600 font-bold mt-1">
                  ⚠️ Perhatian: Harus dihabiskan dalam 24 jam
                </p>
              </div>
            </label>

            <label
              className={`p-4 rounded-2xl bg-white border-2 cursor-pointer flex items-start gap-3 shadow-xs transition-all ${
                preorderType === 'pasteurized'
                  ? 'border-forest ring-2 ring-forest/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="preorder-type"
                value="pasteurized"
                checked={preorderType === 'pasteurized'}
                onChange={() => setPreorderType('pasteurized')}
                className="mt-1 accent-forest cursor-pointer"
              />
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-sky text-white uppercase tracking-wider">
                  Susu Siap Minum
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm mt-1">
                  Susu Pasteurisasi
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Tahan hingga 5-7 hari di suhu dingin 4°C kulkas.
                </p>
              </div>
            </label>
          </div>

          {/* Kalender Slot Tanggal */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {slots.map((slot) => {
              const isFull = slot.status === 'Penuh';
              const isSelected = selectedSlotDate === slot.date;
              return (
                <div
                  key={slot.id}
                  onClick={() => {
                    if (!isFull) onSelectSlot(slot);
                  }}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    isFull
                      ? 'bg-rose-50 border-rose-200 opacity-80 cursor-not-allowed'
                      : isSelected
                      ? 'bg-emerald-50 border-forest ring-2 ring-forest/30 shadow-md cursor-pointer'
                      : 'bg-white border-slate-300 hover:border-forest cursor-pointer shadow-xs'
                  }`}
                >
                  <p className="font-bold text-slate-800">
                    {slot.date} ({slot.day})
                  </p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      isFull ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {slot.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {slot.booked}/{slot.max} Botol
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
