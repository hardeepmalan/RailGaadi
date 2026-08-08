'use client';

import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  RefreshCw,
  Map,
  Compass,
  Bell,
  Trash2,
  Info,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useRecentSearches, useFavorites } from '@/hooks/useLocalStorage';

export default function SettingsPage() {
  const [refreshInterval, setRefreshInterval] = useState('30');
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [tempUnit, setTempUnit] = useState('c');
  const [notifications, setNotifications] = useState(true);
  const [clearedMsg, setClearedMsg] = useState('');

  const { clearRecents } = useRecentSearches();

  useEffect(() => {
    const storedRefresh = localStorage.getItem('railgaadi_setting_refresh');
    if (storedRefresh) setRefreshInterval(storedRefresh);
    const storedDist = localStorage.getItem('railgaadi_setting_dist');
    if (storedDist) setDistanceUnit(storedDist);
    const storedTemp = localStorage.getItem('railgaadi_setting_temp');
    if (storedTemp) setTempUnit(storedTemp);
  }, []);

  const handleRefreshChange = (val: string) => {
    setRefreshInterval(val);
    localStorage.setItem('railgaadi_setting_refresh', val);
  };

  const handleDistChange = (val: string) => {
    setDistanceUnit(val);
    localStorage.setItem('railgaadi_setting_dist', val);
  };

  const handleTempChange = (val: string) => {
    setTempUnit(val);
    localStorage.setItem('railgaadi_setting_temp', val);
  };

  const handleClearAll = () => {
    clearRecents();
    setClearedMsg('Recent searches cleared successfully!');
    setTimeout(() => setClearedMsg(''), 3000);
  };

  return (
    <div className="min-h-screen bg-background p-5 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-heading text-text-primary flex items-center gap-2">
          <SettingsIcon size={24} className="text-primary" /> App Settings
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Customize live tracking behavior, display preferences, and local data.
        </p>
      </div>

      {clearedMsg && (
        <div className="p-3 bg-success-50 border border-success/30 text-success text-xs font-semibold rounded-xl flex items-center gap-2">
          <Check size={16} /> {clearedMsg}
        </div>
      )}

      {/* Tracking Preferences */}
      <div className="card p-5 space-y-4">
        <h2 className="font-bold text-sm text-text-primary flex items-center gap-2">
          <RefreshCw size={16} className="text-primary" /> Live Tracking Frequency
        </h2>
        <div className="text-xs text-text-secondary">
          Select how often train live status should automatically update.
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { id: '15', label: 'Every 15s' },
            { id: '30', label: 'Every 30s (Default)' },
            { id: '60', label: 'Every 60s' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleRefreshChange(id)}
              className={clsx(
                'py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center',
                refreshInterval === id
                  ? 'bg-primary-50 border-primary text-primary font-semibold'
                  : 'bg-surface border-border text-text-secondary hover:text-text-primary'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Units & Measurement */}
      <div className="card p-5 space-y-4">
        <h2 className="font-bold text-sm text-text-primary flex items-center gap-2">
          <Compass size={16} className="text-primary" /> Display Units
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-text-secondary font-medium block mb-2">Distance Unit</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleDistChange('km')}
                className={clsx(
                  'flex-1 py-2 rounded-xl text-xs font-medium border transition-all',
                  distanceUnit === 'km'
                    ? 'bg-primary-50 border-primary text-primary font-semibold'
                    : 'bg-surface border-border text-text-secondary'
                )}
              >
                Kilometers (km)
              </button>
              <button
                onClick={() => handleDistChange('mi')}
                className={clsx(
                  'flex-1 py-2 rounded-xl text-xs font-medium border transition-all',
                  distanceUnit === 'mi'
                    ? 'bg-primary-50 border-primary text-primary font-semibold'
                    : 'bg-surface border-border text-text-secondary'
                )}
              >
                Miles (mi)
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-text-secondary font-medium block mb-2">Temperature Unit</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleTempChange('c')}
                className={clsx(
                  'flex-1 py-2 rounded-xl text-xs font-medium border transition-all',
                  tempUnit === 'c'
                    ? 'bg-primary-50 border-primary text-primary font-semibold'
                    : 'bg-surface border-border text-text-secondary'
                )}
              >
                Celsius (°C)
              </button>
              <button
                onClick={() => handleTempChange('f')}
                className={clsx(
                  'flex-1 py-2 rounded-xl text-xs font-medium border transition-all',
                  tempUnit === 'f'
                    ? 'bg-primary-50 border-primary text-primary font-semibold'
                    : 'bg-surface border-border text-text-secondary'
                )}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-5 flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="font-bold text-sm text-text-primary flex items-center gap-2">
            <Bell size={16} className="text-primary" /> Journey Alerts &amp; Delay Warnings
          </h2>
          <p className="text-xs text-text-secondary">
            Receive in-app alerts when significant train delays occur.
          </p>
        </div>
        <button
          onClick={() => setNotifications(!notifications)}
          className={clsx(
            'w-12 h-6 rounded-full transition-colors relative p-0.5 flex-shrink-0',
            notifications ? 'bg-primary' : 'bg-surface-hover'
          )}
        >
          <div
            className={clsx(
              'w-5 h-5 rounded-full bg-white transition-transform shadow-sm',
              notifications ? 'translate-x-6' : 'translate-x-0'
            )}
          />
        </button>
      </div>

      {/* Data Management */}
      <div className="card p-5 space-y-3">
        <h2 className="font-bold text-sm text-text-primary flex items-center gap-2">
          <Trash2 size={16} className="text-danger" /> Clear Cache &amp; Storage
        </h2>
        <p className="text-xs text-text-secondary">
          Clear saved search history and local cached tracking data.
        </p>
        <button
          onClick={handleClearAll}
          className="btn btn-secondary text-xs text-danger hover:bg-danger-50 hover:border-danger/30 py-2 px-4 rounded-xl"
        >
          Clear Recent Search History
        </button>
      </div>

      {/* About App */}
      <div className="card p-5 space-y-2 bg-surface/50 border border-border">
        <div className="flex items-center gap-2 font-bold text-sm text-text-primary">
          <Info size={16} className="text-primary" /> RailGaadi v1.0.0
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          RailGaadi is a real-time Indian Railways tracking application offering live train location updates, station delay timelines, topography profiles, weather insights, and nearby landmark discovery.
        </p>
        <div className="text-[11px] text-text-muted pt-2 border-t border-border flex items-center gap-1">
          <ShieldCheck size={14} className="text-success" /> Data synced with IRCTC &amp; OpenStreetMap APIs.
        </div>
      </div>
    </div>
  );
}
