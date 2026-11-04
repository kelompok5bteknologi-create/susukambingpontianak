import { createClient } from '@supabase/supabase-js';
import {
  Farm,
  Product,
  FarmOtherProduct,
  OrderItem,
  NotificationItem,
  BuyerHistoryItem,
  PreorderSlot,
} from '../types';

// Supabase project credentials provided by user
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://ppifrikrjxofsumjitbi.supabase.co';

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwaWZyaWtyanhvZnN1bWppdGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4MDQwMTQsImV4cCI6MjEwOTM4MDAxNH0.fsI8aoaoPI6NpV0HLBhyckUdWw72ajxm6ZdCzY0ebqk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// DATA ACCESS LAYER WITH GRACEFUL FALLBACK
// ==========================================

// 1. FARMS
export async function fetchFarmsFromDB(fallback: Farm[]): Promise<Farm[]> {
  try {
    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .order('rating', { ascending: false });

    if (error || !data || data.length === 0) {
      return fallback;
    }

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      code: row.code,
      breed: row.breed,
      address: row.address,
      milkedTimeAgo: row.milked_time_ago,
      description: row.description,
      capacity: row.capacity,
      badgeBg: row.badge_bg || 'bg-emerald-100',
      badgeColor: row.badge_color || 'text-forest',
      rating: Number(row.rating) || 4.8,
      reviewCount: Number(row.review_count) || 0,
      phone: row.phone,
    }));
  } catch (err) {
    console.warn('Supabase fetchFarms error, using fallback:', err);
    return fallback;
  }
}

export async function updateFarmInDB(farm: Farm): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('farms')
      .upsert({
        id: farm.id,
        name: farm.name,
        code: farm.code,
        breed: farm.breed,
        address: farm.address,
        milked_time_ago: farm.milkedTimeAgo,
        description: farm.description,
        capacity: farm.capacity,
        badge_bg: farm.badgeBg,
        badge_color: farm.badgeColor,
        rating: farm.rating,
        review_count: farm.reviewCount,
        phone: farm.phone,
      });
    return !error;
  } catch (err) {
    console.warn('Supabase updateFarm error:', err);
    return false;
  }
}

// 2. PRODUCTS
export async function fetchProductsFromDB(fallback: Product[]): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallback;
    }

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      price: Number(row.price),
      stock: Number(row.stock),
      unit: row.unit,
      image: row.image,
      description: row.description,
      farmId: row.farm_id,
      farmName: row.farm_name,
      category: row.category,
    }));
  } catch (err) {
    console.warn('Supabase fetchProducts error, using fallback:', err);
    return fallback;
  }
}

export async function addProductToDB(product: Product): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').insert({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      unit: product.unit,
      image: product.image,
      description: product.description,
      farm_id: product.farmId,
      farm_name: product.farmName,
      category: product.category,
    });
    return !error;
  } catch (err) {
    console.warn('Supabase addProduct error:', err);
    return false;
  }
}

export async function updateProductStockInDB(productId: string, newStock: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', productId);
    return !error;
  } catch (err) {
    console.warn('Supabase updateProductStock error:', err);
    return false;
  }
}

export async function deleteProductFromDB(productId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    return !error;
  } catch (err) {
    console.warn('Supabase deleteProduct error:', err);
    return false;
  }
}

// 3. OTHER PRODUCTS
export async function fetchOtherProductsFromDB(
  fallback: FarmOtherProduct[]
): Promise<FarmOtherProduct[]> {
  try {
    const { data, error } = await supabase.from('farm_other_products').select('*');

    if (error || !data || data.length === 0) {
      return fallback;
    }

    return data.map((row) => ({
      id: row.id,
      farmId: row.farm_id,
      name: row.name,
      category: row.category,
      price: Number(row.price),
      unit: row.unit,
      description: row.description,
      image: row.image,
    }));
  } catch (err) {
    console.warn('Supabase fetchOtherProducts error, using fallback:', err);
    return fallback;
  }
}

