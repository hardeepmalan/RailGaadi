'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Train, ZoomIn, ZoomOut, LayoutGrid, CheckCircle2, Armchair, Sparkles, BedDouble, Zap, ShieldCheck, Compass, Info, Check, ChevronRight } from 'lucide-react';
import { findOrGenerateTrain } from '@/data/trains';
import { clsx } from 'clsx';

interface CoachDef {
  id: string;
  label: string;
  type: 'loco' | 'general' | 'sleeper' | 'ac3' | 'ac2' | 'ac1' | 'pantry' | 'chair';
  className: string;
  totalSeats: number;
  amenities: string[];
}

function getCoachesForTrain(trainNumber: string, trainType: string): CoachDef[] {
  if (trainType === 'rajdhani') {
    return [
      { id: 'LOCO', label: 'LOCO', type: 'loco', className: 'WAP-7 Engine', totalSeats: 0, amenities: ['WAP-7 6000HP', 'Electric Locomotive', 'Bi-Directional Driver Cab'] },
      { id: 'EOG1', label: 'EOG', type: 'general', className: 'Generator Car', totalSeats: 0, amenities: ['500kVA Power Car', 'Luggage Van'] },
      { id: 'H1', label: 'H1', type: 'ac1', className: '1st AC Coupe', totalSeats: 24, amenities: ['AC 1st Class', 'Lockable Cabins', 'Personal Reading Lamps', 'Complimentary Bedding'] },
      { id: 'A1', label: 'A1', type: 'ac2', className: '2nd AC Bunk', totalSeats: 52, amenities: ['AC 2-Tier', 'Privacy Curtains', 'Individual Charging Sockets'] },
      { id: 'A2', label: 'A2', type: 'ac2', className: '2nd AC Bunk', totalSeats: 52, amenities: ['AC 2-Tier', 'Privacy Curtains', 'Individual Charging Sockets'] },
      { id: 'B1', label: 'B1', type: 'ac3', className: '3rd AC Economy', totalSeats: 64, amenities: ['AC 3-Tier', 'Padded Mattress', 'Reading Lights'] },
      { id: 'B2', label: 'B2', type: 'ac3', className: '3rd AC Economy', totalSeats: 64, amenities: ['AC 3-Tier', 'Padded Mattress', 'Reading Lights'] },
      { id: 'B3', label: 'B3', type: 'ac3', className: '3rd AC Economy', totalSeats: 64, amenities: ['AC 3-Tier', 'Padded Mattress', 'Reading Lights'] },
      { id: 'B4', label: 'B4', type: 'ac3', className: '3rd AC Economy', totalSeats: 64, amenities: ['AC 3-Tier', 'Padded Mattress', 'Reading Lights'] },
      { id: 'PC', label: 'PC', type: 'pantry', className: 'Pantry Car', totalSeats: 0, amenities: ['Hot Kitchen Counter', 'IRCTC Fresh Meals', 'Cold Drinks'] },
      { id: 'B5', label: 'B5', type: 'ac3', className: '3rd AC Economy', totalSeats: 64, amenities: ['AC 3-Tier', 'Padded Mattress'] },
      { id: 'B6', label: 'B6', type: 'ac3', className: '3rd AC Economy', totalSeats: 64, amenities: ['AC 3-Tier', 'Padded Mattress'] },
      { id: 'EOG2', label: 'EOG', type: 'general', className: 'Generator Car', totalSeats: 0, amenities: ['Power Car', 'Guard Compartment'] },
    ];
  }

  if (trainType === 'vande_bharat') {
    return [
      { id: 'LOCO1', label: 'DTC1', type: 'loco', className: 'Aero Driver Cab', totalSeats: 44, amenities: ['Aerodynamic Nose', 'CCTV Security', 'Emergency Brakes'] },
      { id: 'EC1', label: 'EC1', type: 'ac1', className: 'Executive Chair', totalSeats: 52, amenities: ['180° Rotating Seats', 'Personal Audio Screen', 'On-Board Wi-Fi'] },
      { id: 'C1', label: 'C1', type: 'chair', className: 'Chair Car', totalSeats: 78, amenities: ['Ergonomic Reclining Seats', 'Automatic Gangway Doors', 'Footrests'] },
      { id: 'C2', label: 'C2', type: 'chair', className: 'Chair Car', totalSeats: 78, amenities: ['Ergonomic Reclining Seats', 'Automatic Gangway Doors'] },
      { id: 'C3', label: 'C3', type: 'chair', className: 'Chair Car', totalSeats: 78, amenities: ['Ergonomic Reclining Seats', 'Automatic Gangway Doors'] },
      { id: 'C4', label: 'C4', type: 'chair', className: 'Chair Car', totalSeats: 78, amenities: ['Ergonomic Reclining Seats', 'Automatic Gangway Doors'] },
      { id: 'LOCO2', label: 'DTC2', type: 'loco', className: 'Aero Driver Cab', totalSeats: 44, amenities: ['Driver Control Cab'] },
    ];
  }

  return [
    { id: 'LOCO', label: 'LOCO', type: 'loco', className: 'WAP-7 Engine', totalSeats: 0, amenities: ['WAP-7 Electric Loco 6000HP'] },
    { id: 'SLR1', label: 'SLR', type: 'general', className: 'Guard / Luggage', totalSeats: 30, amenities: ['Guard Van', 'Divyangjan Friendly Coupe'] },
    { id: 'GS1', label: 'GS1', type: 'general', className: 'General Unreserved', totalSeats: 90, amenities: ['General Cushioned Benches'] },
    { id: 'S1', label: 'S1', type: 'sleeper', className: 'Sleeper Class', totalSeats: 72, amenities: ['Non-AC Sleeper', '3-Tier Bunks', 'Cushioned Bed', 'Mobile Socket'] },
    { id: 'S2', label: 'S2', type: 'sleeper', className: 'Sleeper Class', totalSeats: 72, amenities: ['Non-AC Sleeper', '3-Tier Bunks', 'Cushioned Bed', 'Mobile Socket'] },
    { id: 'S3', label: 'S3', type: 'sleeper', className: 'Sleeper Class', totalSeats: 72, amenities: ['Non-AC Sleeper', '3-Tier Bunks', 'Cushioned Bed', 'Mobile Socket'] },
    { id: 'S4', label: 'S4', type: 'sleeper', className: 'Sleeper Class', totalSeats: 72, amenities: ['Non-AC Sleeper', '3-Tier Bunks', 'Cushioned Bed', 'Mobile Socket'] },
    { id: 'S5', label: 'S5', type: 'sleeper', className: 'Sleeper Class', totalSeats: 72, amenities: ['Non-AC Sleeper', '3-Tier Bunks', 'Cushioned Bed', 'Mobile Socket'] },
    { id: 'PC', label: 'PC', type: 'pantry', className: 'Pantry Car', totalSeats: 0, amenities: ['Hot Kitchen Counter', 'Meals Service'] },
    { id: 'B1', label: 'B1', type: 'ac3', className: '3rd AC Bunk', totalSeats: 64, amenities: ['AC 3-Tier', 'Individual Reading Lights', 'Bedding Kit'] },
    { id: 'B2', label: 'B2', type: 'ac3', className: '3rd AC Bunk', totalSeats: 64, amenities: ['AC 3-Tier', 'Individual Reading Lights', 'Bedding Kit'] },
    { id: 'B3', label: 'B3', type: 'ac3', className: '3rd AC Bunk', totalSeats: 64, amenities: ['AC 3-Tier', 'Individual Reading Lights', 'Bedding Kit'] },
    { id: 'A1', label: 'A1', type: 'ac2', className: '2nd AC Bunk', totalSeats: 52, amenities: ['AC 2-Tier', 'Privacy Curtains', 'Charging Sockets'] },
    { id: 'H1', label: 'H1', type: 'ac1', className: '1st AC Coupe', totalSeats: 24, amenities: ['AC 1st Class', 'Lockable Cabins & Coupes'] },
    { id: 'GS2', label: 'GS2', type: 'general', className: 'General Unreserved', totalSeats: 90, amenities: ['General Benches'] },
    { id: 'SLR2', label: 'SLR', type: 'general', className: 'Guard / Luggage', totalSeats: 30, amenities: ['Guard Compartment'] },
  ];
}

