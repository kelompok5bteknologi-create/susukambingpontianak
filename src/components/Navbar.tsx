import React, { useState, useEffect } from 'react';
import { UserRole, BuyerPage, SellerPage, NotificationItem, WhatsAppNotificationPrefs } from '../types';

interface NavbarProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  buyerPage: BuyerPage;
  setBuyerPage: (page: BuyerPage) => void;
  sellerPage: SellerPage;
  setSellerPage: (page: SellerPage) => void;
  cartCount: number;
  notifications: NotificationItem[];
  onClearNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  setRole,
  buyerPage,
  setBuyerPage,
  sellerPage,
  setSellerPage,
  cartCount,
  notifications,
  onClearNotifications,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // WhatsApp Notification Settings saved in localStorage
  const [waPrefs, setWaPrefs] = useState<WhatsAppNotificationPrefs>(() => {
    const saved = localStorage.getItem('whatsapp_notif_prefs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      restockInfo: true,
      preorderReady: true,
      orderSent: true,
    };
  });

  const [savedToast, setSavedToast] = useState(false);

  const handleTogglePref = (key: keyof WhatsAppNotificationPrefs) => {
    const updated = { ...waPrefs, [key]: !waPrefs[key] };
    setWaPrefs(updated);
    localStorage.setItem('whatsapp_notif_prefs', JSON.stringify(updated));
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <button
            type="button"
            onClick={() => {
              if (role === 'buyer') setBuyerPage('home');
              else setSellerPage('dashboard');
            }}
            className="flex items-center gap-3 cursor-pointer text-left focus:outline-none group"
          >
            <div className="w-11 h-11 rounded-2xl bg-forest text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <i className="ti ti-bottle text-2xl"></i>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                Susu Kambing <span className="text-forest">Pontianak</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500 tracking-tight block">
                Penjualan dan Edukasi Susu Kambing Terlengkap
              </span>
            </div>
          </button>

          {/* Menu Pembeli (Terpisah Halaman) */}
          {role === 'buyer' && (
            <nav className="hidden md:flex items-center gap-1.5 text-sm font-bold text-slate-700">
              <button
                type="button"
                onClick={() => setBuyerPage('home')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  buyerPage === 'home'
                    ? 'bg-forest text-white shadow-xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => setBuyerPage('edukasi')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  buyerPage === 'edukasi'
                    ? 'bg-forest text-white shadow-xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                Edukasi
              </button>
              <button
                type="button"
                onClick={() => setBuyerPage('produk')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  buyerPage === 'produk'
                    ? 'bg-forest text-white shadow-xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                Produk
              </button>
              <button
                type="button"
                onClick={() => setBuyerPage('peternak')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  buyerPage === 'peternak'
                    ? 'bg-forest text-white shadow-xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                Profil Peternak
              </button>
            </nav>
          )}

          {/* Menu Peternak (Terpisah Halaman) */}
          {role === 'farmer' && (
            <nav className="hidden md:flex items-center gap-1.5 text-sm font-bold text-slate-700">
              <button
                type="button"
                onClick={() => setSellerPage('dashboard')}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  sellerPage === 'dashboard'
                    ? 'bg-forest text-white shadow-xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => setSellerPage('pesanan')}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  sellerPage === 'pesanan'
                    ? 'bg-forest text-white shadow-xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                Pesanan
              </button>
              <button
                type="button"
                onClick={() => setSellerPage('stok')}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  sellerPage === 'stok'
                    ? 'bg-forest text-white shadow-xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                Stok
              </button>
              <button
                type="button"
                onClick={() => setSellerPage('analitik')}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  sellerPage === 'analitik'
                    ? 'bg-forest text-white shadow-xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                Analitik
              </button>
              <button
                type="button"
                onClick={() => setSellerPage('profil')}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  sellerPage === 'profil'
                    ? 'bg-forest text-white shadow-xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                Profil Peternakan
              </button>
            </nav>
          )}

          {/* Aksi Kanan: Cart, Notifikasi WhatsApp, Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Tombol Keranjang (Mode Pembeli) */}
            {role === 'buyer' && (
              <button
                type="button"
                onClick={() => setBuyerPage('keranjang')}
                className={`relative p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                  buyerPage === 'keranjang'
                    ? 'bg-forest text-white border-forest shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                }`}
                title="Buka Keranjang & Riwayat"
              >
                <i className="ti ti-shopping-cart text-xl"></i>
                <span className="hidden sm:inline text-xs font-bold">Keranjang</span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-black ${
                    buyerPage === 'keranjang'
                      ? 'bg-white text-forest'
                      : 'bg-forest text-white'
                  }`}
                >
                  {cartCount}
                </span>
              </button>
            )}

            {/* Ikon Lonceng Notifikasi WhatsApp (Mode Pembeli) */}
            {role === 'buyer' && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className={`relative p-2.5 rounded-xl border transition-all cursor-pointer ${
                    notifDropdownOpen
                      ? 'bg-forest-50 border-forest text-forest'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                  }`}
                  title="Pengaturan Notifikasi WhatsApp"
                >
                  <i className="ti ti-bell text-xl"></i>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full ring-2 ring-[#FDFBF7]"></span>
                  )}
                </button>

                {/* Panel Pengaturan Notifikasi WhatsApp */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-88 bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 z-50 text-xs animate-fadeIn">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <div className="flex items-center gap-2 text-forest font-black text-sm">
                        <i className="ti ti-brand-whatsapp text-lg"></i>
                        <span>Notifikasi WhatsApp</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                      >
                        <i className="ti ti-x text-base"></i>
                      </button>
                    </div>

                    {/* Pengaturan Preferensi WhatsApp (Tersimpan di localStorage) */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                          Pilihan Info WhatsApp
                        </span>
                        {savedToast && (
                          <span className="text-[10px] text-emerald-600 font-bold animate-fadeIn">
                            ✓ Tersimpan!
                          </span>
                        )}
                      </div>

                      <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={waPrefs.restockInfo}
                          onChange={() => handleTogglePref('restockInfo')}
                          className="w-4 h-4 rounded text-forest accent-forest cursor-pointer"
                        />
                        <span className="font-medium text-xs">Restock info</span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={waPrefs.preorderReady}
                          onChange={() => handleTogglePref('preorderReady')}
                          className="w-4 h-4 rounded text-forest accent-forest cursor-pointer"
                        />
                        <span className="font-medium text-xs">Preorder siap diambil</span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={waPrefs.orderSent}
                          onChange={() => handleTogglePref('orderSent')}
                          className="w-4 h-4 rounded text-forest accent-forest cursor-pointer"
                        />
                        <span className="font-medium text-xs">Pesanan sudah dikirim</span>
                      </label>
                      <p className="text-[10px] text-slate-400 italic pt-1">
                        *Preferensi otomatis disimpan ke penyimpanan lokal Anda.
                      </p>
                    </div>

                    {/* Riwayat Notifikasi Terbaru */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Riwayat Notifikasi
                      </span>
                      <button
                        type="button"
                        onClick={onClearNotifications}
                        className="text-[10px] text-slate-400 hover:text-forest transition-colors cursor-pointer"
                      >
                        Tandai sudah dibaca
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {notifications.length === 0 || unreadCount === 0 ? (
                        <p className="text-slate-400 py-3 text-center text-[11px]">
                          Tidak ada pesan notifikasi baru.
                        </p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                              notif.type === 'stock'
                                ? 'bg-forest-50/60 border-emerald-100'
                                : notif.type === 'order'
                                ? 'bg-sky-50/60 border-sky-100'
                                : 'bg-amber-50/60 border-amber-100'
                            }`}
                          >
                            <i
                              className={`mt-0.5 text-base shrink-0 ${
                                notif.type === 'stock'
                                  ? 'ti ti-sparkles text-forest'
                                  : notif.type === 'order'
                                  ? 'ti ti-truck text-sky'
                                  : 'ti ti-calendar-check text-amber-700'
                              }`}
                            ></i>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 leading-tight">{notif.title}</p>
                              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{notif.desc}</p>
                              <span className="text-[9px] text-slate-400 mt-1 block">{notif.time}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ROLE SWITCHER DENGAN LOCALSTORAGE */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 shadow-xs hover:border-forest transition-colors">
              <i className="ti ti-user-circle text-forest text-base"></i>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="text-xs font-black text-slate-800 bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="buyer">Mode: Pembeli</option>
                <option value="farmer">Mode: Peternak</option>
              </select>
            </div>

            {/* Tombol Hamburger Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-300"
            >
              <i className="ti ti-menu-2 text-2xl"></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 text-sm space-y-1 font-semibold animate-fadeIn">
            {role === 'buyer' ? (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setBuyerPage('home');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl cursor-pointer ${
                    buyerPage === 'home' ? 'bg-forest text-white' : 'hover:bg-slate-100'
                  }`}
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBuyerPage('edukasi');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl cursor-pointer ${
                    buyerPage === 'edukasi' ? 'bg-forest text-white' : 'hover:bg-slate-100'
                  }`}
                >
                  Edukasi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBuyerPage('produk');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl cursor-pointer ${
                    buyerPage === 'produk' ? 'bg-forest text-white' : 'hover:bg-slate-100'
                  }`}
                >
                  Produk
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBuyerPage('peternak');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl cursor-pointer ${
                    buyerPage === 'peternak' ? 'bg-forest text-white' : 'hover:bg-slate-100'
                  }`}
                >
                  Profil Peternak
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBuyerPage('keranjang');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center justify-between cursor-pointer ${
                    buyerPage === 'keranjang' ? 'bg-forest text-white' : 'hover:bg-slate-100'
                  }`}
                >
                  <span>Keranjang & Riwayat</span>
                  <span className="px-2 py-0.5 rounded-full bg-forest text-white text-xs font-bold">
                    {cartCount}
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setSellerPage('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl cursor-pointer ${
                    sellerPage === 'dashboard' ? 'bg-forest text-white' : 'hover:bg-slate-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSellerPage('pesanan');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl cursor-pointer ${
                    sellerPage === 'pesanan' ? 'bg-forest text-white' : 'hover:bg-slate-100'
                  }`}
                >
                  Pesanan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSellerPage('stok');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl cursor-pointer ${
                    sellerPage === 'stok' ? 'bg-forest text-white' : 'hover:bg-slate-100'
                  }`}
                >
                  Stok
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSellerPage('analitik');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl cursor-pointer ${
                    sellerPage === 'analitik' ? 'bg-forest text-white' : 'hover:bg-slate-100'
                  }`}
                >
                  Analitik
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSellerPage('profil');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl cursor-pointer ${
                    sellerPage === 'profil' ? 'bg-forest text-white' : 'hover:bg-slate-100'
                  }`}
                >
                  Profil Peternakan
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