export async function addOtherProductToDB(item: FarmOtherProduct): Promise<boolean> {
  try {
    const { error } = await supabase.from('farm_other_products').insert({
      id: item.id,
      farm_id: item.farmId,
      name: item.name,
      category: item.category,
      price: item.price,
      unit: item.unit,
      description: item.description,
      image: item.image,
    });
    return !error;
  } catch (err) {
    console.warn('Supabase addOtherProduct error:', err);
    return false;
  }
}

export async function deleteOtherProductFromDB(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('farm_other_products').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.warn('Supabase deleteOtherProduct error:', err);
    return false;
  }
}

// 4. ORDERS
export async function fetchOrdersFromDB(fallback: OrderItem[]): Promise<OrderItem[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return fallback;
    }

    return data.map((row) => ({
      id: row.id,
      orderNumber: row.order_number,
      isGuest: Boolean(row.is_guest),
      status: row.status,
      date: row.date,
      total: Number(row.total),
      paymentMethod: row.payment_method,
      productName: row.product_name,
      quantity: Number(row.quantity),
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      customerAddress: row.customer_address,
      slot: row.slot,
      coordinates: row.coordinates,
      farmName: row.farm_name,
    }));
  } catch (err) {
    console.warn('Supabase fetchOrders error, using fallback:', err);
    return fallback;
  }
}

export async function insertOrderToDB(order: OrderItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('orders').insert({
      id: order.id,
      order_number: order.orderNumber,
      is_guest: order.isGuest,
      status: order.status,
      date: order.date,
      total: order.total,
      payment_method: order.paymentMethod,
      product_name: order.productName,
      quantity: order.quantity,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_address: order.customerAddress,
      slot: order.slot,
      coordinates: order.coordinates,
      farm_name: order.farmName,
    });
    return !error;
  } catch (err) {
    console.warn('Supabase insertOrder error:', err);
    return false;
  }
}

export async function updateOrderStatusInDB(
  orderId: string,
  status: 'Baru' | 'Diproses' | 'Selesai'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    return !error;
  } catch (err) {
    console.warn('Supabase updateOrderStatus error:', err);
    return false;
  }
}

// 5. NOTIFICATIONS
export async function fetchNotificationsFromDB(
  fallback: NotificationItem[]
): Promise<NotificationItem[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return fallback;
    }

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      desc: row.description ?? row.desc ?? '',
      type: row.type,
      time: row.time,
      read: Boolean(row.read),
    }));
  } catch (err) {
    console.warn('Supabase fetchNotifications error, using fallback:', err);
    return fallback;
  }
}

export async function insertNotificationToDB(notif: NotificationItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('notifications').insert({
      id: notif.id,
      title: notif.title,
      description: notif.desc,
      type: notif.type,
      time: notif.time,
      read: notif.read || false,
    });
    return !error;
  } catch (err) {
    console.warn('Supabase insertNotification error:', err);
    return false;
  }
}

export async function markAllNotificationsReadInDB(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('read', false);
    return !error;
  } catch (err) {
    console.warn('Supabase markAllNotificationsRead error:', err);
    return false;
  }
}

// 6. BUYER HISTORY
export async function fetchBuyerHistoryFromDB(
  fallback: BuyerHistoryItem[]
): Promise<BuyerHistoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('buyer_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return fallback;
    }

    return data.map((row) => ({
      id: row.id,
      orderNumber: row.order_number,
      status: row.status,
      date: row.date,
      category: row.category,
      items: row.items,
      farmName: row.farm_name,
      total: Number(row.total),
      points: Number(row.points),
      reorderProduct: row.reorder_product,
      reorderQty: Number(row.reorder_qty),
      price: Number(row.price),
    }));
  } catch (err) {
    console.warn('Supabase fetchBuyerHistory error, using fallback:', err);
    return fallback;
  }
}

export async function insertBuyerHistoryToDB(item: BuyerHistoryItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('buyer_history').insert({
      id: item.id,
      order_number: item.orderNumber,
      status: item.status,
      date: item.date,
      category: item.category,
      items: item.items,
      farm_name: item.farmName,
      total: item.total,
      points: item.points,
      reorder_product: item.reorderProduct,
      reorder_qty: item.reorderQty,
      price: item.price,
    });
    return !error;
  } catch (err) {
    console.warn('Supabase insertBuyerHistory error:', err);
    return false;
  }
}