const COACH_THEME_COLORS: Record<string, { bg: string; border: string; text: string; badge: string; gradient: string }> = {
  loco: { bg: 'from-slate-800 to-slate-900', border: 'border-slate-700', text: 'text-amber-400', badge: 'bg-slate-800 text-amber-300 border-slate-700', gradient: 'from-slate-900 to-slate-800' },
  general: { bg: 'from-amber-500 to-orange-600', border: 'border-amber-400', text: 'text-white', badge: 'bg-amber-100 text-amber-800 border-amber-300', gradient: 'from-amber-50 to-orange-50' },
  sleeper: { bg: 'from-blue-600 to-indigo-700', border: 'border-blue-500', text: 'text-white', badge: 'bg-blue-100 text-blue-800 border-blue-300', gradient: 'from-blue-50 to-indigo-50' },
  ac3: { bg: 'from-teal-600 to-emerald-700', border: 'border-teal-500', text: 'text-white', badge: 'bg-teal-100 text-teal-800 border-teal-300', gradient: 'from-teal-50 to-emerald-50' },
  ac2: { bg: 'from-indigo-600 to-purple-700', border: 'border-indigo-500', text: 'text-white', badge: 'bg-indigo-100 text-indigo-800 border-indigo-300', gradient: 'from-indigo-50 to-purple-50' },
  ac1: { bg: 'from-purple-600 to-pink-700', border: 'border-purple-500', text: 'text-white', badge: 'bg-purple-100 text-purple-800 border-purple-300', gradient: 'from-purple-50 to-pink-50' },
  pantry: { bg: 'from-orange-500 to-amber-600', border: 'border-orange-400', text: 'text-white', badge: 'bg-orange-100 text-orange-800 border-orange-300', gradient: 'from-orange-50 to-amber-50' },
  chair: { bg: 'from-cyan-600 to-blue-700', border: 'border-cyan-500', text: 'text-white', badge: 'bg-cyan-100 text-cyan-800 border-cyan-300', gradient: 'from-cyan-50 to-blue-50' },
};

