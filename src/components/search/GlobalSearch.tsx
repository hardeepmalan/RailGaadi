'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, Train as TrainIcon, Clock, TrendingUp, Command } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { searchTrains } from '@/services/api';
import { useRecentSearches } from '@/hooks/useLocalStorage';
import { TRENDING_TRAINS } from '@/data/trains';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const { recents } = useRecentSearches();

  const debouncedQuery = useDebounce(query, 200);

  const { data, isLoading } = useQuery({
    queryKey: ['global-search', debouncedQuery],
    queryFn: () => searchTrains(debouncedQuery),
    enabled: debouncedQuery.length >= 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSelect = useCallback((trainNumber: string) => {
    onClose();
    setQuery('');
    router.push(`/track/${trainNumber}`);
  }, [router, onClose]);

  if (!isOpen) return null;

  const trains = data?.trains || [];
  const showResults = debouncedQuery.length >= 1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[8vh] sm:pt-[12vh] px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div className="relative w-full max-w-2xl animate-scale-in">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100">
            <div className="flex-shrink-0 text-blue-600">
              {isLoading ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <Search size={22} />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) handleSelect(query.trim());
                if (e.key === 'Escape') onClose();
              }}
              placeholder="Search by train name or 5-digit number (e.g. 12301, Rajdhani)…"
              className="flex-1 text-base text-slate-900 placeholder:text-slate-400 font-medium outline-none bg-transparent"
              autoComplete="off"
            />
            <div className="flex items-center gap-2">
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="flex items-center gap-1 text-xs text-slate-400 bg-slate-100 px-2.5 py-1.5 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                <span>Esc</span>
              </button>
            </div>
          </div>

          {/* Results area */}
          <div className="max-h-[60vh] overflow-y-auto">
            {showResults ? (
              <div className="p-2">
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-blue-500" />
                  </div>
                )}

                {!isLoading && trains.length === 0 && (
                  <div className="text-center py-10 text-slate-400">
                    <Search size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">No trains found for "{debouncedQuery}"</p>
                    <p className="text-xs mt-1">Try a 5-digit train number or train name</p>
                  </div>
                )}

                {trains.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Search Results
                    </div>
                    {trains.map((train: any) => (
                      <button
                        key={train.number}
                        onClick={() => handleSelect(train.number)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-50 transition-colors text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                          <TrainIcon size={18} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-slate-900 truncate">{train.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            #{train.number}
                            {train.from && train.to && ` · ${train.from} → ${train.to}`}
                          </div>
                        </div>
                        <div className="text-[11px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0">
                          Track →
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            ) : (
              <div className="p-2">
                {/* Recent searches */}
                {recents.length > 0 && (
                  <div>
                    <div className="px-3 py-2 flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <Clock size={11} /> Recent Searches
                    </div>
                    {recents.slice(0, 4).map((r) => (
                      <button
                        key={r.trainNumber}
                        onClick={() => handleSelect(r.trainNumber)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <Clock size={14} className="text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-slate-800 truncate">{r.trainName}</div>
                          <div className="text-xs text-slate-400">#{r.trainNumber} · {r.from} → {r.to}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Trending trains */}
                <div>
                  <div className="px-3 py-2 flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    <TrendingUp size={11} /> Popular Trains
                  </div>
                  {TRENDING_TRAINS.slice(0, 6).map((train) => (
                    <button
                      key={train.number}
                      onClick={() => handleSelect(train.number)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        <TrainIcon size={14} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-slate-800 truncate">{train.name}</div>
                        <div className="text-xs text-slate-400">#{train.number} · {train.from} → {train.to}</div>
                      </div>
                      <div className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                        #{train.number}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <kbd className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold">↑↓</kbd> navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold">↵</kbd> select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold">Esc</kbd> close
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Command size={11} />
              <span>+K to open</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
