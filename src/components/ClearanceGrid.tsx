'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '../types/catalog';
import ProductCard from './ProductCard';
import { BRAND_CONFIG } from '../data/products';

interface ClearanceGridProps {
  products: Product[];
  onAddToCart: (p: Product, size?: string) => void;
  onQuickView?: (p: Product) => void;
}

export default function ClearanceGrid({ products, onAddToCart, onQuickView }: ClearanceGridProps) {
  const [selectedSize, setSelectedSize] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSize = selectedSize === 'ALL' || p.sizes.includes(selectedSize);
      const matchPrice = p.price <= maxPrice;
      return matchSize && matchPrice;
    });
  }, [products, selectedSize, maxPrice]);

  return (
    <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="border-b border-gray-200 dark:border-white/10 pb-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <nav className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <span>Home</span> <span>/</span> <span className="text-black dark:text-white">Clearance Sale</span>
          </nav>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-black dark:text-white mt-1">
            Clearance Sale <span className="text-sm font-semibold text-red-600">(Upto 80% OFF)</span>
          </h1>
        </div>
        <span className="text-sm font-medium text-gray-500">Showing {filtered.length} items</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-6 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/10 h-fit">
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-black dark:text-white">
              Filter By Size
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {['ALL', 'XS', 'S', 'M', 'L', 'XL', '2XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={selectedSize === size ? { backgroundColor: BRAND_CONFIG.colors.primaryAccent } : undefined}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    selectedSize === size
                      ? 'text-white shadow'
                      : 'bg-white dark:bg-black/40 border border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-white/10 pt-6">
            <div className="flex justify-between text-xs font-bold text-black dark:text-white mb-2">
              <span>Max Price:</span>
              <span>₹ {maxPrice}</span>
            </div>
            <input
              type="range"
              min="400"
              max="3500"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full cursor-pointer accent-black dark:accent-white"
            />
          </div>

          <div className="border-t border-gray-200 dark:border-white/10 pt-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-black dark:text-white mb-3">
              Availability
            </h3>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <input type="checkbox" defaultChecked className="rounded accent-black dark:accent-white" />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((prod) => (
            <ProductCard key={prod.id} product={prod} onAddToCart={onAddToCart} onQuickView={onQuickView} />
          ))}
        </div>
      </div>
    </section>
  );
}
