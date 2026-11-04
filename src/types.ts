export type UserRole = 'buyer' | 'farmer';

export type BuyerPage = 'home' | 'produk' | 'edukasi' | 'peternak' | 'keranjang';

export type SellerPage = 'dashboard' | 'pesanan' | 'stok' | 'analitik' | 'profil';

export type PreorderType = 'raw' | 'pasteurized';

export type PaymentMethodType = 'Transfer Bank' | 'E-Wallet' | 'COD' | 'QRIS';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  unit: string;
  description: string;
  farmId: string;
  farmName: string;
  category?: string;
}

export interface FarmOtherProduct {
  id: string;
  farmId: string;
  name: string;
  category: 'KOHE' | 'Kunjungan Peternakan' | 'Kambing Jantan' | string;
  price: number;
  unit: string;
  description: string;
  image: string;
}

export interface Farm {
  id: string;
  name: string;
  code: string;
  breed: string;
  address: string;
  milkedTimeAgo: string;
  description: string;
  capacity: string;
  badgeBg: string;
  badgeColor: string;
  rating: number;
  reviewCount: number;
  phone: string;
}

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  farmName: string;
  unit?: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  isGuest: boolean;
  status: 'Baru' | 'Diproses' | 'Selesai';
  date: string;
  total: number;
  paymentMethod: string;
  productName: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  slot: string;
  coordinates: string;
  farmName: string;
  isPreorder?: boolean;
  preorderLiters?: number;
  transferredToPartner?: boolean;
  partnerName?: string;
  commissionFarmer?: number;
  commissionPartner?: number;
}

export interface PreorderSlot {
  id: number;
  date: string;
  day: string;
  status: 'Tersedia' | 'Penuh';
  booked: number;
  max: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  type: 'stock' | 'order' | 'preorder';
  time: string;
  read?: boolean;
}

export interface WhatsAppNotificationPrefs {
  restockInfo: boolean;
  preorderReady: boolean;
  orderSent: boolean;
}

export interface BuyerHistoryItem {
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
