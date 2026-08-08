import { NextRequest, NextResponse } from 'next/server';
import { STATION_GEO_DATABASE } from '@/data/routes';
import { WeatherData } from '@/types';

function degreesToCardinal(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round((deg % 360) / 45) % 8];
}

const mockWeather = (stationCode: string, stationName: string): WeatherData => {
  const conditions = [
    { desc: 'Clear sky', icon: '01d', rainProb: 10 },
    { desc: 'Partly cloudy', icon: '02d', rainProb: 25 },
    { desc: 'Overcast & humid', icon: '03d', rainProb: 35 },
    { desc: 'Light rain expected', icon: '09d', rainProb: 65 },
    { desc: 'Heavy thunderstorm', icon: '11d', rainProb: 85 },
  ];

  // Deterministic index per station code so it doesn't flicker on refresh
  const charSum = stationCode.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
  const selectedCond = conditions[charSum % conditions.length];

  const nowHour = new Date().getHours();
  const forecast = Array.from({ length: 6 }, (_, i) => {
    const hour = (nowHour + i + 1) % 24;
    const timeStr = `${String(hour).padStart(2, '0')}:00`;
    const condIdx = (charSum + i) % conditions.length;
    const cond = conditions[condIdx];
    // Slightly fluctuate temperature and rain probability across 6 hours
    const temp = Math.round(25 + ((charSum + i * 2) % 9));
    const prob = Math.min(95, Math.max(5, cond.rainProb + ((i % 3) * 5 - 5)));

    return {
      time: timeStr,
      temperature: temp,
      rainProbability: prob,
      icon: cond.icon,
      description: cond.desc,
    };
  });

  const maxRainProb = Math.max(selectedCond.rainProb, ...forecast.map((f) => f.rainProbability));
  const willRain = maxRainProb >= 45 || selectedCond.rainProb >= 40;

  return {
    stationCode,
    stationName,
    temperature: 26 + (charSum % 8),
    feelsLike: 28 + (charSum % 6),
    humidity: 50 + (charSum % 35),
    windSpeed: 10 + (charSum % 14),
    windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][charSum % 8],
    description: selectedCond.desc,
    icon: selectedCond.icon,
    rainProbability: selectedCond.rainProb,
    visibility: 8 + (charSum % 4),
    pressure: 1008 + (charSum % 8),
    uvIndex: 3 + (charSum % 5),
    rainSummary: {
      willRain,
      rainProbabilityMax: maxRainProb,
      summaryText: willRain
        ? `Rain is expected at ${stationName} in the next 6 hours (Max rain chance: ${maxRainProb}%). Carry an umbrella!`
        : `No significant rain expected at ${stationName} over the next 6 hours (Max rain chance: ${maxRainProb}%). Good traveling weather!`,
    },
    forecast,
  };
};

const cache = new Map<string, { data: WeatherData; expires: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export async function GET(
  request: NextRequest,
  { params }: { params: { station: string } }
) {
  const stationCode = params.station.toUpperCase();
  const { searchParams } = new URL(request.url);
  const qLat = searchParams.get('lat');
  const qLon = searchParams.get('lon');

  const cachedKey = `${stationCode}_${qLat || ''}_${qLon || ''}`;
  const cached = cache.get(cachedKey);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json({ ...cached.data, cached: true });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const baseUrl = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';
  
  const geoInfo = STATION_GEO_DATABASE[stationCode];
  const lat = qLat ? parseFloat(qLat) : geoInfo ? geoInfo.lat : 22.5;
  const lon = qLon ? parseFloat(qLon) : geoInfo ? geoInfo.lon : 82.5;
  const stationName = geoInfo ? geoInfo.name : `Station ${stationCode}`;

  let weather: WeatherData;

  if (apiKey) {
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`${baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`, {
          signal: AbortSignal.timeout(5000),
        }),
        fetch(`${baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=6`, {
          signal: AbortSignal.timeout(5000),
        }),
      ]);

      if (currentRes.ok) {
        const current = await currentRes.json();
        const forecastData = forecastRes.ok ? await forecastRes.json() : { list: [] };

        const nowHour = new Date().getHours();
        const rawList = forecastData.list || [];

        const forecastList = Array.from({ length: 6 }, (_, i) => {
          const f = rawList[i] || rawList[Math.floor(i / 2)] || {};
          const hour = (nowHour + i + 1) % 24;
          const timeStr = `${String(hour).padStart(2, '0')}:00`;
          const prob = Math.round((f.pop || 0) * 100);
          return {
            time: f.dt_txt ? f.dt_txt.split(' ')[1]?.substring(0, 5) : timeStr,
            temperature: Math.round(f.main?.temp ?? current.main.temp),
            rainProbability: prob > 0 ? prob : Math.round(current.rain ? 70 : 15),
            icon: f.weather?.[0]?.icon || current.weather[0]?.icon || '01d',
            description: f.weather?.[0]?.description || current.weather[0]?.description || 'Clear sky',
          };
        });

        const maxRainProb = Math.max(
          Math.round(current.rain ? 70 : 15),
          ...forecastList.map((f) => f.rainProbability)
        );
        const willRain = maxRainProb >= 40 || !!current.rain;

        weather = {
          stationCode,
          stationName: current.name || stationName,
          temperature: Math.round(current.main.temp),
          feelsLike: Math.round(current.main.feels_like),
          humidity: current.main.humidity,
          windSpeed: Math.round(current.wind.speed * 3.6),
          windDirection: degreesToCardinal(current.wind?.deg || 0),
          description: current.weather[0]?.description || 'Clear sky',
          icon: current.weather[0]?.icon || '01d',
          rainProbability: Math.round(current.rain ? 70 : 15),
          visibility: Math.round((current.visibility || 10000) / 1000),
          pressure: current.main.pressure,
          uvIndex: 5,
          rainSummary: {
            willRain,
            rainProbabilityMax: maxRainProb,
            summaryText: willRain
              ? `Rain expected at ${current.name || stationName} in the next 6 hours (Max rain chance: ${maxRainProb}%). Keep rain gear handy!`
              : `No rain expected at ${current.name || stationName} in the next 6 hours (Max rain chance: ${maxRainProb}%). Fair weather ahead!`,
          },
          forecast: forecastList,
        };
      } else {
        weather = mockWeather(stationCode, stationName);
      }
    } catch {
      weather = mockWeather(stationCode, stationName);
    }
  } else {
    weather = mockWeather(stationCode, stationName);
  }

  cache.set(cachedKey, { data: weather, expires: Date.now() + CACHE_TTL });
  return NextResponse.json(weather);
}
