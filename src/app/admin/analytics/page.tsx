'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, Lock, Users, RefreshCw, BarChart3, Trash2,
  AlertOctagon, Activity, ShieldAlert, Key, Search, MessageSquare,
  LogOut, Shield, Eye, EyeOff, CheckCircle2, X
} from 'lucide-react';
import { clsx } from 'clsx';

// ─── Admin Password Gate (Two-Layer: NextAuth role + server-verified password) ──

function AdminPasswordGate({ onVerified }: { onVerified: () => void }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', password }),
      });
      const data = await res.json();

      if (data.notConfigured) {
        setError('No admin password configured yet. Use "Setup Initial Password" below.');
        return;
      }
      if (!res.ok || !data.success) {
        setError(data.error || 'Incorrect password. Access denied.');
        return;
      }

      // Mark verified in sessionStorage (per-tab, not persisted)
      sessionStorage.setItem('rg_admin_pwd_verified', '1');
      onVerified();
    } catch {
      setError('Network error verifying admin password.');
    } finally {
      setLoading(false);
    }
  };

  // One-time setup (only when no password configured yet, admin role required)
  const handleSetupInitial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setup', newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Setup failed.');
        return;
      }
      sessionStorage.setItem('rg_admin_pwd_verified', '1');
      onVerified();
    } catch {
      setError('Network error during setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-800 text-white p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-2">
            <Lock size={28} />
          </div>
          <h2 className="font-extrabold text-xl">Admin Dashboard Access</h2>
          <p className="text-blue-100 text-xs mt-1">
            Signed in as: <strong>{session?.user?.email}</strong>
          </p>
          <p className="text-blue-100 text-xs mt-0.5">
            Enter your admin password to unlock the telemetry dashboard.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-800 flex gap-2">
            <ShieldAlert size={15} className="flex-shrink-0 mt-0.5 text-amber-600" />
            <span>
              Admin password is verified <strong>server-side</strong>. It is stored as a secure hash — 
              never visible in source code or client requests.
            </span>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Admin Dashboard Password
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  required
                  placeholder="Enter admin password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-10 text-sm font-semibold outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShow(v => !v)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs font-semibold text-red-700 flex gap-2">
                <X size={14} className="flex-shrink-0 mt-0.5" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all"
            >
              {loading ? 'Verifying...' : 'Unlock Admin Dashboard'}
            </button>
          </form>

          <details className="text-xs text-slate-400">
            <summary className="cursor-pointer hover:text-slate-600 font-semibold py-1">
              No password configured yet? (One-time setup)
            </summary>
            <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <p className="text-slate-500 text-[11px] leading-relaxed">
                As the authorized admin, you can set the initial password once.
                After setup, only the Change Password option (inside the dashboard) can modify it.
              </p>
              <button
                type="button"
                onClick={handleSetupInitial}
                disabled={loading || password.length < 8}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs rounded-xl transition-all"
              >
                Set as Initial Admin Password
              </button>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

// ─── Change Password Modal ─────────────────────────────────────────────────────

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      setError('New passwords do not match.');
      return;
    }
    if (newPwd.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change', currentPassword: currentPwd, newPassword: newPwd }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Password change failed.');
        return;
      }
      setSuccess(true);
      // Update sessionStorage so re-entry isn't needed immediately
      sessionStorage.setItem('rg_admin_pwd_verified', '1');
    } catch {
      setError('Network error changing password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-base">Change Admin Password</h3>
            <p className="text-blue-100 text-xs mt-0.5">Verified server-side. Hash stored securely.</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
              <CheckCircle2 size={28} className="text-emerald-600 mx-auto" />
              <div className="font-extrabold text-emerald-900">Password Changed Successfully!</div>
              <p className="text-xs text-emerald-700">The new admin password is now active. Store it securely.</p>
              <button onClick={onClose} className="mt-2 text-xs font-bold text-emerald-700 underline">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleChange} className="space-y-3">
              {[
                { label: 'Current Admin Password', val: currentPwd, set: setCurrentPwd, ph: 'Enter current password...' },
                { label: 'New Password (min 8 chars)', val: newPwd, set: setNewPwd, ph: 'Enter new password...' },
                { label: 'Confirm New Password', val: confirmPwd, set: setConfirmPwd, ph: 'Repeat new password...' },
              ].map(({ label, val, set, ph }) => (
                <div key={label}>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">{label}</label>
                  <input
                    type="password"
                    required
                    placeholder={ph}
                    value={val}
                    onChange={(e) => set(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>
              ))}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 text-xs text-red-700 font-semibold flex gap-1.5">
                  <X size={13} className="flex-shrink-0 mt-0.5" /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !currentPwd || !newPwd || !confirmPwd}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-extrabold text-xs rounded-xl transition-all"
              >
                {loading ? 'Changing...' : 'Change Admin Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Analytics Dashboard ───────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Two-layer auth state: NextAuth admin role + verified admin password
  const [pwdVerified, setPwdVerified] = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    sessions: any[];
    suggestions: any[];
    auditLogs: any[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sessions' | 'suggestions' | 'audit'>('sessions');

  // Check sessionStorage for already-verified password this browser tab
  useEffect(() => {
    if (sessionStorage.getItem('rg_admin_pwd_verified') === '1') {
      setPwdVerified(true);
    }
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/analytics');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Access Denied.');
      setData(json);
      if (json.sessions?.length > 0 && !selectedSessionId) {
        setSelectedSessionId(json.sessions[0].sessionId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin' && pwdVerified) {
      fetchAdminData();
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      setLoading(false);
      setError('403 Forbidden: Your account does not have admin privileges.');
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, session, pwdVerified]);

  const handleUpdateSuggestion = async (suggestionId: string, newStatus: string) => {
    await fetch('/api/admin/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_suggestion', suggestionId, status: newStatus }),
    });
    fetchAdminData();
  };

  const handleRevokeSession = async (sessionId: string) => {
    await fetch('/api/admin/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'revoke_session', sessionId }),
    });
    fetchAdminData();
  };

  // ── Layer 1: NextAuth loading ──────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-md">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-700">Verifying admin session…</span>
        </div>
      </div>
    );
  }

  // ── Layer 1 FAIL: Not signed in ────────────────────────────────────────────
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-center">
          <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white p-6">
            <ShieldAlert size={28} className="mx-auto mb-2" />
            <h2 className="font-black text-xl">401 — Authentication Required</h2>
          </div>
          <div className="p-6 space-y-3">
            <p className="text-xs text-slate-600">You must sign in with an authorized admin account to access this dashboard.</p>
            <button onClick={() => router.push('/auth/signin?callbackUrl=/admin/analytics')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl">
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Layer 1 FAIL: Signed in but not admin role ─────────────────────────────
  if (session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-center">
          <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white p-6">
            <ShieldAlert size={28} className="mx-auto mb-2" />
            <h2 className="font-black text-xl">403 — Access Forbidden</h2>
            <p className="text-red-100 text-xs mt-1">{session?.user?.email}</p>
          </div>
          <div className="p-6 space-y-3">
            <p className="text-xs text-slate-600">
              Your account does not have server-assigned admin privileges.
              Only authorized developer accounts can access this dashboard.
            </p>
            <button onClick={() => router.push('/')}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl">
              Return to App
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Layer 2: Admin role confirmed — require password verification ──────────
  if (!pwdVerified) {
    return <AdminPasswordGate onVerified={() => setPwdVerified(true)} />;
  }

  // ── BOTH LAYERS PASSED — Render Full Admin Dashboard ──────────────────────

  const sessions = data?.sessions || [];
  const suggestions = data?.suggestions || [];
  const auditLogs = data?.auditLogs || [];

  const filteredSessions = sessions.filter((s: any) =>
    s.verifiedEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.userId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSession = sessions.find((s: any) => s.sessionId === selectedSessionId)
    || (filteredSessions[0] || null);
  const onlineSessions = sessions.filter((s: any) => s.isOnline);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {showChangePwd && <ChangePasswordModal onClose={() => setShowChangePwd(false)} />}

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-800 text-white px-5 pt-8 pb-10 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white border border-white/30 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <ShieldCheck size={14} className="text-emerald-300" /> Authenticated Admin: {session.user.email}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Protected Developer Telemetry</h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-0.5">Real-time verified user sessions, feedback, and audit logs</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={fetchAdminData}
              className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 text-xs font-bold rounded-xl flex items-center gap-1.5">
              <RefreshCw size={14} /> Refresh
            </button>
            <button onClick={() => setShowChangePwd(true)}
              className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 text-xs font-bold rounded-xl flex items-center gap-1.5">
              <Key size={14} /> Change Password
            </button>
            <button onClick={() => {
              sessionStorage.removeItem('rg_admin_pwd_verified');
              signOut({ callbackUrl: '/auth/signin' });
            }}
              className="px-3.5 py-2 bg-red-500/80 hover:bg-red-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-5 space-y-5">
        {/* Loading / Error */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 mt-2 font-semibold">Loading telemetry…</p>
          </div>
        )}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs font-bold text-red-700">{error}</div>
        )}

        {!loading && data && (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Online Now', value: onlineSessions.length, color: 'text-emerald-600', dot: true },
                { label: 'Total Visitors', value: sessions.length, color: 'text-blue-700' },
                { label: 'Suggestions', value: suggestions.length, color: 'text-purple-700' },
                { label: 'Signed-In Users', value: sessions.filter((s: any) => s.isAuthenticated).length, color: 'text-indigo-700' },
              ].map(m => (
                <div key={m.label} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 text-center space-y-1">
                  <div className={clsx('text-3xl font-black', m.color)}>{m.value}</div>
                  <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                    {m.dot && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex gap-1 shadow-xs">
              {[
                { id: 'sessions', label: 'User Sessions', count: sessions.length },
                { id: 'suggestions', label: 'Verified Feedback', count: suggestions.length },
                { id: 'audit', label: 'Audit Logs', count: auditLogs.length },
              ].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                  className={clsx(
                    'flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2',
                    activeTab === t.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  )}>
                  {t.label}
                  <span className={clsx('px-1.5 py-0.5 text-[10px] rounded-full font-black',
                    activeTab === t.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600')}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input type="text" placeholder="Search by verified email or user ID..."
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 shadow-xs" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Session List */}
                  <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-md p-4 space-y-2 max-h-[520px] overflow-y-auto">
                    {filteredSessions.length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-400">No matching sessions.</div>
                    ) : filteredSessions.map((s: any) => {
                      const isSelected = selectedSession?.sessionId === s.sessionId;
                      return (
                        <div key={s.sessionId} onClick={() => setSelectedSessionId(s.sessionId)}
                          className={clsx('p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2',
                            isSelected ? 'bg-blue-50/80 border-blue-500 shadow-sm' : 'bg-slate-50 hover:bg-slate-100 border-slate-200')}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={clsx('text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0',
                                  s.isAuthenticated ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600')}>
                                  {s.isAuthenticated ? '✓ Auth' : '👤 Anon'}
                                </span>
                                <div className="font-extrabold text-xs text-slate-900 truncate">{s.displayName || s.verifiedEmail}</div>
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5 truncate">{s.verifiedEmail}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{s.country} · {s.device?.split(' ')[0]}</div>
                            </div>
                            <span className={clsx('text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0',
                              s.isOnline ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-600')}>
                              <span className={clsx('w-1.5 h-1.5 rounded-full', s.isOnline ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400')} />
                              {s.isOnline ? 'Live' : 'Left'}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60 font-mono gap-1">
                            <span>⏱ {Math.floor((s.totalTimeSeconds || 0) / 60)}m {(s.totalTimeSeconds || 0) % 60}s</span>
                            <span className="text-center">📄 {s.pagesVisited?.length || 0} pages</span>
                            <span className="text-right">#{s.sessionCount || 1} visit</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Session Detail */}
                  <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 space-y-4 max-h-[520px] overflow-y-auto">
                    {selectedSession ? (
                      <>
                        {/* Identity Card */}
                        <div className={clsx('rounded-2xl p-4 space-y-3 border',
                          selectedSession.isAuthenticated
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                            : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-300'
                        )}>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className={clsx('text-[10px] font-black px-2 py-0.5 rounded-lg',
                                  selectedSession.isAuthenticated ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-300 text-slate-700')}>
                                  {selectedSession.isAuthenticated ? '✅ Verified Account' : '👤 Anonymous Visitor'}
                                </span>
                              </div>
                              <div className="font-black text-base text-slate-900">{selectedSession.displayName || 'Guest User'}</div>
                              <div className="text-xs text-blue-700 font-mono font-bold">{selectedSession.verifiedEmail}</div>
                              <div className="text-[10px] font-mono text-slate-400">UID: {selectedSession.userId}</div>
                            </div>
                            <button onClick={() => handleRevokeSession(selectedSession.sessionId)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[10px] rounded-lg border border-red-200 transition-colors flex-shrink-0">
                              Revoke
                            </button>
                          </div>

                          {/* Rich Info Grid */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200/60">
                            {[
                              ['📍 Country', selectedSession.country],
                              ['🕐 Timezone', selectedSession.timezone],
                              ['💻 Device', selectedSession.device],
                              ['🌐 Browser', selectedSession.browser],
                              ['🖥️ OS', selectedSession.os],
                              ['📐 Screen', selectedSession.screenSize],
                              ['🌍 Language', selectedSession.language],
                              ['🌐 IP Address', selectedSession.ip],
                              ['⏱ Time Spent', `${Math.floor((selectedSession.totalTimeSeconds || 0) / 60)}m ${(selectedSession.totalTimeSeconds || 0) % 60}s`],
                              ['🔁 Visit #', `Session ${selectedSession.sessionCount || 1}${selectedSession.isRepeatVisit ? ' (Returning)' : ' (New)'}`],
                              ['👁 First Seen', new Date(selectedSession.firstSeen).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })],
                              ['💤 Last Active', new Date(selectedSession.lastActiveTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })],
                            ].map(([label, val]) => (
                              <div key={label} className="bg-white/70 rounded-xl px-2.5 py-1.5">
                                <div className="text-[9px] text-slate-400 font-bold uppercase leading-none">{label}</div>
                                <div className="text-[11px] font-bold text-slate-800 mt-0.5 truncate">{val || '—'}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Pages Visited */}
                        <div>
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Pages Visited ({selectedSession.pagesVisited?.length || 0})</h3>
                          <div className="space-y-1">
                            {(selectedSession.pagesVisited || []).map((p: any, i: number) => (
                              <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                                <span className="text-xs font-bold text-slate-800">{typeof p === 'object' ? p.title : p}</span>
                                {typeof p === 'object' && p.visitedAt && (
                                  <span className="text-[10px] font-mono text-slate-400">{new Date(p.visitedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Action Stream ({selectedSession.events?.length || 0} events)</h3>
                          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                            {(selectedSession.events || []).length === 0 ? (
                              <div className="bg-slate-50 rounded-xl p-3 text-center text-xs text-slate-400">No events logged yet.</div>
                            ) : selectedSession.events.map((evt: any) => (
                              <div key={evt.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex justify-between text-xs">
                                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />{evt.name} ({evt.pagePath})
                                </div>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {new Date(evt.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 text-slate-400 text-xs">Select a session to inspect details.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions Tab */}
            {activeTab === 'suggestions' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 space-y-4">
                <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <MessageSquare size={18} className="text-purple-600" /> Verified User Feedback
                </h2>
                {suggestions.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">No suggestions submitted yet.</div>
                ) : suggestions.map((sug: any) => (
                  <div key={sug.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="font-extrabold text-xs text-slate-900">{sug.userName} ({sug.verifiedEmail})</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          ID: {sug.userId} · {new Date(sug.submittedAt).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {['pending', 'reviewed', 'resolved'].map(st => (
                          <button key={st} onClick={() => handleUpdateSuggestion(sug.id, st)}
                            className={clsx('text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase transition-all',
                              sug.status === st
                                ? st === 'resolved' ? 'bg-emerald-600 text-white' : st === 'reviewed' ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100')}>
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed font-medium">
                      "{sug.suggestionText}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Audit Logs Tab */}
            {activeTab === 'audit' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 space-y-4">
                <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Shield size={18} className="text-amber-600" /> Security Audit Log
                </h2>
                {auditLogs.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">No admin security events recorded yet.</div>
                ) : (
                  <div className="space-y-2 font-mono text-xs">
                    {auditLogs.map((log: any) => (
                      <div key={log.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-blue-700">[{log.adminEmail}]</span>{' '}
                          <span className="font-semibold text-slate-800">{log.action}</span>
                          {log.details && <span className="text-slate-500 text-[10px]"> — {log.details}</span>}
                        </div>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
