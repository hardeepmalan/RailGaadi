'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Search, X, Clock } from 'lucide-react';
import { searchStations } from '@/data/indianStations';
import { RailwayStation } from '@/types';
import { clsx } from 'clsx';

const RECENT_STATIONS_KEY = 'railgaadi_recent_stations';

function getRecentStations(): RailwayStation[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_STATIONS_KEY) || '[]');
  } catch { return []; }
}

function saveRecentStation(station: RailwayStation) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getRecentStations().filter((s) => s.code !== station.code);
    const updated = [station, ...existing].slice(0, 5);
    localStorage.setItem(RECENT_STATIONS_KEY, JSON.stringify(updated));
  } catch { /* noop */ }
}

interface StationSearchInputProps {
  placeholder?: string;
  value?: RailwayStation | null;
  onSelect: (station: RailwayStation) => void;
  onClear?: () => void;
  id?: string;
  autoFocus?: boolean;
  label?: string;
}

export function StationSearchInput({
  placeholder = 'Search station…',
  value,
  onSelect,
  onClear,
  id,
  autoFocus,
  label,
}: StationSearchInputProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<RailwayStation[]>([]);
  const [recents, setRecents] = useState<RailwayStation[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecents(getRecentStations());
  }, []);

  useEffect(() => {
    if (query.length >= 1) {
      const hits = searchStations(query, 8);
      setResults(hits);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback((station: RailwayStation) => {
    onSelect(station);
    saveRecentStation(station);
    setRecents(getRecentStations());
    setQuery('');
    setOpen(false);
  }, [onSelect]);

  const handleClear = () => {
    setQuery('');
    setOpen(false);
    onClear?.();
    inputRef.current?.focus();
  };

  const showDropdown = open && (results.length > 0 || (query.length === 0 && recents.length > 0));
  const displayValue = value ? `${value.name} (${value.code})` : '';

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div
        className={clsx(
          'flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-white transition-all duration-200',
          open
            ? 'border-blue-500 ring-2 ring-blue-100 shadow-md'
            : 'border-slate-200 hover:border-slate-300 shadow-sm'
        )}
      >
        <MapPin size={16} className="text-blue-500 flex-shrink-0" />
        {value && !open ? (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">{value.name}</div>
            <div className="text-xs text-slate-500">{value.code} · {value.city}, {value.state}</div>
          </div>
        ) : (
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
            placeholder={value ? `${value.name} (${value.code})` : placeholder}
            autoFocus={autoFocus}
            autoComplete="off"
            className="flex-1 min-w-0 bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400 font-medium"
            aria-label={placeholder}
            aria-autocomplete="list"
          />
        )}
        {(value || query) && (
          <button
            onClick={handleClear}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
            aria-label="Clear"
          >
            <X size={14} />
          </button>
        )}
        {!value && !query && (
          <Search size={14} className="text-slate-300 flex-shrink-0" />
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
          {query.length === 0 && recents.length > 0 && (
            <div>
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100">
                <Clock size={10} /> Recent
              </div>
              {recents.map((station) => (
                <StationRow key={station.code} station={station} onSelect={handleSelect} />
              ))}
            </div>
          )}
          {results.length > 0 && (
            <div>
              {query.length > 0 && recents.length > 0 && (
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Results
                </div>
              )}
              {results.map((station) => (
                <StationRow key={station.code} station={station} onSelect={handleSelect} />
              ))}
            </div>
          )}
          {query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-5 text-center">
              <div className="text-slate-400 text-sm font-medium">No station found</div>
              <div className="text-slate-400 text-xs mt-1">
                Try a different name, code, or city
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StationRow({ station, onSelect }: { station: RailwayStation; onSelect: (s: RailwayStation) => void }) {
  return (
    <button
      onClick={() => onSelect(station)}
      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left border-b border-slate-50 last:border-0"
    >
      <div className={clsx(
        'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold',
        station.isMajor
          ? 'bg-blue-100 text-blue-700'
          : 'bg-slate-100 text-slate-600'
      )}>
        {station.code.slice(0, 3)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-900 truncate">{station.name}</div>
        <div className="text-xs text-slate-500 truncate">{station.city}, {station.state}</div>
      </div>
      {station.isMajor && (
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100 flex-shrink-0">
          Major
        </span>
      )}
    </button>
  );
}
