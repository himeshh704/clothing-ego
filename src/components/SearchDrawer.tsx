'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Product } from '../types/catalog';
import { CATALOG_PRODUCTS, BRAND_CONFIG } from '../data/products';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickView: (product: Product) => void;
}

export default function SearchDrawer({ isOpen, onClose, onQuickView }: SearchDrawerProps) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const trendingSearches = [
    'Oversized Hoodie',
    'Ribbed Crop Top',
    'Parachute Cargo',
    '300GSM French Terry',
    'Co-Ord Set',
    'Heavyweight Tee',
  ];

  const results = useMemo(() => {
    if (!query.trim() && !selectedTag) return [];
    const searchTerm = (selectedTag || query).toLowerCase().trim();
    return CATALOG_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        (p.badge && p.badge.toLowerCase().includes(searchTerm))
    );
  }, [query, selectedTag]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-body">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Slide-down Drawer Panel */}
      <div className="relative z-10 w-full bg-white dark:bg-[#18181b] border-b border-gray-200 dark:border-white/10 shadow-2xl transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          
          {/* Top Header & Search Input Bar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedTag(null);
                }}
                placeholder="SEARCH VALOR & VEIL ARCHIVES (E.G., TRACKSUIT, CARGO, RIBBED)..."
                className="w-full rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-5 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-black dark:focus:border-white"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white text-xs font-bold"
                >
                  CLEAR
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/10 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors font-bold text-sm"
              aria-label="Close Search"
            >
              ✕
            </button>
          </div>

          {/* Trending Searches Tags */}
          <div className="mt-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2.5">
              TRENDING ARCHIVE QUERIES:
            </span>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setQuery(tag);
                    setSelectedTag(tag);
                  }}
                  style={selectedTag === tag || query === tag ? { backgroundColor: BRAND_CONFIG.colors.primaryAccent, color: '#ffffff' } : undefined}
                  className={`rounded-lg px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all border ${
                    selectedTag === tag || query === tag
                      ? 'border-transparent shadow'
                      : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            {(!query.trim() && !selectedTag) ? (
              <div className="py-12 text-center text-gray-400">
                <p className="font-heading text-xs font-bold uppercase tracking-widest text-gray-500">
                  Type or click a trending query to explore silhouettes
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p className="font-heading text-sm font-bold uppercase tracking-widest text-black dark:text-white">
                  No matching silhouettes found for &quot;{selectedTag || query}&quot;
                </p>
                <p className="text-xs text-gray-500 mt-1">Try exploring our Women&apos;s or Men&apos;s Lookbooks.</p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                    ARCHIVE RESULTS ({results.length}):
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">CURATED EDIT</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-h-[50vh] overflow-y-auto pr-2">
                  {results.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onQuickView(product);
                        onClose();
                      }}
                      className="group flex flex-col rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 hover:border-black dark:hover:border-white transition-all cursor-pointer"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-200">
                        <Image
                          src={product.imagePrimary}
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 50vw, 200px"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-2.5 flex flex-col justify-between flex-1">
                        <h4 className="font-heading text-xs font-bold uppercase tracking-tight text-black dark:text-white line-clamp-1">
                          {product.title}
                        </h4>
                        <div className="mt-1 flex items-baseline justify-between">
                          <span className="font-heading text-xs font-black text-black dark:text-white">
                            ₹ {product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-black dark:group-hover:text-white">
                            VIEW ↗
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