/**
 * High-Fidelity Interactive Compartment & Berth Ticket Visualizer
 */
function RealRailwayInteriorMap({ coach }: { coach: CoachDef }) {
  const [selectedBerth, setSelectedBerth] = useState<number>(7);

  if (coach.type === 'loco' || coach.type === 'pantry') {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-md">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-3">
          <Train size={32} className="text-amber-600" />
        </div>
        <h4 className="font-bold text-lg text-slate-800">{coach.label} — {coach.className}</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">This compartment houses heavy machinery and IRCTC pantry kitchen equipment. No passenger berth seating available.</p>
      </div>
    );
  }

  // Chair Car Seating Layout
  if (coach.type === 'chair') {
    const rows = Array.from({ length: 15 }, (_, r) => r + 1);
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                <Armchair size={18} />
              </div>
              <h4 className="font-bold text-base text-slate-900">
                Reclining Chair Car Layout ({coach.label})
              </h4>
            </div>
            <p className="text-xs text-slate-500 mt-1">2 x 3 Seating Rows with Central Air-Conditioned Walking Aisle</p>
          </div>
          <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl shadow-2xs">
            78 Seats
          </span>
        </div>

        {/* Chair Car Rows Diagram */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3 overflow-x-auto">
          {rows.map(rowNum => {
            const start = (rowNum - 1) * 5 + 1;
            return (
              <div key={rowNum} className="flex items-center justify-between gap-3 min-w-max bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-mono font-bold text-slate-400 w-12 text-center">Row {rowNum}</span>
                
                {/* Left 2 Seats */}
                <div className="flex gap-2">
                  {[start, start + 1].map(seatNum => {
                    if (seatNum > 78) return null;
                    const isSelected = selectedBerth === seatNum;
                    const isWindow = (seatNum % 5 === 1);
                    return (
                      <button
                        key={seatNum}
                        onClick={() => setSelectedBerth(seatNum)}
                        className={clsx(
                          'w-12 h-12 rounded-xl border flex flex-col items-center justify-center transition-all duration-200',
                          isSelected
                            ? 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white font-black border-blue-600 shadow-lg scale-105 ring-2 ring-blue-400/50'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                        )}
                      >
                        <span className="text-xs font-bold">{seatNum}</span>
                        <span className="text-[9px] font-semibold opacity-80">{isWindow ? '🪟 WS' : 'AS'}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Central Walking Aisle */}
                <div className="flex-1 text-center font-mono text-[10px] text-slate-400 font-bold border-x border-slate-200/80 px-6">
                  CENTRAL AISLE PATH 🚶‍♂️
                </div>

                {/* Right 3 Seats */}
                <div className="flex gap-2">
                  {[start + 2, start + 3, start + 4].map(seatNum => {
                    if (seatNum > 78) return null;
                    const isSelected = selectedBerth === seatNum;
                    const isWindow = (seatNum % 5 === 0);
                    const isMiddle = (seatNum % 5 === 4);
                    return (
                      <button
                        key={seatNum}
                        onClick={() => setSelectedBerth(seatNum)}
                        className={clsx(
                          'w-12 h-12 rounded-xl border flex flex-col items-center justify-center transition-all duration-200',
                          isSelected
                            ? 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white font-black border-blue-600 shadow-lg scale-105 ring-2 ring-blue-400/50'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                        )}
                      >
                        <span className="text-xs font-bold">{seatNum}</span>
                        <span className="text-[9px] font-semibold opacity-80">{isWindow ? '🪟 WS' : isMiddle ? 'MS' : 'AS'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Sleeper & AC Bunk Compartment Layout
  const totalBerths = coach.totalSeats || 72;
  const berthsPerBay = coach.type === 'ac2' ? 6 : coach.type === 'ac1' ? 4 : 8;
  const totalBays = Math.ceil(totalBerths / berthsPerBay);

  const getBerthDetails = (seatNum: number) => {
    if (coach.type === 'ac1') {
      return seatNum % 2 === 1
        ? { name: 'Lower Berth', code: 'LB', color: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100', badgeCls: 'bg-emerald-600 text-white' }
        : { name: 'Upper Berth', code: 'UB', color: 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100', badgeCls: 'bg-blue-600 text-white' };
    }

    if (coach.type === 'ac2') {
      const m = seatNum % 6;
      if (m === 1 || m === 3) return { name: 'Lower Berth', code: 'LB', color: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100', badgeCls: 'bg-emerald-600 text-white' };
      if (m === 2 || m === 4) return { name: 'Upper Berth', code: 'UB', color: 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100', badgeCls: 'bg-blue-600 text-white' };
      if (m === 5) return { name: 'Side Lower', code: 'SL', color: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100', badgeCls: 'bg-amber-600 text-white' };
      return { name: 'Side Upper', code: 'SU', color: 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100', badgeCls: 'bg-rose-600 text-white' };
    }

    // Sleeper & 3rd AC
    const m = seatNum % 8;
    if (m === 1 || m === 4) return { name: 'Lower Berth', code: 'LB', color: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100', badgeCls: 'bg-emerald-600 text-white' };
    if (m === 2 || m === 5) return { name: 'Middle Berth', code: 'MB', color: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100', badgeCls: 'bg-amber-600 text-white' };
    if (m === 3 || m === 6) return { name: 'Upper Berth', code: 'UB', color: 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100', badgeCls: 'bg-blue-600 text-white' };
    if (m === 7) return { name: 'Side Lower', code: 'SL', color: 'bg-orange-50 text-orange-800 border-orange-300 hover:bg-orange-100', badgeCls: 'bg-orange-600 text-white' };
    return { name: 'Side Upper', code: 'SU', color: 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100', badgeCls: 'bg-rose-600 text-white' };
  };

  const selectedInfo = selectedBerth ? getBerthDetails(selectedBerth) : null;
  const selectedBayNum = selectedBerth ? Math.ceil(selectedBerth / berthsPerBay) : 1;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <BedDouble size={18} />
            </div>
            <h4 className="font-bold text-base text-slate-900">
              Indian Railways Interior Compartment ({coach.label})
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-1">6-Berth Main Coupe (Cabin) + Central Walking Aisle + 2 Side-Berths</p>
        </div>
        <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-3.5 py-1.5 rounded-xl shadow-2xs">
          {totalBerths} Berths ({totalBays} Bays)
        </span>
      </div>

      {/* Colour Legend */}
      <div className="flex flex-wrap gap-2 text-[11px] font-semibold bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-600" /> LB: Lower Berth
        </span>
        <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-600" /> MB: Middle Berth
        </span>
        <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-600" /> UB: Upper Berth
        </span>
        <span className="bg-orange-100 text-orange-800 border border-orange-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-600" /> SL: Side Lower
        </span>
        <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-600" /> SU: Side Upper
        </span>
      </div>

      {/* Door & Washbasin End */}
      <div className="flex justify-between items-center bg-slate-100 px-4 py-2.5 rounded-2xl text-xs font-mono font-bold text-slate-600 border border-slate-200">
        <span className="flex items-center gap-1">🚪 Entry Door & Toilet</span>
        <span className="text-blue-600 flex items-center gap-1">🪟 Windows & Exterior Wall</span>
        <span className="flex items-center gap-1">🚪 Washbasin & Exit</span>
      </div>

      {/* Compartments / Bays List */}
      <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
        {Array.from({ length: totalBays }, (_, bayIdx) => {
          const bayNum = bayIdx + 1;
          const startNum = bayIdx * berthsPerBay + 1;

          let mainCoupeLeft: number[] = [];
          let mainCoupeRight: number[] = [];
          let sideBerths: number[] = [];

          if (coach.type === 'ac2') {
            mainCoupeLeft = [startNum, startNum + 1];
            mainCoupeRight = [startNum + 2, startNum + 3];
            sideBerths = [startNum + 4, startNum + 5];
          } else {
            mainCoupeLeft = [startNum, startNum + 1, startNum + 2];
            mainCoupeRight = [startNum + 3, startNum + 4, startNum + 5];
            sideBerths = [startNum + 6, startNum + 7];
          }

          return (
            <div key={bayNum} className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-blue-700 border-b border-slate-200 pb-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">#{bayNum}</span>
                  BAY COMPARTMENT #{bayNum} (Berths {startNum} – {Math.min(startNum + berthsPerBay - 1, totalBerths)})
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Train Exterior Window 🪟</span>
              </div>

              {/* Bay Visual Box */}
              <div className="grid grid-cols-12 gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                {/* 1. Main 6-Berth Coupe */}
                <div className="col-span-8 bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 space-y-2.5">
                  <div className="text-[10px] font-mono font-bold text-slate-400 text-center uppercase tracking-wide">
                    MAIN COUPE (CABIN BUNK STACK)
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Left Bunks */}
                    <div className="space-y-2 bg-white p-2 rounded-xl border border-slate-200/80">
                      <div className="text-[9px] font-mono text-slate-400 text-center font-bold">LEFT BUNKS</div>
                      {mainCoupeLeft.map(seatNum => {
                        if (seatNum > totalBerths) return null;
                        const info = getBerthDetails(seatNum);
                        const isSelected = selectedBerth === seatNum;
                        return (
                          <button
                            key={seatNum}
                            onClick={() => setSelectedBerth(seatNum)}
                            className={clsx(
                              'w-full py-2.5 px-3 rounded-xl border flex items-center justify-between text-xs font-mono transition-all duration-200',
                              isSelected
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black border-blue-600 shadow-md scale-105 ring-2 ring-blue-300'
                                : `${info.color}`
                            )}
                          >
                            <span className="font-bold">Berth #{seatNum}</span>
                            <span className={clsx('text-[10px] font-extrabold px-1.5 py-0.5 rounded-md', isSelected ? 'bg-white/20 text-white' : info.badgeCls)}>
                              {info.code}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Bunks */}
                    <div className="space-y-2 bg-white p-2 rounded-xl border border-slate-200/80">
                      <div className="text-[9px] font-mono text-slate-400 text-center font-bold">RIGHT BUNKS</div>
                      {mainCoupeRight.map(seatNum => {
                        if (seatNum > totalBerths) return null;
                        const info = getBerthDetails(seatNum);
                        const isSelected = selectedBerth === seatNum;
                        return (
                          <button
                            key={seatNum}
                            onClick={() => setSelectedBerth(seatNum)}
                            className={clsx(
                              'w-full py-2.5 px-3 rounded-xl border flex items-center justify-between text-xs font-mono transition-all duration-200',
                              isSelected
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black border-blue-600 shadow-md scale-105 ring-2 ring-blue-300'
                                : `${info.color}`
                            )}
                          >
                            <span className="font-bold">Berth #{seatNum}</span>
                            <span className={clsx('text-[10px] font-extrabold px-1.5 py-0.5 rounded-md', isSelected ? 'bg-white/20 text-white' : info.badgeCls)}>
                              {info.code}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Central Walking Aisle */}
                <div className="col-span-1 border-x border-dashed border-slate-300 flex items-center justify-center">
                  <span className="writing-mode-vertical text-[9px] font-mono font-bold text-slate-400 tracking-widest uppercase">
                    AISLE 🚶‍♂️
                  </span>
                </div>

                {/* 3. Side Berths */}
                <div className="col-span-3 bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 space-y-2">
                  <div className="text-[9px] font-mono font-bold text-blue-600 text-center uppercase tracking-wide">
                    SIDE BERTHS
                  </div>
                  {sideBerths.map(seatNum => {
                    if (seatNum > totalBerths) return null;
                    const info = getBerthDetails(seatNum);
                    const isSelected = selectedBerth === seatNum;
                    return (
                      <button
                        key={seatNum}
                        onClick={() => setSelectedBerth(seatNum)}
                        className={clsx(
                          'w-full py-3 px-3 rounded-xl border flex items-center justify-between text-xs font-mono transition-all duration-200',
                          isSelected
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black border-blue-600 shadow-md scale-105 ring-2 ring-blue-300'
                            : `${info.color}`
                        )}
                      >
                        <span className="font-bold">#{seatNum}</span>
                        <span className={clsx('text-[10px] font-extrabold px-1.5 py-0.5 rounded-md', isSelected ? 'bg-white/20 text-white' : info.badgeCls)}>
                          {info.code}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Berth Boarding Pass Ticket Preview */}
      {selectedBerth && selectedInfo && (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl p-4 shadow-xl border border-blue-400/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white text-blue-700 font-mono font-black flex flex-col items-center justify-center shadow-md">
              <span className="text-[9px] uppercase font-bold text-slate-500">Berth</span>
              <span className="text-xl leading-none">{selectedBerth}</span>
            </div>
            <div>
              <div className="text-xs text-blue-100 font-semibold flex items-center gap-1">
                <Sparkles size={13} className="text-amber-300" /> Selected Berth Allocation
              </div>
              <div className="font-black text-lg text-white">{selectedInfo.name} ({selectedInfo.code})</div>
              <div className="text-xs text-blue-100 font-medium">
                Bay #{selectedBayNum} · Coach {coach.label} ({coach.className})
              </div>
            </div>
          </div>

          <div className="text-right space-y-1">
            <span className="inline-block text-xs bg-white text-blue-800 font-black px-3 py-1 rounded-xl shadow-xs">
              {selectedInfo.code}
            </span>
            <div className="text-[10px] text-blue-100 flex items-center gap-1 justify-end">
              <Zap size={10} className="text-amber-300" /> Mobile Socket Available
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CoachPageInner() {
  const searchParams = useSearchParams();
  const highlightCoach = searchParams.get('highlight');
  const trainParam = searchParams.get('train') || '12951';

  const [trainNumber, setTrainNumber] = useState(trainParam);
  const [activeTrain, setActiveTrain] = useState<any>(() => findOrGenerateTrain(trainParam));
  const [selectedCoach, setSelectedCoach] = useState<CoachDef | null>(null);
  const [zoom, setZoom] = useState(1);

  const coaches = getCoachesForTrain(activeTrain.number, activeTrain.type);

  useEffect(() => {
    if (highlightCoach) {
      const found = coaches.find(c => c.label === highlightCoach);
      if (found) setSelectedCoach(found);
    } else if (coaches.length > 3) {
      const defaultSel = coaches.find(c => c.type === 'ac3' || c.type === 'sleeper') || coaches[3];
      setSelectedCoach(defaultSel);
    }
  }, [highlightCoach, activeTrain]);

  const handleSearch = () => {
    if (!trainNumber.trim()) return;
    const t = findOrGenerateTrain(trainNumber.trim());
    setActiveTrain(t);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Signature Unified Brand Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white px-5 pt-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
                <LayoutGrid size={22} />
                Coach Position & Seat Map
              </h1>
              <p className="text-blue-100 text-sm">Interactive train layout with real 6-berth main coupe & side-berth diagrams</p>
            </div>
            <span className="text-xs bg-white/20 text-white border border-white/30 px-3 py-1 rounded-full font-mono font-semibold">
              RailGaadi 2.0
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-5 space-y-4">
        {/* Search Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xl">
          <div className="flex gap-2">
            <input
              id="coach-train-search-input"
              type="text"
              value={trainNumber}
              onChange={e => setTrainNumber(e.target.value.toUpperCase())}
              placeholder="Enter Train Number (e.g. 12951, 12301, 22436, 12560)..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
            >
              <Train size={16} /> View Layout
            </button>
          </div>

          {/* Quick Select Buttons */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex-shrink-0">Quick Trains:</span>
            {[
              { num: '12951', name: 'Mumbai Rajdhani' },
              { num: '12301', name: 'Howrah Rajdhani' },
              { num: '22436', name: 'Vande Bharat' },
              { num: '12560', name: 'Shiv Ganga Exp' },
              { num: '12002', name: 'Bhopal Shatabdi' },
              { num: '12627', name: 'Karnataka Exp' },
            ].map(t => (
              <button
                key={t.num}
                onClick={() => {
                  setTrainNumber(t.num);
                  setActiveTrain(findOrGenerateTrain(t.num));
                }}
                className={clsx(
                  'text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all flex-shrink-0',
                  activeTrain.number === t.num
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                )}
              >
                #{t.num} {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Train Info Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-mono font-black text-blue-700 text-base">
              #{activeTrain.number}
            </div>
            <div>
              <div className="font-bold text-base text-slate-900">{activeTrain.name}</div>
              <div className="text-xs text-slate-500 font-medium">
                {activeTrain.from} ({activeTrain.fromCode}) → {activeTrain.to} ({activeTrain.toCode}) · {coaches.length} Coaches
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(z => Math.max(0.7, z - 0.1))} className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600"><ZoomOut size={16} /></button>
            <span className="text-xs font-mono text-slate-500 font-bold">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(1.4, z + 0.1))} className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600"><ZoomIn size={16} /></button>
          </div>
        </div>

        {/* Train Composition Visualizer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1 font-bold text-blue-600"><Train size={14} /> Engine End (Front)</span>
            <span>Scroll horizontally to view full train composition ➔</span>
            <span>Rear End</span>
          </div>

          <div className="overflow-x-auto pb-4 pt-2">
            <div
              className="flex items-center gap-2 min-w-max px-2 py-4"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'left center', transition: 'transform 0.2s ease' }}
            >
              {coaches.map((coach, idx) => {
                const isSelected = selectedCoach?.id === coach.id;
                const isHighlighted = highlightCoach && coach.label === highlightCoach;
                const colors = COACH_THEME_COLORS[coach.type] || COACH_THEME_COLORS.sleeper;

                return (
                  <div
                    key={coach.id}
                    onClick={() => setSelectedCoach(coach)}
                    className={clsx(
                      'relative flex flex-col items-center cursor-pointer transition-all duration-200 select-none group',
                      isSelected ? 'scale-105 z-20' : 'hover:scale-102'
                    )}
                  >
                    {/* Highlight Badge */}
                    {isHighlighted && (
                      <div className="absolute -top-7 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md border border-amber-400 whitespace-nowrap animate-bounce">
                        YOUR COACH
                      </div>
                    )}

                    {/* Coach Car Body */}
                    <div className={clsx(
                      'relative w-24 h-16 rounded-xl border-2 bg-gradient-to-b flex flex-col items-center justify-between p-1.5 shadow-sm transition-all',
                      colors.bg, colors.border,
                      isSelected ? 'ring-4 ring-blue-500/40 border-blue-600 shadow-md' : 'opacity-90 hover:opacity-100'
                    )}>
                      {/* Windows Line */}
                      <div className="w-full flex items-center justify-between px-1 mt-0.5">
                        <div className="w-3.5 h-2 rounded-xs bg-white/60 border border-current/20" />
                        <div className="w-3.5 h-2 rounded-xs bg-white/60 border border-current/20" />
                        <div className="w-3.5 h-2 rounded-xs bg-white/60 border border-current/20" />
                      </div>

                      {/* Coach Title */}
                      <div className="text-center my-auto">
                        <div className={clsx('font-black text-sm leading-tight tracking-wider', colors.text)}>
                          {coach.label}
                        </div>
                        <div className="text-[8px] font-bold opacity-80 uppercase">
                          {coach.className}
                        </div>
                      </div>

                      {/* Doors */}
                      <div className="w-full flex items-center justify-between px-0.5">
                        <div className="w-1.5 h-3 bg-white/30 rounded-xs" />
                        <div className="h-0.5 flex-1 mx-1 bg-white/30 rounded-full" />
                        <div className="w-1.5 h-3 bg-white/30 rounded-xs" />
                      </div>
                    </div>

                    {/* Bogie Wheels */}
                    <div className="w-full flex items-center justify-between px-2 mt-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-slate-400 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-slate-600" />
                      </div>
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-slate-400 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-slate-600" />
                      </div>
                    </div>

                    {/* Position Number */}
                    <span className="text-[10px] font-mono font-bold text-slate-400 mt-1">
                      #{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Steel Track Line */}
          <div className="h-2 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-full mx-2 border border-slate-300" />
        </div>

        {/* Selected Coach Real Railway Interior Layout */}
        {selectedCoach && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="text-xs text-blue-600 font-bold uppercase tracking-wider">Selected Coach Composition</div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCoach.label} — {selectedCoach.className}</h3>
                  <p className="text-xs text-slate-500 font-medium">Position #{coaches.findIndex(c => c.id === selectedCoach.id) + 1} from Engine</p>
                </div>
                <span className={clsx('text-xs font-bold px-3 py-1 rounded-lg border', (COACH_THEME_COLORS[selectedCoach.type] || COACH_THEME_COLORS.sleeper).badge)}>
                  {selectedCoach.type.toUpperCase()}
                </span>
              </div>

              {/* Amenities */}
              {selectedCoach.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedCoach.amenities.map(a => (
                    <span key={a} className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-blue-600" /> {a}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Render Interior Compartment Layout */}
            <RealRailwayInteriorMap coach={selectedCoach} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function CoachPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">Loading coach position...</div>}>
      <CoachPageInner />
    </Suspense>
  );
}
