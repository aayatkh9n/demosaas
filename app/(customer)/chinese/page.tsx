'use client';

import { useEffect, useState } from 'react';
import { getMenuItemsByCuisine } from '@/lib/data/menuData';
import MenuItemCard from '@/components/MenuItemCard';
import Navbar from '@/components/Navbar';
import { cuisineThemes } from '@/lib/utils';
import { MenuItem } from '@/types';

export default function ChinesePage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = cuisineThemes.chinese;

  useEffect(() => {
    async function loadMenu() {
      const data = await getMenuItemsByCuisine('chinese');
      setItems(data);
      setLoading(false);
    }
    loadMenu();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar cuisine="chinese" />
        <div className="text-center py-20 text-gray-500">
          Loading menu…
        </div>
      </div>
    );
  }

  const itemsByCategory = items.reduce<Record<string, MenuItem[]>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar cuisine="chinese" />

      {/* HERO */}
      <section
        className="py-24 text-white text-center"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.dark})`,
        }}
      >
        <h1 className="text-5xl font-bold mb-4">Chinese Cuisine</h1>
        <p className="text-xl opacity-90">
          Bold flavors, sizzling wok dishes, and authentic Chinese classics
        </p>
      </section>

      {/* MENU */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
          <div key={category} className="mb-16">
            <h2
              className="text-3xl font-bold mb-6"
              style={{ color: theme.dark }}
            >
              {category}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryItems.map(item => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  cuisine="chinese"
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
