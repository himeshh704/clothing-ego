'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND_CONFIG } from '../data/products';

export default function Footer() {
  const footerLinks = [
    'HELP',
    'TRACK ORDER',
    'Return and Exchange Policy',
    'TERMS & CONDITIONS',
    'PRIVACY POLICY',
    'CONTACT',
    'RETURN AND EXCHANGE ORDER',
    'BLOGS',
  ];

  return (
    <footer
      style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
      className="text-white pt-16 pb-12 relative"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-3 border-b border-white/20 pb-12">
          {footerLinks.map((link) => (
            <Link
              key={link}
              href={`#${link.toLowerCase().replace(/[^a-z]/g, '-')}`}
              className="text-xs sm:text-sm font-bold tracking-wider hover:underline transition-all"
            >
              {link}
            </Link>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between text-xs font-bold tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-white flex items-center justify-center text-black font-extrabold text-[9px]">
              Z
            </span>
            <span>{BRAND_CONFIG.name} STUDIO</span>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1 hover:text-gray-300 transition-colors"
          >
            <span>Back To Top</span>
            <span>↑</span>
          </button>
        </div>
      </div>

      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-2xl hover:scale-110 transition-transform"
      >
        <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.128 1.536 5.887L.182 23.633l5.962-1.547A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.952 17.069c-.255.717-1.488 1.371-2.062 1.455-.575.085-1.121.143-3.649-.906-3.23-1.341-5.313-4.636-5.474-4.85-.162-.213-1.306-1.74-1.306-3.319 0-1.579.829-2.358 1.123-2.677.294-.319.642-.399.855-.399.214 0 .428.001.616.011.198.01.464-.076.726.554.265.637.906 2.21 .985 2.37.08.16.134.346.027.558-.107.213-.16.346-.321.533-.16.186-.336.416-.481.558-.16.16-.328.334-.141.654.187.319.833 1.377 1.787 2.228 1.226 1.094 2.257 1.433 2.578 1.593.321.16.508.134.695-.08.187-.213.802-.93 1.016-1.249.214-.319.428-.266.722-.16.294.107 1.872.883 2.193 1.043.321.16.535.24.615.373.08.134.08.777-.175 1.494z" />
        </svg>
      </a>
    </footer>
  );
}
