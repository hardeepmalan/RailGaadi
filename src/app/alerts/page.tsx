'use client';

import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight, Clock, Train, MapPin, AlertTriangle, Cloud, X, Check, ChevronDown, BellRing, History, BellOff } from 'lucide-react';
import { clsx } from 'clsx';

type AlertType =
  | 'departure'
  | 'station_arrival'
  | 'destination'
  | 'delay'
  | 'platform_change'
  | 'cancellation'
  | 'reschedule'
  | 'pnr_change'
  | 'coach_position'
  | 'weather';

interface UserAlert {
  id: string;
  type: AlertType;
  trainNumber: string;
  trainName: string;
  label: string;
  description: string;
  enabled: boolean;
  triggered: boolean;
  createdAt: string;
  triggerCondition?: string;
}

const ALERT_TYPES: { id: AlertType; icon: string; label: string; desc: string; hasCondition: boolean; conditions?: string[] }[] = [
  {
    id: 'departure', icon: '🚂', label: 'Departure Alert',
    desc: 'Get notified before your train departs',
    hasCondition: true,
    conditions: ['15 minutes before', '30 minutes before', '1 hour before', '2 hours before']
  },
  {
    id: 'station_arrival', icon: '📍', label: 'Station Arrival Alert',
    desc: 'Alert when train approaches a station',
    hasCondition: true,
    conditions: ['1 station before', '2 stations before', '10 km before', '30 minutes before']
  },
  {
    id: 'destination', icon: '🏁', label: 'Destination Alert',
    desc: 'Notified before reaching your destination',
    hasCondition: true,
    conditions: ['15 minutes before', '30 minutes before', '1 station before']
  },
  {
    id: 'delay', icon: '⏰', label: 'Delay Threshold Alert',
    desc: 'Alert when train delay exceeds a limit',
    hasCondition: true,
    conditions: ['Delay > 15 min', 'Delay > 30 min', 'Delay > 1 hour', 'Any delay']
  },
  {
    id: 'platform_change', icon: '🔄', label: 'Platform Change Alert',
    desc: 'Notified if platform changes',
    hasCondition: false
  },
  {
    id: 'cancellation', icon: '❌', label: 'Cancellation Alert',
    desc: 'Alert if train is cancelled or affected',
    hasCondition: false
  },
  {
    id: 'reschedule', icon: '📅', label: 'Rescheduling Alert',
    desc: 'Alert when departure time changes',
    hasCondition: false
  },
  {
    id: 'pnr_change', icon: '🎫', label: 'PNR Status Alert',
    desc: 'Track your waitlist or RAC status changes',
    hasCondition: false
  },
  {
    id: 'coach_position', icon: '🚃', label: 'Coach Position Alert',
    desc: 'Alert when coach position is updated',
    hasCondition: false
  },
  {
    id: 'weather', icon: '🌩️', label: 'Weather Alert',
    desc: 'Severe weather along your route',
    hasCondition: true,
    conditions: ['Heavy Rain', 'Dense Fog', 'Extreme Heat', 'Storm Warning']
  },
];

const STORAGE_KEY = 'railgaadi_user_alerts';

