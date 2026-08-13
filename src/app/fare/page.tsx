'use client';

import { useState } from 'react';
import { Landmark, ArrowLeftRight, HelpCircle, Calculator, Check, ArrowRight, Compass, Sparkles, ShieldCheck, Ticket } from 'lucide-react';
import { StationSearchInput } from '@/components/search/StationSearchInput';
import { RailwayStation } from '@/types';
import { clsx } from 'clsx';

const CLASSES = [
  { code: 'SL', name: 'Sleeper Class', base: 0.8, color: 'bg-blue-100 text-blue-800 border-blue-300', icon: '🛏️' },
  { code: '3A', name: 'AC 3 Tier', base: 2.2, color: 'bg-teal-100 text-teal-800 border-teal-300', icon: '❄️' },
  { code: '2A', name: 'AC 2 Tier', base: 3.5, color: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: '🛋️' },
  { code: '1A', name: 'AC First Class', base: 5.5, color: 'bg-purple-100 text-purple-800 border-purple-300', icon: '👑' },
  { code: 'CC', name: 'AC Chair Car', base: 1.8, color: 'bg-cyan-100 text-cyan-800 border-cyan-300', icon: '🪑' },
  { code: 'EC', name: 'Exec Chair Car', base: 4.2, color: 'bg-amber-100 text-amber-800 border-amber-300', icon: '⚡' },
  { code: '2S', name: 'Second Seating', base: 0.4, color: 'bg-slate-100 text-slate-800 border-slate-300', icon: '🎫' },
];

export default function FarePage() {
  const [from, setFrom] = useState<RailwayStation | null>(null);
  const [to, setTo] = useState<RailwayStation | null>(null);
  const [cls, setCls] = useState('SL');
  const [passengers, setPassengers] = useState(1);
  const [customDist, setCustomDist] = useState<string>('');
  const [fare, setFare] = useState<{ base: number; resFee: number; sfCharge: number; total: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number>(0);

  const swap = () => {
    const tmp = from;
    setFrom(to);
    setTo(tmp);
    setFare(null);
  };

  const calculateFare = (e: React.FormEvent) => {
    e.preventDefault();
    let dist = 0;

    if (customDist.trim() && parseInt(customDist, 10) > 0) {
      dist = parseInt(customDist, 10);
    } else if (from && to) {
      const R = 6371;
      const dLat = ((to.latitude || 25) - (from.latitude || 25)) * Math.PI / 180;
      const dLon = ((to.longitude || 80) - (from.longitude || 80)) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos((from.latitude || 25) * Math.PI / 180) * Math.cos((to.latitude || 25) * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      dist = Math.max(50, Math.round(R * c * 1.15));
    } else {
      return;
    }

    setDistanceKm(dist);

    const clsMultiplier = CLASSES.find(c => c.code === cls)?.base || 0.8;
    const base = Math.round(50 + (dist * clsMultiplier));
    const resFee = cls.startsWith('1A') ? 60 : cls.startsWith('2A') ? 50 : cls.startsWith('3A') ? 40 : 20;
    const sfCharge = dist > 300 ? 40 : 20;
    const total = (base + resFee + sfCharge) * passengers;

    setFare({ base: base * passengers, resFee: resFee * passengers, sfCharge: sfCharge * passengers, total });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Signature Brand Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-800 text-white px-5 pt-8 pb-10 text-center shadow-md">
        <div className="max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white border border-white/30 text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-xs">
            <Sparkles size={13} className="text-amber-300" /> Ticket Price Estimator
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">Railway Fare Calculator</h1>
          <p className="text-blue-100 text-xs sm:text-sm">Calculate ticket fares, reservation charges, and slab breakdowns for any route</p>
        </div>
      </div>

      {/* Centered Container */}
      <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-5 space-y-4">
          <form onSubmit={calculateFare} className="space-y-4">
            <StationSearchInput
              id="fare-from"
              label="Departure Station (From)"
              placeholder="Type origin station..."
              value={from}
              onSelect={setFrom}
              onClear={() => { setFrom(null); setFare(null); }}
            />

            <div className="flex justify-center -my-1">
              <button
                type="button"
                onClick={swap}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 shadow-xs hover:rotate-180 transition-all duration-300"
              >
                <ArrowLeftRight size={18} />
              </button>
            </div>

            <StationSearchInput
              id="fare-to"
              label="Destination Station (To)"
              placeholder="Type destination station..."
              value={to}
              onSelect={setTo}
              onClear={() => { setTo(null); setFare(null); }}
            />

            {/* Custom Distance Optional */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Or Custom Distance (in KM)
              </label>
              <input
                type="number"
                placeholder="Optional (e.g. 450 km)"
                value={customDist}
                onChange={(e) => setCustomDist(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
              />
            </div>

            {/* Travel Class Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Select Travel Class
              </label>
              <div className="grid grid-cols-4 gap-2">
                {CLASSES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCls(c.code)}
                    className={clsx(
                      'py-2 px-2 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center gap-0.5',
                      cls === c.code
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                        : `${c.color} hover:shadow-xs`
                    )}
                  >
                    <span>{c.icon} {c.code}</span>
                    <span className="text-[9px] opacity-80 truncate max-w-[60px]">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Passengers Count */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Number of Passengers
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPassengers(num)}
                    className={clsx(
                      'flex-1 py-2 rounded-xl text-xs font-bold border transition-all',
                      passengers === num
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={(!from || !to) && !customDist}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-extrabold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Calculator size={18} /> Calculate Ticket Fare
            </button>
          </form>
        </div>

        {/* Fare Result Card */}
        {fare !== null && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase">Estimated Total Fare</div>
                <div className="text-3xl font-black text-slate-900 mt-0.5">₹{fare.total}</div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs">
                {passengers} Passenger{passengers > 1 ? 's' : ''} · {cls}
              </span>
            </div>

            {/* Price Breakdown Table */}
            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Approx Journey Distance</span>
                <span className="font-bold text-slate-800">~{distanceKm} km</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Base Ticket Rate</span>
                <span className="font-bold text-slate-800">₹{fare.base}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">IRCTC Reservation Fee</span>
                <span className="font-bold text-slate-800">₹{fare.resFee}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Superfast / Express Surcharge</span>
                <span className="font-bold text-slate-800">₹{fare.sfCharge}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-black text-blue-700">
                <span>Total Ticket Price</span>
                <span>₹{fare.total}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
