'use client';

import React, { useState } from 'react';
import { BRAND_CONFIG } from '../data/products';

export default function AnnouncementBar() {
  const [closed, setClosed] = useState(false);
  if (closed) return null;

  return (
    <div
      style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
      className="px-4 py-2.5 text-center text-[11px] font-bold tracking-widest uppercase text-white transition-all flex items-center justify-between border-b border-white/10"
    >
      <div className="w-5" />
      <div className="flex items-center gap-2">
        <span className="text-gray-300">{BRAND_CONFIG.announcement}</span>
      </div>
      <button
        onClick={() => setClosed(true)}
        className="text-white/70 hover:text-white transition-colors text-sm font-bold leading-none px-1"
        aria-label="Close Announcement"
      >
        ✕
      </button>
    </div>
  );
}
