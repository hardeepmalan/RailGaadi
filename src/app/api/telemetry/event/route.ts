import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth/session';
import { recordServerTelemetry } from '@/lib/telemetry/serverTelemetryStore';
import { checkRateLimit } from '@/lib/auth/rateLimit';

export async function POST(request: NextRequest) {
  const rateLimitError = checkRateLimit(request, 120, 60000);
  if (rateLimitError) return rateLimitError;

  try {
    const body = await request.json();
    const { pagePath, pageTitle, eventName, eventMeta, device, browser, os, timezone, screenSize, language, sessionId } = body;

    // Get authenticated session if any
    const session = await getServerAuthSession();

    // Build visitor identity — works for both logged-in AND anonymous users
    let userId: string;
    let verifiedEmail: string;
    let displayName: string;
    let isAuthenticated = false;

    if (session?.user?.email) {
      // Verified authenticated user
      userId = session.user.id || ('usr_' + Buffer.from(session.user.email).toString('hex').substring(0, 12));
      verifiedEmail = session.user.email;
      displayName = session.user.name || session.user.email;
      isAuthenticated = true;
    } else {
      // Anonymous visitor — tracked by their self-reported sessionId
      const anonSessionId = sessionId || body.anonId || 'anon_unknown';
      userId = 'anon_' + anonSessionId.replace('sess_', '');
      verifiedEmail = 'Anonymous Visitor';
      displayName = 'Guest User';
      isAuthenticated = false;
    }

    // Extract approximate country from timezone
    const country = getCountryFromTimezone(timezone);

    // Get real IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'Unknown';

    const serverSession = recordServerTelemetry({
      userId,
      verifiedEmail,
      displayName,
      isAuthenticated,
      pagePath: pagePath || '/',
      pageTitle,
      eventName,
      eventMeta,
      device,
      browser,
      os,
      country,
      timezone: timezone || 'Asia/Kolkata',
      screenSize,
      language,
      ip,
      sessionId,
    });

    return NextResponse.json({
      success: true,
      sessionId: serverSession.sessionId,
      isAuthenticated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Telemetry failed.' }, { status: 500 });
  }
}

function getCountryFromTimezone(tz?: string): string {
  if (!tz) return 'India 🇮🇳';
  if (tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta')) return 'India 🇮🇳';
  if (tz.startsWith('Asia/Dubai')) return 'UAE 🇦🇪';
  if (tz.startsWith('Asia/Singapore')) return 'Singapore 🇸🇬';
  if (tz.startsWith('Asia/Tokyo')) return 'Japan 🇯🇵';
  if (tz.startsWith('Europe/London')) return 'UK 🇬🇧';
  if (tz.startsWith('America/New_York') || tz.startsWith('America/Chicago') || tz.startsWith('America/Los_Angeles')) return 'USA 🇺🇸';
  if (tz.startsWith('Australia')) return 'Australia 🇦🇺';
  if (tz.startsWith('Asia/Karachi')) return 'Pakistan 🇵🇰';
  if (tz.startsWith('Asia/Dhaka')) return 'Bangladesh 🇧🇩';
  if (tz.startsWith('Asia/Colombo')) return 'Sri Lanka 🇱🇰';
  if (tz.startsWith('Asia/Kathmandu')) return 'Nepal 🇳🇵';
  return tz.split('/')[0] || 'Unknown 🌍';
}
