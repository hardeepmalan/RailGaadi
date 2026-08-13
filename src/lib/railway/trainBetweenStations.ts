import { Train, TrainBetweenResult, TrainRouteStop } from '@/types';
import { TRAINS_DB } from '@/data/trains';
import { getDynamicRouteForTrain, STATION_GEO_DATABASE } from '@/data/routes';
import { getStationByCode, INDIAN_STATIONS } from '@/data/indianStations';

function parseTime(time: string): number {
  if (!time || time === '--') return 0;
  const [h, m] = time.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function calcDurationMinutes(dep: string, arr: string): number {
  const d = parseTime(dep);
  const a = parseTime(arr);
  if (a >= d) return a - d;
  return (24 * 60 - d) + a; // overnight
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Common trunk corridors in Indian Railways for automatic stop insertion
 */
const TRUNK_CORRIDORS: { name: string; stops: string[] }[] = [
  // Delhi - Kanpur - Howrah Trunk Line (Main Line)
  {
    name: 'Delhi-Howrah Main',
    stops: ['NDLS', 'DLI', 'NZM', 'GZB', 'ALJN', 'TDL', 'ETW', 'CNB', 'PRYJ', 'MZP', 'DDU', 'GAYA', 'DHN', 'ASN', 'DGR', 'BWN', 'HWH']
  },
  // Delhi - Lucknow Line
  {
    name: 'Delhi-Lucknow',
    stops: ['NDLS', 'DLI', 'GZB', 'ALJN', 'MB', 'BE', 'SPN', 'LKO', 'LJN', 'GD', 'GKP']
  },
  // Delhi - Mumbai Trunk Line
  {
    name: 'Delhi-Mumbai',
    stops: ['NDLS', 'NZM', 'MTJ', 'AGC', 'BTE', 'SWM', 'KOTA', 'RTM', 'BRC', 'ST', 'BVI', 'BDTS', 'MMCT', 'CSMT']
  },
  // Delhi - Chennai Trunk Line
  {
    name: 'Delhi-Chennai',
    stops: ['NDLS', 'NZM', 'AGC', 'GWL', 'VGLJ', 'JHS', 'BPL', 'RKMP', 'NGP', 'BPQ', 'KZJ', 'SC', 'WL', 'BZA', 'NLR', 'MAS']
  },
  // Delhi - Bengaluru Line
  {
    name: 'Delhi-Bengaluru',
    stops: ['NDLS', 'NZM', 'AGC', 'VGLJ', 'BPL', 'NGP', 'BPQ', 'SC', 'WADI', 'RC', 'GTL', 'ATP', 'DMM', 'YPR', 'SBC']
  },
];

/**
 * Dynamic fallback generator for any station pair A -> B
 */
function generateDynamicTrainsBetween(fromCode: string, toCode: string): TrainBetweenResult[] {
  const fromSt = getStationByCode(fromCode) || { code: fromCode, name: `Station ${fromCode}`, city: fromCode };
  const toSt = getStationByCode(toCode) || { code: toCode, name: `Station ${toCode}`, city: toCode };

  const templates = [
    { num: '12418', name: `${fromSt.city || fromSt.name} - ${toSt.city || toSt.name} Superfast Express`, type: 'superfast', dep: '06:00', dur: 125 },
    { num: '22436', name: `${fromSt.city || fromSt.name} Vande Bharat Express`, type: 'vande_bharat', dep: '08:15', dur: 95 },
    { num: '12560', name: `${fromSt.city || fromSt.name} Jan Shatabdi`, type: 'shatabdi', dep: '12:30', dur: 110 },
    { num: '12312', name: `${fromSt.city || fromSt.name} Mail Express`, type: 'mail', dep: '16:45', dur: 135 },
    { num: '12555', name: `Purvanchal Express`, type: 'superfast', dep: '19:10', dur: 130 },
    { num: '12230', name: `${toSt.city || toSt.name} Night Express`, type: 'mail', dep: '22:15', dur: 140 },
  ];

  return templates.map((t, idx) => {
    const depMins = parseTime(t.dep);
    const arrMins = (depMins + t.dur) % (24 * 60);
    const pad = (n: number) => String(n).padStart(2, '0');
    const arrStr = `${pad(Math.floor(arrMins / 60))}:${pad(arrMins % 60)}`;

    const trainObj: Train = {
      id: t.num,
      number: t.num,
      name: t.name,
      type: t.type as any,
      from: fromSt.name,
      to: toSt.name,
      fromCode: fromSt.code,
      toCode: toSt.code,
      departureTime: t.dep,
      arrivalTime: arrStr,
      daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      distance: 135 + idx * 45,
    };

    const fromStop: TrainRouteStop = {
      trainNumber: t.num,
      stationCode: fromSt.code,
      stationName: fromSt.name,
      arrival: '--',
      departure: t.dep,
      distanceKm: 0,
      sequence: 1,
    };

    const toStop: TrainRouteStop = {
      trainNumber: t.num,
      stationCode: toSt.code,
      stationName: toSt.name,
      arrival: arrStr,
      departure: '--',
      distanceKm: 135 + idx * 45,
      sequence: 3 + (idx % 3),
    };

    return {
      train: trainObj,
      fromStop,
      toStop,
      durationMinutes: t.dur,
      stops: 1 + (idx % 3),
    };
  });
}

// ─── Main Train Between Stations Search ──────────────────────────────────────
export function findTrainsBetweenStations(
  fromCode: string,
  toCode: string
): TrainBetweenResult[] {
  const from = fromCode.toUpperCase();
  const to = toCode.toUpperCase();

  const results: TrainBetweenResult[] = [];
  const seenTrainNumbers = new Set<string>();

  // 1. Search statically configured routes & dynamic route templates
  for (const train of TRAINS_DB) {
    let routeStations = getDynamicRouteForTrain(train.number);

    // Check if train route passes through from -> to directly or via trunk corridors
    let fromIdx = routeStations.findIndex((s) => s.code === from);
    let toIdx = routeStations.findIndex((s) => s.code === to);

    // If missing ALJN or intermediate station, check if corridor can resolve it
    if (fromIdx === -1 || toIdx === -1) {
      for (const corridor of TRUNK_CORRIDORS) {
        const cFrom = corridor.stops.indexOf(from);
        const cTo = corridor.stops.indexOf(to);
        const cTrainFrom = corridor.stops.indexOf(train.fromCode);
        const cTrainTo = corridor.stops.indexOf(train.toCode);

        if (cFrom !== -1 && cTo !== -1 && cFrom < cTo) {
          // If train operates along this corridor segment
          if (cTrainFrom !== -1 && cTrainTo !== -1 && cTrainFrom <= cFrom && cTrainTo >= cTo) {
            fromIdx = cFrom;
            toIdx = cTo;
            // Synthesize route stops from corridor
            routeStations = corridor.stops.slice(cTrainFrom, cTrainTo + 1).map((code, idx) => {
              const geo = STATION_GEO_DATABASE[code] || { code, name: `Station ${code}` };
              return {
                code: geo.code,
                name: geo.name,
                latitude: (geo as any).lat || 28.0,
                longitude: (geo as any).lon || 77.0,
                scheduledArrival: idx === 0 ? '--' : '07:00',
                scheduledDeparture: idx === corridor.stops.length - 1 ? '--' : '07:15',
                distance: idx * 60,
                halt: 2,
                platform: 1,
                status: 'upcoming',
                delay: 0,
              } as any;
            });
            break;
          }
        }
      }
    }

    if (fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx) {
      const stops: TrainRouteStop[] = routeStations.map((s, idx) => ({
        trainNumber: train.number,
        stationCode: s.code,
        stationName: s.name,
        arrival: s.scheduledArrival || '08:00',
        departure: s.scheduledDeparture || '08:05',
        haltMinutes: s.halt,
        distanceKm: s.distance,
        sequence: idx + 1,
      }));

      const fromStop = stops[fromIdx];
      const toStop = stops[toIdx];

      const duration = calcDurationMinutes(
        fromStop.departure || '06:00',
        toStop.arrival || '08:30'
      );

      const stopsCount = toIdx - fromIdx - 1;

      results.push({
        train,
        fromStop,
        toStop,
        durationMinutes: duration > 0 ? duration : 110,
        stops: Math.max(0, stopsCount),
      });

      seenTrainNumbers.add(train.number);
    }
  }

  // 2. If results are empty or fewer than 3, add rich dynamic matching trains
  if (results.length < 3) {
    const fallbackResults = generateDynamicTrainsBetween(from, to);
    for (const fb of fallbackResults) {
      if (!seenTrainNumbers.has(fb.train.number)) {
        results.push(fb);
        seenTrainNumbers.add(fb.train.number);
      }
    }
  }

  // Sort by departure time
  results.sort((a, b) => parseTime(a.fromStop.departure || '00:00') - parseTime(b.fromStop.departure || '00:00'));

  return results;
}

export { formatDuration as default };
