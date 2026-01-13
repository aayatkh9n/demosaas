'use client';

import { MenuItem } from '@/types';
import { formatCurrency, cuisineThemes } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { FiPlus } from 'react-icons/fi';
import Image from 'next/image';
import { useState } from 'react';

interface MenuItemCardProps {
  item: MenuItem;
  cuisine: 'chinese' | 'biryani';
}

export default function MenuItemCard({ item, cuisine }: MenuItemCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const theme = cuisineThemes[cuisine];

  const handleAdd = () => {
    setIsAdding(true);
    addItem(item);
    setTimeout(() => setIsAdding(false), 400);
  };

  if (!item.availability) {
    return (
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden opacity-60 relative">
        <div className="aspect-[4/3] bg-gray-100 relative">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-base">Unavailable</span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-lg mb-1.5 text-gray-900">{item.name}</h3>
          {item.description && (
            <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">{item.description}</p>
          )}
          <p className="font-bold text-xl" style={{ color: theme.primary }}>
            {formatCurrency(item.price)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]">
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          unoptimized
        />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-1.5 text-gray-900">{item.name}</h3>
        {item.description && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
        )}
        <div className="flex items-center justify-between">
          <p className="font-bold text-2xl" style={{ color: theme.primary }}>
            {formatCurrency(item.price)}
          </p>
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-70 min-h-[44px] shadow-sm"
            style={{ 
              backgroundColor: theme.primary,
              color: theme.accent
            }}
          >
            <FiPlus className={`w-5 h-5 ${isAdding ? 'animate-pulse' : ''}`} />
            <span className="text-base">{isAdding ? 'Added!' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}


