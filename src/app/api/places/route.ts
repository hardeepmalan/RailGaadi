import { NextRequest, NextResponse } from 'next/server';
import { NearbyPlace, PlaceCategory } from '@/types';

const OVERPASS_URL = process.env.OVERPASS_BASE_URL || 'https://overpass-api.de/api/interpreter';

const OVERPASS_QUERIES: Record<string, string> = {
  river: 'waterway~"river|stream"',
  lake: 'natural~"water|lake"',
  mountain: 'natural~"peak|mountain|hill"',
  bridge: 'man_made="bridge"',
  tunnel: 'tunnel="yes"',
  attraction: 'tourism~"attraction|viewpoint|museum|historic"',
  city: 'place~"city|town"',
  ghat: 'amenity="ghat"',
};

function buildOverpassQuery(lat: number, lon: number, type: string, radius: number): string {
  const filter = OVERPASS_QUERIES[type] || 'tourism="attraction"';
  return `[out:json][timeout:10];
(
  node[${filter}](around:${radius},${lat},${lon});
  way[${filter}](around:${radius},${lat},${lon});
  relation[${filter}](around:${radius},${lat},${lon});
);
out body center 20;`;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Comprehensive landmark database along major Indian Railways rail corridors
const REGIONAL_LANDMARKS: Array<{
  id: string;
  name: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  description: string;
  wikiUrl?: string;
}> = [
  // North / Delhi / UP Region
  { id: 'n1', name: 'Yamuna River', category: 'river', latitude: 28.6139, longitude: 77.2490, description: 'Major river passing through Delhi, Mathura, and Agra.', wikiUrl: 'https://en.wikipedia.org/wiki/Yamuna' },
  { id: 'n2', name: 'Red Fort & Old Delhi', category: 'attraction', latitude: 28.6562, longitude: 77.2410, description: 'Historic Mughal fort complex near Old Delhi Junction.', wikiUrl: 'https://en.wikipedia.org/wiki/Red_Fort' },
  { id: 'n3', name: 'Taj Mahal & Yamuna Bridge', category: 'attraction', latitude: 27.1751, longitude: 78.0421, description: 'Iconic marble mausoleum along Agra Railway line.', wikiUrl: 'https://en.wikipedia.org/wiki/Taj_Mahal' },
  { id: 'n4', name: 'Ganges River Ghats', category: 'ghat', latitude: 25.3176, longitude: 83.0061, description: 'Sacred river ghats of Varanasi along the eastern line.', wikiUrl: 'https://en.wikipedia.org/wiki/Ghats_in_Varanasi' },
  { id: 'n5', name: 'Triveni Sangam', category: 'river', latitude: 25.4358, longitude: 81.8700, description: 'Confluence of Ganges and Yamuna in Prayagraj.', wikiUrl: 'https://en.wikipedia.org/wiki/Triveni_Sangam' },
  { id: 'n6', name: 'Vindhya Mountain Ridge', category: 'mountain', latitude: 25.1000, longitude: 78.5000, description: 'Ancient rocky hills near Jhansi & Lalitpur route.', wikiUrl: 'https://en.wikipedia.org/wiki/Vindhya_Range' },
  
  // West / Maharashtra / Gujarat Region
  { id: 'w1', name: 'Bandra-Worli Sea Link', category: 'bridge', latitude: 19.0330, longitude: 72.8170, description: 'Cable-stayed bridge along Mumbai Western Railway line.', wikiUrl: 'https://en.wikipedia.org/wiki/Bandra%E2%80%93Worli_Sea_Link' },
  { id: 'w2', name: 'Sanjay Gandhi National Park', category: 'attraction', latitude: 19.2290, longitude: 72.9100, description: 'Protected forest park near Borivali Railway station.', wikiUrl: 'https://en.wikipedia.org/wiki/Sanjay_Gandhi_National_Park' },
  { id: 'w3', name: 'Sabarmati River & Riverfront', category: 'river', latitude: 23.0300, longitude: 72.5800, description: 'Scenic riverfront passing through Ahmedabad.', wikiUrl: 'https://en.wikipedia.org/wiki/Sabarmati_Riverfront' },
  { id: 'w4', name: 'Western Ghats (Sahyadri Range)', category: 'mountain', latitude: 18.7500, longitude: 73.4000, description: 'Lush green mountain peaks along Mumbai-Pune ghat section.', wikiUrl: 'https://en.wikipedia.org/wiki/Western_Ghats' },
  { id: 'w5', name: 'Tapi River Bridge', category: 'bridge', latitude: 21.2000, longitude: 72.8300, description: 'Major railway bridge across the Tapi River near Surat.', wikiUrl: 'https://en.wikipedia.org/wiki/Tapti_River' },

  // South / Karnataka / AP / Tamil Nadu / Kerala Region
  { id: 's1', name: 'Kaveri River Bridge', category: 'river', latitude: 12.4200, longitude: 77.7000, description: 'Sacred river flowing through Karnataka and Tamil Nadu plains.', wikiUrl: 'https://en.wikipedia.org/wiki/Kaveri' },
  { id: 's2', name: 'Nandi Hills', category: 'mountain', latitude: 13.3700, longitude: 77.6800, description: 'Historic hill fortress near Bengaluru airport rail link.', wikiUrl: 'https://en.wikipedia.org/wiki/Nandi_Hills,_India' },
  { id: 's3', name: 'Prakasam Barrage & Krishna River', category: 'bridge', latitude: 16.5062, longitude: 80.6050, description: 'Massive river bridge and barrage near Vijayawada Junction.', wikiUrl: 'https://en.wikipedia.org/wiki/Prakasam_Barrage' },
  { id: 's4', name: 'Hussain Sagar Lake', category: 'lake', latitude: 17.4239, longitude: 78.4738, description: 'Heart-shaped lake with Buddha statue near Secunderabad.', wikiUrl: 'https://en.wikipedia.org/wiki/Hussain_Sagar' },
  { id: 's5', name: 'Marina Beach & Bay Coast', category: 'attraction', latitude: 13.0475, longitude: 80.2824, description: 'Long natural urban beach along Chennai rail corridor.', wikiUrl: 'https://en.wikipedia.org/wiki/Marina_Beach' },

  // East / Bengal / Jharkhand / Odisha Region
  { id: 'e1', name: 'Howrah Bridge (Rabindra Setu)', category: 'bridge', latitude: 22.5851, longitude: 88.3468, description: 'Iconic balanced cantilever bridge over Hooghly River.', wikiUrl: 'https://en.wikipedia.org/wiki/Howrah_Bridge' },
  { id: 'e2', name: 'Hooghly River', category: 'river', latitude: 22.5700, longitude: 88.3500, description: 'Distributary of the Ganges flowing past Howrah & Kolkata.', wikiUrl: 'https://en.wikipedia.org/wiki/Hooghly_River' },
  { id: 'e3', name: 'Parasnath Hill (Shikharji)', category: 'mountain', latitude: 23.9628, longitude: 86.1364, description: 'Highest peak in Jharkhand near Parasnath station.', wikiUrl: 'https://en.wikipedia.org/wiki/Shikharji' },
  { id: 'e4', name: 'Mahanadi River Bridge', category: 'bridge', latitude: 20.4800, longitude: 85.8700, description: 'Longest rail-cum-road bridge in Odisha.', wikiUrl: 'https://en.wikipedia.org/wiki/Mahanadi' },
  { id: 'e5', name: 'Damodar River Valley', category: 'river', latitude: 23.6800, longitude: 86.9800, description: 'Mineral-rich river valley near Asansol & Dhanbad.', wikiUrl: 'https://en.wikipedia.org/wiki/Damodar_River' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '25.0');
  const lon = parseFloat(searchParams.get('lon') || '82.0');
  const type = searchParams.get('type') || '';
  const radius = parseInt(searchParams.get('radius') || '50000');

  let places: NearbyPlace[] = [];

  try {
    const types = type ? [type] : Object.keys(OVERPASS_QUERIES);
    const results = await Promise.allSettled(
      types.map(async (t) => {
        const query = buildOverpassQuery(lat, lon, t, radius);
        const res = await fetch(OVERPASS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(query)}`,
          signal: AbortSignal.timeout(4000),
        });
        if (!res.ok) return [];
        const data = await res.json();
        return (data.elements || []).map((el: any) => ({
          id: String(el.id),
          name: el.tags?.name || el.tags?.['name:en'] || 'Unknown',
          category: t as PlaceCategory,
          latitude: el.lat || el.center?.lat || lat,
          longitude: el.lon || el.center?.lon || lon,
          distance: haversineDistance(lat, lon, el.lat || el.center?.lat || lat, el.lon || el.center?.lon || lon),
          description: el.tags?.description || el.tags?.wikipedia || `${t} landmark along the route`,
          wikiUrl: el.tags?.wikipedia ? `https://en.wikipedia.org/wiki/${el.tags.wikipedia.replace('en:', '')}` : undefined,
        })).filter((p: NearbyPlace) => p.name !== 'Unknown').slice(0, 5);
      })
    );

    results.forEach((r) => {
      if (r.status === 'fulfilled') places.push(...r.value);
    });
  } catch {
    // Fall back to dynamic landmark calculation
  }

  // If live query yielded few or no results, filter regional landmark database dynamically
  if (places.length < 3) {
    const fallbackPlaces = REGIONAL_LANDMARKS.map((lm) => {
      const dist = haversineDistance(lat, lon, lm.latitude, lm.longitude);
      return {
        ...lm,
        distance: Math.round(dist * 10) / 10,
      };
    })
      .filter((p) => (!type || p.category === type))
      .sort((a, b) => a.distance - b.distance);

    places = [...places, ...fallbackPlaces];
  }

  // Remove duplicates & sort by nearest distance
  const seenNames = new Set<string>();
  const uniquePlaces: NearbyPlace[] = [];
  for (const p of places) {
    if (!seenNames.has(p.name)) {
      seenNames.add(p.name);
      uniquePlaces.push(p);
    }
  }

  uniquePlaces.sort((a, b) => a.distance - b.distance);

  return NextResponse.json(uniquePlaces.slice(0, 25));
}
