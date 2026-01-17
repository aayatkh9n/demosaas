'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import {
  generateWhatsAppURL,
  formatOrderSummary,
  formatCurrency,
} from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { FiCheckCircle, FiCopy } from 'react-icons/fi';

type AdminSettings = {
  kitchen_name: string;
  whatsapp_number: string;
  upi_id: string;
  upi_qr_code: string | null;
};

export default function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const [order, setOrder] = useState<any>(null);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // ✅ Load order + admin settings (SUPABASE ONLY)
  useEffect(() => {
    const loadData = async () => {
      const orderId = searchParams.get('orderId');
      if (!orderId) {
        router.push('/');
        return;
      }

      // 1️⃣ Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError || !orderData) {
        router.push('/');
        return;
      }

      // 2️⃣ Fetch admin settings
      const { data: adminSettings, error: settingsError } = await supabase
        .from('admin_settings')
        .select('kitchen_name, whatsapp_number, upi_id, upi_qr_code')
        .limit(1)
        .single();

      if (settingsError || !adminSettings) {
        alert('Payment settings not configured. Please contact support.');
        router.push('/');
        return;
      }

      setOrder(orderData);
      setSettings(adminSettings);
      setLoading(false);
    };

    loadData();
  }, [searchParams, router]);

  // ✅ Clipboard (client-safe)
  const copyUPIId = async () => {
    if (!settings?.upi_id) return;

    try {
      await navigator.clipboard.writeText(settings.upi_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Failed to copy UPI ID');
    }
  };

  if (loading || !order || !settings) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment…</p>
          </div>
        </div>
      </>
    );
  }

  const handleWhatsAppRedirect = () => {
    const summary = formatOrderSummary(
      order.items,
      order.total,
      order.order_type,
      'ONLINE',
      settings.kitchen_name
    );

    const whatsappURL = generateWhatsAppURL(
      settings.whatsapp_number,
      summary
    );

    clearCart();
    window.location.href = whatsappURL;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10">

            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Complete Payment
              </h1>
              <p className="text-gray-600 text-lg">
                Scan the QR code to pay via UPI
              </p>
            </div>

            {/* Amount */}
            <div className="bg-gray-100 rounded-3xl p-6 mb-8 text-center">
              <p className="text-sm text-gray-600 mb-2">Total Amount</p>
              <p className="text-4xl font-bold">
                {formatCurrency(order.total)}
              </p>
            </div>

            {/* QR */}
            {settings.upi_qr_code && (
              <div className="mb-8 flex justify-center">
                <div className="border-4 border-gray-200 rounded-3xl p-6">
                  <Image
                    src={settings.upi_qr_code}
                    alt="UPI QR Code"
                    width={300}
                    height={300}
                    unoptimized
                  />
                </div>
              </div>
            )}

            {/* UPI ID */}
            <div className="mb-8 bg-gray-50 rounded-3xl p-5">
              <p className="text-sm text-gray-600 mb-3 text-center">
                Or pay directly to:
              </p>

              <div className="flex items-center justify-center gap-3">
                <p className="font-mono font-semibold text-lg bg-white px-5 py-3 rounded-2xl border">
                  {settings.upi_id}
                </p>

                <button
                  onClick={copyUPIId}
                  className="w-12 h-12 rounded-full border flex items-center justify-center hover:bg-gray-200"
                >
                  <FiCopy
                    className={copied ? 'text-green-600' : 'text-gray-600'}
                  />
                </button>
              </div>

              {copied && (
                <p className="text-sm text-green-600 text-center mt-3">
                  Copied to clipboard!
                </p>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={handleWhatsAppRedirect}
              className="w-full bg-green-600 text-white py-5 rounded-full font-semibold text-lg flex items-center justify-center gap-3 hover:bg-green-700"
            >
              <FiCheckCircle />
              I’ve Paid – Continue to WhatsApp
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
