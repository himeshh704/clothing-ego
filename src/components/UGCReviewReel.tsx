'use client';

import React from 'react';
import Image from 'next/image';
import { BRAND_CONFIG } from '../data/products';

interface ReviewCard {
  id: string;
  author: string;
  handle: string;
  rating: number;
  comment: string;
  itemBought: string;
  image: string;
  verified: boolean;
}

export default function UGCReviewReel() {
  const reviews: ReviewCard[] = [
    {
      id: 'rev-1',
      author: 'Aarav M.',
      handle: '@aarav.studio',
      rating: 5,
      comment: 'The 300GSM French Terry drape on the boxy tee is unmatched. Fits exactly like high-end runway pieces.',
      itemBought: 'Heavyweight 300GSM Boxy Tee (Size L)',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=85',
      verified: true,
    },
    {
      id: 'rev-2',
      author: 'Rhea K.',
      handle: '@rheakpoor',
      rating: 5,
      comment: 'Parachute cargo silhouette holds its shape all day while breathing effortlessly. Best luxury co-ord in India.',
      itemBought: 'Parachute Technical Cargo (Size M)',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=85',
      verified: true,
    },
    {
      id: 'rev-3',
      author: 'Vikram S.',
      handle: '@vikram.style',
      rating: 5,
      comment: 'Insane attention to detail. Express 24-hour dispatch arrived perfectly packaged in custom matte archive boxes.',
      itemBought: 'Series 04 Tracksuit Co-Ord (Size XL)',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=85',
      verified: true,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#18181b] font-body border-t border-gray-200 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex text-emerald-600 font-bold text-xs">★★★★★</span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">4.9 / 5.0 RATING (1,420+ VERIFIED ARCHIVE REVIEWS)</span>
            </div>
            <h2
              style={{ color: BRAND_CONFIG.colors.primaryAccent }}
              className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight dark:text-white"
            >
              COMMUNITY &amp; STREET STYLING
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-widest text-black dark:text-white border-b border-black dark:border-white pb-1 hover:opacity-70 transition-opacity self-start sm:self-auto"
          >
            TAG @ZEVROOFFICIAL TO GET FEATURED ↗
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[4/3] w-full bg-gray-200 overflow-hidden">
                <Image
                  src={rev.image}
                  alt={rev.author}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>VERIFIED BUYER</span>
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading text-sm font-black uppercase text-black dark:text-white">
                        {rev.author}
                      </h4>
                      <span className="text-xs font-mono text-gray-400">{rev.handle}</span>
                    </div>
                    <span className="text-emerald-600 font-bold text-xs">★★★★★</span>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <span>PURCHASED: </span>
                  <span className="text-black dark:text-white">{rev.itemBought}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
