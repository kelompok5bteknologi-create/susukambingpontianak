import React, { useState } from 'react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  link?: string;
  linkText?: string;
}

export const HealthAssistantChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Halo! Ada yang ingin ditanyakan seputar khasiat susu kambing untuk lambung (GERD), asma, atau pakan grass-fed? Ketik pesan Anda!',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [waEnabled, setWaEnabled] = useState(true);
  const [waDailyStock, setWaDailyStock] = useState(true);
  const [waOrderProgress, setWaOrderProgress] = useState(true);
  const [saveToast, setSaveToast] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      let reply =
        'Susu kambing sangat kaya fluorin alami dan molekul lemaknya 1/5 ukuran susu sapi sehingga dicerna dalam 20 menit tanpa memicu gas lambung.';
      let link: string | undefined;
      let linkText: string | undefined;

      const lower = text.toLowerCase();
      if (lower.includes('grass-fed') || lower.includes('rumput')) {
        reply =
          'Pakan grass-fed menjaga susu kaya Omega-3 dan CLA alami 2x lebih banyak. Anda bisa membaca penjelasan detailnya di bagian edukasi.';
        link = '#edukasi';
        linkText = 'Pelajari Edukasi Grass-fed';
      } else if (lower.includes('pesan') || lower.includes('beli') || lower.includes('order')) {
        reply =
          'Anda dapat memesan langsung melalui tombol "Tambah ke Keranjang" di katalog produk atau memilih slot di Kalender Pre-order!';
        link = '#produk';
        linkText = 'Lihat Katalog Produk';
      } else if (
        lower.includes('lambung') ||
        lower.includes('gerd') ||
        lower.includes('maag') ||
        lower.includes('asam')
      ) {
        reply =
          'Untuk penderita GERD & Maag: Minumlah 200ml susu kambing hangat 30 menit sebelum makan pagi. Sifat alkali alaminya sangat ampuh menetralkan kelebihan asam lambung.';
      } else if (lower.includes('alergi') || lower.includes('anak') || lower.includes('laktosa')) {
        reply =
          'Susu kambing mengandung protein beta-kasein A2 yang hipoalergenik dan jauh lebih ramah untuk anak atau dewasa yang tidak tahan susu sapi biasa.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'a-' + Date.now(),
          sender: 'assistant',
          text: reply,
          link,
          linkText,
        },
      ]);
    }, 600);
  };

  const handleSaveSettings = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <section className="py-16 bg-cream border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* AI Health Assistant (Chat Interaktif) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col h-[480px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  🐐
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">AI Health Assistant</h4>
                  <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                    ● Online • Konsultasi Gizi & Kambing
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Pontianak Segar</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-slate-100 text-slate-800 rounded-tr-none ml-auto'
                      : 'bg-forest-50 text-slate-800 rounded-tl-none border border-emerald-100'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.link && m.linkText && (
                    <a
                      href={m.link}
                      className="inline-block mt-1.5 text-sky font-bold underline text-[11px]"
                    >
                      {m.linkText} →
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Tanya seputar gizi (cth: lambung, grass-fed, pesan)..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-forest"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Kirim
              </button>
            </form>
          </div>

          {/* Pengaturan Notifikasi WhatsApp */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-forest font-bold text-sm">
              <i className="ti ti-brand-whatsapp text-xl"></i>
              <h3>Pengaturan Notifikasi WhatsApp</h3>
            </div>
            <p className="text-xs text-slate-500">
              Kelola bagaimana sistem peternak mengirimkan pembaruan status botol dan stok pagi hari ke nomor ponsel Anda.
            </p>

            <div className="pt-2 space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-bold text-slate-800">Notifikasi via WhatsApp</p>
                  <p className="text-[11px] text-slate-500">Terima ping otomatis ke nomor aktif</p>
                </div>
                <input
                  type="checkbox"
                  checked={waEnabled}
                  onChange={(e) => setWaEnabled(e.target.checked)}
                  className="w-5 h-5 accent-forest cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={!waEnabled}
                    checked={waDailyStock}
                    onChange={(e) => setWaDailyStock(e.target.checked)}
                    className="accent-forest cursor-pointer"
                  />
                  <span className={`text-slate-700 font-medium ${!waEnabled ? 'opacity-50' : ''}`}>
                    Kirim Update Stok Harian via WhatsApp
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={!waEnabled}
                    checked={waOrderProgress}
                    onChange={(e) => setWaOrderProgress(e.target.checked)}
                    className="accent-forest cursor-pointer"
                  />
                  <span className={`text-slate-700 font-medium ${!waEnabled ? 'opacity-50' : ''}`}>
                    Notifikasi Perubahan Status Pesanan
                  </span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleSaveSettings}
                className="w-full py-2.5 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-xs shadow transition-all cursor-pointer"
              >
                Simpan Pengaturan
              </button>

              {saveToast && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-forest text-center font-bold text-[11px] border border-emerald-200 animate-fadeIn">
                  ✓ Pengaturan notifikasi berhasil disimpan!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
