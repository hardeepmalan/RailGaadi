// ─── Train & Station ──────────────────────────────────────────────────────────

export interface Train {
  id: string;
  number: string;
  name: string;
  type: 'express' | 'superfast' | 'mail' | 'passenger' | 'rajdhani' | 'shatabdi' | 'vande_bharat' | 'duronto';
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  daysOfOperation: string[];
  distance: number; // km
}

export interface Station {
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  scheduledArrival: string;
  scheduledDeparture: string;
  actualArrival?: string;
  actualDeparture?: string;
  distance: number; // km from source
  halt: number; // minutes
  platform?: number;
  status: 'departed' | 'arrived' | 'upcoming' | 'current';
  delay?: number; // minutes
}

// ─── Live Status ──────────────────────────────────────────────────────────────

export interface LiveStatus {
  trainNumber: string;
  trainName: string;
  latitude: number;
  longitude: number;
  speed: number; // km/h
  delay: number; // minutes (negative = early)
  eta: string; // ISO datetime
  currentStation: Station;
  nextStation: Station;
  allStations: Station[];
  distanceCovered: number; // km
  distanceRemaining: number; // km
  totalDistance: number; // km
  completionPercent: number;
  lastUpdated: string; // ISO datetime
  status: 'running' | 'at_station' | 'delayed' | 'cancelled' | 'completed' | 'not_started';
  avgSpeed: number;
  maxElevation?: number;
  journeyStarted: string; // ISO datetime
}

// ─── Weather ──────────────────────────────────────────────────────────────────

export interface WeatherForecast {
  time: string;
  temperature: number;
  rainProbability: number;
  icon: string;
  description: string;
}

export interface WeatherData {
  stationCode: string;
  stationName: string;
  temperature: number; // Celsius
  feelsLike: number;
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: string;
  description: string;
  icon: string;
  rainProbability: number; // %
  visibility: number; // km
  pressure: number; // hPa
  uvIndex: number;
  rainSummary?: {
    willRain: boolean;
    rainProbabilityMax: number;
    summaryText: string;
  };
  forecast: WeatherForecast[];
}

// ─── Nearby Places ────────────────────────────────────────────────────────────

export type PlaceCategory =
  | 'attraction'
  | 'river'
  | 'mountain'
  | 'bridge'
  | 'tunnel'
  | 'city'
  | 'lake'
  | 'ghat';

export interface NearbyPlace {
  id: string;
  name: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  distance: number; // km from track
  description: string;
  wikiUrl?: string;
  imageUrl?: string;
}

// ─── Elevation ────────────────────────────────────────────────────────────────

export interface ElevationPoint {
  distance: number; // km from source
  elevation: number; // meters
  latitude: number;
  longitude: number;
}

export interface ElevationProfile {
  points: ElevationPoint[];
  maxElevation: number;
  minElevation: number;
  totalAscent: number;
  totalDescent: number;
  highestPoint: { name: string; elevation: number };
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface DelayDataPoint {
  station: string;
  stationCode: string;
  scheduledTime: string;
  actualTime: string;
  delay: number;
}

export interface JourneyAnalytics {
  completionPercent: number;
  totalDistance: number;
  coveredDistance: number;
  avgSpeed: number;
  maxSpeed: number;
  totalDelay: number;
  onTimePercent: number;
  elevation: ElevationProfile;
  delayTimeline: DelayDataPoint[];
}

// ─── User Preferences ─────────────────────────────────────────────────────────

export interface Favorite {
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  createdAt: string; // ISO datetime
}

export interface RecentSearch {
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  searchedAt: string; // ISO datetime
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  cached?: boolean;
  timestamp: string;
}

export interface SearchResult {
  trains: Train[];
  query: string;
  total: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  image?: string;
  favorites: Favorite[];
  recentSearches: RecentSearch[];
  createdAt: string;
}
