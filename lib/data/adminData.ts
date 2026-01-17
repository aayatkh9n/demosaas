import { supabase } from '@/lib/supabase/client';
import { AdminSettings, Order, OrderStatus } from '@/types';

/* ================================
   ADMIN SETTINGS (SUPABASE)
================================ */

export const getAdminSettings = async (): Promise<AdminSettings> => {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return {
      kitchenName: 'Cloud Kitchen',
      whatsappNumber: '',
      upiQrCode: '',
      upiId: '',
    };
  }

  return {
    kitchenName: data.kitchen_name,
    whatsappNumber: data.whatsapp_number,
    upiQrCode: data.upi_qr_code,
    upiId: data.upi_id,
  };
};

export const saveAdminSettings = async (
  settings: AdminSettings
): Promise<void> => {
  const { error } = await supabase.from('admin_settings').insert({
    kitchen_name: settings.kitchenName,
    whatsapp_number: settings.whatsappNumber,
    upi_qr_code: settings.upiQrCode,
    upi_id: settings.upiId,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Failed to save admin settings', error);
    throw error;
  }
};

/* ================================
   ORDERS (SUPABASE)
================================ */

export const getOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Failed to fetch orders', error);
    return [];
  }

  return data.map(order => ({
    id: order.id,
    items: order.items,
    total: order.total,
    orderType: order.order_type,
    paymentMethod: order.payment_method,
    status: order.status,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    customerAddress: order.customer_address,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  }));
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) {
    console.error('Failed to update order status', error);
    throw error;
  }
};
