'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CategoryTab } from '../types/catalog';
import { BRAND_CONFIG } from '../data/products';

interface CategoryShowcaseProps {
  activeTab: CategoryTab;
}

export default function CategoryShowcase({ activeTab }: CategoryShowcaseProps) {
  const categories =
    activeTab === 'men'
      ? ['TRACKS', 'SHORTS', 'COORDS', 'TSHIRTS', 'SWEATS', 'JACKETS']
      : ['DRESSES', 'TOPS', 'BOTTOMS', 'PLAYSUIT', 'COORDS', 'SWEATS'];

  const categoryImages: Record<string, string> = {
    TRACKS: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    SHORTS: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80',
    COORDS: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    TSHIRTS: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    SWEATS: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    JACKETS: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
    DRESSES: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    TOPS: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    BOTTOMS: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    PLAYSUIT: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-gray-500">
            {activeTab === 'men' ? 'ENGINEERED SILHOUETTES' : 'CURATED BY SILHOUETTE'}
          </h2>
          <p className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white mt-1">
            Shop By Category
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, index) => (
            <Link
              key={cat}
              href={`#${cat.toLowerCase()}`}
              style={index === 2 ? { borderColor: BRAND_CONFIG.colors.primaryAccent } : undefined}
              className={`group relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1.5 ${
                index === 2 ? 'aspect-[3/5] sm:scale-105 z-10 border-2' : 'aspect-[3/4]'
              }`}
            >
              <Image
                src={categoryImages[cat] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'}
                alt={cat}
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute inset-x-2 bottom-3 text-center">
                <span className="inline-block rounded-lg bg-white/95 dark:bg-black/90 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-black dark:text-white shadow group-hover:bg-black group-hover:text-white transition-colors">
                  {cat}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
