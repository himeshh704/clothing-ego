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
        href={`https://ig.me/m/${BRAND_CONFIG.socials.instagram}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct Message on Instagram"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all group"
        title={`Message @${BRAND_CONFIG.socials.instagram} on Instagram`}
      >
        <svg className="h-7 w-7 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </a>
    </footer>
  );
}
