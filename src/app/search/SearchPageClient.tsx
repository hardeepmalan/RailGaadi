'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftRight, Search, Calendar, Train, Clock, ArrowRight, MapPin, ChevronRight, SlidersHorizontal, X, ChevronDown, Sparkles, Filter, ShieldCheck, Zap } from 'lucide-react';
import { StationSearchInput } from '@/components/search/StationSearchInput';
import { RailwayStation, TrainBetweenResult } from '@/types';
import { TRAIN_TYPE_LABELS, TRAIN_TYPE_COLORS } from '@/data/trains';
import { formatDuration } from '@/lib/railway/trainBetweenStations';
import { clsx } from 'clsx';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DEPARTURE_WINDOWS = [
  { id: 'morning', label: 'Morning', range: '6AM–12PM', hours: [6, 12], icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', range: '12PM–6PM', hours: [12, 18], icon: '☀️' },
  { id: 'evening', label: 'Evening', range: '6PM–12AM', hours: [18, 24], icon: '🌆' },
  { id: 'night', label: 'Night', range: '12AM–6AM', hours: [0, 6], icon: '🌙' },
];

const TRAIN_TYPES = [
  { id: 'vande_bharat', label: 'Vande Bharat ⚡', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'rajdhani', label: 'Rajdhani 👑', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { id: 'shatabdi', label: 'Shatabdi 🚀', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  { id: 'superfast', label: 'Superfast ⚡', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'mail', label: 'Mail/Express 🚆', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'duronto', label: 'Duronto 🚄', color: 'bg-orange-100 text-orange-800 border-orange-300' },
];

const SORT_OPTIONS = [
  { id: 'dep_asc', label: 'Earliest Departure' },
  { id: 'arr_asc', label: 'Earliest Arrival' },
  { id: 'dur_asc', label: 'Shortest Journey' },
  { id: 'dur_desc', label: 'Longest Journey' },
  { id: 'name_asc', label: 'Train Name' },
  { id: 'num_asc', label: 'Train Number' },
];

function parseTime(time: string): number {
  if (!time || time === '--') return 0;
  const [h, m] = time.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export default function SearchPageClient() {
  const router = useRouter();
  const [from, setFrom] = useState<RailwayStation | null>(null);
  const [to, setTo] = useState<RailwayStation | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [results, setResults] = useState<TrainBetweenResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  // Filters
  const [selectedWindows, setSelectedWindows] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [acOnly, setAcOnly] = useState(false);
  const [sortBy, setSortBy] = useState('dep_asc');

  const toggleWindow = (id: string) =>
    setSelectedWindows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleType = (id: string) =>
    setSelectedTypes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const swap = () => {
    const tmp = from;
    setFrom(to);
    setTo(tmp);
    setResults(null);
    setSearched(false);
  };

  const handleSearch = async () => {
    if (!from || !to) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    setVisibleCount(10);
    try {
      const res = await fetch(`/api/trains/between?from=${from.code}&to=${to.code}&date=${date}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch trains');
      setResults(data.results || []);
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    if (!results) return null;
    let filtered = [...results];

    if (selectedWindows.length > 0) {
      filtered = filtered.filter(r => {
        const depMin = parseTime(r.fromStop.departure || '--');
        const depHour = Math.floor(depMin / 60);
        return selectedWindows.some(wId => {
          const w = DEPARTURE_WINDOWS.find(x => x.id === wId);
          if (!w) return false;
          if (w.hours[0] === 0 && w.hours[1] === 6) return depHour < 6;
          return depHour >= w.hours[0] && depHour < w.hours[1];
        });
      });
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(r => selectedTypes.includes(r.train.type));
    }

    if (acOnly) {
      filtered = filtered.filter(r =>
        ['rajdhani', 'shatabdi', 'vande_bharat', 'duronto'].includes(r.train.type)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dep_asc': return parseTime(a.fromStop.departure || '00:00') - parseTime(b.fromStop.departure || '00:00');
        case 'arr_asc': return parseTime(a.toStop.arrival || '00:00') - parseTime(b.toStop.arrival || '00:00');
        case 'dur_asc': return a.durationMinutes - b.durationMinutes;
        case 'dur_desc': return b.durationMinutes - a.durationMinutes;
        case 'name_asc': return a.train.name.localeCompare(b.train.name);
        case 'num_asc': return a.train.number.localeCompare(b.train.number);
        default: return 0;
      }
    });

    return filtered;
  }, [results, selectedWindows, selectedTypes, acOnly, sortBy]);

  const activeFilterCount = selectedWindows.length + selectedTypes.length + (acOnly ? 1 : 0);
  const displayedResults = filteredResults ? filteredResults.slice(0, visibleCount) : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Signature Vibrant Brand Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-800 text-white px-5 pt-8 pb-10 text-center shadow-md">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white border border-white/30 text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-xs">
            <Sparkles size={13} className="text-amber-300" /> Train Between Stations
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">Search Trains Across India</h1>
          <p className="text-blue-100 text-xs sm:text-sm">Find direct schedules, timings, and durations for any station pair</p>
        </div>
      </div>

      {/* Centered Search Card Container */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-5 space-y-4">
          <div className="space-y-3">
            {/* From Station */}
            <StationSearchInput
              id="from-station"
              label="Departure Station (From)"
              placeholder="Type origin station (e.g. New Delhi, Mumbai, Lucknow)..."
              value={from}
              onSelect={setFrom}
              onClear={() => { setFrom(null); setResults(null); }}
            />

            {/* Swap Button */}
            <div className="flex justify-center -my-1">
              <button
                onClick={swap}
                id="swap-stations-btn"
                className="p-2.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/80 shadow-xs hover:scale-110 transition-all duration-300"
                aria-label="Swap origin and destination stations"
              >
                <ArrowLeftRight size={18} />
              </button>
            </div>

            {/* To Station */}
            <StationSearchInput
              id="to-station"
              label="Destination Station (To)"
              placeholder="Type destination station (e.g. Aligarh, Kanpur, Howrah)..."
              value={to}
              onSelect={setTo}
              onClear={() => { setTo(null); setResults(null); }}
            />
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50">
            <Calendar size={18} className="text-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Journey Date</div>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setDate(e.target.value)}
                className="text-sm font-semibold text-slate-800 bg-transparent outline-none w-full cursor-pointer"
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            id="search-trains-btn"
            onClick={handleSearch}
            disabled={!from || !to || loading}
            className={clsx(
              'w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md',
              from && to && !loading
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-blue-500/20 hover:scale-[1.01]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            )}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Searching live train schedules…
              </>
            ) : (
              <>
                <Search size={18} />
                Search Available Trains
              </>
            )}
          </button>
        </div>

        {/* Results Container */}
        <div>
          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-48" />
                  <div className="h-3 bg-slate-100 rounded w-64" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-8 bg-slate-100 rounded w-20" />
                    <div className="h-8 bg-slate-100 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Results Header with Filter Controls */}
          {!loading && filteredResults && searched && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs flex items-center justify-center font-bold">
                      {filteredResults.length}
                    </span>
                    Train{filteredResults.length !== 1 ? 's' : ''} Available
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {from?.code} → {to?.code} · {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                  <button
                    onClick={() => setShowFilters(v => !v)}
                    className={clsx(
                      'flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all',
                      showFilters ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    )}
                  >
                    <SlidersHorizontal size={14} />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-md animate-fade-in">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Departure Window</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {DEPARTURE_WINDOWS.map(w => (
                        <button
                          key={w.id}
                          onClick={() => toggleWindow(w.id)}
                          className={clsx(
                            'text-left px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2',
                            selectedWindows.includes(w.id)
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300'
                          )}
                        >
                          <span className="text-base">{w.icon}</span>
                          <div>
                            <div>{w.label}</div>
                            <div className={clsx('text-[10px] font-normal', selectedWindows.includes(w.id) ? 'text-blue-100' : 'text-slate-400')}>{w.range}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Train Category</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {TRAIN_TYPES.map(t => (
                        <button
                          key={t.id}
                          onClick={() => toggleType(t.id)}
                          className={clsx(
                            'px-3 py-1.5 rounded-xl border text-xs font-bold transition-all',
                            selectedTypes.includes(t.id)
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : `${t.color} hover:shadow-xs`
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs font-bold text-slate-700">AC Trains Only</span>
                    <button
                      onClick={() => setAcOnly(v => !v)}
                      className={clsx(
                        'relative w-11 h-6 rounded-full transition-colors',
                        acOnly ? 'bg-blue-600' : 'bg-slate-300'
                      )}
                    >
                      <div className={clsx('absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform', acOnly ? 'translate-x-6' : 'translate-x-1')} />
                    </button>
                  </div>
                </div>
              )}

              {/* Trains Result Cards */}
              <div className="space-y-3.5">
                {displayedResults.map((result) => (
                  <TrainResultCard
                    key={result.train.number}
                    result={result}
                    onTrack={() => router.push(`/track/${result.train.number}`)}
                  />
                ))}
              </div>

              {/* Load More Button if results > 10 */}
              {filteredResults.length > visibleCount && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setVisibleCount(v => v + 10)}
                    className="px-6 py-3 bg-white border border-slate-200 hover:border-blue-300 text-blue-700 font-bold text-xs rounded-2xl shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2"
                  >
                    Load More Trains ({filteredResults.length - visibleCount} remaining) <ChevronDown size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick Popular Suggestions when not searched */}
          {!searched && !loading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" /> Popular Rail Corridors
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { from: 'NDLS', fromName: 'New Delhi', to: 'LKO', toName: 'Lucknow' },
                  { from: 'NDLS', fromName: 'New Delhi', to: 'BSB', toName: 'Varanasi' },
                  { from: 'NDLS', fromName: 'New Delhi', to: 'ALJN', toName: 'Aligarh' },
                  { from: 'MMCT', fromName: 'Mumbai', to: 'NDLS', toName: 'New Delhi' },
                  { from: 'SBC', fromName: 'Bengaluru', to: 'NDLS', toName: 'New Delhi' },
                  { from: 'HWH', fromName: 'Howrah', to: 'NDLS', toName: 'New Delhi' },
                ].map((route) => (
                  <button
                    key={`${route.from}-${route.to}`}
                    onClick={async () => {
                      const { getStationByCode } = await import('@/data/indianStations');
                      const f = getStationByCode(route.from);
                      const t = getStationByCode(route.to);
                      if (f && t) { setFrom(f); setTo(t); }
                    }}
                    className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl p-3 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-blue-700">{route.fromName}</div>
                    <div className="text-[10px] text-slate-400 my-0.5 font-bold">↓</div>
                    <div className="text-xs font-bold text-slate-800">{route.toName}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TrainResultCard({ result, onTrack }: { result: TrainBetweenResult; onTrack: () => void }) {
  const { train, fromStop, toStop, durationMinutes, stops } = result;
  const [expanded, setExpanded] = useState(false);

  const getTrainBadge = (type: string) => {
    switch (type) {
      case 'vande_bharat': return { label: 'Vande Bharat ⚡', color: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'rajdhani': return { label: 'Rajdhani 👑', color: 'bg-rose-100 text-rose-800 border-rose-300' };
      case 'shatabdi': return { label: 'Shatabdi 🚀', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' };
      case 'superfast': return { label: 'Superfast ⚡', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      default: return { label: 'Mail/Express 🚆', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
  };

  const badge = getTrainBadge(train.type);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-md transition-all">
      {/* Train Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-extrabold text-slate-900 text-sm sm:text-base">{train.name}</span>
          <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
            #{train.number}
          </span>
          <span className={clsx('text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg border', badge.color)}>
            {badge.label}
          </span>
        </div>
        <button
          onClick={onTrack}
          className="flex-shrink-0 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 shadow-2xs"
        >
          Track <ChevronRight size={14} />
        </button>
      </div>

      {/* Journey Timings & Route Line */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="text-center min-w-[68px]">
            <div className="text-xl font-black text-slate-900 leading-tight">
              {fromStop.departure === '--' ? '06:00' : fromStop.departure}
            </div>
            <div className="text-[11px] font-bold text-slate-500 truncate max-w-[72px]">{fromStop.stationCode}</div>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Clock size={12} className="text-blue-600" /> {formatDuration(durationMinutes)}
            </div>
            <div className="w-full flex items-center gap-1">
              <div className="flex-1 h-0.5 bg-slate-200" />
              <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Train size={12} />
              </div>
              <div className="flex-1 h-0.5 bg-slate-200" />
            </div>
            <div className="text-[10px] text-slate-400 font-semibold">{stops} intermediate stop{stops !== 1 ? 's' : ''}</div>
          </div>

          <div className="text-center min-w-[68px]">
            <div className="text-xl font-black text-slate-900 leading-tight">
              {toStop.arrival === '--' ? '08:15' : toStop.arrival}
            </div>
            <div className="text-[11px] font-bold text-slate-500 truncate max-w-[72px]">{toStop.stationCode}</div>
          </div>
        </div>

        {/* Operating Days & Toggle */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
          <button
            onClick={() => setExpanded(v => !v)}
            className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 text-xs"
          >
            Details <ChevronDown size={12} className={clsx('transition-transform', expanded && 'rotate-180')} />
          </button>

          <div className="flex gap-1">
            {DAYS.map((day) => (
              <span
                key={day}
                className={clsx(
                  'text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full',
                  train.daysOfOperation.includes(day)
                    ? 'bg-emerald-100 text-emerald-800 font-extrabold'
                    : 'bg-slate-100 text-slate-300'
                )}
              >
                {day[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Expanded Info */}
        {expanded && (
          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs animate-fade-in">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Boarding Station</div>
                <div className="font-bold text-slate-800">{fromStop.stationName}</div>
                <div className="text-slate-500">Departure: {fromStop.departure}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Destination Station</div>
                <div className="font-bold text-slate-800">{toStop.stationName}</div>
                <div className="text-slate-500">Arrival: {toStop.arrival}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`/coach?train=${train.number}`}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl text-center transition-colors"
              >
                Coach Layout
              </a>
              <button
                onClick={onTrack}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Live Tracking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
