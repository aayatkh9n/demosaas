'use client';

import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import { FiPlus, FiMinus, FiX, FiShoppingCart } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

export default function Cart() {
  const { getTotal, getItemCount } = useCart();
  const itemCount = getItemCount();
  const total = getTotal();

  if (itemCount === 0) {
    return (
      <div className="fixed bottom-6 right-4 md:bottom-6 md:right-6 z-50 md:hidden">
        <Link
          href="/cart"
          className="flex items-center justify-center w-16 h-16 bg-gray-900 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Cart"
        >
          <FiShoppingCart className="text-2xl" />
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-4 md:bottom-6 md:right-6 z-50 md:hidden">
      <Link
        href="/cart"
        className="flex items-center gap-3 bg-gray-900 text-white px-5 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <div className="relative">
          <FiShoppingCart className="text-2xl" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
            {itemCount}
          </span>
        </div>
        <div className="text-right">
          <div className="text-xs opacity-90">{itemCount} items</div>
          <div className="font-bold text-base">{formatCurrency(total)}</div>
        </div>
      </Link>
    </div>
  );
}

export function CartDrawer() {
  const { items, updateQuantity, removeItem, getTotal, getItemCount } = useCart();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 md:mb-12 text-gray-900">Your Cart</h1>
        
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items - Left side on desktop */}
          <div className="md:col-span-2">
            {items.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm p-12 md:p-16 text-center">
                <div className="text-7xl mb-6">🛒</div>
                <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
                <Link
                  href="/"
                  className="inline-block px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl shadow-sm p-5 md:p-6 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      {/* Item Image */}
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1 text-gray-900 truncate">{item.name}</h3>
                        <p className="text-gray-500 text-sm mb-2">{formatCurrency(item.price)} each</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center active:scale-95"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus className="w-4 h-4 text-gray-700" />
                          </button>
                          <span className="w-8 text-center font-semibold text-base text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center active:scale-95"
                            aria-label="Increase quantity"
                          >
                            <FiPlus className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Price and Remove */}
                      <div className="text-right flex flex-col items-end gap-3">
                        <div className="font-bold text-lg text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-colors flex items-center justify-center active:scale-95"
                          aria-label="Remove item"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary - Sticky on desktop */}
          {items.length > 0 && (
            <div className="md:col-span-1">
              <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 sticky top-24">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({getItemCount()} items)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-gray-900">{formatCurrency(getTotal())}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-gray-900 text-white text-center py-4 rounded-full font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-lg shadow-sm"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
