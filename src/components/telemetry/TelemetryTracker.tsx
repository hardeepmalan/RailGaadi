'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

function getDeviceType(ua: string): string {
  if (/iPhone|iPod/i.test(ua)) return 'iPhone 📱';
  if (/iPad/i.test(ua)) return 'iPad 📱';
  if (/Android.*Mobile/i.test(ua)) return 'Android Phone 📱';
  if (/Android/i.test(ua)) return 'Android Tablet 📱';
  if (/Windows/i.test(ua)) return 'Windows PC 💻';
  if (/Macintosh/i.test(ua)) return 'Mac 💻';
  if (/Linux/i.test(ua)) return 'Linux 💻';
  return 'Desktop 💻';
}

function getBrowser(ua: string): string {
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR|Opera/i.test(ua)) return 'Opera';
  if (/Chrome/i.test(ua)) return 'Chrome';
  if (/Firefox/i.test(ua)) return 'Firefox';
  if (/Safari/i.test(ua)) return 'Safari';
  return 'Unknown Browser';
}

function getOS(ua: string): string {
  if (/Windows NT 10/i.test(ua)) return 'Windows 10/11';
  if (/Windows NT 6.3/i.test(ua)) return 'Windows 8.1';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/iPhone OS/i.test(ua)) return 'iOS ' + (ua.match(/iPhone OS (\d+)/)?.[1] || '');
  if (/Mac OS X/i.test(ua)) return 'macOS';
  if (/Android (\d+)/i.test(ua)) return 'Android ' + (ua.match(/Android (\d+)/)?.[1] || '');
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Unknown OS';
}

function getPageTitle(path: string): string {
  if (path === '/') return 'Home Dashboard';
  if (path.startsWith('/search')) return 'Train Search';
  if (path.startsWith('/pnr')) return 'PNR Status';
  if (path.startsWith('/coach')) return 'Coach Position';
  if (path.startsWith('/food')) return 'Food on Train';
  if (path.startsWith('/fare')) return 'Fare Calculator';
  if (path.startsWith('/alerts')) return 'Alert Center';
  if (path.startsWith('/favorites')) return 'Saved Trains';
  if (path.startsWith('/emergency')) return 'Emergency Help';
  if (path.startsWith('/profile')) return 'Profile';
  if (path.startsWith('/admin')) return 'Admin Dashboard';
  return path;
}

// Persistent anonymous session ID (localStorage)
function getAnonSessionId(): string {
  if (typeof window === 'undefined') return 'ssr_anon';
  let id = localStorage.getItem('rg_anon_session_id');
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('rg_anon_session_id', id);
  }
  return id;
}

export function TelemetryTracker() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const clientInfoRef = useRef<Record<string, string> | null>(null);

  // Build client info once on mount
  useEffect(() => {
    const ua = navigator.userAgent;
    clientInfoRef.current = {
      device: getDeviceType(ua),
      browser: getBrowser(ua),
      os: getOS(ua),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      screenSize: `${window.screen.width}×${window.screen.height}`,
      language: navigator.language || 'en',
      sessionId: getAnonSessionId(),
    };
  }, []);

  // Track page views whenever route changes
  useEffect(() => {
    if (!pathname || !clientInfoRef.current) return;

    const info = clientInfoRef.current;
    const pageTitle = getPageTitle(pathname);

    fetch('/api/telemetry/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pagePath: pathname,
        pageTitle,
        eventName: `Visited ${pageTitle}`,
        device: info.device,
        browser: info.browser,
        os: info.os,
        timezone: info.timezone,
        screenSize: info.screenSize,
        language: info.language,
        sessionId: info.sessionId,
        anonId: info.sessionId,
      }),
    }).catch(() => {});
  }, [pathname]);

  // Heartbeat every 30s to keep session alive & update duration
  useEffect(() => {
    const interval = setInterval(() => {
      if (!clientInfoRef.current || !pathname) return;
      const info = clientInfoRef.current;
      fetch('/api/telemetry/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pagePath: pathname,
          eventName: 'Session Heartbeat',
          device: info.device,
          browser: info.browser,
          os: info.os,
          timezone: info.timezone,
          screenSize: info.screenSize,
          language: info.language,
          sessionId: info.sessionId,
          anonId: info.sessionId,
        }),
      }).catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
