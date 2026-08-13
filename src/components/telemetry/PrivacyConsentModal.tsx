'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Lock, CheckCircle2, X, Mail, Sparkles, AlertCircle, Trash2, ShieldAlert } from 'lucide-react';
import { getTelemetryConsent, setTelemetryConsent, getAuthenticatedUser, authenticateUser, logoutUser, clearTelemetryData } from '@/lib/telemetry/analyticsEngine';
import { clsx } from 'clsx';

export function PrivacyConsentModal({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const [visible, setVisible] = useState(false);
  const [consent, setConsent] = useState(() => getTelemetryConsent());
  const [user, setUser] = useState(() => getAuthenticatedUser());
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const c = getTelemetryConsent();
    const u = getAuthenticatedUser();
    setConsent(c);
    setUser(u);

    if (isOpen !== undefined) {
      setVisible(isOpen);
    } else if (!c.optedIn || !u) {
      // Auto show consent prompt if not opted in or unauthenticated
      setVisible(true);
    }
  }, [isOpen]);

  const handleLoginAndConsent = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = emailInput.trim().toLowerCase();
    if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setError('Please enter a valid email address.');
      return;
    }

    const authenticatedUser = authenticateUser(clean);
    const updatedConsent = setTelemetryConsent(true);

    setUser(authenticatedUser);
    setConsent(updatedConsent);
    setError(null);
    setVisible(false);
    if (onClose) onClose();
  };

  const handleOptOut = () => {
    setTelemetryConsent(false);
    logoutUser();
    setConsent({ optedIn: false, consentTimestamp: '', version: '1.0' });
    setUser(null);
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden space-y-0">
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-800 text-white p-5 text-center relative">
          {onClose && (
            <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white p-1">
              <X size={18} />
            </button>
          )}
          <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-2 text-white">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-extrabold text-lg">RailGaadi Telemetry & Privacy</h3>
          <p className="text-blue-100 text-xs mt-0.5">Developer Analytics & Verified User Login</p>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 text-slate-800">
          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 space-y-2 text-xs">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" /> Transparent Developer Telemetry
            </div>
            <ul className="text-slate-600 space-y-1 text-[11px] list-disc pl-4">
              <li>Captures verified email, journey time spent, and feature actions.</li>
              <li>Allows the developer (<strong>hardeepmalan@gmail.com</strong>) to monitor active app usage.</li>
              <li><strong>Zero Passwords or Messages:</strong> Sensitive data is NEVER collected.</li>
              <li>You can Opt-Out or Delete your telemetry at any time.</li>
            </ul>
          </div>

          {user && user.isVerified ? (
            /* Already Verified User Card */
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Authenticated User</div>
                  <div className="font-extrabold text-slate-900 text-sm">{user.email}</div>
                  <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 size={11} /> Verified Session Active
                  </div>
                </div>
                {user.adminRole === 'admin' && (
                  <span className="text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded-lg">
                    Admin
                  </span>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleOptOut}
                  className="flex-1 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 size={13} /> Opt-Out & Delete
                </button>
                <button
                  type="button"
                  onClick={() => setVisible(false)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            /* Login & Consent Form */
            <form onSubmit={handleLoginAndConsent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Verified Email Login
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter email (e.g. hardeepmalan@gmail.com)..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold outline-none focus:border-blue-500"
                />
              </div>

              {error && (
                <div className="text-xs text-red-600 font-semibold bg-red-50 p-2 rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Lock size={14} /> Accept Privacy Terms & Login
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleOptOut}
                  className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 underline"
                >
                  Decline & Continue Without Telemetry
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
