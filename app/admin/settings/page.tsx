'use client';

import { useState } from 'react';
import { getAdminSettings, saveAdminSettings } from '@/lib/data/adminData';
import { AdminSettings } from '@/types';
import { FiSave } from 'react-icons/fi';
import Image from 'next/image';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>(getAdminSettings());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveAdminSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, upiQrCode: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Kitchen Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Kitchen Name</label>
              <input
                type="text"
                value={settings.kitchenName}
                onChange={(e) => setSettings({ ...settings, kitchenName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                placeholder="Cloud Kitchen"
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
              <input
                type="tel"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                placeholder="+91 8850055287"
              />
              <p className="text-sm text-gray-500 mt-1">
                Include country code (e.g., +91 for India)
              </p>
            </div>

            {/* UPI ID */}
            <div>
              <label className="block text-sm font-medium mb-2">UPI ID</label>
              <input
                type="text"
                value={settings.upiId}
                onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                placeholder="yourupi@paytm"
              />
            </div>

            {/* UPI QR Code */}
            <div>
              <label className="block text-sm font-medium mb-2">UPI QR Code</label>
              <div className="mb-4">
                {settings.upiQrCode && (
                  <div className="border-2 border-gray-200 rounded-lg p-4 inline-block">
                    <Image
                      src={settings.upiQrCode}
                      alt="UPI QR Code"
                      width={200}
                      height={200}
                      className="rounded-lg"
                      unoptimized
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Upload QR Code Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-900"
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium mb-2">Or enter image URL</label>
                <input
                  type="text"
                  value={settings.upiQrCode}
                  onChange={(e) => setSettings({ ...settings, upiQrCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2 ${
                saved
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-900'
              }`}
            >
              <FiSave />
              {saved ? 'Settings Saved!' : 'Save Settings'}
            </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold mb-2 text-blue-900">Instructions:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
            <li>WhatsApp number should include country code (e.g., +91 for India)</li>
            <li>QR code image should be a clear, high-quality image</li>
            <li>UPI ID will be displayed on the payment page</li>
            <li>Changes take effect immediately after saving</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

