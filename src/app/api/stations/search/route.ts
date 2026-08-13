import { NextRequest, NextResponse } from 'next/server';
import { searchStations } from '@/data/indianStations';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!q || q.length < 1) {
    return NextResponse.json({ stations: [], query: q, total: 0 });
  }

  const stations = searchStations(q, Math.min(limit, 20));
  return NextResponse.json({ stations, query: q, total: stations.length });
}
