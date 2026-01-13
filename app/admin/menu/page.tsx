'use client';

import { useState, useEffect } from 'react';
import { menuItems as initialMenuItems } from '@/lib/data/menuData';
import { formatCurrency } from '@/lib/utils';
import { MenuItem, Cuisine } from '@/types';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiX,
  FiCheck,
} from 'react-icons/fi';
import Image from 'next/image';

const STORAGE_KEY = 'admin_menu_items';

export default function MenuManagement() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    cuisine: 'chinese',
    category: '',
    image: '',
    availability: true,
    description: '',
  });

  // ✅ Load menu on client only (Vercel-safe)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
        return;
      } catch {}
    }
    setItems(initialMenuItems);
  }, []);

  const persist = (updated: MenuItem[]) => {
    setItems(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert('Please fill all required fields');
      return;
    }

    let updated: MenuItem[];

    if (editingItem) {
      updated = items.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData } as MenuItem
          : item
      );
    } else {
      const newItem: MenuItem = {
        id: `${formData.cuisine === 'chinese' ? 'ch' : 'bi'}-${Date.now()}`,
        name: formData.name!,
        price: Number(formData.price),
        cuisine: formData.cuisine as Cuisine,
        category: formData.category!,
        image: formData.image || 'https://via.placeholder.com/400x300',
        availability: formData.availability ?? true,
        description: formData.description,
      };
      updated = [...items, newItem];
    }

    persist(updated);
    handleCancel();
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this item?')) return;
    persist(items.filter(item => item.id !== id));
  };

  const toggleAvailability = (id: string) => {
    persist(
      items.map(item =>
        item.id === id
          ? { ...item, availability: !item.availability }
          : item
      )
    );
  };

  const handleCancel = () => {
    setEditingItem(null);
    setShowForm(false);
    setFormData({
      name: '',
      price: 0,
      cuisine: 'chinese',
      category: '',
      image: '',
      availability: true,
      description: '',
    });
  };

  const grouped = items.reduce((acc, item) => {
    const key = `${item.cuisine}-${item.category}`;
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Menu Management</h1>
          <button
            onClick={() => {
              handleCancel();
              setShowForm(true);
            }}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-black"
          >
            <FiPlus /> Add Item
          </button>
        </div>

        {/* FORM MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingItem ? 'Edit Item' : 'Add Item'}
              </h2>

              <div className="space-y-4">
                <input
                  placeholder="Name *"
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Price *"
                    value={formData.price}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className="border px-4 py-2 rounded"
                  />

                  <select
                    value={formData.cuisine}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        cuisine: e.target.value as Cuisine,
                      })
                    }
                    className="border px-4 py-2 rounded"
                  >
                    <option value="chinese">Chinese</option>
                    <option value="biryani">Biryani</option>
                  </select>
                </div>

                <input
                  placeholder="Category *"
                  value={formData.category}
                  onChange={e =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded"
                />

                <input
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={e =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded"
                />

                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="w-full border px-4 py-2 rounded"
                />

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.availability}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        availability: e.target.checked,
                      })
                    }
                  />
                  Available
                </label>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MENU LIST */}
        <div className="space-y-8">
          {Object.entries(grouped).map(([key, list]) => {
            const [cuisine, category] = key.split('-');
            return (
              <div key={key} className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-4 capitalize">
                  {cuisine} — {category}
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {list.map(item => (
                    <div
                      key={item.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="relative aspect-video">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        {!item.availability && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold">
                            Unavailable
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.description}
                        </p>
                        <p className="font-bold mb-3">
                          {formatCurrency(item.price)}
                        </p>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="flex-1 bg-blue-600 text-white py-2 rounded"
                          >
                            <FiEdit />
                          </button>

                          <button
                            onClick={() => toggleAvailability(item.id)}
                            className={`flex-1 py-2 rounded text-white ${
                              item.availability
                                ? 'bg-yellow-600'
                                : 'bg-green-600'
                            }`}
                          >
                            {item.availability ? <FiX /> : <FiCheck />}
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-600 text-white px-3 py-2 rounded"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
