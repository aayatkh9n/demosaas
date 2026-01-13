'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { menuItems as initialMenuItems } from '@/lib/data/menuData';
import { formatCurrency } from '@/lib/utils';
import { MenuItem, Cuisine } from '@/types';
import { FiPlus, FiEdit, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import Image from 'next/image';

const STORAGE_KEY = 'admin_menu_items';

const getMenuItems = (): MenuItem[] => {
  if (typeof window === 'undefined') return initialMenuItems;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialMenuItems;
    }
  }
  return initialMenuItems;
};

const saveMenuItems = (items: MenuItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

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

  useEffect(() => {
    setItems(getMenuItems());
  }, []);

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    let updatedItems: MenuItem[];
    
    if (editingItem) {
      updatedItems = items.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData } as MenuItem
          : item
      );
    } else {
      const newItem: MenuItem = {
        id: `${formData.cuisine === 'chinese' ? 'ch' : 'bi'}-${Date.now()}`,
        name: formData.name!,
        price: formData.price!,
        cuisine: formData.cuisine!,
        category: formData.category!,
        image: formData.image || 'https://via.placeholder.com/400x300',
        availability: formData.availability ?? true,
        description: formData.description,
      };
      updatedItems = [...items, newItem];
    }

    setItems(updatedItems);
    saveMenuItems(updatedItems);
    handleCancel();
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      saveMenuItems(updatedItems);
    }
  };

  const handleToggleAvailability = (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, availability: !item.availability } : item
    );
    setItems(updatedItems);
    saveMenuItems(updatedItems);
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

  const groupedItems = items.reduce((acc, item) => {
    const key = `${item.cuisine}-${item.category}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Menu Management</h1>
            <button
              onClick={() => {
                handleCancel();
                setShowForm(true);
              }}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-900 transition-colors"
            >
              <FiPlus />
              Add Item
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Cuisine *</label>
                      <select
                        value={formData.cuisine}
                        onChange={(e) => setFormData({ ...formData, cuisine: e.target.value as Cuisine })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="chinese">Chinese</option>
                        <option value="biryani">Biryani</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., Main Course, Appetizer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.availability}
                        onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span>Available</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items by Category */}
          <div className="space-y-8">
            {Object.entries(groupedItems).map(([key, categoryItems]) => {
              const [cuisine, category] = key.split('-');
              return (
                <div key={key} className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4 capitalize">
                    {cuisine} - {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryItems.map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="aspect-video bg-gray-200 relative">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          {!item.availability && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white font-bold">Unavailable</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          <p className="font-bold text-lg mb-4">{formatCurrency(item.price)}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                            >
                              <FiEdit />
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleAvailability(item.id)}
                              className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-1 ${
                                item.availability
                                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                            >
                              {item.availability ? (
                                <>
                                  <FiX />
                                  Disable
                                </>
                              ) : (
                                <>
                                  <FiCheck />
                                  Enable
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="bg-red-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-red-700 transition-colors flex items-center justify-center"
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

