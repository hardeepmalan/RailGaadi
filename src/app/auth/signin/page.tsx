'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Train, Lock, ShieldCheck, Mail, ArrowRight, AlertCircle } from 'lucide-react';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(errorParam ? 'Authentication failed. Please check credentials.' : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter a valid email address and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error || 'Invalid credentials. Please try again.');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden space-y-0">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-800 text-white p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-2 text-white shadow-md">
            <Train size={28} />
          </div>
          <h1 className="font-extrabold text-2xl tracking-tight">RailGaadi Account Sign In</h1>
          <p className="text-blue-100 text-xs mt-1">Verified authentication for journey telemetry & admin control</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 space-y-1.5 text-xs">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-blue-600" /> Server-Verified Identity
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Sign in with your verified email. Developer accounts matching authorized credentials automatically gain admin access.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Verified Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                name="email"
                autoComplete="email"
                placeholder="e.g. hardeepmalan@gmail.com or user@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Account Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                required
                placeholder="Enter password (min 4 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-xs font-bold text-red-700 flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : (
              <>
                Sign In to RailGaadi <ArrowRight size={14} />
              </>
            )}
          </button>

          <div className="text-center pt-2 text-[11px] text-slate-400">
            Developer Account: <strong className="text-slate-700 font-mono">hardeepmalan@gmail.com</strong>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-md">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-700">Loading sign in page…</span>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
