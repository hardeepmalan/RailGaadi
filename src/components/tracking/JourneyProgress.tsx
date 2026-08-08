'use client';

import { LiveStatus } from '@/types';
import { MapPin, Navigation, Gauge, ArrowRight } from 'lucide-react';

interface JourneyProgressProps {
  status: LiveStatus;
}

export function JourneyProgress({ status }: JourneyProgressProps) {
  const percent = Math.min(100, Math.max(0, status.completionPercent));
  const covered = status.distanceCovered;
  const remaining = status.distanceRemaining;
  const total = status.totalDistance;

  return (
    <div className="card p-5 space-y-5">
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Journey Progress</h2>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-3xl font-extrabold text-blue-600 tabular-nums leading-none">{percent}</span>
            <span className="text-lg font-bold text-blue-400 mt-1">%</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-text-muted">Avg Speed</div>
          <div className="text-2xl font-bold text-text-primary tabular-nums">{status.avgSpeed}</div>
          <div className="text-xs text-text-muted font-medium">km/h</div>
        </div>
      </div>

      {/* Station route: current → next */}
      <div className="relative flex items-center gap-3 bg-slate-50 rounded-2xl p-3 overflow-hidden">
        {/* Animated gradient bar */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-100 to-blue-50 rounded-2xl transition-all duration-1000"
          style={{ width: `${percent}%`, opacity: 0.7 }}
        />
        <div className="relative z-10 flex items-center gap-3 w-full">
          {/* Current station */}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Current Station
            </div>
            <div className="font-bold text-sm text-text-primary truncate leading-tight">
              {status.currentStation?.name || '—'}
            </div>
            <div className="text-[10px] text-text-muted font-mono">{status.currentStation?.code}</div>
          </div>

          {/* Arrow with train icon */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <rect x="2" y="7" width="20" height="11" rx="2"/>
                <path d="M12 7V3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
              </svg>
            </div>
            <ArrowRight size={10} className="text-blue-400" />
          </div>

          {/* Next station */}
          <div className="flex-1 min-w-0 text-right">
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5 flex items-center justify-end gap-1">
              Next Stop
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            </div>
            <div className="font-bold text-sm text-text-primary truncate leading-tight">
              {status.nextStation?.name || '—'}
            </div>
            <div className="text-[10px] text-text-muted font-mono">{status.nextStation?.scheduledArrival}</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-[10px] text-text-muted mb-2 font-medium">
          <span>Origin</span>
          <span>{percent}% completed</span>
          <span>Destination</span>
        </div>
        <div
          className="relative h-3 bg-slate-100 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {/* Track segments for every 10% */}
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((tick) => (
            <div
              key={tick}
              className="absolute top-0 bottom-0 w-px bg-white/60 z-10"
              style={{ left: `${tick}%` }}
            />
          ))}
          {/* Fill */}
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative"
            style={{
              width: `${percent}%`,
              background: 'linear-gradient(90deg, #16a34a 0%, #22c55e 40%, #2563eb 80%, #3b82f6 100%)',
            }}
          >
            {/* Glowing head */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 -mr-2 rounded-full bg-blue-500 shadow-lg shadow-blue-400/60 border-2 border-white" />
          </div>
        </div>
      </div>

      {/* Distance stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-center">
          <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-1.5">
            <Navigation size={12} className="text-emerald-600" />
          </div>
          <div className="text-lg font-extrabold text-emerald-700 tabular-nums leading-none">{covered}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">km covered</div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-center">
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-1.5">
            <Gauge size={12} className="text-blue-600" />
          </div>
          <div className="text-lg font-extrabold text-blue-700 tabular-nums leading-none">{total}</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-0.5">km total</div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-center">
          <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-1.5">
            <MapPin size={12} className="text-amber-600" />
          </div>
          <div className="text-lg font-extrabold text-amber-700 tabular-nums leading-none">{remaining}</div>
          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">km left</div>
        </div>
      </div>
    </div>
  );
}
