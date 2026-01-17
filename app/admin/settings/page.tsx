'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { FiSave } from 'react-icons/fi';
import Image from 'next/image';

type AdminSettings = {
  id: string;
  kitchen_name: string;
  whatsapp_number: string;
  upi_id: string;
  upi_qr_code: string | null;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ✅ ALWAYS LOAD SAFELY
  useEffect(() => {
    const loadSettings = async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Failed to load settings', error);
        setLoading(false);
        return;
      }

      // No row exists → create one
      if (!data || data.length === 0) {
        const { data: inserted, error: insertError } = await supabase
          .from('admin_settings')
          .insert({
            kitchen_name: 'Cloud Kitchen',
            whatsapp_number: '',
            upi_id: '',
            upi_qr_code: null,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Failed to create settings', insertError);
          setLoading(false);
          return;
        }

        setSettings(inserted);
        setLoading(false);
        return;
      }

      setSettings(data[0]);
      setLoading(false);
    };

    loadSettings();
  }, []);

  // ✅ UPLOAD QR
  const uploadQr = async (file: File) => {
    if (!settings) return;

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

    setSettings({ ...settings, upi_qr_code: data.publicUrl });
  };

  // ✅ SAVE SETTINGS
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
      .eq('id', settings.id);

    setSaving(false);

    if (error) {
      alert('Failed to save settings');
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // ✅ NEVER FREEZE UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading settings…
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load settings
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <input
            value={settings.kitchen_name}
            onChange={e => setSettings({ ...settings, kitchen_name: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            placeholder="Kitchen name"
          />

          <input
            value={settings.whatsapp_number}
            onChange={e => setSettings({ ...settings, whatsapp_number: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            placeholder="WhatsApp number"
          />

          <input
            value={settings.upi_id}
            onChange={e => setSettings({ ...settings, upi_id: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            placeholder="UPI ID"
          />

          {settings.upi_qr_code && (
            <Image
              src={settings.upi_qr_code}
              alt="QR"
              width={200}
              height={200}
              unoptimized
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={e => e.target.files && uploadQr(e.target.files[0])}
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-black text-white rounded"
          >
            <FiSave /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
