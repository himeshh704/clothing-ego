'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '../types/catalog';
import { BRAND_CONFIG } from '../data/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product, size?: string) => void;
  onQuickView?: (p: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSwatch, setSelectedSwatch] = useState(product.swatches[0]?.colorHex || '#000000');

  return (
    <div
      className="group relative flex flex-col rounded-xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 p-3 sm:p-3.5 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onQuickView && onQuickView(product)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        <Image
          src={isHovered ? product.imageSecondary : product.imagePrimary}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        {product.badge && (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
            <span
              style={product.badge === 'BEST SELLER' ? { backgroundColor: BRAND_CONFIG.colors.primaryAccent } : undefined}
              className={`rounded px-1.5 py-0.5 sm:px-2 sm:py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white shadow-xs ${
                product.badge === 'SALE'
                  ? 'bg-red-600'
                  : product.badge === 'NEW'
                  ? 'bg-black dark:bg-white dark:text-black'
                  : ''
              }`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick actions overlay - Always visible on mobile touch screens, slide-up on desktop hover */}
        <div
          className={`absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 z-10 flex items-center justify-between gap-1.5 sm:gap-2 transition-all duration-300 ${
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-100 sm:opacity-0 translate-y-0 sm:translate-y-3 sm:pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onAddToCart(product, product.sizes[0] || 'M')}
            style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
            className="flex-1 rounded-md text-white py-2.5 sm:py-2.5 text-center text-[10px] sm:text-[11px] font-black tracking-widest uppercase shadow-md hover:opacity-90 active:scale-95 transition-all min-h-[44px] flex items-center justify-center"
          >
            + ADD
          </button>
          <button
            onClick={() => onQuickView && onQuickView(product)}
            className="flex h-11 w-11 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-md bg-white/95 dark:bg-black/95 text-black dark:text-white shadow-md hover:bg-gray-100 active:scale-95 transition-colors text-xs font-bold min-h-[44px] min-w-[44px]"
            aria-label="Quick View"
          >
            ↗
          </button>
        </div>
      </div>

      <div className="mt-3 sm:mt-3.5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-heading text-xs font-bold uppercase tracking-tight text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-1">
            {product.title}
          </h3>
          <p className="mt-0.5 text-[9px] sm:text-[10px] font-medium text-gray-400 dark:text-gray-500 tracking-wide uppercase line-clamp-1">
            {product.emiText}
          </p>
        </div>

        <div className="mt-2 sm:mt-2.5 flex items-baseline gap-1.5 sm:gap-2">
          <span className="font-heading text-xs sm:text-sm font-black text-black dark:text-white tracking-tight">
            ₹ {product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium text-gray-400 line-through">
            ₹ {product.compareAtPrice.toLocaleString('en-IN')}
          </span>
        </div>

        <div
          className="mt-2 sm:mt-3 flex items-center gap-1.5 pt-2 sm:pt-2.5 border-t border-gray-100 dark:border-white/5"
          onClick={(e) => e.stopPropagation()}
        >
          {product.swatches.map((swatch, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSwatch(swatch.colorHex)}
              style={{ backgroundColor: swatch.colorHex }}
              className={`h-5 w-5 sm:h-4 sm:w-4 rounded-full border border-gray-300 shadow-2xs transition-transform min-h-[20px] min-w-[20px] ${
                selectedSwatch === swatch.colorHex ? 'ring-2 ring-black dark:ring-white scale-110' : 'active:scale-95'
              }`}
              title={swatch.name}
              aria-label={swatch.name}
            />
          ))}
          <span className="ml-auto text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            {product.sizes.length} SIZES
          </span>
        </div>
      </div>
    </div>
  );
}
