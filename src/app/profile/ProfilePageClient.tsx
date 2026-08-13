'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, Send, Sparkles, CheckCircle2, ShieldCheck, BarChart3, LogOut, Lock, User, Info } from 'lucide-react';
import { clsx } from 'clsx';

export default function ProfilePageClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [suggestion, setSuggestion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const isAuthenticated = status === 'authenticated' && !!session?.user?.email;
  const verifiedEmail = session?.user?.email;
  const isAdmin = session?.user?.role === 'admin';

  // Get anonymous session id from localStorage
  const getAnonId = () => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('rg_anon_session_id') || '';
  };

  const handleSendSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim() || suggestion.trim().length < 5) {
      setFeedbackError('Please write at least 5 characters.');
      return;
    }
    setSending(true);
    setFeedbackError(null);

    try {
      const body: Record<string, string> = {
        suggestion: suggestion.trim(),
        sessionId: getAnonId(),
        anonId: getAnonId(),
      };

      // For anonymous users, include optional name/email from form
      if (!isAuthenticated) {
        if (name.trim()) body.name = name.trim();
        if (email.trim()) body.email = email.trim();
      }
      // For authenticated users: backend uses session email; don't send email in body

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSentSuccess(true);
        setSuggestion('');
        setName('');
        setEmail('');
      } else {
        setFeedbackError(data.error || 'Failed to submit. Please try again.');
      }
    } catch (e: any) {
      setFeedbackError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-800 text-white px-5 pt-8 pb-10 text-center shadow-md">
        <div className="max-w-xl mx-auto">
          <div className="w-20 h-20 bg-white text-blue-700 flex items-center justify-center rounded-3xl text-2xl font-black mx-auto shadow-lg mb-3 border-2 border-white/40">
            {isAuthenticated ? verifiedEmail!.substring(0, 2).toUpperCase() : '🚂'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
            {isAuthenticated ? (session.user.name || verifiedEmail) : 'RailGaadi Profile'}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm">
            {isAuthenticated ? `Verified Account · ${verifiedEmail}` : 'Suggest features or sign in for full access'}
          </p>

          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            {isAuthenticated ? (
              <>
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-full">
                  <CheckCircle2 size={13} className="text-emerald-300" /> {verifiedEmail} (Verified ✓)
                </div>
                {isAdmin && (
                  <button onClick={() => router.push('/admin/analytics')}
                    className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-3.5 py-1 rounded-full shadow-md transition-all">
                    <BarChart3 size={13} /> Admin Dashboard
                  </button>
                )}
                <button onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                  className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-3 py-1 rounded-full transition-all">
                  <LogOut size={12} /> Sign Out
                </button>
              </>
            ) : (
              <button onClick={() => router.push('/auth/signin')}
                className="inline-flex items-center gap-1.5 bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs px-4 py-1.5 rounded-full shadow-md transition-all">
                <Lock size={13} /> Sign In for Verified Access
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* ── Suggestion / Feedback Form ─────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs text-blue-600 font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={14} className="text-amber-500" /> Send Suggestion
              </div>
              <h2 className="text-lg font-black text-slate-900">Suggest Features to Hardeep</h2>
            </div>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-xl hidden sm:block">
              hardeepmalan@gmail.com
            </span>
          </div>

          {sentSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-2">
              <CheckCircle2 size={28} className="text-emerald-600 mx-auto" />
              <div className="font-extrabold text-base text-emerald-900">Suggestion Sent! 🎉</div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Your suggestion has been delivered to <strong>hardeepmalan@gmail.com</strong> and saved in the admin dashboard.
              </p>
              <button onClick={() => setSentSuccess(false)}
                className="text-xs font-bold text-emerald-700 underline">
                Send another suggestion
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendSuggestion} className="space-y-3">
              {/* Email display — auto-detected if logged in, optional field if anonymous */}
              {isAuthenticated ? (
                /* Verified user: show read-only email badge — no editable input */
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Sending As (Auto-Detected)</div>
                    <div className="text-sm font-extrabold text-slate-900 font-mono">{verifiedEmail}</div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-lg border border-emerald-300 flex-shrink-0">
                    ✓ Verified
                  </span>
                </div>
              ) : (
                /* Anonymous user: optional name + email */
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5 space-y-2">
                  <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <Info size={13} /> No login required — fields below are optional
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Name (optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Email (optional)</label>
                      <input
                        type="email"
                        placeholder="for follow-up"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestion text */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Your Suggestion or Feedback *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your idea to improve RailGaadi... (e.g. Add platform number alerts, live delay map, offline schedule)"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-sm font-medium outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {feedbackError && (
                <div className="text-xs font-bold text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">
                  {feedbackError}
                </div>
              )}

              <button
                type="submit"
                disabled={suggestion.trim().length < 5 || sending}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending to hardeepmalan@gmail.com…
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    {isAuthenticated ? `Send as ${verifiedEmail}` : 'Send Suggestion'}
                  </>
                )}
              </button>

              {!isAuthenticated && (
                <p className="text-center text-[11px] text-slate-400">
                  <button onClick={() => router.push('/auth/signin')} className="text-blue-600 font-bold underline">
                    Sign in
                  </button>
                  {' '}to have your verified email automatically attached to your feedback.
                </p>
              )}
            </form>
          )}
        </section>

        {/* ── About Card ─────────────────────────────────────────────── */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck size={18} className="text-blue-600" />
            <h2 className="text-sm font-extrabold text-slate-900">About RailGaadi v2.0</h2>
          </div>
          <div className="text-xs text-slate-600 space-y-2">
            <p>Designed and maintained by <strong className="text-slate-900">Hardeep Malan</strong>. Privacy-first analytics, server-verified identities, 2D LHB coach layouts, and live train tracking.</p>
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Developer Contact</div>
                <div className="text-xs font-bold text-blue-700">hardeepmalan@gmail.com</div>
              </div>
              <span className="text-[11px] bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-xl border border-purple-200">v2.0</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
