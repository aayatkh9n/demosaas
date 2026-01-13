import { MenuItem, Cuisine } from '@/types';

export const menuItems: MenuItem[] = [
  // Chinese Cuisine
  {
    id: 'ch-001',
    name: 'Kung Pao Chicken',
    price: 350,
    cuisine: 'chinese',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    availability: true,
    description: 'Spicy stir-fried chicken with peanuts and vegetables',
  },
  {
    id: 'ch-002',
    name: 'Sweet and Sour Pork',
    price: 320,
    cuisine: 'chinese',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    availability: true,
    description: 'Crispy pork with tangy sweet and sour sauce',
  },
  {
    id: 'ch-003',
    name: 'Mapo Tofu',
    price: 280,
    cuisine: 'chinese',
    category: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
    availability: true,
    description: 'Spicy Sichuan tofu with minced meat',
  },
  {
    id: 'ch-004',
    name: 'Spring Rolls (6 pcs)',
    price: 180,
    cuisine: 'chinese',
    category: 'Appetizer',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    availability: true,
    description: 'Crispy vegetable spring rolls with dipping sauce',
  },
  {
    id: 'ch-005',
    name: 'Fried Rice',
    price: 240,
    cuisine: 'chinese',
    category: 'Rice',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    availability: true,
    description: 'Classic Chinese fried rice with vegetables',
  },
  {
    id: 'ch-006',
    name: 'Szechuan Noodles',
    price: 290,
    cuisine: 'chinese',
    category: 'Noodles',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop',
    availability: true,
    description: 'Spicy noodles with Szechuan sauce',
  },
  {
    id: 'ch-007',
    name: 'Hot and Sour Soup',
    price: 160,
    cuisine: 'chinese',
    category: 'Soup',
    image: 'https://images.unsplash.com/photo-1609501676725-7186f1f4a8a9?w=400&h=300&fit=crop',
    availability: true,
    description: 'Traditional hot and sour soup',
  },
  {
    id: 'ch-008',
    name: 'Peking Duck',
    price: 650,
    cuisine: 'chinese',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1609501676725-7186f1f4a8a9?w=400&h=300&fit=crop',
    availability: false,
    description: 'Classic Peking duck with pancakes',
  },
  
  // Biryani Cuisine
  {
    id: 'bi-001',
    name: 'Hyderabadi Chicken Biryani',
    price: 380,
    cuisine: 'biryani',
    category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    availability: true,
    description: 'Authentic Hyderabadi style biryani with tender chicken',
  },
  {
    id: 'bi-002',
    name: 'Mutton Biryani',
    price: 450,
    cuisine: 'biryani',
    category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    availability: true,
    description: 'Rich mutton biryani with aromatic spices',
  },
  {
    id: 'bi-003',
    name: 'Vegetable Biryani',
    price: 280,
    cuisine: 'biryani',
    category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    availability: true,
    description: 'Fragrant vegetable biryani with mixed vegetables',
  },
  {
    id: 'bi-004',
    name: 'Egg Biryani',
    price: 260,
    cuisine: 'biryani',
    category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    availability: true,
    description: 'Delicious egg biryani with boiled eggs',
  },
  {
    id: 'bi-005',
    name: 'Chicken Korma',
    price: 320,
    cuisine: 'biryani',
    category: 'Curry',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop',
    availability: true,
    description: 'Creamy chicken curry with cashews and almonds',
  },
  {
    id: 'bi-006',
    name: 'Raita',
    price: 80,
    cuisine: 'biryani',
    category: 'Side',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop',
    availability: true,
    description: 'Cool yogurt side dish',
  },
  {
    id: 'bi-007',
    name: 'Naan Bread',
    price: 50,
    cuisine: 'biryani',
    category: 'Bread',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop',
    availability: true,
    description: 'Freshly baked tandoori naan',
  },
  {
    id: 'bi-008',
    name: 'Gulab Jamun (2 pcs)',
    price: 100,
    cuisine: 'biryani',
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop',
    availability: true,
    description: 'Sweet milk dumplings in sugar syrup',
  },
];

const STORAGE_KEY = 'admin_menu_items';

const getStoredMenuItems = (): MenuItem[] => {
  if (typeof window === 'undefined') return menuItems;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return menuItems;
    }
  }
  return menuItems;
};

export const getMenuItemsByCuisine = (cuisine: Cuisine): MenuItem[] => {
  const items = getStoredMenuItems();
  return items.filter(item => item.cuisine === cuisine && item.availability);
};

export const getMenuItemById = (id: string): MenuItem | undefined => {
  const items = getStoredMenuItems();
  return items.find(item => item.id === id);
};

export const getAllMenuItems = (): MenuItem[] => {
  return getStoredMenuItems();
};


