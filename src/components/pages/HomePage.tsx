'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Train, Clock, TrendingUp, ArrowRight, X, Heart, ShieldCheck, FileText, Shield, Landmark, LayoutGrid, Utensils, ArrowLeftRight, Search } from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { StationSearchInput } from '@/components/search/StationSearchInput';
import { useFavorites, useRecentSearches } from '@/hooks/useLocalStorage';
import { TRENDING_TRAINS, TRAIN_TYPE_LABELS, TRAIN_TYPE_COLORS } from '@/data/trains';
import { RailwayStation } from '@/types';
import { clsx } from 'clsx';
import { format } from 'date-fns';

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { text: 'Good Morning', emoji: '🌅' };
  if (h >= 12 && h < 17) return { text: 'Good Afternoon', emoji: '☀️' };
  if (h >= 17 && h < 21) return { text: 'Good Evening', emoji: '🌇' };
  return { text: 'Good Night', emoji: '🌙' };
}

const QUICK_ACTIONS = [
  { id: 'pnr', label: 'PNR Status', icon: FileText, color: 'text-blue-600 bg-blue-50', href: '/pnr' },
  { id: 'emergency', label: 'Emergency', icon: Shield, color: 'text-red-600 bg-red-50', href: '/emergency' },
  { id: 'fare', label: 'Fare Calc', icon: Landmark, color: 'text-emerald-600 bg-emerald-50', href: '/fare' },
  { id: 'coach', label: 'Coach Pos', icon: LayoutGrid, color: 'text-purple-600 bg-purple-50', href: '/coach' },
  { id: 'food', label: 'Food Order', icon: Utensils, color: 'text-amber-600 bg-amber-50', href: '/food' },
  { id: 'search', label: 'Trains', icon: Search, color: 'text-indigo-600 bg-indigo-50', href: '/search' },
];