function loadAlerts(): UserAlert[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveAlerts(alerts: UserAlert[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [tab, setTab] = useState<'active' | 'history' | 'disabled'>('active');
  const [showCreate, setShowCreate] = useState(false);

  // Create form
  const [trainNumber, setTrainNumber] = useState('');
  const [trainName, setTrainName] = useState('');
  const [selectedType, setSelectedType] = useState<AlertType>('departure');
  const [selectedCondition, setSelectedCondition] = useState('');

  useEffect(() => {
    setAlerts(loadAlerts());
  }, []);

  const updateAlerts = (updated: UserAlert[]) => {
    setAlerts(updated);
    saveAlerts(updated);
  };

  const handleCreate = () => {
    if (!trainNumber.trim()) return;
    const typeInfo = ALERT_TYPES.find(t => t.id === selectedType);
    const alert: UserAlert = {
      id: Date.now().toString(),
      type: selectedType,
      trainNumber: trainNumber.trim(),
      trainName: trainName.trim() || `Train ${trainNumber.trim()}`,
      label: typeInfo?.label || selectedType,
      description: selectedCondition || typeInfo?.desc || '',
      enabled: true,
      triggered: false,
      createdAt: new Date().toISOString(),
      triggerCondition: selectedCondition,
    };
    updateAlerts([alert, ...alerts]);
    setTrainNumber('');
    setTrainName('');
    setSelectedType('departure');
    setSelectedCondition('');
    setShowCreate(false);
    setTab('active');
  };

  const toggleAlert = (id: string) => {
    updateAlerts(alerts.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const deleteAlert = (id: string) => {
    updateAlerts(alerts.filter(a => a.id !== id));
  };

  const activeAlerts = alerts.filter(a => a.enabled && !a.triggered);
  const historyAlerts = alerts.filter(a => a.triggered);
  const disabledAlerts = alerts.filter(a => !a.enabled && !a.triggered);

  const currentList = tab === 'active' ? activeAlerts : tab === 'history' ? historyAlerts : disabledAlerts;

  const typeInfo = ALERT_TYPES.find(t => t.id === selectedType);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Signature Unified Brand Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white px-5 pt-8 pb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <Bell size={22} />
              Alert Center
            </h1>
            <p className="text-blue-100 text-sm">Create and manage your railway journey alerts</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white border border-white/30 text-sm font-bold px-3 py-2 rounded-xl transition-colors"
          >
            <Plus size={16} /> New Alert
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: 'Active', count: activeAlerts.length, color: 'bg-white/20' },
            { label: 'Triggered', count: historyAlerts.length, color: 'bg-white/20' },
            { label: 'Disabled', count: disabledAlerts.length, color: 'bg-white/20' },
          ].map(s => (
            <div key={s.label} className={clsx('rounded-xl p-3 text-center', s.color)}>
              <div className="text-2xl font-bold">{s.count}</div>
              <div className="text-xs text-indigo-100">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 -mt-2">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-4">
          <div className="flex">
            {[
              { id: 'active', label: 'Active', icon: BellRing, count: activeAlerts.length },
              { id: 'history', label: 'History', icon: History, count: historyAlerts.length },
              { id: 'disabled', label: 'Disabled', icon: BellOff, count: disabledAlerts.length },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={clsx(
                  'flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors border-b-2',
                  tab === t.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                )}
              >
                <t.icon size={16} />
                {t.label}
                {t.count > 0 && (
                  <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded-full', tab === t.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600')}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Alert list */}
        {currentList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Bell size={24} className="text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-700 mb-1">
              {tab === 'active' ? 'No active alerts' : tab === 'history' ? 'No triggered alerts yet' : 'No disabled alerts'}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {tab === 'active' ? 'Create your first train alert to get notified about departures, delays, and more.' : 'Alerts will appear here after they trigger.'}
            </p>
            {tab === 'active' && (
              <button
                onClick={() => setShowCreate(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus size={16} /> Create Alert
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {currentList.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onToggle={() => toggleAlert(alert.id)}
                onDelete={() => deleteAlert(alert.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Alert Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800 text-lg">Create Alert</h2>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-5">
              {/* Train input */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">Train</label>
                <input
                  type="text"
                  placeholder="Train number (e.g. 12301)"
                  value={trainNumber}
                  onChange={e => setTrainNumber(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono font-semibold outline-none focus:border-blue-400"
                />
                <input
                  type="text"
                  placeholder="Train name (optional)"
                  value={trainName}
                  onChange={e => setTrainName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                />
              </div>

              {/* Alert type */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">Alert Type</label>
                <div className="grid grid-cols-1 gap-2">
                  {ALERT_TYPES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => { setSelectedType(t.id); setSelectedCondition(''); }}
                      className={clsx(
                        'flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                        selectedType === t.id
                          ? 'bg-blue-50 border-blue-300 text-blue-800'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      )}
                    >
                      <span className="text-xl">{t.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{t.label}</div>
                        <div className="text-xs text-slate-500">{t.desc}</div>
                      </div>
                      {selectedType === t.id && <Check size={16} className="text-blue-600 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              {typeInfo?.hasCondition && typeInfo.conditions && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">When</label>
                  <div className="grid grid-cols-2 gap-2">
                    {typeInfo.conditions.map(c => (
                      <button
                        key={c}
                        onClick={() => setSelectedCondition(c)}
                        className={clsx(
                          'px-3 py-2 rounded-xl border text-sm font-semibold transition-all',
                          selectedCondition === c
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-slate-200 text-slate-700 hover:border-blue-300'
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleCreate}
                disabled={!trainNumber.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Bell size={16} /> Set Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AlertCard({ alert, onToggle, onDelete }: { alert: UserAlert; onToggle: () => void; onDelete: () => void }) {
  const typeInfo = ALERT_TYPES.find(t => t.id === alert.type);
  
  return (
    <div className={clsx(
      'bg-white rounded-2xl border shadow-sm overflow-hidden transition-all',
      !alert.enabled && 'opacity-60',
      alert.triggered ? 'border-green-200' : 'border-slate-200'
    )}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={clsx(
            'w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0',
            alert.triggered ? 'bg-green-50' : alert.enabled ? 'bg-blue-50' : 'bg-slate-100'
          )}>
            {typeInfo?.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-bold text-sm text-slate-800">{alert.label}</div>
                <div className="text-xs font-mono font-semibold text-blue-600">#{alert.trainNumber} · {alert.trainName}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onToggle}
                  className={clsx(
                    'p-1.5 rounded-lg transition-colors',
                    alert.enabled ? 'text-blue-600 hover:bg-blue-50' : 'text-slate-400 hover:bg-slate-100'
                  )}
                  title={alert.enabled ? 'Disable' : 'Enable'}
                >
                  {alert.enabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
                <button
                  onClick={onDelete}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {alert.triggerCondition && (
              <div className="mt-1.5 inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-600">
                <Clock size={11} /> {alert.triggerCondition}
              </div>
            )}

            <div className="flex items-center gap-2 mt-2">
              {alert.triggered && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  <Check size={10} /> Triggered
                </span>
              )}
              {!alert.triggered && alert.enabled && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  <Bell size={10} /> Watching
                </span>
              )}
              {!alert.enabled && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  <BellOff size={10} /> Paused
                </span>
              )}
              <span className="text-[10px] text-slate-400">
                {new Date(alert.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
