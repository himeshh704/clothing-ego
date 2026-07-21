'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Menu, 
  X, 
  Search, 
  ShoppingBag, 
  Sparkles, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Compass, 
  SlidersHorizontal,
  Tag
} from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scrolling with state threshold check to prevent frame drops
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const categories = [
    { id: 'women' as CategoryTab, label: 'WOMEN' },
    { id: 'men' as CategoryTab, label: 'MEN' },
    { id: 'clearance' as CategoryTab, label: 'CLEARANCE ARCHIVES' },
  ];

  const handleMobileCategorySelect = (tab: CategoryTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Sticky Luxury Header */}
      <header 
        className={`sticky top-0 z-40 w-full font-body transform-gpu transition-colors duration-200 ${
          scrolled 
            ? 'bg-white dark:bg-[#18181b] shadow-md border-b border-gray-200/80 dark:border-white/10' 
            : 'bg-white/95 dark:bg-[#18181b]/95 border-b border-gray-100 dark:border-white/5'
        }`}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-2 sm:gap-4">
            
            {/* 1. LEFT: Mobile Drawer Toggle (Menu) & Desktop Navigation Tabs */}
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger Trigger (Inspired by CIS Jodhpur Drawer) */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all border border-gray-200/60 dark:border-white/10 active:scale-95 shrink-0"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Desktop Navigation Tabs (Hover triggers Mega Menu) */}
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
                      className={`font-heading text-xs font-bold uppercase tracking-widest transition-all ${
                        activeTab === cat.id
                          ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-1 font-black'
                          : 'text-gray-500 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  </div>
                ))}
              </nav>
            </div>

            {/* 2. CENTER: Brand Logo */}
            <div
              onClick={() => setActiveTab('women')}
              className="cursor-pointer text-center flex items-center justify-center gap-2 group select-none shrink-0"
            >
              <Image
                src="/zevro-logo.svg"
                alt="ZEVRO Logo"
                width={36}
                height={36}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain transition-transform group-hover:scale-105 rounded-md invert dark:invert-0"
              />
              <div className="flex flex-col items-start justify-center">
                <span className="font-heading text-lg sm:text-2xl font-black tracking-wider uppercase text-black dark:text-white transition-transform group-hover:scale-105 leading-none">
                  {BRAND_CONFIG.name}
                </span>
                <span className="text-[7px] sm:text-[9px] font-mono tracking-[0.25em] text-gray-400 uppercase font-bold mt-0.5">
                  WEAR YOUR EDGE
                </span>
              </div>
            </div>

            {/* 3. RIGHT: Action Triggers (Search & Shopping Bag) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Search Trigger Button */}
              <button
                onClick={onOpenSearch}
                className="flex items-center justify-center h-10 px-2.5 sm:px-3.5 gap-2 rounded-xl bg-gray-100 dark:bg-white/5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all border border-gray-200/80 dark:border-white/10 shadow-xs active:scale-95"
                aria-label="Search Catalog"
              >
                <Search className="w-4 h-4 text-black dark:text-white shrink-0" />
                <span className="hidden sm:inline">SEARCH</span>
                <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded bg-white/80 dark:bg-black/50 text-[10px] font-mono text-gray-500 border border-gray-200 dark:border-white/10">
                  ⌘K
                </kbd>
              </button>

              {/* Shopping Bag Trigger Button */}
              <button
                onClick={onOpenCart}
                style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
                className="flex items-center justify-center h-10 px-3 sm:px-4 gap-2 rounded-xl text-xs font-bold uppercase tracking-widest text-white shadow-md hover:opacity-90 active:scale-95 transition-all shrink-0"
                aria-label="View Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">BAG</span>
                <span className={`flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-white/20 text-[10px] font-black ${
                  cartCount > 0 ? 'animate-pulse scale-105' : ''
                }`}>
                  {cartCount}
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* Secondary Mobile Category Switcher Pills Bar (Ensures fast switching below header) */}
        <div className="lg:hidden flex items-center justify-center gap-2 py-2.5 px-3 bg-gray-50/95 dark:bg-[#111113]/95 border-t border-gray-200/60 dark:border-white/10 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                style={isActive ? { backgroundColor: BRAND_CONFIG.colors.primaryAccent, color: '#fff' } : undefined}
                className={`flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'text-white shadow-md scale-[1.02]'
                    : 'bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200/80 dark:border-white/10 hover:border-black dark:hover:border-white'
                }`}
              >
                {cat.id === 'clearance' && <Tag className="w-3 h-3 text-emerald-400" />}
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Desktop Hover-Triggered Mega Menu Dropdown */}
        {megaMenuTab && (
          <div
            onMouseEnter={() => setMegaMenuTab(megaMenuTab)}
            onMouseLeave={() => setMegaMenuTab(null)}
            className="hidden lg:block absolute top-full left-0 right-0 w-full bg-white dark:bg-[#18181b] border-b border-gray-200 dark:border-white/10 shadow-2xl animate-in slide-in-from-top-2 duration-200 z-50 font-body"
          >
            <div className="mx-auto max-w-7xl px-8 py-10 grid grid-cols-12 gap-8">
              
              {/* Column 1: Categories */}
              <div className="col-span-3 space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block border-b border-gray-200 dark:border-white/10 pb-2 flex items-center justify-between">
                  <span>{megaMenuTab.toUpperCase()} / SILHOUETTES</span>
                  <SlidersHorizontal className="w-3 h-3 text-gray-400" />
                </span>
                <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                  <li
                    onClick={() => { setActiveTab(megaMenuTab); setMegaMenuTab(null); }}
                    className="hover:translate-x-1 transition-transform cursor-pointer hover:text-emerald-500 flex items-center justify-between group/link"
                  >
                    <span>01. All {megaMenuTab} Lookbook</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover/link:text-emerald-500 transition-transform group-hover/link:translate-x-0.5" />
                  </li>
                  <li
                    onClick={() => { setActiveTab(megaMenuTab); setMegaMenuTab(null); }}
                    className="hover:translate-x-1 transition-transform cursor-pointer hover:text-emerald-500 flex items-center justify-between group/link"
                  >
                    <span>02. Heavyweight Tracksuits</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover/link:text-emerald-500 transition-transform group-hover/link:translate-x-0.5" />
                  </li>
                  <li
                    onClick={() => { setActiveTab(megaMenuTab); setMegaMenuTab(null); }}
                    className="hover:translate-x-1 transition-transform cursor-pointer hover:text-emerald-500 flex items-center justify-between group/link"
                  >
                    <span>03. Ribbed Knits &amp; Tops</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover/link:text-emerald-500 transition-transform group-hover/link:translate-x-0.5" />
                  </li>
                  <li
                    onClick={() => { setActiveTab(megaMenuTab); setMegaMenuTab(null); }}
                    className="hover:translate-x-1 transition-transform cursor-pointer hover:text-emerald-500 flex items-center justify-between group/link"
                  >
                    <span>04. Parachute Cargo Pants</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover/link:text-emerald-500 transition-transform group-hover/link:translate-x-0.5" />
                  </li>
                </ul>
              </div>

              {/* Column 2: Highlights */}
              <div className="col-span-3 space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block border-b border-gray-200 dark:border-white/10 pb-2">
                  ARCHIVE COLLECTIONS
                </span>
                <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  <li className="hover:text-black dark:hover:text-white cursor-pointer flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Series 04 / Core Draping
                  </li>
                  <li className="hover:text-black dark:hover:text-white cursor-pointer">300GSM French Terry Program</li>
                  <li className="hover:text-black dark:hover:text-white cursor-pointer">Athletic Contour Capsule</li>
                  <li className="hover:text-black dark:hover:text-white cursor-pointer flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <Truck className="w-3.5 h-3.5" /> 24H Air Express Dispatch
                  </li>
                </ul>
              </div>

              {/* Column 3 & 4: Live Lookbook Card */}
              <div className="col-span-6 flex gap-6 bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-200 dark:border-white/10">
                <div className="relative aspect-[3/4] w-36 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 shadow-md">
                  <Image
                    src={
                      megaMenuTab === 'women'
                        ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=90'
                        : 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=90'
                    }
                    alt="Lookbook Spotlight"
                    fill
                    sizes="150px"
                    className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <span className="rounded-full bg-black dark:bg-white text-white dark:text-black px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest inline-flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400 dark:text-amber-600" /> SPOTLIGHT EDIT
                    </span>
                    <h4 className="font-heading text-lg font-black uppercase text-black dark:text-white mt-2 leading-tight">
                      {megaMenuTab === 'women' ? 'THE CONTOUR & CARGO CAPSULE' : 'THE 300GSM ATHLETIC SERIES'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {megaMenuTab === 'women'
                        ? 'Architectural draping paired with heavy utility parachute nylon engineered for modern street mobility.'
                        : 'Heavyweight French terry boxy cuts engineered for lifetime wear and extreme atmospheric durability.'}
                    </p>
                  </div>
                  <button
                    onClick={() => { setActiveTab(megaMenuTab); setMegaMenuTab(null); }}
                    style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
                    className="w-fit flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
                  >
                    <span>SHOP THIS CAMPAIGN</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          4. CIS JODHPUR-INSPIRED LUXURY MOBILE NAVIGATION DRAWER
          ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-in fade-in duration-200">
          {/* Backdrop Blur Overlay */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
          />

          {/* Side Drawer Panel */}
          <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-[#18181b] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
            
            {/* Drawer Top Header Bar */}
            <div className="p-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
              <div className="flex flex-col">
                <span className="font-heading text-lg font-black uppercase tracking-tighter text-black dark:text-white">
                  {BRAND_CONFIG.name}
                </span>
                <span className="text-[8px] font-mono tracking-widest text-gray-400 uppercase -mt-0.5">
                  {BRAND_CONFIG.tagline}
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Main Content */}
            <div className="p-5 space-y-6 flex-1">
              
              {/* Primary Category Selector Cards */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block px-1">
                  SELECT SILHOUETTE ARCHIVE
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {categories.map((cat) => {
                    const isActive = activeTab === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleMobileCategorySelect(cat.id)}
                        style={isActive ? { backgroundColor: BRAND_CONFIG.colors.primaryAccent } : undefined}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all ${
                          isActive
                            ? 'text-white shadow-lg scale-[1.02]'
                            : 'bg-gray-50 dark:bg-white/5 text-black dark:text-white border border-gray-200/60 dark:border-white/10 hover:border-black dark:hover:border-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-ping' : 'bg-gray-300 dark:bg-gray-600'}`} />
                          <span className="font-heading text-sm font-black uppercase tracking-wider">
                            {cat.label}
                          </span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sub-Silhouettes Menu */}
              <div className="pt-2 border-t border-gray-100 dark:border-white/10 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block px-1">
                  CURATED COLLECTIONS
                </span>
                <div className="space-y-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
                  <div 
                    onClick={() => handleMobileCategorySelect(activeTab)}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <span>01. Complete Lookbook Archives</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div 
                    onClick={() => handleMobileCategorySelect(activeTab)}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <span>02. Heavyweight Tracksuits &amp; Co-Ords</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div 
                    onClick={() => handleMobileCategorySelect(activeTab)}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <span>03. Parachute Cargo Pants &amp; Utility</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Mobile Lookbook Spotlight Card */}
              <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-black p-4 text-white shadow-xl relative overflow-hidden border border-white/10">
                <div className="relative z-10">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-bold text-[8px] uppercase tracking-widest inline-flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> CAMPAIGN EDIT
                  </span>
                  <h5 className="font-heading text-sm font-black uppercase mt-2">
                    {activeTab === 'women' ? 'CONTOUR & CARGO CAPSULE' : '300GSM ATHLETIC SERIES'}
                  </h5>
                  <p className="text-[11px] text-gray-300 mt-1 line-clamp-2">
                    High-density architectural street silhouettes ready for dispatch.
                  </p>
                  <button
                    onClick={() => handleMobileCategorySelect(activeTab)}
                    className="mt-3.5 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-colors"
                  >
                    <span>EXPLORE ARCHIVE</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>

            {/* Drawer Footer / VIP Badges */}
            <div className="p-5 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#111113] space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-500" /> 24H Air Dispatch
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Lifetime Guarantee
                </span>
              </div>
              <div className="text-[10px] font-mono text-center text-gray-400 pt-1 border-t border-gray-200/60 dark:border-white/5">
                ZEVRO ENG. LAB — LONDON / TOKYO / NYC
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
