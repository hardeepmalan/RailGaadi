import { NextRequest, NextResponse } from 'next/server';
import { TRAINS_DB, findOrGenerateTrain } from '@/data/trains';
import { Train } from '@/types';

const cache = new Map<string, { data: Train[]; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawQuery = (searchParams.get('q') || '').trim();
  const query = rawQuery.toLowerCase();

  if (!query || query.length < 1) {
    return NextResponse.json({ trains: [], query: rawQuery, total: 0 });
  }

  const cached = cache.get(query);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json({ trains: cached.data, query: rawQuery, total: cached.data.length, cached: true });
  }

  const railradarKey = process.env.RAILRADAR_API_KEY;
  const railradarBase = process.env.RAILRADAR_BASE_URL || 'https://api.railradar.in/v1';

  let trains: Train[] = [];

  if (railradarKey) {
    try {
      const res = await fetch(`${railradarBase}/trains/search?q=${encodeURIComponent(rawQuery)}`, {
        headers: {
          'Authorization': `Bearer ${railradarKey}`,
          'x-api-key': railradarKey,
        },
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.trains) && data.trains.length > 0) {
          trains = data.trains;
        }
      }
    } catch {
      // Fall through to local database and generator
    }
  }

  // Filter local DB first
  if (trains.length === 0) {
    trains = TRAINS_DB.filter(
      (t) =>
        t.number.includes(query) ||
        t.name.toLowerCase().includes(query) ||
        t.fromCode.toLowerCase().includes(query) ||
        t.toCode.toLowerCase().includes(query) ||
        t.from.toLowerCase().includes(query) ||
        t.to.toLowerCase().includes(query)
    );
  }

  // If query is a 5-digit number or specific train query not in local list, dynamically generate it!
  if (trains.length === 0 && (/\d{4,5}/.test(query) || query.length >= 2)) {
    const generated = findOrGenerateTrain(rawQuery);
    trains = [generated];
  }

  cache.set(query, { data: trains, expires: Date.now() + CACHE_TTL });

  return NextResponse.json({ trains, query: rawQuery, total: trains.length });
}
