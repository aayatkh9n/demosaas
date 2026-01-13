'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency, formatOrderSummary, generateWhatsAppURL } from '@/lib/utils';
import { getAdminSettings, saveOrder } from '@/lib/data/adminData';
import { OrderType, PaymentMethod, Order } from '@/types';
import Navbar from '@/components/Navbar';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const total = getTotal();

  if (items.length === 0) {
    router.push('/');
    return null;
  }

  const handleProceed = () => {
    const settings = getAdminSettings();

    if (paymentMethod === 'ONLINE') {
      // Save order and redirect to payment page
      const order: Order = {
        id: `ORD-${Date.now()}`,
        items,
        total,
        orderType,
        paymentMethod,
        status: 'new',
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        customerAddress: customerAddress || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      saveOrder(order);
      router.push(`/payment?orderId=${order.id}`);
    } else {
      // Direct WhatsApp redirect for COD
      handleWhatsAppRedirect();
    }
  };

  const handleWhatsAppRedirect = () => {
    const settings = getAdminSettings();
    const summary = formatOrderSummary(
      items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      orderType,
      paymentMethod,
      settings.kitchenName
    );
    
    const whatsappURL = generateWhatsAppURL(settings.whatsappNumber, summary);
    
    // Save order
    const order: Order = {
      id: `ORD-${Date.now()}`,
      items,
      total,
      orderType,
      paymentMethod,
      status: 'new',
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      customerAddress: customerAddress || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    saveOrder(order);
    clearCart();
    window.location.href = whatsappURL;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#f9fafb' }}>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 md:mb-12 text-gray-900">Checkout</h1>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column - Form */}
            <div className="md:col-span-2 space-y-6">
              {/* Customer Details */}
              <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Your Details</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-base"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Phone *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-base"
                      placeholder="+91 8850055287"
                      required
                    />
                  </div>
                  {orderType === 'delivery' && (
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">Delivery Address *</label>
                      <textarea
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none text-base"
                        rows={4}
                        placeholder="Your delivery address"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Order Type */}
              <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Order Type</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setOrderType('delivery')}
                    className={`p-6 md:p-8 rounded-3xl border-2 transition-all duration-200 ${
                      orderType === 'delivery'
                        ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                    } active:scale-95`}
                  >
                    <div className="text-5xl mb-4">🚚</div>
                    <div className="font-semibold text-lg">Delivery</div>
                  </button>
                  <button
                    onClick={() => setOrderType('pickup')}
                    className={`p-6 md:p-8 rounded-3xl border-2 transition-all duration-200 ${
                      orderType === 'pickup'
                        ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                    } active:scale-95`}
                  >
                    <div className="text-5xl mb-4">🏃</div>
                    <div className="font-semibold text-lg">Pickup</div>
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Payment Method</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-6 md:p-8 rounded-3xl border-2 transition-all duration-200 text-left ${
                      paymentMethod === 'COD'
                        ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                    } active:scale-95`}
                  >
                    <div className="text-5xl mb-4">💵</div>
                    <div className="font-semibold text-lg mb-2">Cash on Delivery</div>
                    <div className={`text-sm ${paymentMethod === 'COD' ? 'opacity-90' : 'text-gray-500'}`}>
                      Pay when you receive
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`p-6 md:p-8 rounded-3xl border-2 transition-all duration-200 text-left ${
                      paymentMethod === 'ONLINE'
                        ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                    } active:scale-95`}
                  >
                    <div className="text-5xl mb-4">📱</div>
                    <div className="font-semibold text-lg mb-2">Online Payment</div>
                    <div className={`text-sm ${paymentMethod === 'ONLINE' ? 'opacity-90' : 'text-gray-500'}`}>
                      UPI QR Code
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary (Sticky) */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 sticky top-24">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
                
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">× {item.quantity}</div>
                      </div>
                      <div className="font-semibold text-sm text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-gray-900">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceed}
                  className="w-full bg-gray-900 text-white py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm min-h-[56px]"
                >
                  {paymentMethod === 'COD' ? 'Continue to WhatsApp' : 'Proceed to Payment'}
                </button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Order will be confirmed after payment verification
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
