'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cuisine } from '@/types';
import { cuisineThemes } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import Cart from './Cart';

interface NavbarProps {
  cuisine?: Cuisine;
}

export default function Navbar({ cuisine }: NavbarProps) {
  const pathname = usePathname();
  const { getItemCount } = useCart();
  const theme = cuisine ? cuisineThemes[cuisine] : null;

  return (
    <>
      <nav
        className="sticky top-0 z-40 text-white shadow-lg"
        style={
          theme
            ? { backgroundColor: theme.primary }
            : { backgroundColor: '#1F2937' }
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold">
              Cloud Kitchen
            </Link>
            
            <div className="flex items-center gap-4">
              <Link
                href="/chinese"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/chinese'
                    ? 'bg-black bg-opacity-20'
                    : 'hover:bg-black hover:bg-opacity-10'
                }`}
              >
                Chinese
              </Link>
              <Link
                href="/biryani"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/biryani'
                    ? 'bg-black bg-opacity-20'
                    : 'hover:bg-black hover:bg-opacity-10'
                }`}
              >
                Biryani
              </Link>
              <Link
                href="/cart"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-black hover:bg-opacity-10 transition-colors"
              >
                Cart ({getItemCount()})
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <Cart />
    </>
  );
}

