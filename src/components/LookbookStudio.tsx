'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '../types/catalog';
import { CATALOG_PRODUCTS, BRAND_CONFIG } from '../data/products';

interface LookbookStudioProps {
  onQuickView: (product: Product) => void;
}

interface LookbookPin {
  id: string;
  x: number; // percentage left
  y: number; // percentage top
  label: string;
  productId: string;
}

interface LookbookItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  pins: LookbookPin[];
}

export default function LookbookStudio({ onQuickView }: LookbookStudioProps) {
  const [activePin, setActivePin] = useState<string | null>(null);

  const lookbookData: LookbookItem[] = [
    {
      id: 'look-1',
      title: 'LOOK 01 / THE ARCHITECTURAL STREET EDIT',
      subtitle: 'Contoured Ribbed Knits paired with Heavyweight Parachute Nylon.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=95',
      pins: [
        {
          id: 'pin-1-top',
          x: 48,
          y: 35,
          label: 'Contour Ribbed Crop Top',
          productId: '1',
        },
        {
          id: 'pin-1-bottom',
          x: 52,
          y: 68,
          label: 'Parachute Technical Cargo',
          productId: '2',
        },
      ],
    },
    {
      id: 'look-2',
      title: 'LOOK 02 / HEAVYWEIGHT ATHLETIC DRAPE',
      subtitle: '300GSM French Terry Hoodie and Boxy Structured Silhouette.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=95',
      pins: [
        {
          id: 'pin-2-top',
          x: 45,
          y: 38,
          label: 'Heavyweight 300GSM Boxy Tee',
          productId: '3',
        },
      ],
    },
  ];

  const getProductById = (id: string) => CATALOG_PRODUCTS.find((p) => p.id === id);

  return (
    <section className="py-14 sm:py-20 bg-gray-50 dark:bg-[#121214] border-y border-gray-200 dark:border-white/10 font-body">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3 sm:gap-4">
          <div>
            <span className="font-heading text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500 block">
              SERIES 04 / CAMPAIGN STUDIO
            </span>
            <h2
              style={{ color: BRAND_CONFIG.colors.primaryAccent }}
              className="font-heading text-2xl sm:text-4xl font-black uppercase tracking-tight dark:text-white mt-1"
            >
              SHOP THE LOOKBOOK
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md leading-relaxed">
            Tap the interactive coordinate buttons across our studio editorial looks to view specifications and add the exact pieces to your bag.
          </p>
        </div>

        {/* Lookbook Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {lookbookData.map((look) => (
            <div
              key={look.id}
              className="group relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 dark:border-white/10 shadow-xl"
            >
              <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] w-full">
                <Image
                  src={look.image}
                  alt={look.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Interactive Pins - Large 44x44 target area on mobile for easy thumb tapping */}
                {look.pins.map((pin) => {
                  const product = getProductById(pin.productId);
                  const isPinActive = activePin === pin.id;

                  return (
                    <div
                      key={pin.id}
                      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                    >
                      <button
                        onClick={() => setActivePin(isPinActive ? null : pin.id)}
                        style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
                        className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full text-white font-bold text-base sm:text-sm shadow-xl ring-4 ring-white/30 transition-transform active:scale-95 hover:scale-125"
                        title={pin.label}
                        aria-label={`Shop ${pin.label}`}
                      >
                        {isPinActive ? '✕' : '+'}
                      </button>

                      {/* Floating Product Preview Card overlay - docked safely on mobile screen width */}
                      {isPinActive && product && (
                        <div className="absolute left-1/2 bottom-12 -translate-x-1/2 w-[260px] sm:w-64 rounded-xl bg-white dark:bg-[#18181b] p-3 shadow-2xl border border-gray-200 dark:border-white/20 animate-in fade-in zoom-in duration-200 z-30">
                          <div className="flex gap-3">
                            <div className="relative h-16 w-14 flex-shrink-0 rounded bg-gray-100 overflow-hidden">
                              <Image src={product.imagePrimary} alt={product.title} fill sizes="60px" className="object-cover" />
                            </div>
                            <div className="flex flex-col justify-between flex-1">
                              <div>
                                <h4 className="font-heading text-xs font-bold uppercase tracking-tight text-black dark:text-white line-clamp-1">
                                  {product.title}
                                </h4>
                                <span className="text-[11px] font-black text-black dark:text-white mt-0.5 block">
                                  ₹ {product.price.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  onQuickView(product);
                                  setActivePin(null);
                                }}
                                style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
                                className="w-full rounded py-2 sm:py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow hover:opacity-90 active:scale-95 transition-all mt-1"
                              >
                                SHOP ITEM ↗
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Look Title Footer */}
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 z-10">
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-gray-300 uppercase block">
                    {look.id.toUpperCase()} / ARCHIVE
                  </span>
                  <h3 className="font-heading text-lg sm:text-2xl font-black text-white uppercase tracking-tight mt-1">
                    {look.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-300 mt-1 line-clamp-1">{look.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
