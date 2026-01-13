import { AdminSettings, Order, OrderStatus } from '@/types';

const STORAGE_KEYS = {
  SETTINGS: 'admin_settings',
  ORDERS: 'admin_orders',
};

export const defaultAdminSettings: AdminSettings = {
  kitchenName: 'Cloud Kitchen',
  whatsappNumber: '+918850055287',
  upiQrCode: 'https://via.placeholder.com/300x300/000000/FFFFFF?text=UPI+QR+Code',
  upiId: 'yourupi@paytm',
};

export const getAdminSettings = (): AdminSettings => {
  if (typeof window === 'undefined') return defaultAdminSettings;
  
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultAdminSettings;
    }
  }
  return defaultAdminSettings;
};

export const saveAdminSettings = (settings: AdminSettings): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

export const saveOrder = (order: Order): void => {
  if (typeof window === 'undefined') return;
  
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

export const updateOrderStatus = (orderId: string, status: OrderStatus): void => {
  if (typeof window === 'undefined') return;
  
  const orders = getOrders();
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }
};

