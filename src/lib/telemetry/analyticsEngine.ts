'use client';

import { UserAnalyticsSession, UserEventLog, TelemetryConsent, TelemetryUser } from '@/types/telemetry';

const STORAGE_SESSION_KEY = 'railgaadi_telemetry_session';
const STORAGE_USER_KEY = 'railgaadi_telemetry_user';
const STORAGE_CONSENT_KEY = 'railgaadi_telemetry_consent';
const STORAGE_ALL_SESSIONS_KEY = 'railgaadi_telemetry_admin_all_sessions';

// ─── 1. Consent Management ───────────────────────────────────────────────────

export function getTelemetryConsent(): TelemetryConsent {
  if (typeof window === 'undefined') return { optedIn: false, consentTimestamp: '', version: '1.0' };
  try {
    const raw = localStorage.getItem(STORAGE_CONSENT_KEY);
    if (!raw) return { optedIn: false, consentTimestamp: '', version: '1.0' };
    return JSON.parse(raw);
  } catch {
    return { optedIn: false, consentTimestamp: '', version: '1.0' };
  }
}

export function setTelemetryConsent(optedIn: boolean): TelemetryConsent {
  const consent: TelemetryConsent = {
    optedIn,
    consentTimestamp: new Date().toISOString(),
    version: '1.0',
  };
  localStorage.setItem(STORAGE_CONSENT_KEY, JSON.stringify(consent));
  if (!optedIn) {
    clearTelemetryData();
  }
  return consent;
}

export function clearTelemetryData() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_SESSION_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
}

// ─── 2. Authenticated User Service ──────────────────────────────────────────

export function getAuthenticatedUser(): TelemetryUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function authenticateUser(email: string): TelemetryUser {
  const cleanEmail = email.trim().toLowerCase();
  const isAdmin = cleanEmail === 'hardeepmalan@gmail.com';

  const user: TelemetryUser = {
    email: cleanEmail,
    isVerified: true,
    verifiedAt: new Date().toISOString(),
    adminRole: isAdmin ? 'admin' : 'user',
  };

  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  return user;
}

export function logoutUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_USER_KEY);
  localStorage.removeItem(STORAGE_SESSION_KEY);
}

// ─── 3. Session & Event Engine ──────────────────────────────────────────────

export function startOrGetSession(): UserAnalyticsSession | null {
  if (typeof window === 'undefined') return null;

  const consent = getTelemetryConsent();
  if (!consent.optedIn) return null;

  const user = getAuthenticatedUser();
  if (!user || !user.isVerified) return null;

  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    let session: UserAnalyticsSession | null = raw ? JSON.parse(raw) : null;
    const now = new Date().toISOString();

    if (!session || !session.sessionId) {
      // Check previous session count
      const allSessions = getAllStoredAdminSessions();
      const userSessions = allSessions.filter(s => s.userEmail === user.email);
      const sessionCount = userSessions.length + 1;

      session = {
        sessionId: 'sess_' + Math.random().toString(36).substring(2, 11),
        userEmail: user.email,
        isVerified: true,
        startTime: now,
        lastActiveTime: now,
        totalTimeSeconds: 0,
        isOnline: true,
        device: getDeviceType(),
        browser: getBrowserInfo(),
        country: 'India 🇮🇳',
        pagesVisited: [],
        events: [],
        sessionCount,
        isRepeatVisit: sessionCount > 1,
      };
    } else {
      // Update online status & last active
      session.isOnline = true;
      session.lastActiveTime = now;
      const startMs = new Date(session.startTime).getTime();
      session.totalTimeSeconds = Math.max(0, Math.floor((new Date().getTime() - startMs) / 1000));
    }

    saveSession(session);
    return session;
  } catch {
    return null;
  }
}

export function trackEvent(
  eventType: UserEventLog['eventType'],
  eventName: string,
  pagePath: string,
  metadata?: Record<string, any>
) {
  const session = startOrGetSession();
  if (!session) return;

  const newEvent: UserEventLog = {
    id: 'evt_' + Math.random().toString(36).substring(2, 9),
    eventType,
    eventName,
    pagePath,
    metadata,
    timestamp: new Date().toISOString(),
  };

  session.events.unshift(newEvent);
  // Keep last 50 events per session
  session.events = session.events.slice(0, 50);

  if (!session.pagesVisited.includes(pagePath)) {
    session.pagesVisited.push(pagePath);
  }

  saveSession(session);

  // Sync to API in background if possible
  fetch('/api/telemetry/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session, event: newEvent }),
  }).catch(() => {});
}

