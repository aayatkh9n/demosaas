import { Cuisine, CuisineTheme } from '@/types';

export const cuisineThemes: Record<Cuisine, CuisineTheme> = {
  chinese: {
    primary: '#FF6B35', // Orange - bold, fast, modern
    dark: '#000000', // Black
    accent: '#FFFFFF', // White
    background: '#FFFFFF',
    text: '#1F1F1F',
  },
  biryani: {
    primary: '#C92A2A', // Red - royal
    dark: '#800020', // Maroon
    accent: '#D4AF37', // Gold - indulgent
    background: '#FFF8E7', // Warm cream
    text: '#5C4033',
  },
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(0)}`;
};

export const formatOrderSummary = (
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  orderType: string,
  paymentMethod: string,
  kitchenName: string
): string => {
  const orderTypeText = orderType === 'delivery' ? 'Delivery' : 'Pickup';
  const paymentText = paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment';
  
  let summary = `🍽️ *${kitchenName}*\n\n`;
  summary += `📋 *ORDER SUMMARY*\n`;
  summary += `${'='.repeat(30)}\n\n`;
  
  items.forEach(item => {
    summary += `${item.name} × ${item.quantity}\n`;
    summary += `₹${(item.price * item.quantity).toFixed(0)}\n\n`;
  });
  
  summary += `${'='.repeat(30)}\n`;
  summary += `*Total: ₹${total.toFixed(0)}*\n\n`;
  summary += `📦 ${orderTypeText}\n`;
  summary += `💳 ${paymentText}\n\n`;
  summary += `Please confirm this order. Thank you!`;
  
  return summary;
};

export const generateWhatsAppURL = (phone: string, message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
};

