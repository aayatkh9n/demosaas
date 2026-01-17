'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import {
  formatCurrency,
  formatOrderSummary,
  generateWhatsAppURL,
} from '@/lib/utils';
import Navbar from '@/components/Navbar';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<any>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const loadData = async () => {
      /* 1️⃣ Fetch order */
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError || !orderData) {
        router.push('/');
        return;
      }

      /* 2️⃣ Fetch admin settings (SINGLE ROW – UUID SAFE) */
      const { data: settings, error: settingsError } = await supabase
        .from('admin_settings')
        .select('upi_qr_code, whatsapp_number')
        .limit(1)
        .single();

      if (settingsError) {
        console.error('Failed to load admin settings', settingsError);
      }

      setOrder(orderData);
      setQrCode(settings?.upi_qr_code ?? null);
      setWhatsappNumber(settings?.whatsapp_number ?? null);
      setLoading(false);
    };

    loadData();
  }, [orderId, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading payment…
        </div>
      </>
    );
  }

  const handlePaid = async () => {
    if (!whatsappNumber) {
      alert('WhatsApp number not configured');
      return;
    }

    await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', order.id);

    const summary = formatOrderSummary(
      order.items,
      order.total,
      order.order_type,
      order.payment_method,
      'Cloud Kitchen'
    );

    const whatsappURL = generateWhatsAppURL(
      whatsappNumber,
      `✅ PAYMENT DONE\n🧾 Order ID: ${order.id}\n\n${summary}`
    );

    window.location.href = whatsappURL;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-sm p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Complete Payment</h1>

          <p className="text-gray-600 mb-6">
            Scan the QR code below and complete the payment
          </p>

          {/* ✅ QR FROM ADMIN DASHBOARD */}
          {qrCode ? (
            <div className="flex justify-center mb-6">
              <img
                src={qrCode}
                alt="UPI QR Code"
                className="w-64 h-64 object-contain"
              />
            </div>
          ) : (
            <div className="text-red-500 mb-6">
              Payment QR not configured. Please contact support.
            </div>
          )}

          <div className="text-lg font-semibold mb-2">
            Amount: {formatCurrency(order.total)}
          </div>

          <div className="text-sm text-gray-500 mb-6">
            Order ID: {order.id}
          </div>

          <button
            onClick={handlePaid}
            disabled={!qrCode}
            className="w-full bg-black text-white py-4 rounded-full text-lg hover:opacity-90 disabled:opacity-50"
          >
            I have paid
          </button>

          <p className="text-xs text-gray-400 mt-4">
            Order will be confirmed after payment verification
          </p>
        </div>
      </div>
    </>
  );
}
