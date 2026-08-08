'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Settings, Home, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { GlobalSearch } from '@/components/search/GlobalSearch';

export function BottomNav() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  const NAV_ITEMS = [
    { href: '/', icon: Home, label: 'Home' },
    { action: () => setSearchOpen(true), icon: Search, label: 'Search' },
    { href: '/favorites', icon: Heart, label: 'Saved' },
    { href: '/settings', icon: Settings, label: 'More' },
  ];

  return (
    <>
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border lg:hidden"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
          {NAV_ITEMS.map(({ href, icon: Icon, label, action }) => {
            const isActive = href
              ? pathname === href || (href !== '/' && pathname.startsWith(href))
              : false;

            if (action) {
              return (
                <button
                  key={label}
                  onClick={action}
                  className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-150 min-w-[60px] text-text-secondary hover:text-blue-600"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                    <Icon size={18} strokeWidth={2.5} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold text-blue-600">{label}</span>
                </button>
              );
            }

            return (
              <Link
                key={href}
                href={href!}
                className={clsx(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-150 min-w-[60px]',
                  isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={clsx('transition-transform duration-150', isActive && 'scale-110')}
                />
                <span className={clsx('text-xs font-medium', isActive ? 'font-semibold' : '')}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
