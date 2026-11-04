import React, { useState } from 'react';
import {
  OrderItem,
  Product,
  PreorderSlot,
  SellerPage,
  Farm,
  FarmOtherProduct,
} from '../types';
import goatBarnImage from '../assets/images/dairy_goat_farm_1790247733097.jpg';

interface FarmerDashboardProps {
  sellerPage: SellerPage;
  setSellerPage: (page: SellerPage) => void;
  orders: OrderItem[];
  products: Product[];
  farms: Farm[];
  currentFarmId: string;
  setCurrentFarmId: (farmId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: 'Baru' | 'Diproses' | 'Selesai') => void;
  onAddStock: (productId: string, quantity: number) => void;
  onAddNewProduct: (newProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  otherProducts: FarmOtherProduct[];
  onAddOtherProduct: (item: FarmOtherProduct) => void;
  onDeleteOtherProduct: (id: string) => void;
  onUpdateFarmProfile: (updatedFarm: Farm) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  sellerPage,
  setSellerPage,
  orders,
  products,
  farms,
  currentFarmId,
  setCurrentFarmId,
  onUpdateOrderStatus,
  onAddStock,
  onAddNewProduct,
  onDeleteProduct,
  otherProducts,
  onAddOtherProduct,
  onDeleteOtherProduct,
  onUpdateFarmProfile,
}) => {
  const currentFarm = farms.find((f) => f.id === currentFarmId) || farms[0];

  // Stock management form
  const [stockProduct, setStockProduct] = useState<string>(products[0]?.id || '');
  const [stockAddQty, setStockAddQty] = useState<number>(10);

  // New product form
  const [showNewProdModal, setShowNewProdModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(30000);
  const [newProdStock, setNewProdStock] = useState(20);
  const [newProdUnit, setNewProdUnit] = useState('Botol');
  const [newProdCategory, setNewProdCategory] = useState('Susu Murni');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Saling Bantu Stok toggle & statistics
  const [partnerAssistanceActive, setPartnerAssistanceActive] = useState<boolean>(true);

  // Transaction history filter
  const [trxFilter, setTrxFilter] = useState<'Semua' | 'Pemasukan' | 'Penarikan' | 'Komisi'>('Semua');

  // Farm profile edit form
  const [profileName, setProfileName] = useState(currentFarm.name);
  const [profileBreed, setProfileBreed] = useState(currentFarm.breed);
  const [profileAddress, setProfileAddress] = useState(currentFarm.address);
  const [profileCapacity, setProfileCapacity] = useState(currentFarm.capacity);
  const [profileMilkedTime, setProfileMilkedTime] = useState(currentFarm.milkedTimeAgo);
  const [profileDesc, setProfileDesc] = useState(currentFarm.description);
  const [profilePhone, setProfilePhone] = useState(currentFarm.phone || '0812-5890-7821');

  // New Other Product (KOHE, Kunjungan, Kambing Jantan)
  const [newOtherCategory, setNewOtherCategory] = useState<string>('KOHE');
  const [newOtherName, setNewOtherName] = useState<string>('');
  const [newOtherPrice, setNewOtherPrice] = useState<number>(30000);
  const [newOtherUnit, setNewOtherUnit] = useState<string>('Karung');
  const [newOtherDesc, setNewOtherDesc] = useState<string>('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // MULTI-TENANT FILTER:
  // "Hanya peternak yang dipilih pembeli yang menerima pesanan ini. Peternak lain tidak boleh menerima info."
  const filteredOrders = orders.filter((o) => o.farmName === currentFarm.name);

  // Handlers for orders
  const handleProcessOrder = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'Diproses');
    showToast('Status pesanan berhasil diubah menjadi: Diproses.');
  };

  const handleCompleteOrder = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'Selesai');
    // Required alert specification:
    alert('Pesanan selesai! Notifikasi WhatsApp terkirim ke pembeli.');
    showToast('Pesanan selesai! Notifikasi WhatsApp terkirim ke pembeli.');
  };

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stockAddQty <= 0) return;
    const target = products.find((p) => p.id === stockProduct) || products[0];
    if (target) {
      onAddStock(target.id, stockAddQty);
      showToast(`Berhasil menambahkan ${stockAddQty} stok untuk ${target.name}!`);
    }
  };

  const handleCreateNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProd: Product = {
      id: 'prod-' + Date.now(),
      name: newProdName,
      price: newProdPrice,
      stock: newProdStock,
      unit: newProdUnit,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop',
      description: newProdDesc || 'Susu kambing segar higienis langsung dari perahan kandang mitra.',
      farmId: currentFarm.id,
      farmName: currentFarm.name,
      category: newProdCategory,
    };

    onAddNewProduct(newProd);
    setShowNewProdModal(false);
    setNewProdName('');
    setNewProdDesc('');
    showToast(`Produk baru ${newProd.name} berhasil ditambahkan ke katalog!`);
  };

  const handleSaveFarmProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Farm = {
      ...currentFarm,
      name: profileName,
      breed: profileBreed,
      address: profileAddress,
      capacity: profileCapacity,
      milkedTimeAgo: profileMilkedTime,
      description: profileDesc,
      phone: profilePhone,
    };
    onUpdateFarmProfile(updated);
    showToast(`Profil ${profileName} berhasil diperbarui!`);
  };

  const handleCreateOtherProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOtherName.trim()) return;

    const item: FarmOtherProduct = {
      id: 'other-' + Date.now(),
      farmId: currentFarm.id,
      name: newOtherName,
      category: newOtherCategory,
      price: newOtherPrice,
      unit: newOtherUnit,
      description: newOtherDesc || `Layanan ${newOtherCategory} dari kandang ${currentFarm.name}.`,
      image:
        newOtherCategory === 'KOHE'
          ? 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=800&auto=format&fit=crop'
          : newOtherCategory === 'Kunjungan Peternakan'
          ? goatBarnImage
          : 'https://images.unsplash.com/photo-1524024973431-2ad916746881?q=80&w=800&auto=format&fit=crop',
    };

    onAddOtherProduct(item);
    setNewOtherName('');
    setNewOtherDesc('');
    showToast(`Produk unggulan baru ${item.name} berhasil ditambahkan!`);
  };

  // Transaction mutation list with commission details
  const transactionMutations = [
    {
      id: 'trx-1',
      type: 'Pemasukan',
      title: 'Pemasukan: Pesanan #SKP-1234 (2x Susu 500ml)',
      date: '30 Sep 2026, 07:45 WIB',
      gross: 70000,
      fee: 3500,
      net: 66500,
      isTransferred: false,
    },
    {
      id: 'trx-2',
      type: 'Komisi',
      title: 'Komisi Pengalihan: Pesanan Dialihkan ke Mitra (Kandang Berkah)',
      date: '29 Sep 2026, 14:10 WIB',
      gross: 70000,
      fee: 0,
      net: 3500,
      isTransferred: true,
      commissionDetail: 'Peternak A (Anda) dapat komisi 5% (Rp 3.500), Mitra pelaksana terima sisa Rp 66.500',
    },
    {
      id: 'trx-3',
      type: 'Pemasukan',
      title: 'Pemasukan: Pesanan #SKP-1288 (1x Susu 1 Liter)',
      date: '28 Sep 2026, 09:20 WIB',
      gross: 65000,
      fee: 3250,
      net: 61750,
      isTransferred: false,
    },
    {
      id: 'trx-4',
      type: 'Penarikan',
      title: 'Pencairan Saldo ke Rekening BCA Peternak',
      date: '25 Sep 2026, 16:00 WIB',
      gross: 1500000,
      fee: 0,
      net: -1500000,
      isTransferred: false,
    },
  ];

  const filteredTransactions = transactionMutations.filter((t) => {
    if (trxFilter === 'Semua') return true;
    return t.type === trxFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-[75vh]">
      {/* Toast Notifikasi */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 p-4 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-fadeIn">
          <i className="ti ti-check text-emerald-400 text-base"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Seller & Selector Multi-Tenant Peternak */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-forest bg-forest-50 px-3 py-1 rounded-full">
              Mode Peternak (Seller)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-forest text-[11px] font-bold">
              Kandang Terverifikasi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {currentFarm.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentFarm.breed} • {currentFarm.address} • Kapasitas: {currentFarm.capacity}
          </p>
        </div>

        {/* Multi-Tenant Switcher (Peternak yang sedang login) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="text-left sm:text-right">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Kelola Peternakan:
            </span>
            <select
              value={currentFarmId}
              onChange={(e) => {
                setCurrentFarmId(e.target.value);
                const f = farms.find((farm) => farm.id === e.target.value);
                if (f) {
                  setProfileName(f.name);
                  setProfileBreed(f.breed);
                  setProfileAddress(f.address);
                  setProfileCapacity(f.capacity);
                  setProfileDesc(f.description);
                }
              }}
              className="mt-1 p-2.5 rounded-xl border border-slate-300 bg-cream font-extrabold text-xs text-slate-800 outline-none focus:ring-2 focus:ring-forest cursor-pointer"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.breed})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sub-Navigasi Tab Halaman Seller */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        {(['dashboard', 'pesanan', 'stok', 'analitik', 'profil'] as SellerPage[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSellerPage(tab)}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer capitalize ${
              sellerPage === tab
                ? 'bg-forest text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {tab === 'profil' ? 'Profil Peternakan' : tab}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 1. HALAMAN DASHBOARD PETERNAK */}
      {/* ============================================================== */}
      {sellerPage === 'dashboard' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Ringkasan Statistik Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                Pesanan Masuk Aktif
              </span>
              <p className="text-3xl font-black text-slate-900 mt-2">
                {filteredOrders.filter((o) => o.status !== 'Selesai').length}
              </p>
              <p className="text-slate-500 mt-1">Perlu diproses hari ini</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                Perahan Fajar Hari Ini
              </span>
              <p className="text-3xl font-black text-forest mt-2">35 Liter</p>
              <p className="text-slate-500 mt-1">Kapasitas: {currentFarm.capacity}</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                Saldo Tersedia Dicairkan
              </span>
              <p className="text-3xl font-black text-slate-900 mt-2">Rp 3.277.500</p>
              <p className="text-emerald-700 font-bold mt-1">Nett setelah komisi 5%</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                Rating Konsumen
              </span>
              <p className="text-3xl font-black text-amber-500 mt-2">⭐ {currentFarm.rating}</p>
              <p className="text-slate-500 mt-1">{currentFarm.reviewCount} ulasan terverifikasi</p>
            </div>
          </div>

          {/* JARINGAN MITRA — SALING BANTU STOK */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Jaringan Mitra — Saling Bantu Stok
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Membantu mengalihkan pesanan saat kandang sedang kehabisan perahan fajar atau overload.
                </p>
              </div>

              {/* Toggle switch */}
              <label className="flex items-center gap-2.5 cursor-pointer bg-forest-50 px-4 py-2.5 rounded-2xl border border-forest-100">
                <input
                  type="checkbox"
                  checked={partnerAssistanceActive}
                  onChange={(e) => {
                    setPartnerAssistanceActive(e.target.checked);
                    showToast(
                      `Status bantuan stok diperbarui: ${e.target.checked ? 'Aktif' : 'Nonaktif'}`
                    );
                  }}
                  className="w-4 h-4 accent-forest cursor-pointer"
                />
                <span className="font-extrabold text-forest text-xs">
                  Jadi alternatif saat mitra kehabisan stok
                </span>
              </label>
            </div>

            {/* 2 KARTU STATISTIK WAJIB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-sky-50 border border-sky-100 space-y-1">
                <span className="text-sky font-bold text-xs uppercase tracking-wider">
                  Pesanan Dialihkan Dari Mitra
                </span>
                <p className="text-3xl font-black text-slate-900">18 Pesanan</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pesanan yang dialihkan dari mitra ke kandang Anda bulan ini saat stok mereka kosong.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-cream border border-slate-200 space-y-1">
                <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                  Pesanan Anda Dialihkan Ke Mitra
                </span>
                <p className="text-3xl font-black text-slate-900">6 Pesanan</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pesanan Anda yang dialihkan ke mitra terdekat agar pembeli Anda tidak kecewa.
                </p>
              </div>
            </div>
          </section>

          {/* Quick link ke Pesanan & Stok */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSellerPage('pesanan')}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-forest text-left transition-all cursor-pointer flex items-center justify-between"
            >
              <div>
                <h4 className="font-black text-base text-slate-900">Lihat Pesanan Masuk</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Kelola alur Baru ➔ Diproses ➔ Selesai untuk {currentFarm.name}.
                </p>
              </div>
              <i className="ti ti-arrow-right text-xl text-forest"></i>
            </button>

            <button
              type="button"
              onClick={() => setSellerPage('stok')}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-forest text-left transition-all cursor-pointer flex items-center justify-between"
            >
              <div>
                <h4 className="font-black text-base text-slate-900">Manajemen Stok & Produk</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Tambah stok harian dan tambahkan produk perahan baru ke katalog.
                </p>
              </div>
              <i className="ti ti-arrow-right text-xl text-forest"></i>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. HALAMAN PESANAN (MANAJEMEN PESANAN) */}
      {/* ============================================================== */}
      {sellerPage === 'pesanan' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Manajemen Pesanan Masuk
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Alur status: <strong>Baru ➔ Diproses ➔ Selesai</strong>. Khusus pesanan untuk{' '}
                <strong>{currentFarm.name}</strong>.
              </p>
            </div>
            <span className="text-xs font-bold text-forest bg-forest-50 px-3 py-1.5 rounded-xl border border-forest-100">
              {filteredOrders.length} Pesanan Ditemukan
            </span>
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-10 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
                <i className="ti ti-inbox text-3xl text-slate-300"></i>
                <p className="text-sm font-bold text-slate-700">Belum ada pesanan untuk {currentFarm.name}</p>
                <p className="text-xs text-slate-400">
                  Pesanan dari peternak lain tidak ditampilkan di dashboard ini untuk menjaga privasi mitra.
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-black text-slate-900 text-sm">
                        {order.orderNumber}
                      </span>
                      {order.isGuest && (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-black text-[10px]">
                          Guest
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                          order.status === 'Baru'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'Diproses'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-forest'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-slate-400 font-medium">{order.date}</span>
                    </div>

                    <span className="text-base font-black text-forest">
                      {formatRupiah(order.total)} ({order.paymentMethod})
                    </span>
                  </div>

                  {/* Detail Pesanan Lengkap */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-black text-slate-900">{order.productName}</p>
                      <p className="text-slate-700">
                        Nama Pemesan: <strong>{order.customerName}</strong>
                      </p>
                      <p className="text-slate-700 flex items-center gap-1.5">
                        <i className="ti ti-brand-whatsapp text-emerald-600 text-sm"></i>
                        <span>WhatsApp: <strong>{order.customerPhone}</strong></span>
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        Alamat Pengiriman: <strong>{order.customerAddress}</strong>
                      </p>
                    </div>

                    {/* Koordinat Google Maps & Slot Jam */}
                    <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">Slot Jam Pengiriman:</span>
                        <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {order.slot}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="font-bold text-slate-700">Titik Koordinat:</span>
                        <span className="font-mono text-slate-600">{order.coordinates}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-200/70 text-right">
                        <a
                          href={`https://maps.google.com/?q=${order.coordinates.replace(/\s+/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky hover:text-sky-700 underline"
                        >
                          <i className="ti ti-map"></i>
                          <span>Buka Alamat di Google Maps</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi: Proses & Selesai */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    {order.status === 'Baru' && (
                      <button
                        type="button"
                        onClick={() => handleProcessOrder(order.id)}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
                      >
                        Proses Pesanan
                      </button>
                    )}

                    {order.status !== 'Selesai' && (
                      <button
                        type="button"
                        onClick={() => handleCompleteOrder(order.id)}
                        className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
                      >
                        <i className="ti ti-check"></i>
                        <span>Selesaikan Pesanan</span>
                      </button>
                    )}

                    {order.status === 'Selesai' && (
                      <span className="text-forest font-black flex items-center gap-1.5 py-1">
                        <i className="ti ti-circle-check text-base"></i>
                        <span>Pesanan Selesai (Notifikasi Terkirim)</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. HALAMAN STOK MANAGEMENT */}
      {/* ============================================================== */}
      {sellerPage === 'stok' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Manajemen Stok Produk
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Kelola ketersediaan botol susu, perbarui stok harian, atau tambahkan produk baru.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewProdModal(true)}
              className="px-4 py-2.5 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <i className="ti ti-plus"></i>
              <span>+ Tambah Produk Baru</span>
            </button>
          </div>

          {/* Form Tambah Stok Dinamis */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Input Tambahan Stok Cepat
            </h3>
            <form onSubmit={handleStockSubmit} className="flex flex-col sm:flex-row gap-3">
              <select
                value={stockProduct}
                onChange={(e) => setStockProduct(e.target.value)}
                className="p-3 rounded-xl border border-slate-300 bg-white font-bold flex-1 cursor-pointer outline-none focus:ring-2 focus:ring-forest"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stok Saat Ini: {p.stock} {p.unit})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={stockAddQty}
                onChange={(e) => setStockAddQty(parseInt(e.target.value, 10) || 1)}
                placeholder="Jumlah"
                className="w-full sm:w-28 p-3 rounded-xl border border-slate-300 bg-white text-center font-black outline-none focus:ring-2 focus:ring-forest"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-forest hover:bg-forest-600 text-white font-black text-xs shadow-xs cursor-pointer transition-colors"
              >
                + Tambah Stok
              </button>
            </form>
          </div>

          {/* Daftar Produk Dinamis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((prod) => {
              const isLow = prod.stock < 10;
              return (
                <div
                  key={prod.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                    isLow ? 'bg-rose-50/70 border-rose-300' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 text-sm">{prod.name}</h4>
                        {isLow && (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] animate-pulse">
                            ⚠️ Stok Menipis
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{prod.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteProduct(prod.id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                      title="Hapus Produk"
                    >
                      <i className="ti ti-trash text-lg"></i>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs">
                    <div>
                      <span className="text-slate-500">Harga Jual:</span>
                      <p className="font-black text-slate-900 text-sm">
                        {formatRupiah(prod.price)} / {prod.unit}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-500">Sisa Stok:</span>
                      <p
                        className={`text-lg font-black ${
                          isLow ? 'text-rose-600' : 'text-forest'
                        }`}
                      >
                        {prod.stock} {prod.unit}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Tambah Produk Baru */}
          {showNewProdModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 text-xs space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-black text-sm text-slate-900">Tambah Produk Baru</h3>
                  <button
                    type="button"
                    onClick={() => setShowNewProdModal(false)}
                    className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateNewProduct} className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Produk</label>
                    <input
                      type="text"
                      required
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="cth: Susu Kambing Stroberi 250ml"
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Harga (Rp)</label>
                      <input
                        type="number"
                        required
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(parseInt(e.target.value, 10))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Stok Awal</label>
                      <input
                        type="number"
                        required
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(parseInt(e.target.value, 10))}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Satuan</label>
                      <input
                        type="text"
                        value={newProdUnit}
                        onChange={(e) => setNewProdUnit(e.target.value)}
                        placeholder="Botol / Karung"
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      >
                        <option>Susu Murni</option>
                        <option>Varian Rasa</option>
                        <option>Perawatan Kulit</option>
                        <option>Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Deskripsi Produk</label>
                    <textarea
                      rows={2}
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      placeholder="Jelaskan spesifikasi dan keunggulan produk ini..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-forest hover:bg-forest-600 text-white font-black shadow-xs cursor-pointer transition-colors"
                  >
                    Simpan Produk ke Katalog
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. HALAMAN ANALITIK & KEUANGAN */}
      {/* ============================================================== */}
      {sellerPage === 'analitik' && (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Analitik Keuangan & Komisi Platform
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Transparansi mutasi kas, komisi pengalihan stok antar-mitra, dan penarikan saldo.
            </p>
          </div>

          {/* Ringkasan Bulan Ini (Total Pemasukan, Total Penarikan, Saldo Tersedia) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                Total Pemasukan Kotor
              </span>
              <p className="text-2xl font-black text-slate-900">Rp 3.450.000</p>
              <p className="text-slate-500 text-[11px]">Bulan September 2026</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                Total Penarikan Saldo
              </span>
              <p className="text-2xl font-black text-rose-600">Rp 1.500.000</p>
              <p className="text-slate-500 text-[11px]">Telah ditransfer ke rekening</p>
            </div>

            <div className="bg-forest-50 p-6 rounded-3xl border border-emerald-200 shadow-xs space-y-2">
              <span className="text-forest font-bold uppercase tracking-wider text-[10px]">
                Saldo Tersedia Dicairkan
              </span>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-black text-forest">Rp 3.277.500</p>
                <button
                  type="button"
                  onClick={() => alert('Permintaan penarikan saldo Rp 3.277.500 telah dikirim ke admin keuangan.')}
                  className="px-3.5 py-1.5 rounded-xl bg-forest hover:bg-forest-600 text-white font-black text-xs cursor-pointer"
                >
                  Tarik Saldo
                </button>
              </div>
              <p className="text-emerald-800 text-[10px]">Potongan komisi operasional platform 5%</p>
            </div>
          </div>

          {/* Filter Mutasi: Semua, Pemasukan, Penarikan, Komisi */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Riwayat Transaksi</h3>

              <div className="flex flex-wrap gap-2">
                {(['Semua', 'Pemasukan', 'Penarikan', 'Komisi'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setTrxFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      trxFilter === cat
                        ? 'bg-forest text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List Mutasi */}
            <div className="space-y-3">
              {filteredTransactions.map((trx) => (
                <div
                  key={trx.id}
                  className="p-4 rounded-2xl bg-[#FDFBF7] border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-black text-slate-900">{trx.title}</p>
                    <p className="text-[11px] text-slate-400">{trx.date}</p>
                    {trx.commissionDetail && (
                      <p className="text-[11px] text-sky font-semibold bg-sky-50 p-2 rounded-lg mt-1 border border-sky-100">
                        ℹ️ Rincian Komisi: {trx.commissionDetail}
                      </p>
                    )}
                  </div>

                  <span
                    className={`text-sm font-black whitespace-nowrap ${
                      trx.net > 0 ? 'text-forest' : 'text-rose-600'
                    }`}
                  >
                    {trx.net > 0 ? `+ ${formatRupiah(trx.net)}` : `- ${formatRupiah(Math.abs(trx.net))}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. HALAMAN PROFIL PETERNAKAN (EDIT PROFIL & PRODUK UNGGULAN LAINNYA) */}
      {/* ============================================================== */}
      {sellerPage === 'profil' && (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Pengaturan Profil Peternakan
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Perbarui identitas kandang dan kelola section <strong>Produk Unggulan Lainnya</strong> (KOHE, Kunjungan Peternakan, Kambing Jantan).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Edit Profil Peternak */}
            <form
              onSubmit={handleSaveFarmProfile}
              className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs"
            >
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                Informasi Identitas Peternakan
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Peternakan</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-forest outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ras Kambing</label>
                    <input
                      type="text"
                      required
                      value={profileBreed}
                      onChange={(e) => setProfileBreed(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kapasitas Perah</label>
                    <input
                      type="text"
                      required
                      value={profileCapacity}
                      onChange={(e) => setProfileCapacity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alamat Kandang di Pontianak</label>
                  <input
                    type="text"
                    required
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Resmi Peternak</label>
                  <input
                    type="text"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deskripsi Spesifikasi Kandang</label>
                  <textarea
                    rows={4}
                    required
                    value={profileDesc}
                    onChange={(e) => setProfileDesc(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-forest hover:bg-forest-600 text-white font-black text-xs shadow-xs cursor-pointer transition-colors"
              >
                Simpan Perubahan Profil
              </button>
            </form>

            {/* Kelola Produk Unggulan Lainnya (KOHE, Kunjungan, Kambing Jantan) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                Kelola Produk Unggulan Lainnya
              </h3>
              <p className="text-slate-500 text-[11px]">
                Produk sampingan yang ditampilkan pada profil peternakan Anda: KOHE, Kunjungan Peternakan, dan Kambing Jantan.
              </p>

              {/* Form Tambah Item Baru */}
              <form onSubmit={handleCreateOtherProduct} className="p-4 rounded-2xl bg-cream border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 text-[11px] block">+ Tambah Item Layanan</span>
                <div>
                  <select
                    value={newOtherCategory}
                    onChange={(e) => setNewOtherCategory(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white font-bold"
                  >
                    <option value="KOHE">KOHE (Pupuk Kandang)</option>
                    <option value="Kunjungan Peternakan">Kunjungan Peternakan (Wisata Edukasi)</option>
                    <option value="Kambing Jantan">Kambing Jantan (Bibit/Aqiqah)</option>
                  </select>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Nama item (cth: KOHE Halus Super)"
                  value={newOtherName}
                  onChange={(e) => setNewOtherName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    required
                    placeholder="Harga (Rp)"
                    value={newOtherPrice}
                    onChange={(e) => setNewOtherPrice(parseInt(e.target.value, 10))}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Satuan (Karung/Orang/Ekor)"
                    value={newOtherUnit}
                    onChange={(e) => setNewOtherUnit(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-forest hover:bg-forest-600 text-white font-bold cursor-pointer transition-colors"
                >
                  + Tambah ke Profil
                </button>
              </form>

              {/* List Produk Unggulan Lainnya Saat Ini */}
              <div className="space-y-2 pt-2 max-h-60 overflow-y-auto">
                {otherProducts
                  .filter((item) => item.farmId === currentFarm.id)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">{item.name}</span>
                          <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-forest font-black">
                          {formatRupiah(item.price)} / {item.unit}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteOtherProduct(item.id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                        title="Hapus Item"
                      >
                        <i className="ti ti-trash"></i>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
