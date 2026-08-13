'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Settings, Train, Info, Search, Command, FileText, Bell, User, Shield, Utensils, LayoutGrid, Landmark, ArrowLeftRight, Menu, X, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { GlobalSearch } from '@/components/search/GlobalSearch';

const PRIMARY_NAV = [
  { href: '/', icon: Home, label: 'Home', description: 'Dashboard & Live Tracking' },
  { href: '/search', icon: ArrowLeftRight, label: 'Train Search', description: 'Search between stations' },
  { href: '/pnr', icon: FileText, label: 'PNR Status', description: 'Check passenger booking' },
  { href: '/alerts', icon: Bell, label: 'Alert Center', description: 'Manage journey alarms' },
  { href: '/favorites', icon: Heart, label: 'Saved Trains', description: 'Quick access favorites' },
];

const UTILITY_NAV = [
  { href: '/coach', icon: LayoutGrid, label: 'Coach Position', description: '2D seat & berth layout' },
  { href: '/fare', icon: Landmark, label: 'Fare Calculator', description: 'Ticket price estimator' },
  { href: '/food', icon: Utensils, label: 'Food on Train', description: 'Station specialities & IRCTC' },
  { href: '/emergency', icon: Shield, label: 'Emergency Help', description: 'Railway 139 & helplines' },
];

const BOTTOM_NAV = [
  { href: '/profile', icon: User, label: 'Profile', description: 'Hardeep Malan' },
  { href: '/settings', icon: Settings, label: 'Settings', description: 'App preferences' },
];

export function HeaderAndSidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close sidebar automatically on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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

  const NavLink = ({ href, icon: Icon, label, description }: { href: string; icon: React.ElementType; label: string; description: string }) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setSidebarOpen(false)}
        className={clsx(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
          isActive
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-semibold'
            : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
        )}
      >
        <div className={clsx(
          'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700'
        )}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm leading-tight font-medium">{label}</div>
          <div className={clsx('text-[10px] leading-tight truncate', isActive ? 'text-blue-100' : 'text-slate-400')}>
            {description}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <>
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Top Floating App Navbar with 3 Bars Hamburger Menu Button */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Toggle (3 Bars) */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-all flex items-center gap-2 group"
            title="Toggle Navigation Menu (3 Bars)"
          >
            <Menu size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold hidden sm:inline">Menu</span>
          </button>

          {/* RailGaadi Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Train size={18} />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                RailGaadi
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                v2.0
              </span>
            </div>
          </Link>
        </div>

        {/* Header Search Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200 text-slate-600 hover:text-blue-700 text-xs font-semibold transition-all"
          >
            <Search size={14} className="text-blue-600" />
            <span className="hidden md:inline">Search trains...</span>
            <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">⌘K</span>
          </button>
        </div>
      </header>

      {/* Slide-out Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
        />
      )}

      {/* Slide-out Collapsible Drawer Navigation */}
      <aside
        className={clsx(
          'fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Train size={18} />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm">RailGaadi Navigation</div>
              <div className="text-[10px] text-slate-500 font-medium">Select a feature module</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Search inside Drawer */}
        <div className="px-4 pt-3 pb-1">
          <button
            onClick={() => { setSidebarOpen(false); setSearchOpen(true); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 text-slate-600 text-xs font-semibold transition-all"
          >
            <Search size={14} className="text-blue-600" />
            <span className="flex-1 text-left">Search train name / number...</span>
          </button>
        </div>

        {/* Primary Navigation List */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 pt-2 pb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main Services</p>
          </div>
          {PRIMARY_NAV.map((item) => <NavLink key={item.href} {...item} />)}

          <div className="px-3 pt-3 pb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Journey Tools</p>
          </div>
          {UTILITY_NAV.map((item) => <NavLink key={item.href} {...item} />)}
        </nav>

        {/* Footer info inside Drawer */}
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 space-y-1">
          {BOTTOM_NAV.map((item) => <NavLink key={item.href} {...item} />)}
          <div className="pt-2 text-[10px] text-slate-400 text-center">
            RailGaadi Live Companion v2.0
          </div>
        </div>
      </aside>
    </>
  );
}

export { HeaderAndSidebar as Sidebar };
