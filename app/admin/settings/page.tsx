'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { FiSave } from 'react-icons/fi';
import Image from 'next/image';

type AdminSettings = {
  id: number;
  kitchen_name: string;
  whatsapp_number: string;
  upi_id: string;
  upi_qr_code: string | null;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ✅ LOAD SINGLE SOURCE OF TRUTH (id = 1)
  useEffect(() => {
    const loadSettings = async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        console.error('Failed to load settings', error);
        return;
      }

      setSettings(data);
    };

    loadSettings();
  }, []);

  // ✅ Upload QR → Supabase Storage (overwrite-safe)
  const uploadQr = async (file: File) => {
    const fileName = 'upi-qr.png';

    const { error } = await supabase.storage
      .from('qr-codes')
      .upload(fileName, file, { upsert: true });

    if (error) {
      alert('QR upload failed');
      return;
    }

    const { data } = supabase.storage
      .from('qr-codes')
      .getPublicUrl(fileName);

    setSettings((prev) =>
      prev ? { ...prev, upi_qr_code: data.publicUrl } : prev
    );
  };

  // ✅ SAVE (ALWAYS id = 1)
  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);

    const { error } = await supabase
      .from('admin_settings')
      .update({
        kitchen_name: settings.kitchen_name,
        whatsapp_number: settings.whatsapp_number,
        upi_id: settings.upi_id,
        upi_qr_code: settings.upi_qr_code,
      })
      .eq('id', 1);

    setSaving(false);

    if (error) {
      alert('Failed to save settings');
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading settings…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Kitchen Name</label>
            <input
              value={settings.kitchen_name}
              onChange={(e) =>
                setSettings({ ...settings, kitchen_name: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              WhatsApp Number
            </label>
            <input
              value={settings.whatsapp_number}
              onChange={(e) =>
                setSettings({ ...settings, whatsapp_number: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">UPI ID</label>
            <input
              value={settings.upi_id}
              onChange={(e) =>
                setSettings({ ...settings, upi_id: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              UPI QR Code
            </label>

            {settings.upi_qr_code && (
              <div className="mb-4 border rounded-lg inline-block p-3">
                <Image
                  src={settings.upi_qr_code}
                  alt="UPI QR"
                  width={200}
                  height={200}
                  unoptimized
                />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  uploadQr(e.target.files[0]);
                }
              }}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 ${
              saved ? 'bg-green-600' : 'bg-gray-900'
            } text-white`}
          >
            <FiSave />
            {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
