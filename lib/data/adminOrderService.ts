import { supabase } from '@/lib/supabase/client';
import { Order, OrderStatus } from '@/types';

/**
 * Fetch all orders (admin)
 */
export async function fetchAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch orders error:', error);
    return [];
  }

  return data as Order[];
}

/**
 * Update order status (admin)
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  const { error } = await supabase
    .from('orders')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) {
    console.error('Update order status error:', error);
  }
}
