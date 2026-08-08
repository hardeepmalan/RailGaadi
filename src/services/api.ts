import { Train, SearchResult, LiveStatus, WeatherData, NearbyPlace, ElevationProfile } from '@/types';

const API_BASE = '/api';

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Train Search ─────────────────────────────────────────────────────────────

export async function searchTrains(query: string): Promise<SearchResult> {
  return apiFetch<SearchResult>(`/trains/search?q=${encodeURIComponent(query)}`);
}

// ─── Live Status ──────────────────────────────────────────────────────────────

export async function getLiveStatus(trainNumber: string): Promise<LiveStatus> {
  return apiFetch<LiveStatus>(`/train/${trainNumber}/live`);
}

// ─── Weather ──────────────────────────────────────────────────────────────────

export async function getWeather(stationCode: string): Promise<WeatherData> {
  return apiFetch<WeatherData>(`/weather/${stationCode}`);
}

// ─── Nearby Places ────────────────────────────────────────────────────────────

export async function getNearbyPlaces(
  lat: number,
  lon: number,
  type?: string,
  radius?: number
): Promise<NearbyPlace[]> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    ...(type ? { type } : {}),
    ...(radius ? { radius: String(radius) } : {}),
  });
  return apiFetch<NearbyPlace[]>(`/places?${params}`);
}

// ─── Elevation ────────────────────────────────────────────────────────────────

export async function getElevation(trainNumber: string): Promise<ElevationProfile> {
  return apiFetch<ElevationProfile>(`/elevation?train=${trainNumber}`);
}
