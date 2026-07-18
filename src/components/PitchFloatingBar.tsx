'use client';

import React, { useState } from 'react';
import { BRAND_CONFIG } from '../data/products';

export default function PitchFloatingBar() {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-2xl hover:scale-105 transition-transform border border-white/20"
      >
        <span>⚡ Pitch ROI Stats</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm rounded-2xl bg-black/90 dark:bg-white/95 backdrop-blur-xl p-4 text-white dark:text-black shadow-2xl border border-white/20 dark:border-black/20 font-body animate-float">
      <div className="flex items-center justify-between border-b border-white/10 dark:border-black/10 pb-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-heading text-xs font-black uppercase tracking-widest">
            {BRAND_CONFIG.name} — Pitch Mode Active
          </span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="text-xs text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-black font-bold"
        >
          Hide ✕
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] font-medium">
        <div className="rounded-lg bg-white/10 dark:bg-black/5 p-2">
          <div className="text-gray-400 dark:text-gray-500 text-[10px] uppercase">Page Load Latency</div>
          <div className="font-heading text-sm font-black text-emerald-400 dark:text-emerald-600">
            0.12s <span className="text-[10px] text-gray-400 font-normal">(vs 7.84s Legacy)</span>
          </div>
        </div>

        <div className="rounded-lg bg-white/10 dark:bg-black/5 p-2">
          <div className="text-gray-400 dark:text-gray-500 text-[10px] uppercase">Blocking Scripts</div>
          <div className="font-heading text-sm font-black text-emerald-400 dark:text-emerald-600">
            0 <span className="text-[10px] text-gray-400 font-normal">(vs 65+ Legacy)</span>
          </div>
        </div>
      </div>

      <p className="mt-2 text-[11px] text-gray-300 dark:text-gray-700 leading-tight">
        ✨ <span className="font-bold">Pitch Ready:</span> Interactive Cart Drawer, PDP Quick View, and Instant Swatch Swapping are live. Click any product to demonstrate!
      </p>
    </div>
  );
}
