'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import {
  formatCurrency,
  formatOrderSummary,
  generateWhatsAppURL,
} from '@/lib/utils';
import { createOrder } from '@/lib/data/orderService';
import { OrderType, PaymentMethod } from '@/types';
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

  // 🔥 MAIN ORDER HANDLER
  const handleProceed = async () => {
    try {
      const orderPayload = {
        items,
        total,
        orderType,
        paymentMethod,
        customerPhone,
      };

      // 1️⃣ Save order to Supabase
      const savedOrder = await createOrder(orderPayload);

if (!savedOrder?.id) {
  throw new Error('Order ID missing');
}

if (paymentMethod === 'ONLINE') {
  router.push(`/payment?orderId=${savedOrder.id}`);
  return;
}


      // 3️⃣ COD → WhatsApp redirect
      handleWhatsAppRedirect(savedOrder.id);
    } catch (error) {
      alert('Failed to place order. Please try again.');
      console.error(error);
    }
  };

  // 📲 WHATSAPP REDIRECT
  const handleWhatsAppRedirect = (orderId: string) => {
    const summary = formatOrderSummary(
      items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      orderType,
      paymentMethod,
      'Cloud Kitchen'
    );

    const whatsappURL = generateWhatsAppURL(
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
      `🧾 Order ID: ${orderId}\n\n${summary}`
    );

    clearCart();
    window.location.href = whatsappURL;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-10">
            Checkout
          </h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="md:col-span-2 space-y-6">
              {/* CUSTOMER DETAILS */}
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6">Your Details</h2>

                <div className="space-y-4">
                  <input
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-5 py-4 border rounded-2xl"
                  />

                  <input
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="+91 9XXXXXXXXX"
                    className="w-full px-5 py-4 border rounded-2xl"
                  />

                  {orderType === 'delivery' && (
                    <textarea
                      value={customerAddress}
                      onChange={e => setCustomerAddress(e.target.value)}
                      placeholder="Delivery Address"
                      className="w-full px-5 py-4 border rounded-2xl"
                    />
                  )}
                </div>
              </div>

              {/* ORDER TYPE */}
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6">Order Type</h2>
                <div className="grid grid-cols-2 gap-4">
                  {['delivery', 'pickup'].map(type => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type as OrderType)}
                      className={`p-6 rounded-2xl border ${
                        orderType === type
                          ? 'bg-black text-white'
                          : 'bg-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* PAYMENT */}
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Payment Method
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {['COD', 'ONLINE'].map(method => (
                    <button
                      key={method}
                      onClick={() =>
                        setPaymentMethod(method as PaymentMethod)
                      }
                      className={`p-6 rounded-2xl border ${
                        paymentMethod === method
                          ? 'bg-black text-white'
                          : 'bg-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <div className="bg-white rounded-3xl shadow-sm p-8 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Summary</h2>

                {items.map(item => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <span>{item.name} × {item.quantity}</span>
                    <span>
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                <button
                  onClick={handleProceed}
                  className="w-full mt-6 bg-black text-white py-4 rounded-full text-lg"
                >
                  {paymentMethod === 'COD'
                    ? 'Continue to WhatsApp'
                    : 'Proceed to Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