function saveSession(session: UserAnalyticsSession) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));

  // Store in admin sessions log array
  try {
    const all = getAllStoredAdminSessions();
    const idx = all.findIndex(s => s.sessionId === session.sessionId);
    if (idx !== -1) {
      all[idx] = session;
    } else {
      all.unshift(session);
    }
    // Limit admin session history to 200
    localStorage.setItem(STORAGE_ALL_SESSIONS_KEY, JSON.stringify(all.slice(0, 200)));
  } catch (e) {
    console.warn('Failed to save to admin sessions store:', e);
  }
}

export function getAllStoredAdminSessions(): UserAnalyticsSession[] {
  if (typeof window === 'undefined') return getMockAdminSessions();
  try {
    const raw = localStorage.getItem(STORAGE_ALL_SESSIONS_KEY);
    if (!raw) return getMockAdminSessions();
    const sessions: UserAnalyticsSession[] = JSON.parse(raw);
    
    // Evaluate live online/offline status (active within last 45s)
    const nowMs = Date.now();
    return sessions.map(s => {
      const lastActiveMs = new Date(s.lastActiveTime).getTime();
      const isOnline = (nowMs - lastActiveMs) < 45000;
      return { ...s, isOnline };
    });
  } catch {
    return getMockAdminSessions();
  }
}

// Device Helpers
function getDeviceType(): string {
  if (typeof window === 'undefined') return 'Desktop';
  const ua = navigator.userAgent;
  if (/iPhone|iPod/i.test(ua)) return 'iPhone 📱';
  if (/iPad/i.test(ua)) return 'iPad 📱';
  if (/Android/i.test(ua)) return 'Android Mobile 📱';
  if (/Windows/i.test(ua)) return 'Windows PC 💻';
  if (/Macintosh/i.test(ua)) return 'MacBook 💻';
  return 'Desktop 💻';
}

function getBrowserInfo(): string {
  if (typeof window === 'undefined') return 'Chrome';
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  return 'Browser';
}

// Fallback seed sessions for developer demonstration
function getMockAdminSessions(): UserAnalyticsSession[] {
  const now = new Date();
  return [
    {
      sessionId: 'sess_live_developer',
      userEmail: 'hardeepmalan@gmail.com',
      isVerified: true,
      startTime: new Date(now.getTime() - 14 * 60 * 1000).toISOString(),
      lastActiveTime: new Date(now.getTime() - 10 * 1000).toISOString(),
      totalTimeSeconds: 840,
      isOnline: true,
      device: 'Windows PC 💻',
      browser: 'Chrome',
      country: 'India 🇮🇳',
      pagesVisited: ['/', '/search', '/pnr', '/coach', '/profile'],
      sessionCount: 12,
      isRepeatVisit: true,
      events: [
        { id: 'e1', eventType: 'page_view', eventName: 'Viewed Profile & Analytics', pagePath: '/profile', timestamp: new Date().toISOString() },
        { id: 'e2', eventType: 'coach_view', eventName: 'Viewed 2D Coach B2 Layout', pagePath: '/coach', timestamp: new Date(now.getTime() - 3 * 60000).toISOString() },
        { id: 'e3', eventType: 'pnr_check', eventName: 'Checked PNR 4234567890', pagePath: '/pnr', timestamp: new Date(now.getTime() - 7 * 60000).toISOString() },
        { id: 'e4', eventType: 'search_performed', eventName: 'Searched NDLS → ALJN', pagePath: '/search', timestamp: new Date(now.getTime() - 11 * 60000).toISOString() },
      ]
    },
    {
      sessionId: 'sess_user_demo_2',
      userEmail: 'rahul.traveler@gmail.com',
      isVerified: true,
      startTime: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
      lastActiveTime: new Date(now.getTime() - 12 * 60 * 1000).toISOString(),
      totalTimeSeconds: 1980,
      isOnline: false,
      device: 'Android Mobile 📱',
      browser: 'Chrome Mobile',
      country: 'India 🇮🇳',
      pagesVisited: ['/', '/search', '/food', '/fare'],
      sessionCount: 4,
      isRepeatVisit: true,
      events: [
        { id: 'e10', eventType: 'page_view', eventName: 'Calculated Fare NDLS → LKO', pagePath: '/fare', timestamp: new Date(now.getTime() - 14 * 60000).toISOString() },
        { id: 'e11', eventType: 'page_view', eventName: 'Checked Kota Station Food Specialities', pagePath: '/food', timestamp: new Date(now.getTime() - 25 * 60000).toISOString() },
      ]
    }
  ];
}
