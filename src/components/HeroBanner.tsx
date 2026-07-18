'use client';

import React from 'react';
import Image from 'next/image';
import { CategoryTab } from '../types/catalog';
import { BRAND_CONFIG } from '../data/products';

interface HeroBannerProps {
  activeTab: CategoryTab;
  setActiveTab: (tab: CategoryTab) => void;
}

export default function HeroBanner({ activeTab, setActiveTab }: HeroBannerProps) {
  const isMen = activeTab === 'men';

  return (
    <section className="relative w-full overflow-hidden bg-[#121214] text-white py-12 lg:py-20 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Editorial Content Side */}
          <div className="lg:col-span-6 space-y-6 lg:pr-6">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-gray-300">
              <span>{isMen ? 'SERIES 04 / ATHLETIC PERFORMANCE' : 'SERIES 04 / TAILORED DRAPING'}</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl xl:text-7xl font-black uppercase tracking-tight leading-[0.95] text-white">
              {isMen ? (
                <>
                  ENGINEERED FOR <br />
                  <span className="text-gray-400 font-extralight">HIGH IMPACT.</span>
                </>
              ) : (
                <>
                  RELAXED STREET <br />
                  <span className="text-gray-400 font-extralight">SILHOUETTES.</span>
                </>
              )}
            </h1>

            <p className="max-w-md text-sm sm:text-base font-normal text-gray-400 leading-relaxed">
              {isMen
                ? 'Crafted from 300GSM heavyweight French terry and custom technical mesh. Built for endurance, structure, and uncompromising street aesthetics.'
                : 'Uniting architectural contouring with ultra-soft ribbed knits and parachute nylon. Designed for effortless transitions and supreme comfort.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveTab(isMen ? 'men' : 'women')}
                style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
                className="bg-white text-black px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-lg"
              >
                Shop {isMen ? "Men's Edit" : "Women's Edit"}
              </button>
              
              <button
                onClick={() => setActiveTab('clearance')}
                className="border border-white/30 bg-transparent text-white px-7 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest hover:border-white hover:bg-white/5 transition-all"
              >
                Clearance Archives (80% Off)
              </button>
            </div>

            {/* Campaign Switcher Tabs */}
            <div className="pt-8 border-t border-white/10 flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
              <span className="text-gray-500">Campaign:</span>
              <button
                onClick={() => setActiveTab('women')}
                className={`pb-1 transition-all border-b-2 ${
                  !isMen ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                01. Women Lookbook
              </button>
              <button
                onClick={() => setActiveTab('men')}
                className={`pb-1 transition-all border-b-2 ${
                  isMen ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                02. Men Lookbook
              </button>
            </div>
          </div>

          {/* Editorial Split-Image Lookbook Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 h-[440px] sm:h-[560px]">
            <div className="relative h-full overflow-hidden rounded-2xl bg-gray-800 border border-white/10 shadow-2xl">
              <Image
                src={
                  isMen
                    ? 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=95'
                    : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=95'
                }
                alt="Campaign Primary"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                priority
                className="object-cover object-top transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-[10px] font-mono tracking-widest text-gray-300 uppercase">Fig. 01 / Primary</span>
              </div>
            </div>

            <div className="relative h-full overflow-hidden rounded-2xl bg-gray-800 border border-white/10 shadow-2xl translate-y-4 sm:translate-y-6">
              <Image
                src={
                  isMen
                    ? 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=95'
                    : 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=95'
                }
                alt="Campaign Secondary"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                priority
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-[10px] font-mono tracking-widest text-gray-300 uppercase">Fig. 02 / Detail</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
