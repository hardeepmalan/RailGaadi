'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Settings, Home, Search, Train, Bell, User } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';
import { GlobalSearch } from '@/components/search/GlobalSearch';

export function BottomNav() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  // Don't render on individual train tracking pages
  if (pathname.startsWith('/track/')) return null;

  const NAV_ITEMS: Array<{
    href?: string;
    action?: () => void;
    icon: React.ElementType;
    label: string;
    badge?: boolean;
  }> = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/pnr', icon: Train, label: 'PNR' },
    { href: '/alerts', icon: Bell, label: 'Alerts', badge: false },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Spacer so page content isn't hidden behind nav */}
      <div className="h-20 lg:hidden" aria-hidden="true" />

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden shadow-lg"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around px-2 pb-safe max-w-lg mx-auto">
          {NAV_ITEMS.map(({ href, icon: Icon, label, action, badge }) => {
            const isActive = href
              ? pathname === href || (href !== '/' && pathname.startsWith(href))
              : false;

            const content = (
              <>
                <div className="relative">
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={clsx(
                      'transition-all duration-200',
                      isActive ? 'scale-110' : 'scale-100'
                    )}
                  />
                  {badge && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" aria-hidden="true" />
                  )}
                </div>
                <span className="text-[10px] font-semibold leading-tight">{label}</span>
              </>
            );

            if (action) {
              return (
                <button
                  key={label}
                  onClick={action}
                  aria-label={label}
                  className={clsx(
                    'flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl min-w-[56px] transition-all duration-200',
                    'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                  )}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={href}
                href={href!}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className={clsx(
                  'flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl min-w-[56px] transition-all duration-200',
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                )}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
