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

  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'M');
      setActiveImage(product.imagePrimary);
      setShowFitCalc(false);
      setFitRecommendation(null);
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

  const handleWhatsAppEnquire = () => {
    const sizeToUse = selectedSize || product.sizes[0] || 'M';
    const messageText = [
      `Hello *${BRAND_CONFIG.name} Concierge*! 👋`,
      `I would like to enquire about the following silhouette:\n`,
      `• *Item:* ${product.title}`,
      `• *Size:* ${sizeToUse}`,
      `• *Price:* ₹ ${product.price.toLocaleString('en-IN')}`,
      `\nPlease let me know availability and delivery details across my city.`
    ].join('\n');

    const whatsappUrl = `https://wa.me/${BRAND_CONFIG.socials.whatsapp}?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');
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

        {/* Gallery Section */}
        <div className="relative aspect-[4/5] sm:aspect-square md:aspect-auto md:h-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
          <Image
            src={activeImage || product.imagePrimary}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top transition-all duration-300"
          />
          <div className="absolute bottom-3 left-3 flex gap-2 z-10">
            {[product.imagePrimary, product.imageSecondary].map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <button
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
                onClick={handleWhatsAppEnquire}
                className="w-full min-h-[48px] sm:min-h-[50px] rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>💬 ENQUIRE ON WHATSAPP</span>
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
    </div>
  );
}
