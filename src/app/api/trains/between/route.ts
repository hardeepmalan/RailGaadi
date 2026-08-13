import { NextRequest, NextResponse } from 'next/server';
import { findTrainsBetweenStations } from '@/lib/railway/trainBetweenStations';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = (searchParams.get('from') || '').toUpperCase().trim();
  const to = (searchParams.get('to') || '').toUpperCase().trim();

  if (!from || !to) {
    return NextResponse.json({ error: 'from and to station codes are required' }, { status: 400 });
  }

  if (from === to) {
    return NextResponse.json({ error: 'From and To stations cannot be the same' }, { status: 400 });
  }

  let results: any[] = [];
  const railradarKey = process.env.RAILRADAR_API_KEY;
  const railradarBase = process.env.RAILRADAR_BASE_URL || 'https://api.railradar.in/v1';

  if (railradarKey) {
    try {
      const res = await fetch(`${railradarBase}/trains/between?from=${from}&to=${to}`, {
        headers: {
          'Authorization': `Bearer ${railradarKey}`,
          'x-api-key': railradarKey,
        },
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results)) {
          results = data.results;
        }
      }
    } catch (err) {
      // Fall through to local matching
    }
  }

  if (results.length === 0) {
    results = findTrainsBetweenStations(from, to);
  }

  return NextResponse.json({
    results,
    from,
    to,
    total: results.length,
  });
}