export function HomePage() {
  const router = useRouter();
  const { favorites, removeFavorite } = useFavorites();
  const { recents, clearRecents } = useRecentSearches();
  const [fromStation, setFromStation] = useState<RailwayStation | null>(null);
  const [toStation, setToStation] = useState<RailwayStation | null>(null);
  const greeting = getGreeting();

  const handleTrainSelect = (trainNumber: string) => {
    router.push(`/track/${trainNumber}`);
  };

  const handleStationSearch = () => {
    if (fromStation && toStation) {
      router.push(`/search?from=${fromStation.code}&to=${toStation.code}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50 px-5 pt-10 pb-10 lg:px-8 border-b border-border">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Greeting + Badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold shadow-sm">
              <span className="live-dot" aria-hidden="true" />
              <span className="uppercase tracking-wider">Live Indian Railways Telemetry</span>
            </div>
            <div className="text-sm text-slate-500 font-medium hidden sm:block">
              {greeting.emoji} {greeting.text}
            </div>
          </div>

          <h1 className="text-display text-slate-900 leading-tight">
            Track any train in India,
            <br />
            <span className="text-blue-600">in real-time.</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Live train position, station delay timelines, terrain altitude profiles, OpenWeather updates, and route maps — all powered by real-time APIs.
          </p>

          {/* Large Search Bar */}
          <div className="relative pt-2">
            <SearchBar
              size="large"
              onSelect={handleTrainSelect}
              placeholder="Search by train name or 5-digit train number (e.g. 12301, 12627, 22439)…"
              autoFocus={false}
            />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-400">Popular:</span>
            {['12301', '12951', '12627', '22439', '12002', '12809'].map((num) => {
              const t = TRENDING_TRAINS.find((tr) => tr.number === num);
              return t ? (
                <button
                  key={num}
                  onClick={() => handleTrainSelect(num)}
                  className="btn btn-secondary text-xs py-1 px-3 rounded-lg h-auto min-h-0 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all font-semibold shadow-xs"
                >
                  #{num} {t.name.split(' ')[0]}
                </button>
              ) : null;
            })}
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-5 lg:px-8 py-8 space-y-8">
        {/* ─── Quick Actions ───────────────────────────────────────── */}
        <section aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading" className="text-subheading text-slate-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {QUICK_ACTIONS.map(({ id, label, icon: Icon, color, href }) => (
              <button
                key={id}
                id={`quick-action-${id}`}
                onClick={() => router.push(href)}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', color)}>
                  <Icon size={18} />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ─── Train Between Stations ─────────────────────────────── */}
        <section aria-labelledby="station-search-heading">
          <h2 id="station-search-heading" className="text-subheading text-slate-900 mb-3">Train Between Stations</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <StationSearchInput
              id="home-from-station"
              label="From"
              placeholder="Departure station…"
              value={fromStation}
              onSelect={setFromStation}
              onClear={() => setFromStation(null)}
            />
            <div className="flex justify-center">
              <button
                onClick={() => { const t = fromStation; setFromStation(toStation); setToStation(t); }}
                className="p-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 transition-all hover:rotate-180 duration-300"
                aria-label="Swap stations"
              >
                <ArrowLeftRight size={15} />
              </button>
            </div>
            <StationSearchInput
              id="home-to-station"
              label="To"
              placeholder="Arrival station…"
              value={toStation}
              onSelect={setToStation}
              onClear={() => setToStation(null)}
            />
            <button
              onClick={handleStationSearch}
              className="w-full py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center justify-center gap-2"
            >
              <Search size={15} /> Find Trains
            </button>
          </div>
        </section>
        {/* ─── Recent Searches ───────────────────────────────────── */}
        {recents.length > 0 && (
          <section aria-labelledby="recent-searches-heading">
            <div className="flex items-center justify-between mb-3">
              <h2 id="recent-searches-heading" className="text-subheading flex items-center gap-2 text-slate-900">
                <Clock size={18} className="text-slate-400" /> Recent Trackings
              </h2>
              <button onClick={clearRecents} className="text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors">
                Clear history
              </button>
            </div>
            <div className="space-y-2">
              {recents.slice(0, 4).map((r) => (
                <button
                  key={r.trainNumber}
                  onClick={() => handleTrainSelect(r.trainNumber)}
                  className="w-full card p-4 flex items-center gap-3.5 hover:shadow-card-hover transition-all duration-200 text-left border border-slate-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    <Train size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-slate-900 truncate">{r.trainName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Train #{r.trainNumber} · {r.from} → {r.to}</div>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400 flex-shrink-0">
                    {format(new Date(r.searchedAt), 'HH:mm')}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ─── Favorites ──────────────────────────────────────────── */}
        {favorites.length > 0 && (
          <section aria-labelledby="favorites-heading">
            <div className="flex items-center justify-between mb-3">
              <h2 id="favorites-heading" className="text-subheading flex items-center gap-2 text-slate-900">
                <Heart size={18} className="text-rose-600" fill="#DC2626" /> Saved Trains
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {favorites.map((fav) => (
                <div key={fav.trainNumber} className="card p-4 relative group border border-slate-200">
                  <button
                    onClick={() => handleTrainSelect(fav.trainNumber)}
                    className="w-full text-left"
                    aria-label={`Track ${fav.trainName}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                        <Train size={18} className="text-rose-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-slate-900 truncate">{fav.trainName}</div>
                        <div className="text-xs font-mono font-semibold text-blue-600 mt-0.5">#{fav.trainNumber}</div>
                        <div className="text-xs text-slate-500 mt-1">{fav.from} → {fav.to}</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => removeFavorite(fav.trainNumber)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                    aria-label={`Remove ${fav.trainName}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Trending Trains ────────────────────────────────────── */}
        <section aria-labelledby="trending-heading">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-blue-600" />
            <h2 id="trending-heading" className="text-subheading text-slate-900">Featured Indian Railways Trains</h2>
          </div>
          <div className="space-y-2">
            {TRENDING_TRAINS.map((train) => (
              <button
                key={train.number}
                onClick={() => handleTrainSelect(train.number)}
                className="w-full card p-4 flex items-center gap-3.5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 text-left border border-slate-200 group"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-xs font-bold text-xs">
                  <Train size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">{train.name}</span>
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      #{train.number}
                    </span>
                    <span className={clsx('badge text-[10px] font-semibold', TRAIN_TYPE_COLORS[train.type])}>
                      {TRAIN_TYPE_LABELS[train.type]}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {train.from} ({train.fromCode}) → {train.to} ({train.toCode}) · {train.distance} km
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0">
                  <span className="hidden sm:block">Track</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Info footer */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center gap-3">
          <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0" />
          <div>
            <strong>Real-time API Sync</strong>: RailGaadi connects to RailRadar, OpenWeatherMap, MapTiler, and OpenTopography APIs to deliver live position telemetry across Indian Railways.
          </div>
        </div>
      </div>
    </div>
  );
}
