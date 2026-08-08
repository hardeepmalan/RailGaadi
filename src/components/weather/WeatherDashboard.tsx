'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWeather } from '@/services/api';
import { WeatherData } from '@/types';
import {
  Cloud,
  Droplets,
  Wind,
  Sun,
  Eye,
  Gauge,
  Thermometer,
  CloudRain,
  CloudLightning,
  Umbrella,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

interface WeatherDashboardProps {
  currentStationCode: string;
  nextStationCode: string;
  destinationCode?: string;
}

export function WeatherDashboard({
  currentStationCode,
  nextStationCode,
  destinationCode,
}: WeatherDashboardProps) {
  const [selectedCode, setSelectedCode] = useState<string>(currentStationCode);

  useEffect(() => {
    if (currentStationCode) {
      setSelectedCode(currentStationCode);
    }
  }, [currentStationCode]);

  const { data: weather, isLoading, isError } = useQuery<WeatherData>({
    queryKey: ['weather', selectedCode],
    queryFn: () => getWeather(selectedCode),
    enabled: !!selectedCode,
  });

  const stations = [
    { code: currentStationCode, label: 'Current Station' },
    { code: nextStationCode, label: 'Next Station' },
    ...(destinationCode ? [{ code: destinationCode, label: 'Destination' }] : []),
  ];

  const willRain = weather?.rainSummary?.willRain ?? ((weather?.rainProbability ?? 0) >= 40);
  const maxRainChance = weather?.rainSummary?.rainProbabilityMax ?? (weather?.rainProbability ?? 0);

  return (
    <div className="space-y-6">
      {/* ─── Station Selector Tabs ──────────────────────────────────── */}
      <div className="flex gap-2 border-b border-border pb-3 overflow-x-auto scrollbar-hide">
        {stations.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setSelectedCode(code)}
            className={clsx(
              'px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shadow-xs flex items-center gap-1.5',
              selectedCode === code
                ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]'
                : 'bg-surface text-slate-700 hover:bg-slate-200 hover:text-slate-900 border-slate-200'
            )}
          >
            <span>{label}</span>
            <span className={clsx(
              'px-1.5 py-0.5 rounded-md text-[10px] font-extrabold',
              selectedCode === code ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
            )}>
              {code}
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <SkeletonCard lines={6} />
      ) : isError || !weather ? (
        <div className="card p-6 text-center text-text-muted text-sm">
          Unable to fetch weather data for station {selectedCode}.
        </div>
      ) : (
        <>
          {/* ─── Main Live Weather Banner ────────────────────────────── */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white shadow-xl relative overflow-hidden border border-blue-500/20">
            {/* Background Decorative Graphic */}
            <div className="absolute right-[-20px] bottom-[-20px] text-white/10 pointer-events-none">
              {willRain ? <CloudRain size={200} /> : <Sun size={200} />}
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
                  <Sparkles size={13} className="text-yellow-300" />
                  <span>Live Weather</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-xs text-blue-200 font-medium">
                  Station: <span className="font-bold text-white">{weather.stationName} ({weather.stationCode})</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-white">
                    {weather.stationName}
                  </h2>
                  <div className="text-base text-blue-100 capitalize mt-1 flex items-center gap-2">
                    <span>{weather.description}</span>
                    <span className="text-white/40">•</span>
                    <span>Humidity: {weather.humidity}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15">
                  <div className="text-5xl font-extrabold tracking-tight text-white">
                    {Math.round(weather.temperature)}°C
                  </div>
                  <div className="text-xs text-blue-100 border-l border-white/20 pl-3 space-y-1">
                    <div>Feels like: <strong className="text-white">{Math.round(weather.feelsLike)}°C</strong></div>
                    <div>Wind: <strong className="text-white">{weather.windSpeed} km/h {weather.windDirection}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Overall Rain Prediction Banner ("Barish Hogi Ya Nahi") ── */}
          <div
            className={clsx(
              'p-5 rounded-2xl border transition-all shadow-sm',
              willRain
                ? 'bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-indigo-500/10 border-amber-300 dark:border-amber-700/50'
                : 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border-emerald-300 dark:border-emerald-700/50'
            )}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  {willRain ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                      <Umbrella size={14} />
                      Rain Expected / it will rain 
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                      <CheckCircle2 size={14} />
                      No Rain Expected / it will not rain
                    </span>
                  )}
                  <span className="text-xs font-semibold text-text-secondary">
                    Overall Forecast (Next 6 Hours)
                  </span>
                </div>

                <p className="text-sm font-medium text-text-primary pt-1">
                  {weather.rainSummary?.summaryText ||
                    (willRain
                      ? `High chance of rain (${maxRainChance}%) at ${weather.stationName} in the next 6 hours. Keep an umbrella ready!`
                      : `Low rain chance (${maxRainChance}%) at ${weather.stationName} for the next 6 hours. Enjoy clean weather!`)}
                </p>
              </div>

              {/* Rain Probability Gauge Pill */}
              <div className="flex-shrink-0 flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-border shadow-xs">
                <div className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg',
                  willRain ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                )}>
                  {willRain ? <CloudRain size={22} /> : <Sun size={22} />}
                </div>
                <div>
                  <div className="text-[11px] text-text-muted font-medium">Max Rain Chance</div>
                  <div className="text-lg font-extrabold text-white dark:text-white">
                    {maxRainChance}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Next 6 Hours Weather Forecast ──────────────────────── */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                <Clock size={18} className="text-blue-600" />
                <span>Next 6 Hours Weather Forecast</span>
              </h3>
              <span className="text-xs text-text-muted font-medium">Hourly breakdown</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {weather.forecast.map((f, idx) => {
                const isHighRain = f.rainProbability >= 40;
                return (
                  <div
                    key={idx}
                    className={clsx(
                      'p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between space-y-2',
                      isHighRain
                        ? 'bg-blue-50/70 border-blue-200 text-blue-900 hover:shadow-md'
                        : 'bg-surface border-border hover:bg-slate-100/80 hover:shadow-xs'
                    )}
                  >
                    {/* Hour badge */}
                    <div className="text-xs font-extrabold text-text-secondary bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                      {f.time}
                    </div>

                    {/* Icon */}
                    <div className="my-1 text-blue-600">
                      {f.rainProbability >= 60 ? (
                        <CloudLightning size={28} className="text-indigo-600" />
                      ) : f.rainProbability >= 40 ? (
                        <CloudRain size={28} className="text-blue-500" />
                      ) : f.description.toLowerCase().includes('cloud') ? (
                        <Cloud size={28} className="text-slate-500" />
                      ) : (
                        <Sun size={28} className="text-amber-500" />
                      )}
                    </div>

                    {/* Temperature */}
                    <div className="text-xl font-black text-text-primary">
                      {Math.round(f.temperature)}°C
                    </div>

                    {/* Condition text */}
                    <div className="text-[11px] font-medium text-text-secondary capitalize truncate max-w-full">
                      {f.description}
                    </div>

                    {/* Rain probability badge */}
                    <div
                      className={clsx(
                        'w-full text-[11px] font-bold py-1 px-1.5 rounded-lg flex items-center justify-center gap-1',
                        isHighRain
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      )}
                    >
                      <Droplets size={12} />
                      <span>{f.rainProbability}% rain</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Detailed Weather Metrics Grid ──────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="card p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                <Droplets size={22} />
              </div>
              <div>
                <div className="text-xs text-text-muted font-medium">Rain Chance</div>
                <div className="font-extrabold text-base text-text-primary">
                  {weather.rainProbability}%
                </div>
              </div>
            </div>

            <div className="card p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0 text-teal-600">
                <Wind size={22} />
              </div>
              <div>
                <div className="text-xs text-text-muted font-medium">Wind Speed</div>
                <div className="font-extrabold text-base text-text-primary">
                  {weather.windSpeed} km/h{' '}
                  <span className="text-xs font-normal text-text-muted">({weather.windDirection})</span>
                </div>
              </div>
            </div>

            <div className="card p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-600">
                <Sun size={22} />
              </div>
              <div>
                <div className="text-xs text-text-muted font-medium">UV Index</div>
                <div className="font-extrabold text-base text-text-primary">
                  {weather.uvIndex}{' '}
                  <span className="text-xs font-normal text-text-muted">(Moderate)</span>
                </div>
              </div>
            </div>

            <div className="card p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                <Eye size={22} />
              </div>
              <div>
                <div className="text-xs text-text-muted font-medium">Visibility</div>
                <div className="font-extrabold text-base text-text-primary">
                  {weather.visibility} km
                </div>
              </div>
            </div>

            <div className="card p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center flex-shrink-0 text-purple-600">
                <Gauge size={22} />
              </div>
              <div>
                <div className="text-xs text-text-muted font-medium">Pressure</div>
                <div className="font-extrabold text-base text-text-primary">
                  {weather.pressure} hPa
                </div>
              </div>
            </div>

            <div className="card p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-rose-600">
                <Thermometer size={22} />
              </div>
              <div>
                <div className="text-xs text-text-muted font-medium">Humidity</div>
                <div className="font-extrabold text-base text-text-primary">
                  {weather.humidity}%
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
