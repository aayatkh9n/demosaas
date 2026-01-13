'use client';

import { getMenuItemsByCuisine } from '@/lib/data/menuData';
import MenuItemCard from '@/components/MenuItemCard';
import Navbar from '@/components/Navbar';
import { cuisineThemes } from '@/lib/utils';

export default function ChinesePage() {
  const items = getMenuItemsByCuisine('chinese');
  const theme = cuisineThemes.chinese;

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar cuisine="chinese" />

      {/* HERO SECTION */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.dark})`,
        }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_white,_transparent_70%)]" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
            Chinese Cuisine
          </h1>
          <p className="text-lg md:text-2xl opacity-95 max-w-2xl mx-auto">
            Bold flavors, sizzling wok dishes, and authentic Chinese classics
          </p>
        </div>
      </section>

      {/* MENU */}
      <section className="max-w-7xl mx-auto px-4 py-14 md:py-20">
        {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
          <div key={category} className="mb-20 last:mb-0">
            {/* Category Heading */}
            <div className="flex items-center gap-4 mb-8">
              <h2
                className="text-2xl md:text-4xl font-bold tracking-tight"
                style={{ color: theme.dark }}
              >
                {category}
              </h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Food Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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

      {/* TRUST / INFO SECTION */}
      <section className="bg-white/70 backdrop-blur-sm py-14 md:py-20 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: '💵',
                title: 'COD Available',
                desc: 'Pay only after confirmation',
              },
              {
                icon: '🚚',
                title: 'Fast Delivery',
                desc: 'Quick & reliable service',
              },
              {
                icon: '✅',
                title: 'Quality Assured',
                desc: 'Fresh ingredients every day',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-8 text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <p className="font-semibold text-lg mb-1 text-gray-900">
                  {item.title}
                </p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
