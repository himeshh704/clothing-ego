'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CategoryTab } from '../types/catalog';
import { BRAND_CONFIG } from '../data/products';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  activeTab: CategoryTab;
  setActiveTab: (tab: CategoryTab) => void;
}

export default function Header({
  cartCount,
  onOpenCart,
  onOpenSearch,
  activeTab,
  setActiveTab,
}: HeaderProps) {
  const [megaMenuTab, setMegaMenuTab] = useState<CategoryTab | null>(null);

  const categories = [
    { id: 'women' as CategoryTab, label: 'WOMEN' },
    { id: 'men' as CategoryTab, label: 'MEN' },
    { id: 'clearance' as CategoryTab, label: 'CLEARANCE ARCHIVES' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 transition-all font-body">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-3 sm:gap-4">
          
          {/* Left Navigation Tabs (Hover triggers Mega Menu for Women & Men on desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onMouseEnter={() => {
                  if (cat.id === 'women' || cat.id === 'men') {
                    setMegaMenuTab(cat.id);
                  } else {
                    setMegaMenuTab(null);
                  }
                }}
                className="relative py-7 cursor-pointer"
              >
                <button
                  onClick={() => setActiveTab(cat.id)}
                  className={`font-heading text-xs font-bold uppercase tracking-widest transition-colors ${
                    activeTab === cat.id
                      ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1'
                      : 'text-gray-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              </div>
            ))}
          </nav>

          {/* Mobile Category Switcher Pills - Large 40px touch targets */}
          <div className="flex lg:hidden items-center gap-1.5">
            <button
              onClick={() => setActiveTab('women')}
              style={activeTab === 'women' ? { backgroundColor: BRAND_CONFIG.colors.primaryAccent, color: '#fff' } : undefined}
              className={`h-9 px-3 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${
                activeTab === 'women'
                  ? 'text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'
              }`}
            >
              WOMEN
            </button>
            <button
              onClick={() => setActiveTab('men')}
              style={activeTab === 'men' ? { backgroundColor: BRAND_CONFIG.colors.primaryAccent, color: '#fff' } : undefined}
              className={`h-9 px-3 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${
                activeTab === 'men'
                  ? 'text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'
              }`}
            >
              MEN
            </button>
          </div>

          {/* Center Brand Logo */}
          <div
            onClick={() => setActiveTab('women')}
            className="cursor-pointer text-center flex flex-col items-center justify-center group"
          >
            <span className="font-heading text-lg sm:text-2xl font-black tracking-tighter uppercase text-black dark:text-white transition-transform group-hover:scale-105">
              {BRAND_CONFIG.name}
            </span>
            <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-gray-400 uppercase -mt-1 block">
              {BRAND_CONFIG.tagline}
            </span>
          </div>

          {/* Right Action Icons (Search, Bag) - Touch optimized */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onOpenSearch}
              className="flex h-10 px-3 sm:px-3.5 items-center gap-1.5 rounded-xl bg-gray-100 dark:bg-white/5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all border border-gray-200 dark:border-white/10 shadow-xs"
              aria-label="Search Catalog"
            >
              <span>🔍</span>
              <span className="hidden sm:inline">SEARCH</span>
            </button>

            <button
              onClick={onOpenCart}
              style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
              className="flex h-10 items-center gap-2 rounded-xl px-3 sm:px-4 text-xs font-bold uppercase tracking-widest text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
              aria-label="View Shopping Bag"
            >
              <span>BAG</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-black">
                {cartCount}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Hover-Triggered Mega Menu Dropdown (Desktop only) */}
      {megaMenuTab && (
        <div
          onMouseEnter={() => setMegaMenuTab(megaMenuTab)}
          onMouseLeave={() => setMegaMenuTab(null)}
          className="hidden lg:block absolute top-full left-0 right-0 w-full bg-white dark:bg-[#18181b] border-b border-gray-200 dark:border-white/10 shadow-2xl animate-in slide-in-from-top-2 duration-200 z-50 font-body"
        >
          <div className="mx-auto max-w-7xl px-8 py-10 grid grid-cols-12 gap-8">
            
            {/* Column 1: Categories */}
            <div className="col-span-3 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block border-b border-gray-200 dark:border-white/10 pb-2">
                {megaMenuTab.toUpperCase()} / SILHOUETTES
              </span>
              <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                <li
                  onClick={() => { setActiveTab(megaMenuTab); setMegaMenuTab(null); }}
                  className="hover:translate-x-1 transition-transform cursor-pointer hover:text-emerald-500 flex items-center justify-between"
                >
                  <span>01. All {megaMenuTab} Lookbook</span>
                  <span>→</span>
                </li>
                <li
                  onClick={() => { setActiveTab(megaMenuTab); setMegaMenuTab(null); }}
                  className="hover:translate-x-1 transition-transform cursor-pointer hover:text-emerald-500 flex items-center justify-between"
                >
                  <span>02. Heavyweight Tracksuits</span>
                  <span>→</span>
                </li>
                <li
                  onClick={() => { setActiveTab(megaMenuTab); setMegaMenuTab(null); }}
                  className="hover:translate-x-1 transition-transform cursor-pointer hover:text-emerald-500 flex items-center justify-between"
                >
                  <span>03. Ribbed Knits &amp; Tops</span>
                  <span>→</span>
                </li>
                <li
                  onClick={() => { setActiveTab(megaMenuTab); setMegaMenuTab(null); }}
                  className="hover:translate-x-1 transition-transform cursor-pointer hover:text-emerald-500 flex items-center justify-between"
                >
                  <span>04. Parachute Cargo Pants</span>
                  <span>→</span>
                </li>
              </ul>
            </div>

            {/* Column 2: Highlights */}
            <div className="col-span-3 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block border-b border-gray-200 dark:border-white/10 pb-2">
                ARCHIVE COLLECTIONS
              </span>
              <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                <li className="hover:text-black dark:hover:text-white cursor-pointer">Series 04 / Core Draping</li>
                <li className="hover:text-black dark:hover:text-white cursor-pointer">300GSM French Terry Program</li>
                <li className="hover:text-black dark:hover:text-white cursor-pointer">Athletic Contour Capsule</li>
                <li className="hover:text-black dark:hover:text-white cursor-pointer">24H Air Express Dispatch</li>
              </ul>
            </div>

            {/* Column 3 & 4: Live Lookbook Card */}
            <div className="col-span-6 flex gap-6 bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-200 dark:border-white/10">
              <div className="relative aspect-[3/4] w-36 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                <Image
                  src={
                    megaMenuTab === 'women'
                      ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=90'
                      : 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=90'
                  }
                  alt="Lookbook Spotlight"
                  fill
                  sizes="150px"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-col justify-between flex-1 py-2">
                <div>
                  <span className="rounded-full bg-black dark:bg-white text-white dark:text-black px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                    SPOTLIGHT EDIT
                  </span>
                  <h4 className="font-heading text-lg font-black uppercase text-black dark:text-white mt-2 leading-tight">
                    {megaMenuTab === 'women' ? 'THE CONTOUR & CARGO CAPSULE' : 'THE 300GSM ATHLETIC SERIES'}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {megaMenuTab === 'women'
                      ? 'Architectural draping paired with heavy utility parachute nylon.'
                      : 'Heavyweight French terry boxy cuts engineered for lifetime wear.'}
                  </p>
                </div>
                <button
                  onClick={() => { setActiveTab(megaMenuTab); setMegaMenuTab(null); }}
                  style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
                  className="w-fit rounded-lg px-5 py-2 text-xs font-bold uppercase tracking-widest text-white shadow hover:opacity-90 transition-opacity"
                >
                  SHOP THIS CAMPAIGN ↗
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
