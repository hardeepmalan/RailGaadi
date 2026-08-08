'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Map, BarChart2, Cloud, MapPin, Activity, Search, Command } from 'lucide-react';
import { useLiveTracking } from '@/hooks/useLiveTracking';
import { useRecentSearches } from '@/hooks/useLocalStorage';
import { TRAINS_DB } from '@/data/trains';
import { LiveStatusCard } from '@/components/tracking/LiveStatusCard';
import { JourneyProgress } from '@/components/tracking/JourneyProgress';
import { StationTimeline } from '@/components/tracking/StationTimeline';
import { FavoriteButton } from '@/components/tracking/FavoriteButton';
import { ShareButton } from '@/components/tracking/ShareButton';
import { TrainMap } from '@/components/map/TrainMap';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { WeatherDashboard } from '@/components/weather/WeatherDashboard';
import { NearbyPlaces } from '@/components/nearby/NearbyPlaces';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { ErrorState } from '@/components/ui/ErrorState';
import { clsx } from 'clsx';

type Tab = 'status' | 'map' | 'analytics' | 'weather' | 'nearby';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'status', label: 'Status', icon: Activity },
  { id: 'map', label: 'Map', icon: Map },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'weather', label: 'Weather', icon: Cloud },
  { id: 'nearby', label: 'Nearby', icon: MapPin },
];

interface TrackingPageProps {
  trainNumber: string;
}

export function TrackingPage({ trainNumber }: TrackingPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('status');
  const [searchOpen, setSearchOpen] = useState(false);
  const { liveStatus, isLoading, isError, error, refresh, countdown, isFetching } = useLiveTracking(trainNumber);
  const { addRecent } = useRecentSearches();
  const train = TRAINS_DB.find((t) => t.number === trainNumber);

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

  useEffect(() => {
    if (train || liveStatus) {
      addRecent({
        trainNumber,
        trainName: train?.name || liveStatus?.trainName || trainNumber,
        from: train?.from || liveStatus?.currentStation?.name || '',
        to: train?.to || liveStatus?.nextStation?.name || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainNumber]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-5 space-y-4">
        <div className="skeleton h-8 w-40 rounded-xl" />
        <SkeletonCard lines={4} showAvatar />
        <SkeletonCard lines={2} />
        <SkeletonCard lines={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <ErrorState
          title="Could not load train status"
          message={error?.message || 'The train may not be running today or the service is unavailable.'}
          onRetry={refresh}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ─── Header ────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 glass border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-3xl mx-auto gap-3">
          {/* Left: back + title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.back()}
              className="btn btn-ghost p-2 rounded-xl flex-shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <h1 className="font-bold text-base text-text-primary leading-tight truncate">
                {liveStatus?.trainName || train?.name || trainNumber}
              </h1>
              <div className="flex items-center gap-2">
                <span className="live-dot" aria-hidden="true" />
                <span className="text-xs text-success font-medium">Live</span>
                {isFetching && <span className="text-xs text-text-muted">· Updating…</span>}
                {!isFetching && (
                  <span className="text-xs text-text-muted">· Refreshing in {countdown}s</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Search button + actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 🔍 Search button – opens global search from anywhere */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-500 text-xs font-semibold transition-all border border-slate-200 hover:border-blue-200"
              aria-label="Open search"
            >
              <Search size={14} />
              <span>Search</span>
              <span className="flex items-center gap-0.5 text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px] font-bold">
                <Command size={9} />K
              </span>
            </button>
            {/* Mobile search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <FavoriteButton
              trainNumber={trainNumber}
              trainName={liveStatus?.trainName || train?.name || trainNumber}
              from={train?.from || ''}
              to={train?.to || ''}
            />
            <ShareButton trainNumber={trainNumber} trainName={liveStatus?.trainName || trainNumber} />
          </div>
        </div>
      </div>

      {/* ─── Tabs ──────────────────────────────────────────────── */}
      <div className="sticky top-[65px] z-20 bg-background border-b border-border">
        <div className="flex overflow-x-auto max-w-3xl mx-auto px-4 scrollbar-hide gap-1 py-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={clsx(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 flex-shrink-0',
                activeTab === id
                  ? 'bg-primary-50 text-primary'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              )}
              aria-current={activeTab === id ? 'page' : undefined}
            >
              <Icon size={15} strokeWidth={activeTab === id ? 2.5 : 2} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Content ───────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-5">
        {activeTab === 'status' && liveStatus && (
          <div className="space-y-4 animate-slide-up">
            <LiveStatusCard status={liveStatus} />
            <JourneyProgress status={liveStatus} />
            <StationTimeline stations={liveStatus.allStations} />
          </div>
        )}

        {activeTab === 'map' && liveStatus && (
          <div className="animate-fade-in">
            <TrainMap
              latitude={liveStatus.latitude}
              longitude={liveStatus.longitude}
              trainNumber={trainNumber}
              currentStation={liveStatus.currentStation.name}
              nextStation={liveStatus.nextStation?.name}
              coveredDistance={liveStatus.distanceCovered}
              remainingDistance={liveStatus.distanceRemaining}
              journeyProgress={liveStatus.completionPercent}
              stations={liveStatus.allStations}
            />
          </div>
        )}

        {activeTab === 'analytics' && liveStatus && (
          <div className="animate-slide-up">
            <AnalyticsDashboard trainNumber={trainNumber} status={liveStatus} />
          </div>
        )}

        {activeTab === 'weather' && liveStatus && (
          <div className="animate-slide-up">
            <WeatherDashboard
              currentStationCode={liveStatus.currentStation.code}
              nextStationCode={liveStatus.nextStation.code}
              destinationCode={liveStatus.allStations[liveStatus.allStations.length - 1]?.code}
            />
          </div>
        )}

        {activeTab === 'nearby' && liveStatus && (
          <div className="animate-slide-up">
            <NearbyPlaces lat={liveStatus.latitude} lon={liveStatus.longitude} />
          </div>
        )}
      </div>
    </div>
  );
}
