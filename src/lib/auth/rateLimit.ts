import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(request: NextRequest, maxRequests = 20, windowMs = 60000): NextResponse | null {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  const now = Date.now();

  const record = rateLimitMap.get(ip);
  if (!record || now > record.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return null;
  }

  if (record.count >= maxRequests) {
    console.warn(`⚠️ Rate limit exceeded for IP: ${ip}`);
    return NextResponse.json({ error: 'Too many requests. Please wait a minute and try again.' }, { status: 429 });
  }

  record.count += 1;
  return null;
}
