import React, { useState } from 'react';

// 1. MODAL LAPOR (FITUR 56)
interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: string;
  targetName: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetName,
}) => {
  const [category, setCategory] = useState('Kemasan Pecah / Bocor');
  const [desc, setDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) {
      alert('Mohon jelaskan rincian kendala Anda!');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDesc('');
      onClose();
      alert('Laporan Anda telah diterima. Tim kami akan menindaklanjuti dalam 1x24 jam.');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <i className="ti ti-flag"></i>
            <span>Laporkan Keluhan</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-600">
          Target: <strong className="text-slate-900 font-bold">{targetType.toUpperCase()}: {targetName}</strong>
        </p>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 text-forest text-center font-bold">
            ✓ Mengirimkan laporan ke tim penjamin mutu...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Masalah</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white cursor-pointer"
              >
                <option>Kemasan Pecah / Bocor</option>
                <option>Susu Bau / Tidak Segar</option>
                <option>Keterlambatan Pengiriman</option>
                <option>Kandungan Tidak Sesuai Deskripsi</option>
                <option>Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Deskripsi Keluhan</label>
              <textarea
                rows={3}
                required
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Jelaskan kendala yang Anda temui secara detail..."
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              ></textarea>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Upload Foto Bukti (Opsional)</label>
              <input
                type="file"
                className="w-full text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow cursor-pointer transition-colors"
            >
              Kirim Laporan
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// 2. MODAL DAFTAR ULASAN (Klik ⭐ 4.7 dari 214 pembeli di Hero)
interface ReviewsListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewsListModal: React.FC<ReviewsListModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const reviews = [
    {
      name: 'dr. Denny Pratama',
      rating: '★★★★★',
      comment:
        'Susu Saanen dari Enggano Farm sangat gurih dan tanpa bau prengus. Membantu menstabilkan asam lambung saya sejak minggu pertama.',
      farm: 'Enggano Farm 100',
    },
    {
      name: 'Rina Wahyuni',
      rating: '★★★★★',
      comment:
        'Pengiriman cooler box dinginnya pas. Anak saya ada alergi protein susu sapi, tapi cocok dan lahap minum susu kambing ini.',
      farm: 'Tazayyad Farm',
    },
    {
      name: 'H. Syarif Usman',
      rating: '★★★★★',
      comment:
        'Rutin pesan perahan fajar 500ml untuk pemulihan sendi dan nafas. Sangat segar karena diperah langsung subuh.',
      farm: 'Enggano Farm 100',
    },
    {
      name: 'Dewi Lestari',
      rating: '★★★★☆',
      comment:
        'Sabun susu kambingnya lembut banget di kulit, tidak bikin kering dan gatal alergi langsung berkurang.',
      farm: 'Enggano Farm 100',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-sm text-slate-900">Ulasan Pembeli Susu Kambing Pontianak</h3>
            <span className="text-[11px] text-amber-500 font-bold">⭐ 4.7 Rata-rata dari 214 Pembeli</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {reviews.map((rev, i) => (
            <div key={i} className="p-3 bg-cream rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold items-center">
                <span>{rev.name}</span>
                <span className="text-amber-500 tracking-wider">{rev.rating}</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">"{rev.comment}"</p>
              <span className="text-[10px] text-forest font-semibold">Mitra: {rev.farm}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. MODAL PILIH KOORDINAT PETA (FITUR 87)
interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCoords: (coords: string) => void;
}

export const MapPickerModal: React.FC<MapPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectCoords,
}) => {
  const [manualInput, setManualInput] = useState('');

  if (!isOpen) return null;

  const quickPoints = [
    { name: 'Jl. Danau Sentarum (Pontianak Kota)', coords: '-0.0263, 109.3425' },
    { name: 'Siantan Hilir (Pontianak Utara)', coords: '-0.0125, 109.3380' },
    { name: 'Pontianak Selatan (Kawasan Purnama)', coords: '-0.0540, 109.3480' },
    { name: 'Sungai Raya Dalam (Kubu Raya / Pontianak)', coords: '-0.0680, 109.3550' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
            <i className="ti ti-map-pin text-forest"></i>
            <span>Pilih Koordinat Antar (Pontianak)</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>
        <p className="text-slate-500">
          Pilih salah satu titik cepat atau masukkan latitude & longitude alamat tujuan Anda:
        </p>

        <div className="space-y-2">
          {quickPoints.map((pt) => (
            <button
              key={pt.coords}
              type="button"
              onClick={() => {
                onSelectCoords(pt.coords);
                onClose();
              }}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:bg-forest-50 hover:border-forest font-medium flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>📍 {pt.name}</span>
              <span className="font-mono text-[10px] text-slate-400">{pt.coords}</span>
            </button>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100">
          <label className="block font-bold text-slate-700 mb-1">Input Manual (Lat, Long)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="-0.0263, 109.3425"
              className="flex-1 p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
            />
            <button
              type="button"
              onClick={() => {
                if (manualInput.trim()) {
                  onSelectCoords(manualInput.trim());
                  onClose();
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold cursor-pointer"
            >
              Gunakan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. MODAL CONNECT TO WHATSAPP (WHATSAPP AI CONSULTANT)
interface WhatsAppConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppConsultantModal: React.FC<WhatsAppConsultantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedTopic, setSelectedTopic] = useState('Khasiat untuk Lambung & GERD');
  const [customQuestion, setCustomQuestion] = useState('');
  const [copied, setCopied] = useState(false);
  const [aiPreviewResponse, setAiPreviewResponse] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickTopics = [
    {
      title: 'Khasiat Lambung & GERD',
      text: 'Halo AI Consultant, saya ingin konsultasi cara minum susu kambing segar untuk mengatasi asam lambung / GERD.',
    },
    {
      title: 'Alergi Susu Sapi & Anak',
      text: 'Halo AI Consultant, apakah susu kambing aman dikonsumsi anak dengan riwayat intoleransi laktosa?',
    },
    {
      title: 'Jadwal Perahan Fajar',
      text: 'Halo AI Consultant, bagaimana jadwal perahan subuh hari ini di Enggano Farm & Tazayyad Farm?',
    },
    {
      title: 'Panduan Grass-fed & Penyimpanan',
      text: 'Halo AI Consultant, berapa lama susu kambing pasteurisasi dapat disimpan di kulkas?',
    },
  ];

  const currentMessage =
    customQuestion.trim() ||
    quickTopics.find((t) => t.title === selectedTopic)?.text ||
    'Halo AI Consultant Susu Kambing Pontianak, saya ingin konsultasi.';

  const waLink = `https://wa.me/6281258907821?text=${encodeURIComponent(currentMessage)}`;

  const handleSimulateAiConsult = () => {
    let reply =
      'AI Consultant WhatsApp: Susu kambing kaya fluorin alami dan molekul lemaknya 1/5 ukuran susu sapi, sehingga sangat mudah diserap tubuh dalam 20 menit tanpa memicu gas lambung.';
    if (currentMessage.toLowerCase().includes('anak') || currentMessage.toLowerCase().includes('alergi')) {
      reply =
        'AI Consultant WhatsApp: Susu kambing mengandung protein beta-kasein A2 yang hipoalergenik, cocok untuk anak yang sensitif terhadap protein alpha S1-kasein susu sapi.';
    } else if (currentMessage.toLowerCase().includes('simpan') || currentMessage.toLowerCase().includes('kulkas')) {
      reply =
        'AI Consultant WhatsApp: Susu pasteurisasi tahan 5-7 hari di suhu 4°C kulkas, dan susu mentah perahan fajar disarankan dihabiskan dalam 24 jam.';
    }
    setAiPreviewResponse(reply);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 text-xs space-y-4 shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center text-xl shadow-md">
              <i className="ti ti-brand-whatsapp"></i>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm text-slate-900">WhatsApp AI Consultant</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Aktif 24/7 • Konsultasi Cerdas Pontianak
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-600 leading-relaxed">
          Hubungkan pertanyaan Anda langsung ke <strong>WhatsApp AI Consultant</strong> resmi Susu
          Kambing Pontianak (<strong>+62 812-5890-7821</strong>). Pilih topik konsultasi atau ketik pesan Anda:
        </p>

        {/* Pilihan Topik Cepat */}
        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700 text-[11px]">Pilih Topik Konsultasi Cepat:</label>
          <div className="grid grid-cols-2 gap-1.5">
            {quickTopics.map((topic) => (
              <button
                key={topic.title}
                type="button"
                onClick={() => {
                  setSelectedTopic(topic.title);
                  setCustomQuestion(topic.text);
                  setAiPreviewResponse(null);
                }}
                className={`p-2 rounded-xl text-left text-[11px] font-semibold border transition-all cursor-pointer ${
                  selectedTopic === topic.title
                    ? 'bg-emerald-50 border-emerald-400 text-forest'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {topic.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Pesan Konsultasi */}
        <div>
          <label className="block font-bold text-slate-700 mb-1 text-[11px]">Pesan Anda:</label>
          <textarea
            rows={3}
            value={currentMessage}
            onChange={(e) => {
              setCustomQuestion(e.target.value);
              setAiPreviewResponse(null);
            }}
            placeholder="Tulis pertanyaan Anda seputar gizi, kesehatan, atau stok susu..."
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#25D366] outline-none text-xs"
          ></textarea>
        </div>

        {/* Preview Jawaban Cepat dari AI */}
        {aiPreviewResponse && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-forest text-[11px] leading-relaxed animate-fadeIn">
            <p className="font-bold flex items-center gap-1 mb-1">
              <i className="ti ti-sparkles text-emerald-600"></i> Cuplikan Jawaban AI:
            </p>
            <p className="text-slate-700">{aiPreviewResponse}</p>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="space-y-2 pt-1">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <i className="ti ti-brand-whatsapp text-lg"></i>
            <span>Buka Chat di WhatsApp</span>
          </a>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSimulateAiConsult}
              className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <i className="ti ti-sparkles text-forest"></i>
              <span>Cek Respon AI di Web</span>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-[11px] cursor-pointer"
              title="Salin Teks Pesan"
            >
              {copied ? '✓ Tersalin' : 'Salin Pesan'}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 font-bold block mx-auto hover:text-slate-600 cursor-pointer pt-1"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
