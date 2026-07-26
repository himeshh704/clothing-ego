'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '../types/catalog';
import { BRAND_CONFIG } from '../data/products';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize: string) => void;
}

export default function QuickViewModal({ product, onClose, onAddToCart }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');
  const [showFitCalc, setShowFitCalc] = useState(false);
  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('70');
  const [fitRecommendation, setFitRecommendation] = useState<string | null>(null);
  const [imageFitMode, setImageFitMode] = useState<'contain' | 'cover'>('contain');
  const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);
  const [showIgModal, setShowIgModal] = useState(false);
  const [igMessageText, setIgMessageText] = useState('');

  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'M');
      setActiveImage(product.imagePrimary);
      setShowFitCalc(false);
      setFitRecommendation(null);
      setImageFitMode('contain');
      setIsLightBoxOpen(false);
      setShowIgModal(false);
    }
  }, [product]);

  if (!product) return null;

  const calculateFit = () => {
    const h = parseInt(heightCm, 10) || 175;
    const w = parseInt(weightKg, 10) || 70;
    let rec = 'M';
    if (w < 58 || h < 165) rec = 'S';
    else if (w >= 58 && w <= 75 && h <= 180) rec = 'M';
    else if (w > 75 && w <= 88) rec = 'L';
    else rec = 'XL';

    setSelectedSize(rec);
    setFitRecommendation(`Our silhouette algorithm recommends SIZE ${rec} for a tailored street drape based on ${h}cm and ${w}kg.`);
  };

  const handleInstagramEnquire = () => {
    const sizeToUse = selectedSize || product.sizes[0] || 'M';
    const messageText = [
      `Hey @${BRAND_CONFIG.socials.instagram}! 👋 I want to buy this item:`,
      `• Item: ${product.title}`,
      `• Size: ${sizeToUse}`,
      `• Total Price: ₹ ${product.price.toLocaleString('en-IN')}`,
      `\nPlease send payment link & delivery details!`
    ].join('\n');

    setIgMessageText(messageText);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(messageText);
    }
    setShowIgModal(true);

    const encodedMsg = encodeURIComponent(messageText);
    const igUrl = `https://ig.me/m/${BRAND_CONFIG.socials.instagram}?text=${encodedMsg}`;
    window.open(igUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 overflow-y-auto font-body">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Bottom sheet on mobile (rounded-t-2xl), center modal on desktop (rounded-2xl) */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto sm:overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white dark:bg-[#18181b] shadow-2xl border sm:border-gray-200 dark:sm:border-white/10 grid grid-cols-1 md:grid-cols-2">
        
        {/* Mobile close pill header */}
        <div className="sticky top-0 z-30 flex sm:hidden items-center justify-between px-4 py-3 bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
          <span className="font-heading text-xs font-black uppercase tracking-tight text-black dark:text-white line-clamp-1">
            {product.title}
          </span>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-black dark:text-white font-bold text-xs"
            aria-label="Close Modal"
          >
            ✕
          </button>
        </div>

        {/* Desktop close button */}
        <button
          onClick={onClose}
          className="hidden sm:flex absolute top-4 right-4 z-20 h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black transition-colors font-bold text-xs"
          aria-label="Close Modal"
        >
          ✕
        </button>

        {/* Gallery Section - Full view mode by default */}
        <div className="relative aspect-[4/5] sm:aspect-square md:aspect-auto md:h-full bg-gray-900/10 dark:bg-gray-950 flex items-center justify-center overflow-hidden group">
          <Image
            src={activeImage || product.imagePrimary || '/products/spiderman-oversized-tee-men.jpg'}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`transition-all duration-300 cursor-zoom-in ${
              imageFitMode === 'contain' ? 'object-contain p-2 sm:p-6' : 'object-cover object-top'
            }`}
            onClick={() => setIsLightBoxOpen(true)}
          />

          {/* Toggle Fit Mode & Fullscreen Lightbox Buttons */}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
            <button
              type="button"
              onClick={() => setImageFitMode(imageFitMode === 'contain' ? 'cover' : 'contain')}
              className="rounded-full bg-black/70 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-black transition-all shadow"
            >
              {imageFitMode === 'contain' ? '🔎 COVER VIEW' : '🖼️ FULL VIEW (100%)'}
            </button>
            <button
              type="button"
              onClick={() => setIsLightBoxOpen(true)}
              className="rounded-full bg-black/70 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-black transition-all shadow"
            >
              🔍 FULLSCREEN
            </button>
          </div>

          <div className="absolute bottom-3 left-3 flex gap-2 z-10">
            {Array.from(new Set([product.imagePrimary, product.imageSecondary].filter(Boolean))).map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(img);
                }}
                className={`relative h-14 w-12 rounded-md overflow-hidden border-2 transition-all shadow ${
                  activeImage === img ? 'border-black dark:border-white scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt="Thumbnail" fill sizes="48px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-5 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-gray-100 dark:bg-white/10 text-black dark:text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border border-gray-200 dark:border-white/15">
                EXPRESS DISPATCH
              </span>
              {product.badge && (
                <span className="rounded-full bg-black dark:bg-white text-white dark:text-black px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                  {product.badge}
                </span>
              )}
            </div>

            <h2 className="font-heading text-xl sm:text-3xl font-black text-black dark:text-white uppercase tracking-tight">
              {product.title}
            </h2>

            <div className="mt-2.5 sm:mt-3 flex items-baseline gap-2 sm:gap-3">
              <span className="font-heading text-xl sm:text-2xl font-black text-black dark:text-white">
                ₹ {product.price.toLocaleString('en-IN')}.00
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-400 line-through">
                ₹ {product.compareAtPrice.toLocaleString('en-IN')}.00
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-red-600">
                (-{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF)
              </span>
            </div>

            <p className="mt-2 text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 pb-4">
              {product.emiText} • 100% Cotton & Engineered Poly-Mesh
            </p>

            {/* Size Picker & Fit Calculator Toggle */}
            <div className="mt-5 sm:mt-6">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-2">
                <span>Select Size:</span>
                <button
                  type="button"
                  onClick={() => setShowFitCalc(!showFitCalc)}
                  className="text-emerald-600 underline font-extrabold hover:opacity-80 transition-opacity py-1"
                >
                  {showFitCalc ? '✕ Hide Fit Calculator' : '📏 Find My Fit Algorithm'}
                </button>
              </div>

              {/* Fit Calculator Panel */}
              {showFitCalc && (
                <div className="mb-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3.5 sm:p-4 space-y-3 animate-in fade-in duration-200">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">
                    ENTER MEASUREMENTS FOR SILHOUETTE PREDICTION:
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Height (cm)</label>
                      <input
                        type="number"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        className="w-full h-10 rounded-md bg-white dark:bg-black border border-gray-200 dark:border-white/15 px-3 text-xs font-bold text-black dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={weightKg}
                        onChange={(e) => setWeightKg(e.target.value)}
                        className="w-full h-10 rounded-md bg-white dark:bg-black border border-gray-200 dark:border-white/15 px-3 text-xs font-bold text-black dark:text-white"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={calculateFit}
                    style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
                    className="w-full h-11 rounded-md text-[11px] font-bold uppercase tracking-widest text-white shadow hover:opacity-90 active:scale-95 transition-transform"
                  >
                    Calculate Recommended Size
                  </button>
                  {fitRecommendation && (
                    <div className="rounded bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      ✓ {fitRecommendation}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    style={selectedSize === size ? { backgroundColor: BRAND_CONFIG.colors.primaryAccent } : undefined}
                    className={`h-11 min-w-[48px] sm:min-w-[52px] rounded-lg px-4 text-xs font-bold uppercase transition-all active:scale-95 ${
                      selectedSize === size
                        ? 'text-white shadow-md'
                        : 'bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Swatch info */}
            <div className="mt-5 sm:mt-6">
              <span className="text-xs font-bold uppercase tracking-wider block mb-2">
                Color Options ({product.swatches.length}):
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {product.swatches.map((sw, i) => (
                  <div key={i} className="flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-white/5 px-3 py-1 text-xs border border-gray-200 dark:border-white/10">
                    <span style={{ backgroundColor: sw.colorHex }} className="h-3 w-3 rounded-full border border-gray-300" />
                    <span className="font-semibold">{sw.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky/Fixed Bottom Actions on Mobile - Side by side or stacked with 48px+ touch targets */}
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-white/10 sticky sm:static bottom-0 bg-white dark:bg-[#18181b] pb-2 sm:pb-0">
            {showIgModal && (
              <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-[11px] font-bold text-pink-600 dark:text-pink-400 text-center animate-pulse">
                📋 Order message copied to clipboard! Opening Instagram DM...
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  onAddToCart(product, selectedSize || product.sizes[0] || 'M');
                  onClose();
                }}
                style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
                className="w-full min-h-[48px] sm:min-h-[50px] rounded-xl py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>ADD TO BAG ({selectedSize || product.sizes[0] || 'M'})</span>
              </button>

              <button
                type="button"
                onClick={handleInstagramEnquire}
                className="w-full min-h-[48px] sm:min-h-[50px] rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:opacity-95 active:scale-95 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>📸 ORDER ON INSTAGRAM</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>Complimentary Air Delivery</span>
              <span>•</span>
              <span>7-Day Archive Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal for 100% Uncropped Garment View */}
      {isLightBoxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => setIsLightBoxOpen(false)}
            className="absolute top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white font-bold text-lg hover:bg-white/40 transition-colors"
            aria-label="Close Lightbox"
          >
            ✕
          </button>
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center">
            <Image
              src={activeImage || product.imagePrimary}
              alt={product.title}
              fill
              sizes="100vw"
              className="object-contain p-2"
              priority
            />
          </div>
          <div className="absolute bottom-6 inset-x-0 text-center">
            <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white uppercase tracking-widest backdrop-blur-md">
              {product.title} — 100% FULL GARMENT VIEW
            </span>
          </div>
        </div>
      )}
      {/* Instagram Direct Order Sheet Modal */}
      {showIgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#18181b] p-5 sm:p-6 shadow-2xl border border-gray-200 dark:border-white/10 space-y-4 font-body">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📸</span>
                <h3 className="font-heading text-sm font-black uppercase text-black dark:text-white">
                  Buy via Instagram DM (@{BRAND_CONFIG.socials.instagram})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIgModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-black dark:text-white font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3.5 space-y-1.5 text-xs">
              <div className="font-bold text-gray-500 uppercase text-[10px]">SELECTED ITEM:</div>
              <div className="font-bold text-black dark:text-white text-sm">{product.title}</div>
              <div className="flex justify-between font-bold text-black dark:text-white pt-2 border-t border-gray-200 dark:border-white/10">
                <span className="rounded bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 text-[10px]">SIZE: {selectedSize || product.sizes[0] || 'M'}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">TOTAL: ₹ {product.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">
                  Pre-filled Order Message:
                </label>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  ✓ Copied to clipboard
                </span>
              </div>
              <textarea
                readOnly
                value={igMessageText}
                rows={5}
                className="w-full rounded-lg bg-gray-100 dark:bg-black/60 border border-gray-200 dark:border-white/10 p-3 text-xs font-mono text-black dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-2 pt-1">
              <a
                href={`https://ig.me/m/${BRAND_CONFIG.socials.instagram}?text=${encodeURIComponent(igMessageText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-md flex items-center justify-center gap-2 text-center"
              >
                <span>OPEN INSTAGRAM DM WITH PRE-FILLED TEXT →</span>
              </a>

              <a
                href={`https://www.instagram.com/direct/new/?text=${encodeURIComponent(igMessageText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-xl bg-gray-100 dark:bg-white/10 text-black dark:text-white py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-center"
              >
                <span>Direct Web DM (Pre-Filled)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
