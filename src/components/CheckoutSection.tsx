import React, { useState } from 'react';
import { CartItem, PaymentMethodType, OrderItem, BuyerHistoryItem, PreorderSlot } from '../types';

interface CartAndCheckoutProps {
  cart: CartItem[];
  onUpdateCartQty: (itemId: string, delta: number) => void;
  onRemoveCartItem: (itemId: string) => void;
  historyItems: BuyerHistoryItem[];
  onReorder: (productName: string, quantity: number, price: number) => void;
  slots: PreorderSlot[];
  selectedSlot: string;
  setSelectedSlot: (slot: string) => void;
  coordinates: string;
  setCoordinates: (coords: string) => void;
  onOpenMapPicker: () => void;
  onOrderSuccess: (order: OrderItem) => void;
  onSwitchToPartner: () => void;
  onNavigateToProducts: () => void;
}

export const CheckoutSection: React.FC<CartAndCheckoutProps> = ({
  cart,
  onUpdateCartQty,
  onRemoveCartItem,
  historyItems,
  onReorder,
  slots,
  selectedSlot,
  setSelectedSlot,
  coordinates,
  setCoordinates,
  onOpenMapPicker,
  onOrderSuccess,
  onSwitchToPartner,
  onNavigateToProducts,
}) => {
  // Pre-order controls
  const [isPreorder, setIsPreorder] = useState<boolean>(false);
  const [preorderLiters, setPreorderLiters] = useState<number>(2);
  const [selectedPreorderSlotId, setSelectedPreorderSlotId] = useState<number>(slots[0]?.id || 1);

  // Guest checkout form inputs
  const [name, setName] = useState('Budi Santoso');
  const [phone, setPhone] = useState('0812-5890-7821');
  const [address, setAddress] = useState('Jl. Danau Sentarum No. 45, Pontianak Kota');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('Transfer Bank');

  // Checkout submission states
  const [showCheckoutForm, setShowCheckoutForm] = useState<boolean>(true);
  const [completedOrder, setCompletedOrder] = useState<OrderItem | null>(null);

  // Post-order Rating Form states (5 stars + textarea + submit)
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0 && !isPreorder) {
      alert('Keranjang belanja Anda masih kosong! Silakan tambahkan produk terlebih dahulu.');
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('Mohon lengkapi Nama, WhatsApp, dan Alamat pengiriman Anda.');
      return;
    }

    // Check if selected preorder slot is full
    if (isPreorder) {
      const targetSlot = slots.find((s) => s.id === selectedPreorderSlotId);
      if (targetSlot && targetSlot.status === 'Penuh') {
        alert('Slot pre-order yang dipilih sudah penuh (⛔ Tertutup Otomatis). Silakan pilih tanggal lain.');
        return;
      }
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderLitersTotal = isPreorder ? preorderLiters : 0;
    const finalTotal = isPreorder && cart.length === 0 ? preorderLiters * 65000 : cartTotal;

    const newOrder: OrderItem = {
      id: 'ord-' + Date.now(),
      orderNumber: `#SKP-${randomNum}`,
      isGuest: true,
      status: 'Baru',
      date:
        new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }) +
        ', ' +
        new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) +
        ' WIB',
      total: finalTotal,
      paymentMethod,
      productName: isPreorder
        ? `Pre-order Perahan Fajar (${preorderLiters} Liter)`
        : cart.map((i) => `${i.quantity}x ${i.name}`).join(', '),
      quantity: isPreorder ? preorderLiters : cart.reduce((sum, i) => sum + i.quantity, 0),
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      slot: selectedSlot,
      coordinates: coordinates || '-0.0263, 109.3425',
      farmName: cart[0]?.farmName || 'Enggano Farm 100',
      isPreorder,
      preorderLiters: orderLitersTotal,
    };

    onOrderSuccess(newOrder);
    setCompletedOrder(newOrder);
    setReviewSubmitted(false);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    alert(`Terima kasih atas penilaian bintang ${rating} Anda! Ulasan Anda telah tercatat.`);
  };

  return (
    <div className="py-12 bg-cream min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Keranjang & Riwayat */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-widest text-forest bg-forest-50 px-3 py-1 rounded-full">
            Area Transaksi Pembeli
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
            Keranjang & Riwayat Pesanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Kelola pesanan yang sedang diproses, tinjau riwayat transaksi sebelumnya, dan selesaikan pengiriman.
          </p>
        </div>

        {/* Modal/Banner Rekomendasi Mitra Terdekat Jika Stok Menipis/Habis */}
        <div className="max-w-5xl mx-auto p-4 sm:p-5 rounded-3xl bg-sky-50 border-2 border-sky/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky text-white flex items-center justify-center shrink-0 shadow-xs">
              <i className="ti ti-arrows-exchange text-xl"></i>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-sky tracking-wider block">
                Saling Bantu Stok Mitra Terdekat
              </span>
              <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
                Rekomendasi dari Mitra Terdekat:{' '}
                <strong>Susu Kambing Segar 500ml - Kandang Berkah Etawa</strong> (Rp 35.000)
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

        {/* ============================================================== */}
        {/* BAGIAN 1: PRODUK PENYELESAIAN PESANAN (KERANJANG ITEM & CHECKOUT) */}
        {/* ============================================================== */}
        <section className="max-w-5xl mx-auto bg-white p-6 sm:p-9 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-black text-forest uppercase tracking-wider">
                Bagian 1
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Produk Penyelesaian Pesanan
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {cart.reduce((s, i) => s + i.quantity, 0)} Item dalam Keranjang
            </span>
          </div>

          {/* Daftar Item Keranjang */}
          {cart.length === 0 ? (
            <div className="text-center py-10 space-y-3 bg-[#FDFBF7] rounded-3xl border border-dashed border-slate-300">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-2xl">
                <i className="ti ti-shopping-cart"></i>
              </div>
              <p className="text-sm font-bold text-slate-700">Keranjang belanja Anda masih kosong</p>
              <p className="text-xs text-slate-400">Silakan pilih susu segar favorit Anda dari katalog produk.</p>
              <button
                type="button"
                onClick={onNavigateToProducts}
                className="mt-2 px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Buka Katalog Produk
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#FDFBF7] border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-sm">{item.name}</h3>
                    <p className="text-xs text-slate-500">
                      Peternakan: <strong>{item.farmName}</strong> • Harga Satuan:{' '}
                      <strong className="text-forest">{formatRupiah(item.price)}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    {/* Tombol + / - kuantitas */}
                    <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-2xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => onUpdateCartQty(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                        title="Kurangi Kuantitas"
                      >
                        -
                      </button>
                      <span className="w-9 text-center font-black text-xs text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateCartQty(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                        title="Tambah Kuantitas"
                      >
                        +
                      </button>
                    </div>

                    <span className="w-24 text-right font-black text-sm text-slate-900">
                      {formatRupiah(item.price * item.quantity)}
                    </span>

                    <button
                      type="button"
                      onClick={() => onRemoveCartItem(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Hapus Item"
                    >
                      <i className="ti ti-trash text-lg"></i>
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-3 flex flex-col sm:flex-row justify-between items-center text-sm font-bold text-slate-700 border-t border-slate-100">
                <span className="text-xs text-slate-500">Ongkir Cooler Box Termos (Pontianak): <strong className="text-emerald-700">GRATIS</strong></span>
                <div className="flex items-baseline gap-2">
                  <span>Total Tagihan Item:</span>
                  <span className="text-xl font-black text-forest">{formatRupiah(cartTotal)}</span>
                </div>
              </div>
            </div>
          )}

          {/* OPSI PRE-ORDER SUSU KAMBING */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-extrabold text-amber-950 text-sm">
                <input
                  type="checkbox"
                  checked={isPreorder}
                  onChange={(e) => setIsPreorder(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 cursor-pointer"
                />
                <span>Aktifkan Opsi Pre-order Perahan Fajar</span>
              </label>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Susu Murni Langsung Kandang
              </span>
            </div>

            {isPreorder && (
              <div className="space-y-4 pt-2 border-t border-amber-200 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-amber-900 mb-1">
                      Pilih Total Liter Susu
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={preorderLiters}
                        onChange={(e) => setPreorderLiters(parseInt(e.target.value, 10))}
                        className="p-2.5 rounded-xl border border-amber-300 bg-white font-bold text-slate-800 flex-1 outline-none"
                      >
                        <option value={1}>1 Liter (Rp 65.000)</option>
                        <option value={2}>2 Liter (Rp 130.000)</option>
                        <option value={3}>3 Liter (Rp 195.000)</option>
                        <option value={5}>5 Liter (Rp 325.000)</option>
                        <option value={10}>10 Liter (Rp 650.000)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-amber-900 mb-1">
                      Pilih Jadwal Slot Pre-order (Kuota Per Tanggal)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {slots.map((s) => {
                        const isFull = s.status === 'Penuh';
                        const isChecked = selectedPreorderSlotId === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            disabled={isFull}
                            onClick={() => setSelectedPreorderSlotId(s.id)}
                            className={`p-2 rounded-xl border text-left transition-all ${
                              isFull
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                : isChecked
                                ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                                : 'bg-white border-amber-200 hover:border-amber-400 text-slate-800 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span>{s.date} ({s.day})</span>
                              {isFull && <span className="font-bold text-rose-500">⛔ Penuh</span>}
                            </div>
                            <span className="text-[10px] block opacity-80">
                              {isFull ? 'Otomatis tertutup' : `Tersedia (${s.booked}/${s.max})`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FORMULIR CHECKOUT PENGIRIMAN */}
          <div className="pt-4 border-t border-slate-200 space-y-6">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide">
              Informasi Pengiriman & Pembayaran
            </h3>

            <form onSubmit={handleCheckoutSubmit} className="space-y-6 text-xs">
              {/* Data Diri Pembeli (Input Manual Tanpa Buku Alamat) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Lengkap Pembeli
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-forest outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor WhatsApp Aktif
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-forest outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Alamat Lengkap di Pontianak
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Jl. Danau Sentarum No. 45, Kecamatan Pontianak Kota"
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-forest outline-none"
                  ></textarea>
                </div>
              </div>

              {/* Koordinat Lat/Long Manual + Tombol Pilih di Peta */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">
                    Titik Koordinat Lokasi Pengiriman
                  </label>
                  <button
                    type="button"
                    onClick={onOpenMapPicker}
                    className="px-3.5 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest border border-forest-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                  >
                    <i className="ti ti-map-pin"></i>
                    <span>Pilih di Peta</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={coordinates}
                  onChange={(e) => setCoordinates(e.target.value)}
                  placeholder="-0.0263, 109.3425"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white font-mono text-slate-700 focus:ring-2 focus:ring-forest outline-none"
                />
                <p className="text-[11px] text-slate-400">
                  *Anda dapat menginput koordinat latitude/longitude secara manual atau klik tombol <em>Pilih di Peta</em>.
                </p>
              </div>

              {/* Slot Jam Pengiriman */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-800">
                  Slot Jam Pengiriman
                </label>
                <p className="text-[11px] text-slate-500">
                  Perahan fajar dikirim siang hari. Pilihan slot pagi (06:00-09:00) dikirim pada esok hari.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <label
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      selectedSlot === '06:00 - 09:00'
                        ? 'bg-forest-50 border-forest ring-1 ring-forest'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">06:00 - 09:00</span>
                      <span className="text-[10px] text-forest font-semibold">(Dikirim Esok Hari)</span>
                    </div>
                    <input
                      type="radio"
                      name="delivery-slot"
                      value="06:00 - 09:00"
                      checked={selectedSlot === '06:00 - 09:00'}
                      onChange={() => setSelectedSlot('06:00 - 09:00')}
                      className="accent-forest cursor-pointer"
                    />
                  </label>

                  {/* Slot Penuh */}
                  <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-between cursor-not-allowed">
                    <div>
                      <span className="font-bold block">09:00 - 12:00</span>
                      <span className="text-[10px] font-extrabold text-rose-500">⛔ Penuh</span>
                    </div>
                    <i className="ti ti-lock text-base"></i>
                  </div>

                  <label
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      selectedSlot === '12:00 - 15:00'
                        ? 'bg-forest-50 border-forest ring-1 ring-forest'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">12:00 - 15:00</span>
                      <span className="text-[10px] text-slate-500">Siang Hari</span>
                    </div>
                    <input
                      type="radio"
                      name="delivery-slot"
                      value="12:00 - 15:00"
                      checked={selectedSlot === '12:00 - 15:00'}
                      onChange={() => setSelectedSlot('12:00 - 15:00')}
                      className="accent-forest cursor-pointer"
                    />
                  </label>

                  <label
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      selectedSlot === '15:00 - 18:00'
                        ? 'bg-forest-50 border-forest ring-1 ring-forest'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">15:00 - 18:00</span>
                      <span className="text-[10px] text-slate-500">Sore Hari</span>
                    </div>
                    <input
                      type="radio"
                      name="delivery-slot"
                      value="15:00 - 18:00"
                      checked={selectedSlot === '15:00 - 18:00'}
                      onChange={() => setSelectedSlot('15:00 - 18:00')}
                      className="accent-forest cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Metode Pembayaran */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-800">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Transfer Bank */}
                  <label
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'Transfer Bank'
                        ? 'bg-forest-50 border-forest ring-1 ring-forest'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Transfer Bank</span>
                      <input
                        type="radio"
                        name="pay-method"
                        value="Transfer Bank"
                        checked={paymentMethod === 'Transfer Bank'}
                        onChange={() => setPaymentMethod('Transfer Bank')}
                        className="accent-forest cursor-pointer"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">BCA / Bank Kalbar</p>
                  </label>

                  {/* E-Wallet */}
                  <label
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'E-Wallet'
                        ? 'bg-forest-50 border-forest ring-1 ring-forest'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">E-Wallet</span>
                      <input
                        type="radio"
                        name="pay-method"
                        value="E-Wallet"
                        checked={paymentMethod === 'E-Wallet'}
                        onChange={() => setPaymentMethod('E-Wallet')}
                        className="accent-forest cursor-pointer"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">GoPay / OVO / DANA</p>
                  </label>

                  {/* COD */}
                  <label
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'COD'
                        ? 'bg-forest-50 border-forest ring-1 ring-forest'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">COD (Tunai)</span>
                      <input
                        type="radio"
                        name="pay-method"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="accent-forest cursor-pointer"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">Bayar saat kurir tiba</p>
                  </label>

                  {/* QRIS */}
                  <label
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'QRIS'
                        ? 'bg-forest-50 border-forest ring-1 ring-forest'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">QRIS Instant</span>
                      <input
                        type="radio"
                        name="pay-method"
                        value="QRIS"
                        checked={paymentMethod === 'QRIS'}
                        onChange={() => setPaymentMethod('QRIS')}
                        className="accent-forest cursor-pointer"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">Scan semua aplikasi</p>
                  </label>
                </div>

                {/* Detail Box Masing-Masing Metode Pembayaran */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  {paymentMethod === 'Transfer Bank' && (
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800">Detail Rekening Transfer:</p>
                      <p className="text-slate-600">
                        BCA: <strong>8901-229-100</strong> a.n. Susu Kambing Pontianak
                      </p>
                      <p className="text-slate-600">
                        Bank Kalbar: <strong>102-990-4412</strong> a.n. Kelompok Peternak Etawa
                      </p>
                    </div>
                  )}
                  {paymentMethod === 'E-Wallet' && (
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800">Detail Nomor E-Wallet:</p>
                      <p className="text-slate-600">
                        GoPay / DANA / OVO: <strong>0812-5890-7821</strong> a.n. Susu Kambing Pontianak
                      </p>
                    </div>
                  )}
                  {paymentMethod === 'COD' && (
                    <p className="text-slate-600">
                      Siapkan uang pas saat kurir tiba. Susu akan diperiksa bersama untuk memastikan botol tetap dingin dan segel utuh.
                    </p>
                  )}
                  {paymentMethod === 'QRIS' && (
                    <div className="text-center py-2 space-y-2">
                      <div className="w-24 h-24 bg-white border border-slate-300 mx-auto rounded-xl flex items-center justify-center shadow-xs">
                        <i className="ti ti-qrcode text-5xl text-slate-800"></i>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 block">
                        Scan QRIS Susu Kambing Pontianak (NMID: ID102998371)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tombol Pesan Sekarang */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-forest hover:bg-forest-600 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <i className="ti ti-check text-lg"></i>
                <span>Pesan Sekarang</span>
              </button>
            </form>
          </div>

          {/* Form Penilaian Pasca Pemesanan (5 Bintang + Textarea + Tombol Kirim) */}
          {completedOrder && (
            <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-emerald-50/90 border-2 border-forest text-xs space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-forest font-black text-sm">
                <i className="ti ti-circle-check text-xl"></i>
                <span>Pesanan {completedOrder.orderNumber} Berhasil Dibuat!</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Terima kasih, <strong>{completedOrder.customerName}</strong>! Pesanan Anda telah diterima oleh peternak{' '}
                <strong>{completedOrder.farmName}</strong> dan notifikasi konfirmasi telah diteruskan via WhatsApp ke{' '}
                <strong>{completedOrder.customerPhone}</strong>.
              </p>

              {/* Formulir Penilaian Interaktif */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    Form Penilaian Pengalaman
                  </h4>
                  <span className="text-[11px] font-bold text-forest">5 Bintang Ulasan</span>
                </div>

                {reviewSubmitted ? (
                  <div className="p-3 bg-emerald-100 rounded-xl text-forest font-bold text-center">
                    ✓ Terima kasih! Penilaian {rating} bintang Anda berhasil dikirim ke peternak {completedOrder.farmName}.
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="flex items-center justify-center gap-2 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(star)}
                          className="text-2xl transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                        >
                          <i
                            className={`ti ${
                              (hoverRating !== null ? hoverRating >= star : rating >= star)
                                ? 'ti-star-filled text-amber-400'
                                : 'ti-star text-slate-300'
                            }`}
                          ></i>
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={2}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Bagikan sepatah kata penilaian Anda mengenai kemudahan pemesanan atau kesegaran susu..."
                      className="w-full p-3 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-forest"
                    ></textarea>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
                    >
                      Kirim Penilaian
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* BAGIAN 2: RIWAYAT PESANAN (TRANSAKSI SEBELUMNYA) */}
        {/* ============================================================== */}
        <section className="max-w-5xl mx-auto bg-white p-6 sm:p-9 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-black text-forest uppercase tracking-wider">
                Bagian 2
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Riwayat Pesanan
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Daftar Transaksi Pembelian Sebelumnya
            </span>
          </div>

          <div className="space-y-3">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#FDFBF7] border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-2xs hover:border-slate-300 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900">{item.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-forest font-black text-[10px]">
                      {item.status}
                    </span>
                    <span className="text-slate-400 font-medium">{item.date}</span>
                  </div>
                  <p className="font-extrabold text-slate-800 text-sm mt-0.5">{item.items}</p>
                  <p className="text-slate-500">
                    Peternak: <strong>{item.farmName}</strong> • Total:{' '}
                    <strong className="text-forest">{formatRupiah(item.total)}</strong> • Poin Diperoleh:{' '}
                    <strong className="text-sky">+{item.points} Poin</strong>
                  </p>
                </div>

                {/* Tombol Beli Lagi */}
                <button
                  type="button"
                  onClick={() => onReorder(item.reorderProduct, item.reorderQty, item.price)}
                  className="px-4 py-2 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors shrink-0"
                >
                  <i className="ti ti-refresh"></i>
                  <span>Beli Lagi</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
