'use client';

import React from 'react';
import { 
  Home, 
  Flame, 
  Tag, 
  Search, 
  ShoppingBag, 
  Sparkles 
} from 'lucide-react';
import { CategoryTab } from '../types/catalog';
import { BRAND_CONFIG } from '../data/products';

interface BottomTabBarProps {
  activeTab: CategoryTab;
  setActiveTab: (tab: CategoryTab) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export default function BottomTabBar({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onOpenSearch,
}: BottomTabBarProps) {
  const tabs = [
    {
      id: 'women' as CategoryTab,
      label: 'Women',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'men' as CategoryTab,
      label: 'Men',
      icon: <Flame className="w-4 h-4" />,
    },
    {
      id: 'clearance' as CategoryTab,
      label: 'Archives',
      icon: <Tag className="w-4 h-4 text-emerald-500" />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-2xl border-t border-gray-200/80 dark:border-white/10 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] pb-safe font-body">
      <div className="grid grid-cols-5 h-16 items-center justify-around px-1">
        
        {/* Category Tabs: Women, Men, Archives */}
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 h-full transition-all relative ${
                isActive 
                  ? 'text-black dark:text-white scale-105 font-black' 
                  : 'text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <div 
                style={isActive ? { backgroundColor: BRAND_CONFIG.colors.primaryAccent } : undefined}
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'text-white shadow-md' : 'bg-transparent text-gray-500 dark:text-gray-400'
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold">
                {tab.label}
              </span>
              {isActive && (
                <span 
                  style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
                  className="absolute top-0 w-8 h-0.5 rounded-full" 
                />
              )}
            </button>
          );
        })}

        {/* Search Trigger Tab */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center gap-1 h-full text-gray-400 hover:text-black dark:hover:text-white transition-all"
        >
          <div className="p-1.5 rounded-xl bg-transparent text-gray-500 dark:text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <span className="text-[9px] uppercase tracking-wider font-bold">
            Search
          </span>
        </button>

        {/* Shopping Bag Trigger Tab with counter */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center gap-1 h-full text-gray-400 hover:text-black dark:hover:text-white transition-all relative"
        >
          <div className="relative p-1.5 rounded-xl bg-transparent text-gray-500 dark:text-gray-400">
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span 
                style={{ backgroundColor: BRAND_CONFIG.colors.primaryAccent }}
                className="absolute -top-1 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full text-[8px] font-black text-white shadow animate-pulse"
              >
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-wider font-bold">
            Bag
          </span>
        </button>

      </div>
    </div>
  );
}
