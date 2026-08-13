import { Station } from '@/types';

// Station location geocoding database for Indian Railways junctions & stations
export interface StationGeo {
  code: string;
  name: string;
  lat: number;
  lon: number;
  city: string;
  state: string;
}

export const STATION_GEO_DATABASE: Record<string, StationGeo> = {
  HWH: { code: 'HWH', name: 'Howrah Junction', lat: 22.5839, lon: 88.3427, city: 'Kolkata', state: 'West Bengal' },
  DKAE: { code: 'DKAE', name: 'Dankuni Junction', lat: 22.6836, lon: 88.2729, city: 'Dankuni', state: 'West Bengal' },
  BWN: { code: 'BWN', name: 'Barddhaman Junction', lat: 23.2324, lon: 87.8615, city: 'Bardhaman', state: 'West Bengal' },
  DGR: { code: 'DGR', name: 'Durgapur', lat: 23.5004, lon: 87.3119, city: 'Durgapur', state: 'West Bengal' },
  ASN: { code: 'ASN', name: 'Asansol Junction', lat: 23.6834, lon: 86.9612, city: 'Asansol', state: 'West Bengal' },
  DHN: { code: 'DHN', name: 'Dhanbad Junction', lat: 23.7957, lon: 86.4304, city: 'Dhanbad', state: 'Jharkhand' },
  PNME: { code: 'PNME', name: 'Parasnath', lat: 23.9782, lon: 86.0363, city: 'Isri', state: 'Jharkhand' },
  KQR: { code: 'KQR', name: 'Koderma Junction', lat: 24.4673, lon: 85.5946, city: 'Koderma', state: 'Jharkhand' },
  GAYA: { code: 'GAYA', name: 'Gaya Junction', lat: 24.7955, lon: 84.9994, city: 'Gaya', state: 'Bihar' },
  DOS: { code: 'DOS', name: 'Dehri On Sone', lat: 24.9100, lon: 84.1800, city: 'Dehri', state: 'Bihar' },
  SSM: { code: 'SSM', name: 'Sasaram Junction', lat: 24.9500, lon: 84.0300, city: 'Sasaram', state: 'Bihar' },
  DDU: { code: 'DDU', name: 'Pt. Deen Dayal Upadhyaya Jn', lat: 25.2777, lon: 83.1186, city: 'Mughalsarai', state: 'Uttar Pradesh' },
  MGS: { code: 'MGS', name: 'Pt. Deen Dayal Upadhyaya Jn', lat: 25.2777, lon: 83.1186, city: 'Mughalsarai', state: 'Uttar Pradesh' },
  BSB: { code: 'BSB', name: 'Varanasi Junction', lat: 25.3176, lon: 82.9739, city: 'Varanasi', state: 'Uttar Pradesh' },
  PRYJ: { code: 'PRYJ', name: 'Prayagraj Junction', lat: 25.4358, lon: 81.8463, city: 'Prayagraj', state: 'Uttar Pradesh' },
  ALD: { code: 'ALD', name: 'Prayagraj Junction', lat: 25.4358, lon: 81.8463, city: 'Prayagraj', state: 'Uttar Pradesh' },
  CNB: { code: 'CNB', name: 'Kanpur Central', lat: 26.4499, lon: 80.3319, city: 'Kanpur', state: 'Uttar Pradesh' },
  ETW: { code: 'ETW', name: 'Etawah Junction', lat: 26.7766, lon: 79.0238, city: 'Etawah', state: 'Uttar Pradesh' },
  TDL: { code: 'TDL', name: 'Tundla Junction', lat: 27.2069, lon: 78.2435, city: 'Tundla', state: 'Uttar Pradesh' },
  AGC: { code: 'AGC', name: 'Agra Cantt', lat: 27.1597, lon: 78.0069, city: 'Agra', state: 'Uttar Pradesh' },
  MTJ: { code: 'MTJ', name: 'Mathura Junction', lat: 27.4924, lon: 77.6737, city: 'Mathura', state: 'Uttar Pradesh' },
  ALJN: { code: 'ALJN', name: 'Aligarh Junction', lat: 27.8974, lon: 78.0880, city: 'Aligarh', state: 'Uttar Pradesh' },
  GZB: { code: 'GZB', name: 'Ghaziabad Junction', lat: 28.6635, lon: 77.4363, city: 'Ghaziabad', state: 'Uttar Pradesh' },
  NDLS: { code: 'NDLS', name: 'New Delhi', lat: 28.6422, lon: 77.2194, city: 'New Delhi', state: 'Delhi' },
  NZM: { code: 'NZM', name: 'Hazrat Nizamuddin', lat: 28.5891, lon: 77.2541, city: 'New Delhi', state: 'Delhi' },
  DLI: { code: 'DLI', name: 'Old Delhi Junction', lat: 28.6617, lon: 77.2274, city: 'Delhi', state: 'Delhi' },
  MMCT: { code: 'MMCT', name: 'Mumbai Central', lat: 18.9690, lon: 72.8205, city: 'Mumbai', state: 'Maharashtra' },
  CSMT: { code: 'CSMT', name: 'CSMT Mumbai', lat: 18.9400, lon: 72.8350, city: 'Mumbai', state: 'Maharashtra' },
  BDTS: { code: 'BDTS', name: 'Bandra Terminus', lat: 19.0620, lon: 72.8410, city: 'Mumbai', state: 'Maharashtra' },
  BVI: { code: 'BVI', name: 'Borivali', lat: 19.2290, lon: 72.8570, city: 'Mumbai', state: 'Maharashtra' },
  ST: { code: 'ST', name: 'Surat', lat: 21.2040, lon: 72.8410, city: 'Surat', state: 'Gujarat' },
  BRC: { code: 'BRC', name: 'Vadodara Junction', lat: 22.3119, lon: 73.1723, city: 'Vadodara', state: 'Gujarat' },
  ADI: { code: 'ADI', name: 'Ahmedabad Junction', lat: 23.0225, lon: 72.5714, city: 'Ahmedabad', state: 'Gujarat' },
  RTM: { code: 'RTM', name: 'Ratlam Junction', lat: 23.3315, lon: 75.0367, city: 'Ratlam', state: 'Madhya Pradesh' },
  KOTA: { code: 'KOTA', name: 'Kota Junction', lat: 25.1802, lon: 75.8469, city: 'Kota', state: 'Rajasthan' },
  SWM: { code: 'SWM', name: 'Sawai Madhopur Jn', lat: 26.0221, lon: 76.3564, city: 'Sawai Madhopur', state: 'Rajasthan' },
  BTE: { code: 'BTE', name: 'Bharatpur Junction', lat: 27.2183, lon: 77.4894, city: 'Bharatpur', state: 'Rajasthan' },
  SBC: { code: 'SBC', name: 'KSR Bengaluru', lat: 12.9780, lon: 77.5694, city: 'Bengaluru', state: 'Karnataka' },
  YPR: { code: 'YPR', name: 'Yesvantpur Junction', lat: 13.0234, lon: 77.5504, city: 'Bengaluru', state: 'Karnataka' },
  DMM: { code: 'DMM', name: 'Dharmavaram Junction', lat: 14.4140, lon: 77.7190, city: 'Dharmavaram', state: 'Andhra Pradesh' },
  ATP: { code: 'ATP', name: 'Anantapur', lat: 14.6819, lon: 77.6006, city: 'Anantapur', state: 'Andhra Pradesh' },
  GTL: { code: 'GTL', name: 'Guntakal Junction', lat: 15.1690, lon: 77.3680, city: 'Guntakal', state: 'Andhra Pradesh' },
  RC: { code: 'RC', name: 'Raichur Junction', lat: 16.2060, lon: 77.3560, city: 'Raichur', state: 'Karnataka' },
  WADI: { code: 'WADI', name: 'Wadi Junction', lat: 17.0500, lon: 76.9800, city: 'Wadi', state: 'Karnataka' },
  SC: { code: 'SC', name: 'Secunderabad Junction', lat: 17.4338, lon: 78.5017, city: 'Hyderabad', state: 'Telangana' },
  KZJ: { code: 'KZJ', name: 'Kazipet Junction', lat: 17.9780, lon: 79.5240, city: 'Warangal', state: 'Telangana' },
  BPQ: { code: 'BPQ', name: 'Balharshah', lat: 19.8500, lon: 79.3500, city: 'Chandrapur', state: 'Maharashtra' },
  NGP: { code: 'NGP', name: 'Nagpur Junction', lat: 21.1500, lon: 79.0880, city: 'Nagpur', state: 'Maharashtra' },
  BPL: { code: 'BPL', name: 'Bhopal Junction', lat: 23.2599, lon: 77.4126, city: 'Bhopal', state: 'Madhya Pradesh' },
  RKMP: { code: 'RKMP', name: 'Rani Kamlapati', lat: 23.2100, lon: 77.4400, city: 'Bhopal', state: 'Madhya Pradesh' },
  VGLJ: { code: 'VGLJ', name: 'VGL Jhansi Junction', lat: 25.4484, lon: 78.5685, city: 'Jhansi', state: 'Uttar Pradesh' },
  JHS: { code: 'JHS', name: 'VGL Jhansi Junction', lat: 25.4484, lon: 78.5685, city: 'Jhansi', state: 'Uttar Pradesh' },
  GWL: { code: 'GWL', name: 'Gwalior Junction', lat: 26.2183, lon: 78.1828, city: 'Gwalior', state: 'Madhya Pradesh' },
  MAS: { code: 'MAS', name: 'MGR Chennai Central', lat: 13.0827, lon: 80.2707, city: 'Chennai', state: 'Tamil Nadu' },
  NLR: { code: 'NLR', name: 'Nellore', lat: 14.4426, lon: 79.9865, city: 'Nellore', state: 'Andhra Pradesh' },
  BZA: { code: 'BZA', name: 'Vijayawada Junction', lat: 16.5062, lon: 80.6480, city: 'Vijayawada', state: 'Andhra Pradesh' },
  WL: { code: 'WL', name: 'Warangal', lat: 17.9689, lon: 79.5941, city: 'Warangal', state: 'Telangana' },
  TVC: { code: 'TVC', name: 'Thiruvananthapuram Central', lat: 8.4870, lon: 76.9525, city: 'Thiruvananthapuram', state: 'Kerala' },
  ERS: { code: 'ERS', name: 'Ernakulam Junction', lat: 9.9689, lon: 76.2880, city: 'Kochi', state: 'Kerala' },
  CLT: { code: 'CLT', name: 'Kozhikode', lat: 11.2479, lon: 75.7820, city: 'Kozhikode', state: 'Kerala' },
  MAJN: { code: 'MAJN', name: 'Mangaluru Junction', lat: 12.8680, lon: 74.8690, city: 'Mangaluru', state: 'Karnataka' },
  UD: { code: 'UD', name: 'Udupi', lat: 13.3409, lon: 74.7421, city: 'Udupi', state: 'Karnataka' },
  MAAO: { code: 'MAAO', name: 'Madgaon Junction', lat: 15.2730, lon: 73.9580, city: 'Madgaon', state: 'Goa' },
  RN: { code: 'RN', name: 'Ratnagiri', lat: 16.9800, lon: 73.3000, city: 'Ratnagiri', state: 'Maharashtra' },
  PNVL: { code: 'PNVL', name: 'Panvel Junction', lat: 18.9890, lon: 73.1180, city: 'Panvel', state: 'Maharashtra' },
  PUNE: { code: 'PUNE', name: 'Pune Junction', lat: 18.5204, lon: 73.8567, city: 'Pune', state: 'Maharashtra' },
  SUR: { code: 'SUR', name: 'Solapur', lat: 17.6599, lon: 75.9064, city: 'Solapur', state: 'Maharashtra' },
  ASR: { code: 'ASR', name: 'Amritsar Junction', lat: 31.6340, lon: 74.8723, city: 'Amritsar', state: 'Punjab' },
  JUC: { code: 'JUC', name: 'Jalandhar City', lat: 31.3260, lon: 75.5760, city: 'Jalandhar', state: 'Punjab' },
  LDH: { code: 'LDH', name: 'Ludhiana Junction', lat: 30.9010, lon: 75.8570, city: 'Ludhiana', state: 'Punjab' },
  UMB: { code: 'UMB', name: 'Ambala Cantt Junction', lat: 30.3340, lon: 76.8370, city: 'Ambala', state: 'Haryana' },
  PNP: { code: 'PNP', name: 'Panipat Junction', lat: 29.3909, lon: 76.9635, city: 'Panipat', state: 'Haryana' },
  SVDK: { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', lat: 32.9900, lon: 74.9300, city: 'Katra', state: 'Jammu and Kashmir' },
  JAT: { code: 'JAT', name: 'Jammu Tawi', lat: 32.7060, lon: 74.8800, city: 'Jammu', state: 'Jammu and Kashmir' },
};

/**
 * Route definition for popular trains
 */
export const POPULAR_ROUTES: Record<string, Station[]> = {
  '12301': [
    { code: 'HWH', name: 'Howrah Junction', latitude: 22.5839, longitude: 88.3427, scheduledArrival: '--', scheduledDeparture: '16:50', distance: 0, halt: 0, platform: 9, status: 'departed', delay: 0 },
    { code: 'ASN', name: 'Asansol Junction', latitude: 23.6834, longitude: 86.9612, scheduledArrival: '18:57', scheduledDeparture: '19:00', distance: 200, halt: 3, platform: 3, status: 'departed', delay: 2 },
    { code: 'DHN', name: 'Dhanbad Junction', latitude: 23.7957, longitude: 86.4304, scheduledArrival: '19:55', scheduledDeparture: '20:00', distance: 259, halt: 5, platform: 2, status: 'departed', delay: 4 },
    { code: 'GAYA', name: 'Gaya Junction', latitude: 24.7955, longitude: 84.9994, scheduledArrival: '22:30', scheduledDeparture: '22:33', distance: 459, halt: 3, platform: 1, status: 'current', delay: 6 },
    { code: 'DDU', name: 'Pt. Deen Dayal Upadhyaya Jn', latitude: 25.2777, longitude: 83.1186, scheduledArrival: '00:45', scheduledDeparture: '00:55', distance: 664, halt: 10, platform: 4, status: 'upcoming', delay: 0 },
    { code: 'PRYJ', name: 'Prayagraj Junction', latitude: 25.4358, longitude: 81.8463, scheduledArrival: '02:43', scheduledDeparture: '02:45', distance: 817, halt: 2, platform: 1, status: 'upcoming', delay: 0 },
    { code: 'CNB', name: 'Kanpur Central', latitude: 26.4499, longitude: 80.3319, scheduledArrival: '04:50', scheduledDeparture: '04:55', distance: 1011, halt: 5, platform: 1, status: 'upcoming', delay: 0 },
    { code: 'NDLS', name: 'New Delhi', latitude: 28.6422, longitude: 77.2194, scheduledArrival: '10:05', scheduledDeparture: '--', distance: 1447, halt: 0, platform: 16, status: 'upcoming', delay: 0 },
  ],
  '12951': [
    { code: 'MMCT', name: 'Mumbai Central', latitude: 18.9690, longitude: 72.8205, scheduledArrival: '--', scheduledDeparture: '17:00', distance: 0, halt: 0, platform: 1, status: 'departed', delay: 0 },
    { code: 'BVI', name: 'Borivali', latitude: 19.2290, longitude: 72.8570, scheduledArrival: '17:22', scheduledDeparture: '17:24', distance: 30, halt: 2, platform: 6, status: 'departed', delay: 1 },
    { code: 'ST', name: 'Surat', latitude: 21.2040, longitude: 72.8410, scheduledArrival: '19:43', scheduledDeparture: '19:48', distance: 263, halt: 5, platform: 1, status: 'departed', delay: 3 },
    { code: 'BRC', name: 'Vadodara Junction', latitude: 22.3119, longitude: 73.1723, scheduledArrival: '21:06', scheduledDeparture: '21:16', distance: 393, halt: 10, platform: 2, status: 'current', delay: 5 },
    { code: 'RTM', name: 'Ratlam Junction', latitude: 23.3315, longitude: 75.0367, scheduledArrival: '00:05', scheduledDeparture: '00:08', distance: 653, halt: 3, platform: 1, status: 'upcoming', delay: 0 },
    { code: 'KOTA', name: 'Kota Junction', latitude: 25.1802, longitude: 75.8469, scheduledArrival: '03:15', scheduledDeparture: '03:25', distance: 920, halt: 10, platform: 1, status: 'upcoming', delay: 0 },
    { code: 'NDLS', name: 'New Delhi', latitude: 28.6422, longitude: 77.2194, scheduledArrival: '08:32', scheduledDeparture: '--', distance: 1386, halt: 0, platform: 12, status: 'upcoming', delay: 0 },
  ],
};

/**
 * Get dynamic route for ANY train number
 */
export function getDynamicRouteForTrain(trainNumber: string): Station[] {
  if (POPULAR_ROUTES[trainNumber]) {
    return POPULAR_ROUTES[trainNumber];
  }

  // Pre-configured dynamic routes for popular codes
  const routeTemplates: Record<string, string[]> = {
    '12627': ['SBC', 'DMM', 'ATP', 'GTL', 'RC', 'WADI', 'SC', 'KZJ', 'BPQ', 'NGP', 'BPL', 'VGLJ', 'AGC', 'NDLS'],
    '12628': ['NDLS', 'AGC', 'VGLJ', 'BPL', 'NGP', 'BPQ', 'KZJ', 'SC', 'WADI', 'RC', 'GTL', 'ATP', 'DMM', 'SBC'],
    '12001': ['RKMP', 'BPL', 'VGLJ', 'GWL', 'AGC', 'MTJ', 'NDLS'],
    '12002': ['NDLS', 'MTJ', 'AGC', 'GWL', 'VGLJ', 'BPL', 'RKMP'],
    '22439': ['NDLS', 'UMB', 'LDH', 'JAT', 'SVDK'],
    '22436': ['NDLS', 'CNB', 'PRYJ', 'BSB'],
    '12809': ['HWH', 'ASN', 'DHN', 'GAYA', 'DDU', 'JHS', 'NGP', 'PUNE', 'CSMT'],
    '12621': ['MAS', 'NLR', 'BZA', 'WL', 'BPQ', 'NGP', 'BPL', 'VGLJ', 'AGC', 'NDLS'],
    '12431': ['TVC', 'ERS', 'CLT', 'MAJN', 'UD', 'MAAO', 'RN', 'PNVL', 'BRC', 'KOTA', 'NZM'],
    '12559': ['BSB', 'PRYJ', 'CNB', 'ALJN', 'NDLS'],
    '12560': ['NDLS', 'ALJN', 'CNB', 'PRYJ', 'BSB'],
    '12229': ['NDLS', 'GZB', 'ALJN', 'MB', 'BE', 'SPN', 'LKO'],
    '12230': ['LKO', 'SPN', 'BE', 'MB', 'ALJN', 'GZB', 'NDLS'],
    '12003': ['NDLS', 'GZB', 'ALJN', 'CNB', 'LKO'],
    '12004': ['LKO', 'CNB', 'ALJN', 'GZB', 'NDLS'],
    '12555': ['NDLS', 'GZB', 'ALJN', 'CNB', 'LKO', 'GD', 'GKP'],
    '12556': ['GKP', 'GD', 'LKO', 'CNB', 'ALJN', 'GZB', 'NDLS'],
    '12903': ['MMCT', 'BVI', 'ST', 'BRC', 'RTM', 'KOTA', 'NZM', 'NDLS', 'UMB', 'LDH', 'JUC', 'ASR'],
    '12025': ['SC', 'WADI', 'SUR', 'PUNE'],
    '12137': ['CSMT', 'BDTS', 'ST', 'BRC', 'RTM', 'KOTA', 'NDLS', 'PNP', 'UMB', 'LDH', 'FZR'],
    '12260': ['NDLS', 'CNB', 'DDU', 'DHN', 'ASN', 'HWH'],
    '22691': ['SBC', 'DMM', 'GTL', 'RC', 'SC', 'BPQ', 'NGP', 'BPL', 'VGLJ', 'AGC', 'NZM'],
  };

  const codes = routeTemplates[trainNumber] || ['NDLS', 'CNB', 'PRYJ', 'DDU', 'GAYA', 'DHN', 'ASN', 'HWH'];

  let cumDist = 0;
  return codes.map((code, idx) => {
    const geo = STATION_GEO_DATABASE[code] || {
      code,
      name: `Station ${code}`,
      lat: 20.5 + idx * 1.2,
      lon: 78.9 + idx * 1.5,
      city: code,
      state: 'India',
    };
    if (idx > 0) cumDist += 120 + Math.floor((idx * 37) % 80);

    const depHour = (6 + idx * 2) % 24;
    const arrHour = (depHour + 23) % 24;
    const pad = (n: number) => String(n).padStart(2, '0');

    return {
      code: geo.code,
      name: geo.name,
      latitude: geo.lat,
      longitude: geo.lon,
      scheduledArrival: idx === 0 ? '--' : `${pad(arrHour)}:20`,
      scheduledDeparture: idx === codes.length - 1 ? '--' : `${pad(depHour)}:30`,
      distance: cumDist,
      halt: idx === 0 || idx === codes.length - 1 ? 0 : 2 + (idx % 4),
      platform: (idx % 8) + 1,
      status: idx < 2 ? 'departed' : idx === 2 ? 'current' : 'upcoming',
      delay: idx <= 2 ? (idx * 3) : 0,
    };
  });
}

/**
 * Get polyline coordinate array [lon, lat][] for MapLibre
 */
export function getRouteCoordinates(trainNumber: string): [number, number][] {
  const stations = getDynamicRouteForTrain(trainNumber);
  return stations.map((s) => [s.longitude, s.latitude]);
}
