'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '../types/catalog';
import { BRAND_CONFIG } from '../data/products';

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, selectedSize: string, delta: number) => void;
  onRemove: (id: string, selectedSize: string) => void;
  onClear: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onClear,
}: CartDrawerProps) {
  const [copiedToast, setCopiedToast] = React.useState(false);
  const [showIgModal, setShowIgModal] = React.useState(false);
  const [igMessageText, setIgMessageText] = React.useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = items.reduce((sum, item) => sum + (item.compareAtPrice - item.price) * item.quantity, 0);

  const handleInstagramOrder = () => {
    const lines = items.map(
      (item, idx) =>
        `• ${item.title}\n   Size: ${item.selectedSize} | Qty: ${item.quantity} | ₹ ${(item.price * item.quantity).toLocaleString('en-IN')}`
    );

    const messageText = [
      `Hey @${BRAND_CONFIG.socials.instagram}! 👋 I want to buy these items:`,
      ...lines,
      `\n----------------------------`,
      `TOTAL ORDER PRICE: ₹ ${subtotal.toLocaleString('en-IN')}`,
      `----------------------------`,
      `Please confirm order & send payment link!`
    ].join('\n');

    setIgMessageText(messageText);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(messageText);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 4000);
    }
    setShowIgModal(true);

    const igUrl = `https://ig.me/m/${BRAND_CONFIG.socials.instagram}`;
    window.open(igUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-body">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 w-full sm:w-auto">
        <div className="w-full sm:w-screen sm:max-w-md bg-white dark:bg-[#18181b] shadow-2xl border-l border-gray-200 dark:border-white/10 flex flex-col justify-between h-full">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
                className="h-3 w-3 rounded-full"
              />
              <h2 className="font-heading text-sm sm:text-base font-black uppercase tracking-tight text-black dark:text-white">
                SHOPPING BAG ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors font-bold text-sm"
              aria-label="Close Bag"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-3 text-gray-400">
                <p className="font-heading text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white">Your bag is currently empty</p>
                <p className="text-xs text-gray-500 max-w-xs">
                  Discover engineered athletic silhouettes and high-impact co-ords across our categories.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex gap-3 sm:gap-4 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10"
                >
                  <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                    <Image
                      src={item.imagePrimary}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover object-top"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-heading text-xs font-bold uppercase tracking-tight text-black dark:text-white line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => onRemove(item.id, item.selectedSize)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-xs font-bold"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[10px] sm:text-[11px] text-gray-500 font-medium">
                        <span className="rounded bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 font-bold text-black dark:text-white">
                          SIZE: {item.selectedSize}
                        </span>
                        <span>₹ {item.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-gray-300 dark:border-white/15 rounded-md overflow-hidden bg-white dark:bg-black/40">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, -1)}
                          className="flex h-8 w-8 items-center justify-center text-xs font-bold hover:bg-gray-100 dark:hover:bg-white/10 active:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-black dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, 1)}
                          className="flex h-8 w-8 items-center justify-center text-xs font-bold hover:bg-gray-100 dark:hover:bg-white/10 active:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-heading text-xs sm:text-sm font-black text-black dark:text-white">
                        ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sticky Footer / WhatsApp Concierge Checkout CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 space-y-3 sm:space-y-4 pb-6 sm:pb-6">
              <div className="space-y-1.5 text-xs font-medium">
                <div className="flex justify-between text-gray-500">
                  <span>SUBTOTAL</span>
                  <span>₹ {subtotal.toLocaleString('en-IN')}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>ARCHIVE DISCOUNT</span>
                    <span>- ₹ {savings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between font-heading text-sm font-black text-black dark:text-white pt-2 border-t border-gray-200 dark:border-white/10">
                  <span>TOTAL ESTIMATE</span>
                  <span>₹ {subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Instagram Direct Checkout Button */}
              {copiedToast && (
                <div className="p-2.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-[11px] font-bold text-pink-600 dark:text-pink-400 text-center animate-pulse">
                  📋 Order details copied! Opening Instagram DM (@{BRAND_CONFIG.socials.instagram})...
                </div>
              )}
              <button
                onClick={handleInstagramOrder}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:opacity-95 active:scale-95 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-all flex items-center justify-center gap-2 sm:gap-2.5 min-h-[52px]"
              >
                <span className="text-base">📸</span>
                <span>BUY VIA INSTAGRAM DM →</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>DIRECT INSTAGRAM MSG (@{BRAND_CONFIG.socials.instagram})</span>
                <span>•</span>
                <span>INSTANT PAY & DISPATCH</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Instagram Order Sheet Modal */}
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
              <div className="font-bold text-gray-500 uppercase text-[10px]">TOTAL ITEMS: {items.length}</div>
              <div className="flex justify-between font-bold text-black dark:text-white pt-1">
                <span>ESTIMATED TOTAL:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">₹ {subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">
                  Order Summary Message:
                </label>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  ✓ Copied to clipboard
                </span>
              </div>
              <textarea
                readOnly
                value={igMessageText}
                rows={6}
                className="w-full rounded-lg bg-gray-100 dark:bg-black/60 border border-gray-200 dark:border-white/10 p-3 text-xs font-mono text-black dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-2 pt-1">
              <a
                href={`https://ig.me/m/${BRAND_CONFIG.socials.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-md flex items-center justify-center gap-2 text-center"
              >
                <span>OPEN INSTAGRAM DM APP →</span>
              </a>

              <a
                href={`https://instagram.com/${BRAND_CONFIG.socials.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-xl bg-gray-100 dark:bg-white/10 text-black dark:text-white py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-center"
              >
                <span>Open @{BRAND_CONFIG.socials.instagram} Web Profile</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
