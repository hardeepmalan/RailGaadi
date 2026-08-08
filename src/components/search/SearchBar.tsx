'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, Command, ArrowUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { searchTrains } from '@/services/api';
import { SearchResults } from './SearchResults';
import { clsx } from 'clsx';

interface SearchBarProps {
  onSelect?: (trainNumber: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
  size?: 'default' | 'large';
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function SearchBar({
  onSelect,
  autoFocus,
  placeholder = 'Search train by name or 5-digit number…',
  size = 'default',
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 250);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchTrains(debouncedQuery),
    enabled: debouncedQuery.length >= 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (trainNumber: string) => {
      setOpen(false);
      setQuery('');
      if (onSelect) {
        onSelect(trainNumber);
      } else {
        router.push(`/track/${trainNumber}`);
      }
    },
    [onSelect, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Enter' && query.trim()) {
      handleSelect(query.trim());
    }
  };

  const showResults = open && query.length >= 1;
  const isSearching = isLoading || isFetching;

  return (
    <div ref={containerRef} className="relative w-full" role="search">
      <div
        className={clsx(
          'relative flex items-center transition-all duration-200',
          size === 'large'
            ? 'shadow-xl rounded-2xl bg-white border-2 border-slate-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100'
            : 'shadow-card rounded-xl bg-white border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'
        )}
      >
        {/* Left icon */}
        <div className="absolute left-4 text-blue-600 pointer-events-none flex items-center gap-2">
          {isSearching ? (
            <Loader2 size={size === 'large' ? 22 : 18} className="animate-spin text-blue-500" />
          ) : (
            <Search size={size === 'large' ? 22 : 18} />
          )}
        </div>

        <input
          ref={inputRef}
          id="train-search-input"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          aria-label="Search for an Indian Railways train"
          className={clsx(
            'w-full bg-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400',
            size === 'large' ? 'py-4 text-base pl-14 pr-16' : 'py-3 text-sm pl-12 pr-12'
          )}
        />

        {/* Right: Keyboard hint or clear */}
        <div className="absolute right-3 flex items-center gap-1.5">
          {!query && !isSearching && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-lg">
              <Command size={10} />
              <span>K</span>
            </div>
          )}
          {query && !isSearching && (
            <button
              onClick={() => {
                setQuery('');
                setOpen(false);
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          {query && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-lg">
              <ArrowUp size={9} />
              <span>Enter</span>
            </div>
          )}
        </div>
      </div>

      {showResults && (
        <SearchResults
          results={data?.trains || []}
          query={debouncedQuery}
          isLoading={isSearching}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}
