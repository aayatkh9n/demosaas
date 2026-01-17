import { supabase } from '@/lib/supabase/client';

export const createOrder = async (order: any) => {
  const orderId = `ORD-${Date.now()}`;

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        id: orderId,
        items: order.items,
        total: order.total,
        order_type: order.orderType,
        payment_method: order.paymentMethod,
        status: 'new',
        customer_phone: order.customerPhone,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw error;
  }

  return data;
};
