'use client';

import React, { useState, useMemo } from 'react';
import { CategoryTab, Product } from '@/types/catalog';
import { CATALOG_PRODUCTS, BRAND_CONFIG } from '@/data/products';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import CategoryShowcase from '@/components/CategoryShowcase';
import ClearanceGrid from '@/components/ClearanceGrid';
import LookbookStudio from '@/components/LookbookStudio';
import UGCReviewReel from '@/components/UGCReviewReel';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import QuickViewModal from '@/components/QuickViewModal';
import SearchDrawer from '@/components/SearchDrawer';
import BottomTabBar from '@/components/BottomTabBar';

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<CategoryTab>('women');
  const [cart, setCart] = useState<CartItem[]>([
    {
      ...CATALOG_PRODUCTS[0],
      quantity: 1,
      selectedSize: 'M',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleAddToCart = (product: Product, size = 'M') => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === product.id && item.selectedSize === size);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, selectedSize: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id && item.selectedSize === selectedSize) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string, selectedSize: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.selectedSize === selectedSize)));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const displayedProducts = useMemo(() => {
    if (activeTab === 'clearance') return CATALOG_PRODUCTS.filter((p) => p.category === 'clearance');
    return CATALOG_PRODUCTS.filter((p) => p.category === activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#18181b] text-black dark:text-white font-body selection:bg-black selection:text-white pb-20 lg:pb-0">
      <AnnouncementBar />

      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'clearance' ? (
        <ClearanceGrid
          products={displayedProducts}
          onAddToCart={handleAddToCart}
          onQuickView={(p) => setQuickViewProduct(p)}
        />
      ) : (
        <>
          <HeroBanner activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Catalog Grid */}
          <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-gray-500">
                {activeTab === 'men' ? 'NEW IN' : 'BEST SELLERS'}
              </span>
              <h2
                style={{ color: BRAND_CONFIG.colors.primaryAccent }}
                className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight dark:text-white mt-1"
              >
                {activeTab === 'men' ? 'MEN ARCHIVES' : 'WOMEN ARCHIVES'}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {displayedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={handleAddToCart}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={() => setActiveTab('clearance')}
                style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
                className="rounded-xl hover:opacity-90 text-white px-10 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-widest shadow-md transition-transform hover:scale-105"
              >
                Explore Complete Catalog
              </button>
            </div>
          </section>

          {/* Interactive Lookbook Studio (`Shop The Look` Pins) */}
          <LookbookStudio onQuickView={(p) => setQuickViewProduct(p)} />

          {/* Category Vertical Slice Showcase */}
          <CategoryShowcase activeTab={activeTab} />

          {/* Customer UGC & Verified Review Reel */}
          <UGCReviewReel />
        </>
      )}

      <Footer />

      <BottomTabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveItem}
        onClear={handleClearCart}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onQuickView={(p) => setQuickViewProduct(p)}
      />
    </div>
  );
}
