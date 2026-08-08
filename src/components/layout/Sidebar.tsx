'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Settings, Train, Info, Search, Command } from 'lucide-react';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { GlobalSearch } from '@/components/search/GlobalSearch';

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home', description: 'Search trains' },
  { href: '/favorites', icon: Heart, label: 'Favorites', description: 'Saved trains' },
  { href: '/settings', icon: Settings, label: 'Settings', description: 'Preferences' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <aside
        className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col border-r border-border bg-background z-40"
        aria-label="Desktop sidebar navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary shadow-primary">
            <Train size={18} className="text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-text-primary tracking-tight">RailGaadi</span>
            <p className="text-xs text-text-muted font-medium">Live Train Tracking</p>
          </div>
        </div>

        {/* Quick Search Button */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 text-slate-500 text-sm font-medium transition-all group"
            aria-label="Open search (Ctrl+K)"
          >
            <Search size={15} className="group-hover:text-blue-600 transition-colors" />
            <span className="flex-1 text-left text-sm">Search trains…</span>
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              <Command size={9} />K
            </span>
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-2 space-y-1" aria-label="Main navigation">
          {NAV_ITEMS.map(({ href, icon: Icon, label, description }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className={clsx('nav-item', isActive && 'active')}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <div>
                  <div className="text-sm leading-tight">{label}</div>
                  <div className="text-xs text-text-muted leading-tight hidden xl:block">{description}</div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Info size={12} />
            <span>Data via RailRadar · v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
