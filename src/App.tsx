/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserRole,
  BuyerPage,
  SellerPage,
  Product,
  Farm,
  FarmOtherProduct,
  CartItem,
  OrderItem,
  PreorderSlot,
  NotificationItem,
  BuyerHistoryItem,
} from './types';
import {
  INITIAL_FARMS,
  INITIAL_PRODUCTS,
  INITIAL_OTHER_PRODUCTS,
  INITIAL_SLOTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
  INITIAL_BUYER_HISTORY,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { EducationSection } from './components/EducationSection';
import { FarmSelection } from './components/FarmSelection';
import { CheckoutSection } from './components/CheckoutSection';
import { FarmerDashboard } from './components/FarmerDashboard';
import { Footer } from './components/Footer';
import { ReportModal, ReviewsListModal, MapPickerModal, WhatsAppConsultantModal } from './components/Modals';

export default function App() {
  // Role switcher: Pembeli / Peternak dengan LocalStorage
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('user_role') as UserRole) || 'buyer';
  });

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('user_role', newRole);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Halaman Terpisah: Mode Pembeli (Home, Edukasi, Produk, Profil Peternak, Keranjang)
  const [buyerPage, setBuyerPageState] = useState<BuyerPage>('home');
  const setBuyerPage = (page: BuyerPage) => {
    setBuyerPageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Halaman Terpisah: Mode Peternak (Dashboard, Pesanan, Stok, Analitik, Profil Peternakan)
  const [sellerPage, setSellerPageState] = useState<SellerPage>('dashboard');
  const setSellerPage = (page: SellerPage) => {
    setSellerPageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Shared Data State
  const [farms, setFarms] = useState<Farm[]>(INITIAL_FARMS);
  const [selectedFarm, setSelectedFarm] = useState<Farm>(INITIAL_FARMS[0]);
  const [currentFarmerFarmId, setCurrentFarmerFarmId] = useState<string>(INITIAL_FARMS[0].id);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [otherProducts, setOtherProducts] = useState<FarmOtherProduct[]>(INITIAL_OTHER_PRODUCTS);

  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      name: 'Susu Kambing Segar 500ml',
      price: 35000,
      quantity: 2,
      farmName: 'Enggano Farm 100',
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [historyItems, setHistoryItems] = useState<BuyerHistoryItem[]>(INITIAL_BUYER_HISTORY);
  const [slots, setSlots] = useState<PreorderSlot[]>(INITIAL_SLOTS);
  const [deliverySlot, setDeliverySlot] = useState<string>('12:00 - 15:00');
  const [coordinates, setCoordinates] = useState<string>('-0.0263, 109.3425');

  // Education auto-highlight topic
  const [highlightedTopic, setHighlightedTopic] = useState<'grass-fed' | 'pasteurisasi' | null>(null);

  // Modals state
  const [reportModal, setReportModal] = useState<{ isOpen: boolean; targetType: string; targetName: string }>({
    isOpen: false,
    targetType: '',
    targetName: '',
  });
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Tambah ke Keranjang dari Katalog Produk
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: 'cart-' + Date.now(),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          farmName: product.farmName,
          unit: product.unit,
        },
      ];
    });
    showToast(`${product.name} berhasil ditambahkan ke keranjang!`);
  };

  // Beli dari Home Produk Unggulan
  const handleBuyFromHome = (product: Product) => {
    handleAddToCart(product);
    setBuyerPage('produk');
  };

  // Pesan Produk Unggulan Lainnya (KOHE, Kunjungan Peternakan, Kambing Jantan)
  const handleOrderOtherProduct = (item: FarmOtherProduct) => {
    setCart((prev) => [
      ...prev,
      {
        id: 'cart-other-' + Date.now(),
        name: `${item.name} (${item.category})`,
        price: item.price,
        quantity: 1,
        farmName: selectedFarm.name,
        unit: item.unit,
      },
    ]);
    showToast(`${item.name} berhasil dimasukkan ke keranjang pesanan.`);
    setBuyerPage('keranjang');
  };

  // Update kuantitas item keranjang
  const handleUpdateCartQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Hapus item keranjang
  const handleRemoveCartItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item telah dihapus dari keranjang.');
  };

  // Pesan Ulang (Beli Lagi dari Riwayat)
  const handleReorder = (productName: string, quantity: number, price: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === productName);
      if (existing) {
        return prev.map((item) =>
          item.name === productName ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: 'reorder-' + Date.now(),
          name: productName,
          price,
          quantity,
          farmName: selectedFarm.name,
        },
      ];
    });
    showToast(`Produk ${productName} (x${quantity}) berhasil ditambahkan ke keranjang!`);
    setBuyerPage('keranjang');
  };

  // Beralih ke produk mitra terdekat saat stok habis
  const handleSwitchToPartner = () => {
    setCart((prev) => [
      ...prev,
      {
        id: 'partner-' + Date.now(),
        name: 'Susu Kambing Segar 500ml',
        price: 35000,
        quantity: 1,
        farmName: 'Kandang Berkah Etawa',
      },
    ]);
    showToast('Berhasil beralih ke Susu Kambing Segar 500ml dari mitra terdekat: Kandang Berkah Etawa!');
    setBuyerPage('keranjang');
  };

  // Hyperlink kata "Grass-fed" & "Pasteurisasi" ke halaman Edukasi
  const handleHighlightEducation = (topic: 'grass-fed' | 'pasteurisasi') => {
    setHighlightedTopic(topic);
    setBuyerPage('edukasi');
    setTimeout(() => {
      setHighlightedTopic(null);
    }, 4000);
  };

  // Order dibuat dari Checkout
  const handleOrderCreated = (newOrder: OrderItem) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Kosongkan keranjang belanja
    setCart([]);

    // Tambahkan ke Riwayat Pesanan Pembeli (Bagian 2)
    setHistoryItems((prev) => [
      {
        id: 'hist-' + Date.now(),
        orderNumber: newOrder.orderNumber,
        status: 'Diproses',
        date: 'Hari ini',
        category: 'Pembelian',
        items: newOrder.productName,
        farmName: newOrder.farmName,
        total: newOrder.total,
        points: Math.floor(newOrder.total / 1000),
        reorderProduct: 'Susu Kambing Segar 500ml',
        reorderQty: newOrder.quantity,
        price: 35000,
      },
      ...prev,
    ]);

    // Tambahkan notifikasi WhatsApp
    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: `Pesanan ${newOrder.orderNumber} berhasil dibuat`,
        desc: `Pesanan sedang diverifikasi oleh peternak ${newOrder.farmName}.`,
        type: 'order',
        time: 'Baru saja',
      },
      ...prev,
    ]);

    showToast(`Pesanan ${newOrder.orderNumber} berhasil dikirim ke peternak!`);
  };

  // Peternak mengupdate status pesanan (Baru -> Diproses -> Selesai)
  const handleUpdateOrderStatus = (orderId: string, status: 'Baru' | 'Diproses' | 'Selesai') => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

    if (status === 'Selesai') {
      const order = orders.find((o) => o.id === orderId);
      setNotifications((prev) => [
        {
          id: 'notif-' + Date.now(),
          title: `Pesanan ${order?.orderNumber || ''} telah selesai`,
          desc: 'Kurir cooler box telah tiba di alamat tujuan Anda.',
          type: 'order',
          time: 'Baru saja',
        },
        ...prev,
      ]);
    }
  };

  // Peternak menambah stok produk
  const handleAddStock = (productId: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + quantity } : p))
    );
  };

  // Peternak menambah produk baru
  const handleAddNewProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  // Peternak menghapus produk
  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Produk berhasil dihapus dari katalog.');
  };

  // Peternak menambah produk unggulan lainnya (KOHE, Kunjungan, Kambing Jantan)
  const handleAddOtherProduct = (item: FarmOtherProduct) => {
    setOtherProducts((prev) => [item, ...prev]);
  };

  // Peternak menghapus produk unggulan lainnya
  const handleDeleteOtherProduct = (id: string) => {
    setOtherProducts((prev) => prev.filter((item) => item.id !== id));
    showToast('Item berhasil dihapus.');
  };

  // Peternak mengupdate profil peternakannya
  const handleUpdateFarmProfile = (updatedFarm: Farm) => {
    setFarms((prev) =>
      prev.map((f) => (f.id === updatedFarm.id ? updatedFarm : f))
    );
    if (selectedFarm.id === updatedFarm.id) {
      setSelectedFarm(updatedFarm);
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen text-slate-800 flex flex-col antialiased font-sans">
      {/* Toast Notification Alert Global */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-fadeIn">
          <i className="ti ti-bell-ringing text-emerald-400 text-base"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* NAVBAR DENGAN ROLE SWITCHER & SEPARATE PAGE MENU */}
      <Navbar
        role={role}
        setRole={setRole}
        buyerPage={buyerPage}
        setBuyerPage={setBuyerPage}
        sellerPage={sellerPage}
        setSellerPage={setSellerPage}
        cartCount={cartCount}
        notifications={notifications}
        onClearNotifications={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          showToast('Semua notifikasi WhatsApp telah ditandai dibaca.');
        }}
      />

      {/* ============================================================== */}
      {/* MODE PEMBELI (BUYER): TAMPILKAN SECTION SESUAI HALAMAN AKTIF */}
      {/* ============================================================== */}
      {role === 'buyer' && (
        <main className="flex-1">
          {/* 1. HALAMAN HOME */}
          {buyerPage === 'home' && (
            <div className="animate-fadeIn">
              <HeroSection
                featuredProducts={products}
                onOpenReviews={() => setReviewsModalOpen(true)}
                onNavigateToProducts={() => setBuyerPage('produk')}
                onNavigateToEducation={() => setBuyerPage('edukasi')}
                onBuyProduct={handleBuyFromHome}
              />
            </div>
          )}

          {/* 2. HALAMAN EDUKASI */}
          {buyerPage === 'edukasi' && (
            <div className="animate-fadeIn">
              <EducationSection
                highlightedTopic={highlightedTopic}
                onNavigateToProducts={() => setBuyerPage('produk')}
              />
            </div>
          )}

          {/* 3. HALAMAN PRODUK */}
          {buyerPage === 'produk' && (
            <div className="animate-fadeIn">
              <ProductCatalog
                products={products}
                selectedFarmName={selectedFarm.name}
                onAddToCart={handleAddToCart}
                onOpenReport={(type, name) => {
                  setReportModal({ isOpen: true, targetType: type, targetName: name });
                }}
                onSwitchToPartner={handleSwitchToPartner}
                onHighlightEducation={handleHighlightEducation}
              />
            </div>
          )}

          {/* 4. HALAMAN PROFIL PETERNAK */}
          {buyerPage === 'peternak' && (
            <div className="animate-fadeIn">
              <FarmSelection
                farms={farms}
                selectedFarmId={selectedFarm.id}
                onSelectFarm={(farm) => {
                  setSelectedFarm(farm);
                  showToast(`Peternakan mitra aktif: ${farm.name}`);
                }}
                otherProducts={otherProducts}
                onOpenReport={(type, name) => {
                  setReportModal({ isOpen: true, targetType: type, targetName: name });
                }}
                onNavigateToProducts={() => setBuyerPage('produk')}
                onOrderOtherProduct={handleOrderOtherProduct}
              />
            </div>
          )}

          {/* 5. HALAMAN KERANJANG & CHECKOUT */}
          {buyerPage === 'keranjang' && (
            <div className="animate-fadeIn">
              <CheckoutSection
                cart={cart}
                onUpdateCartQty={handleUpdateCartQty}
                onRemoveCartItem={handleRemoveCartItem}
                historyItems={historyItems}
                onReorder={handleReorder}
                slots={slots}
                selectedSlot={deliverySlot}
                setSelectedSlot={setDeliverySlot}
                coordinates={coordinates}
                setCoordinates={setCoordinates}
                onOpenMapPicker={() => setMapModalOpen(true)}
                onOrderSuccess={handleOrderCreated}
                onSwitchToPartner={handleSwitchToPartner}
                onNavigateToProducts={() => setBuyerPage('produk')}
              />
            </div>
          )}

          {/* Floating Connect to WhatsApp (WhatsApp AI Consultant) Button */}
          <div className="fixed bottom-6 left-6 z-40">
            <button
              type="button"
              onClick={() => setWhatsappModalOpen(true)}
              className="group px-4 py-2.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold shadow-2xl flex items-center gap-3 transition-all hover:scale-105 cursor-pointer border border-emerald-300/40 ring-4 ring-[#25D366]/20"
              title="Hubungkan ke WhatsApp AI Consultant"
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-white/20">
                <i className="ti ti-brand-whatsapp text-2xl text-white"></i>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-200 rounded-full animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full"></span>
              </div>
              <div className="text-left">
                <span className="block text-xs font-black leading-tight text-white tracking-wide">
                  Connect to WhatsApp
                </span>
                <span className="block text-[10px] font-semibold text-emerald-100 leading-tight">
                  WhatsApp AI Consultant
                </span>
              </div>
            </button>
          </div>
        </main>
      )}

      {/* ============================================================== */}
      {/* MODE PETERNAK (SELLER): TAMPILKAN DASHBOARD & SUB-HALAMAN */}
      {/* ============================================================== */}
      {role === 'farmer' && (
        <main className="flex-1">
          <FarmerDashboard
            sellerPage={sellerPage}
            setSellerPage={setSellerPage}
            orders={orders}
            products={products}
            farms={farms}
            currentFarmId={currentFarmerFarmId}
            setCurrentFarmId={setCurrentFarmerFarmId}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddStock={handleAddStock}
            onAddNewProduct={handleAddNewProduct}
            onDeleteProduct={handleDeleteProduct}
            otherProducts={otherProducts}
            onAddOtherProduct={handleAddOtherProduct}
            onDeleteOtherProduct={handleDeleteOtherProduct}
            onUpdateFarmProfile={handleUpdateFarmProfile}
          />
        </main>
      )}

      {/* FOOTER */}
      <Footer />

      {/* MODALS */}
      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ isOpen: false, targetType: '', targetName: '' })}
        targetType={reportModal.targetType}
        targetName={reportModal.targetName}
      />

      <ReviewsListModal
        isOpen={reviewsModalOpen}
        onClose={() => setReviewsModalOpen(false)}
      />

      <MapPickerModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        onSelectCoords={(coords) => {
          setCoordinates(coords);
          showToast(`Koordinat pengiriman diperbarui: ${coords}`);
        }}
      />

      <WhatsAppConsultantModal
        isOpen={whatsappModalOpen}
        onClose={() => setWhatsappModalOpen(false)}
      />
    </div>
  );
}
