'use client';

import { useQuery } from '@tanstack/react-query';
import { getElevation } from '@/services/api';
import { LiveStatus } from '@/types';
import {
  BarChart2,
  Gauge,
  Clock,
  Navigation,
  Mountain,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

interface AnalyticsDashboardProps {
  trainNumber: string;
  status: LiveStatus;
}

export function AnalyticsDashboard({ trainNumber, status }: AnalyticsDashboardProps) {
  const { data: elevationData, isLoading: isElevationLoading } = useQuery({
    queryKey: ['elevation', trainNumber],
    queryFn: () => getElevation(trainNumber),
  });

  const delayChartData = (status.allStations || []).map((s) => ({
    station: s.code,
    name: s.name,
    delay: s.delay || 0,
  }));

  const maxDelayStation = [...delayChartData].sort((a, b) => b.delay - a.delay)[0];
  const passedStations = (status.allStations || []).filter((s) => s.status === 'departed' || s.status === 'current');
  const onTimeStations = passedStations.filter((s) => (s.delay || 0) <= 5);

  const onTimePercentage = passedStations.length > 0
    ? Math.round((onTimeStations.length / passedStations.length) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* ─── Key Metrics Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-4 bg-gradient-to-br from-blue-50/50 to-white border border-blue-100">
          <div className="flex items-center gap-2 text-text-secondary text-xs mb-1 font-semibold">
            <Gauge size={15} className="text-blue-600" /> Current Speed
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {status.speed} <span className="text-xs font-normal text-slate-500">km/h</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Average speed: {status.avgSpeed || 78} km/h</div>
        </div>

        <div className="card p-4 bg-gradient-to-br from-amber-50/50 to-white border border-amber-100">
          <div className="flex items-center gap-2 text-text-secondary text-xs mb-1 font-semibold">
            <Clock size={15} className="text-amber-600" /> Live Delay
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {status.delay > 0 ? (
              <span className="text-rose-600">+{status.delay} min</span>
            ) : status.delay < 0 ? (
              <span className="text-emerald-600">{Math.abs(status.delay)} min early</span>
            ) : (
              <span className="text-emerald-600">On Time</span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {maxDelayStation ? `Max: +${maxDelayStation.delay}m @ ${maxDelayStation.station}` : 'No delay'}
          </div>
        </div>

        <div className="card p-4 bg-gradient-to-br from-emerald-50/50 to-white border border-emerald-100">
          <div className="flex items-center gap-2 text-text-secondary text-xs mb-1 font-semibold">
            <CheckCircle2 size={15} className="text-emerald-600" /> On-Time Rate
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{onTimePercentage}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {onTimeStations.length} of {passedStations.length} stations
          </div>
        </div>

        <div className="card p-4 bg-gradient-to-br from-purple-50/50 to-white border border-purple-100">
          <div className="flex items-center gap-2 text-text-secondary text-xs mb-1 font-semibold">
            <Navigation size={15} className="text-purple-600" /> Progress
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{status.completionPercent}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {status.distanceCovered} / {status.totalDistance} km
          </div>
        </div>
      </div>

      {/* ─── Station Delay Bar Chart ──────────────────────────────────── */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <BarChart2 size={18} className="text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Station Delay Analysis</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Delays per stop (min)</span>
        </div>

        {delayChartData.length > 0 ? (
          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={delayChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="station" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-xl space-y-0.5">
                          <div className="font-bold">{data.name} ({data.station})</div>
                          <div className={data.delay > 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                            {data.delay > 0 ? `Delayed by +${data.delay} mins` : 'On Time'}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="delay" radius={[6, 6, 0, 0]}>
                  {delayChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.delay > 15 ? '#EF4444' : entry.delay > 5 ? '#F59E0B' : '#10B981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            No station delay data available.
          </div>
        )}
      </div>

      {/* ─── Elevation & Topography Profile ───────────────────────────── */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Mountain size={18} className="text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Route Topography & Elevation</h3>
          </div>
          {elevationData && (
            <span className="text-xs font-semibold text-slate-600">
              Max Altitude: <strong className="text-blue-600 font-bold">{elevationData.maxElevation} m</strong>
            </span>
          )}
        </div>

        {isElevationLoading ? (
          <div className="h-44 flex items-center justify-center text-xs text-slate-400">
            Loading route terrain profile…
          </div>
        ) : elevationData && elevationData.points ? (
          <div>
            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={elevationData.points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="distance" stroke="#94A3B8" fontSize={11} unit=" km" tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} unit=" m" tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-xl space-y-0.5">
                            <div>Distance: <strong>{data.distance} km</strong></div>
                            <div className="text-blue-300">Elevation: <strong>{data.elevation} m</strong></div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="elevation"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#elevationGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border text-center text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Highest Peak</span>
                <span className="font-bold text-slate-800">{elevationData.highestPoint?.name} ({elevationData.maxElevation} m)</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Total Ascent</span>
                <span className="font-bold text-emerald-600">+{elevationData.totalAscent} m</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Total Descent</span>
                <span className="font-bold text-rose-600">-{elevationData.totalDescent} m</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
