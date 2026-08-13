'use client';

import { useState } from 'react';
import { ShieldAlert, RefreshCw, FileText, CheckCircle2, Train, MapPin, User, Clock, ArrowRight, ChevronRight, AlertTriangle, Sparkles, Check } from 'lucide-react';
import { PNRStatus } from '@/types';
import { clsx } from 'clsx';

const STATUS_COLORS: Record<string, string> = {
  CNF: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  RAC: 'bg-amber-100 text-amber-800 border-amber-300',
  WL: 'bg-rose-100 text-rose-800 border-rose-300',
  CAN: 'bg-slate-100 text-slate-600 border-slate-300',
  GNWL: 'bg-rose-100 text-rose-800 border-rose-300',
  RLWL: 'bg-orange-100 text-orange-800 border-orange-300',
  PQWL: 'bg-orange-100 text-orange-800 border-orange-300',
  TQWL: 'bg-purple-100 text-purple-800 border-purple-300',
};

function getStatusStyle(status: string): string {
  const key = Object.keys(STATUS_COLORS).find(k => status?.toUpperCase().startsWith(k));
  return key ? STATUS_COLORS[key] : 'bg-blue-100 text-blue-800 border-blue-300';
}

function getStatusEmoji(status: string): string {
  if (!status) return '❓';
  const s = status.toUpperCase();
  if (s.startsWith('CNF')) return '✅';
  if (s.startsWith('RAC')) return '🟡';
  if (s.startsWith('WL') || s.startsWith('GNWL') || s.startsWith('RLWL')) return '🔴';
  if (s.startsWith('CAN')) return '❌';
  return '🔵';
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold shadow-2xs', getStatusStyle(status))}>
      {getStatusEmoji(status)} {status}
    </span>
  );
}

function BookingTimeline({ chartPrepared }: { chartPrepared?: boolean }) {
  const steps = [
    { id: 'booking', label: 'Ticket Booked', done: true },
    { id: 'chart', label: 'Chart Prep', done: !!chartPrepared },
    { id: 'current', label: 'Current Status', done: true },
    { id: 'final', label: 'Boarding Ready', done: !!chartPrepared },
  ];

  return (
    <div className="flex items-center justify-between w-full max-w-sm mx-auto py-2">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={clsx(
              'w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all shadow-2xs',
              step.done ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-400'
            )}>
              {step.done ? <Check size={14} /> : i + 1}
            </div>
            <div className={clsx('text-[10px] font-bold mt-1 text-center max-w-[56px] leading-tight', step.done ? 'text-blue-700' : 'text-slate-400')}>
              {step.label}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className={clsx('h-1 w-8 sm:w-12 mx-1 rounded-full transition-colors', steps[i + 1].done ? 'bg-blue-600' : 'bg-slate-200')} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function PNRPageClient() {
  const [pnr, setPnr] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<PNRStatus | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPnr = pnr.trim().replace(/\D/g, '');
    if (cleanPnr.length !== 10) {
      setError('Please enter a valid 10-digit numeric PNR number.');
      return;
    }

    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const res = await fetch(`/api/pnr?pnr=${cleanPnr}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to check PNR status.');
      }
      setStatus(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching PNR status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Signature Brand Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-800 text-white px-5 pt-8 pb-10 text-center shadow-md">
        <div className="max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white border border-white/30 text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-xs">
            <Sparkles size={13} className="text-amber-300" /> PNR Status Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">Check PNR Booking Status</h1>
          <p className="text-blue-100 text-xs sm:text-sm">Get live passenger seat allocations, chart preparation, and coach details</p>
        </div>
      </div>

      {/* Centered Container */}
      <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
        {/* Input Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-5">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="pnr-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Enter 10-Digit PNR Number
              </label>
              <input
                id="pnr-input"
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={pnr}
                onChange={(e) => setPnr(e.target.value.replace(/\D/g, ''))}
                placeholder="PNR Number (e.g. 4234567890)"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-slate-900 text-lg outline-none focus:border-blue-500 font-mono tracking-widest font-bold"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-red-700 text-xs flex gap-2 items-start">
                <ShieldAlert size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={pnr.length !== 10 || loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-extrabold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              {loading ? (
                <><RefreshCw size={16} className="animate-spin" /> Fetching Live Status…</>
              ) : (
                'Check PNR Status'
              )}
            </button>
          </form>
        </div>

        {/* Results Card */}
        {status && (
          <div className="space-y-4 animate-fade-in">
            {/* Journey Details */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-blue-200 font-bold uppercase">PNR Number</div>
                    <div className="font-black text-2xl tracking-wider font-mono">{status.pnr}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-blue-200 font-bold uppercase">Journey Date</div>
                    <div className="font-extrabold text-white text-base">{status.journeyDate || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Train Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 flex-shrink-0">
                    <Train size={22} />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-base">{status.trainName || 'Express Train'}</div>
                    <div className="text-xs font-mono font-bold text-blue-600">Train #{status.trainNumber}</div>
                  </div>
                </div>

                {/* Station Route Pill */}
                <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <div className="text-center">
                    <div className="font-black text-blue-700 text-xl">{status.from?.code || '--'}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">{status.from?.name || 'From'}</div>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <ArrowRight size={18} className="text-blue-500" />
                  </div>
                  <div className="text-center">
                    <div className="font-black text-slate-800 text-xl">{status.to?.code || '--'}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">{status.to?.name || 'To'}</div>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2 text-center">Chart Preparation Status</div>
                  <BookingTimeline chartPrepared={status.chartPrepared} />
                </div>
              </div>
            </div>

            {/* Passenger List Card */}
            {status.passengers && status.passengers.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden space-y-0">
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-blue-600" />
                    <h3 className="font-extrabold text-sm text-slate-900">Passenger Seat Allocations</h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500">{status.passengers.length} Passenger{status.passengers.length > 1 ? 's' : ''}</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {status.passengers.map((p) => (
                    <div key={p.number} className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                          P{p.number}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">Passenger {p.number}</div>
                          {p.bookingStatus && (
                            <div className="text-[10px] text-slate-400 font-semibold">Booked: {p.bookingStatus}</div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <StatusBadge status={p.currentStatus || 'CNF'} />
                        {(p.coach || p.berth) && (
                          <div className="text-[11px] font-bold text-slate-600 mt-1 font-mono">
                            Coach: {p.coach} · Berth: {p.berth} ({p.berthType || 'Berth'})
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coach Redirect Link */}
                {status.passengers[0]?.coach && status.trainNumber && (
                  <div className="px-5 py-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
                    <a
                      href={`/coach?train=${status.trainNumber}&highlight=${status.passengers[0].coach}`}
                      className="flex items-center justify-between text-xs font-extrabold text-blue-700 hover:text-blue-900"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                          {status.passengers[0].coach}
                        </span>
                        View Coach {status.passengers[0].coach} 2D Berth Layout
                      </span>
                      <ChevronRight size={14} />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
