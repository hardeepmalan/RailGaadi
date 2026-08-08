'use client';

import { useState } from 'react';
import { Station } from '@/types';
import { CheckCircle2, Navigation, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

interface StationTimelineProps {
  stations: Station[];
}

export function StationTimeline({ stations }: StationTimelineProps) {
  const [filter, setFilter] = useState<'all' | 'departed' | 'upcoming'>('all');

  const filteredStations = stations.filter((s) => {
    if (filter === 'departed') return s.status === 'departed' || s.status === 'current';
    if (filter === 'upcoming') return s.status === 'upcoming' || s.status === 'current';
    return true;
  });

  return (
    <div className="card p-5 space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <MapPin size={18} className="text-primary" /> Route Station Timeline
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Total {stations.length} stations along the train route.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1 bg-surface p-1 rounded-xl border border-border">
          {[
            { id: 'all', label: 'All Stops' },
            { id: 'departed', label: 'Passed' },
            { id: 'upcoming', label: 'Upcoming' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id as any)}
              className={clsx(
                'px-3 py-1 text-xs font-semibold rounded-lg transition-all',
                filter === id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <ol className="relative pt-2" aria-label="Journey station schedule">
        {filteredStations.map((station, index) => {
          const isFirst = index === 0 && filter === 'all';
          const isLast = index === filteredStations.length - 1 && filter === 'all';
          const isCurrent = station.status === 'current';
          const isDeparted = station.status === 'departed';
          const isUpcoming = station.status === 'upcoming';

          const delay = station.delay || 0;

          return (
            <li
              key={station.code}
              className={clsx('relative flex gap-4 pb-6', isLast && 'pb-0')}
            >
              {/* Vertical Connecting Line */}
              {index < filteredStations.length - 1 && (
                <div
                  className={clsx(
                    'absolute left-[11px] top-6 bottom-0 w-0.5',
                    isDeparted ? 'bg-emerald-500' : 'bg-slate-200'
                  )}
                  aria-hidden="true"
                />
              )}

              {/* Status Marker Icon */}
              <div className="relative z-10 flex-shrink-0 mt-0.5">
                {isCurrent ? (
                  <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <Navigation size={11} className="text-white" />
                  </div>
                ) : isDeparted ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                    <CheckCircle2 size={14} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                  </div>
                )}
              </div>

              {/* Station Content */}
              <div className="flex-1 bg-surface/40 p-3.5 rounded-xl border border-border/80 hover:bg-surface transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={clsx(
                        'font-bold text-sm leading-tight',
                        isCurrent ? 'text-blue-600' : 'text-text-primary'
                      )}>
                        {station.name}
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {station.code}
                      </span>
                      {station.platform && (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          PF {station.platform}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-text-secondary flex items-center gap-2 flex-wrap">
                      <span>{station.distance} km from origin</span>
                      {station.halt > 0 && <span>· Halt: {station.halt}m</span>}
                    </div>
                  </div>

                  {/* Arrival / Departure Times */}
                  <div className="text-right flex-shrink-0 space-y-1">
                    <div className="text-xs font-semibold text-text-primary flex items-center justify-end gap-1.5">
                      <Clock size={13} className="text-blue-500" />
                      <div className="flex flex-col text-right">
                        {station.scheduledArrival !== '--' && (
                          <span className="text-[11px] text-slate-600 font-medium">
                            Arr: <strong className="text-slate-900">{station.scheduledArrival}</strong>
                          </span>
                        )}
                        {station.scheduledDeparture !== '--' && (
                          <span className="text-[11px] text-slate-600 font-medium">
                            Dep: <strong className="text-slate-900">{station.scheduledDeparture}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {delay > 0 ? (
                      <div className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-flex items-center gap-1">
                        <AlertTriangle size={10} /> +{delay} min delay
                      </div>
                    ) : (
                      <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                        On Time
                      </div>
                    )}
                  </div>
                </div>

                {isCurrent && (
                  <div className="mt-2 pt-2 border-t border-border/60 flex items-center gap-2 text-xs font-bold text-emerald-600 animate-fade-in">
                    <span className="live-dot" />
                    <span>Train currently at this station</span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
