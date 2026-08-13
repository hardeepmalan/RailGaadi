'use client';

import { useState, useEffect } from 'react';
import { Code, Settings, User, Shield, Info } from 'lucide-react';


export default function ProfilePageClient() {
  const [lowData, setLowData] = useState(false);
  const [vibe, setVibe] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLowData(localStorage.getItem('railgaadi_low_data') === 'true');
      setVibe(localStorage.getItem('railgaadi_vibrate') !== 'false');
    }
  }, []);

  const toggleLowData = (val: boolean) => {
    setLowData(val);
    localStorage.setItem('railgaadi_low_data', String(val));
  };

  const toggleVibe = (val: boolean) => {
    setVibe(val);
    localStorage.setItem('railgaadi_vibrate', String(val));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 px-5 pt-10 pb-8 border-b border-slate-800 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl font-bold mx-auto border-4 border-slate-900 shadow-xl">
            HM
          </div>
          <div>
            <h1 className="text-xl font-bold">Hardeep Malan</h1>
            <p className="text-xs text-blue-400 font-semibold tracking-wider uppercase mt-1">Owner & Lead Architect</p>
            <p className="text-slate-400 text-xs mt-2 max-w-xs mx-auto">
              RailGaadi is a premium journey companion built to make train travel across India transparent, offline-resilient, and smarter.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-6">
        {/* Settings Module */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Settings size={16} className="text-blue-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Preferences</h2>
          </div>

          <div className="space-y-4">
            {/* Low Data Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-200">Low Data Mode</div>
                <div className="text-[10px] text-slate-500">Reduces background coordinate sync & disables map imagery</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={lowData}
                  onChange={(e) => toggleLowData(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white" />
              </label>
            </div>

            {/* Haptic Alerts Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-200">Haptic/Vibration Alerts</div>
                <div className="text-[10px] text-slate-500">Vibrate device on reaching next station or destination</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={vibe}
                  onChange={(e) => toggleVibe(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white" />
              </label>
            </div>
          </div>
        </section>

        {/* Developer Info Profile Card */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Code size={16} className="text-emerald-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">About the Project</h2>
          </div>

          <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
            <p>
              This app is designed and maintained by <strong className="text-slate-200">Hardeep Malan</strong>. It delivers complete offline schedules, live navigation timelines, alerts, and platform layouts.
            </p>
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div>
                <div className="text-[10px] uppercase text-slate-500 font-bold">App Version</div>
                <div className="text-xs font-semibold text-slate-300">RailGaadi V2.0.0 (Release-Ready)</div>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold border border-emerald-900 py-0.5 px-2 rounded-md">
                Production
              </span>
            </div>
          </div>
        </section>

        {/* Creator Footer attribution */}
        <footer className="text-center pt-4">
          <div className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            Designed & Developed with ♥ by Hardeep Malan
          </div>
          <div className="text-[9px] text-slate-700 mt-1 font-mono">
            © 2026 RailGaadi Inc. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
