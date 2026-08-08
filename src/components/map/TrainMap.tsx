'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Maximize2, Minimize2, Navigation, RotateCcw, ZoomIn, ZoomOut,
  MapPin, Layers, Mountain, Map as MapIcon, Satellite, X, RefreshCw
} from 'lucide-react';
import { getRouteCoordinates, getDynamicRouteForTrain } from '@/data/routes';

import { Station } from '@/types';

interface TrainMapProps {
  latitude: number;
  longitude: number;
  trainNumber: string;
  currentStation: string;
  coveredDistance?: number;
  remainingDistance?: number;
  nextStation?: string;
  journeyProgress?: number;
  stations?: Station[];
}

type MapStyle = 'streets' | 'outdoor' | 'dark' | 'satellite';

const MAP_STYLES: { id: MapStyle; label: string; icon: React.ElementType; getUrl: (key: string) => string }[] = [
  {
    id: 'streets',
    label: 'Streets (CARTO)',
    icon: MapIcon,
    getUrl: () => 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  },
  {
    id: 'outdoor',
    label: 'Outdoor (OFM)',
    icon: Layers,
    getUrl: () => 'https://tiles.openfreemap.org/styles/liberty',
  },
  {
    id: 'dark',
    label: 'Dark Night',
    icon: Mountain,
    getUrl: () => 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  },
  {
    id: 'satellite',
    label: 'Satellite',
    icon: Satellite,
    getUrl: (key) => key ? `https://api.maptiler.com/maps/satellite/style.json?key=${key}` : 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  },
];

export function TrainMap({
  latitude,
  longitude,
  trainNumber,
  currentStation,
  coveredDistance,
  remainingDistance,
  nextStation,
  journeyProgress,
  stations: propStations,
}: TrainMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const stationMarkersRef = useRef<any[]>([]);
  const hasFittedBoundsRef = useRef<boolean>(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraFollow, setCameraFollow] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState<MapStyle>('streets');
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [showPOI, setShowPOI] = useState(true);
  const [isChangingStyle, setIsChangingStyle] = useState(false);

  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || '';

  // Clean up all DOM markers
  const removeAllMarkers = useCallback(() => {
    stationMarkersRef.current.forEach((m) => {
      try { m?.remove?.(); } catch {}
    });
    stationMarkersRef.current = [];

    if (markerRef.current) {
      try { markerRef.current.remove(); } catch {}
      markerRef.current = null;
    }
  }, []);

  // Draw route lines + station markers on the map
  const addRouteAndMarkers = useCallback((map: any, maplibregl: any) => {
    if (!map) return;

    removeAllMarkers();

    const stations = propStations && propStations.length > 0 ? propStations : getDynamicRouteForTrain(trainNumber);
    const stationCoords: [number, number][] = stations.map((s) => [s.longitude, s.latitude]);

    // Safely remove existing layers FIRST, then sources
    const layerIds = [
      'train-route-upcoming-line',
      'train-route-upcoming-glow',
      'train-route-completed-line',
      'train-route-completed-glow',
    ];
    layerIds.forEach((id) => {
      if (map.getLayer && map.getLayer(id)) {
        try { map.removeLayer(id); } catch {}
      }
    });

    const sourceIds = ['train-route-upcoming', 'train-route-completed'];
    sourceIds.forEach((id) => {
      if (map.getSource && map.getSource(id)) {
        try { map.removeSource(id); } catch {}
      }
    });

    if (stationCoords && stationCoords.length > 0) {
      const currentIdx = stations.findIndex((s) => s.status === 'current');
      const validIdx = currentIdx >= 0 ? currentIdx : Math.floor(stations.length / 2);

      // Insert exact live coordinate into polyline split point
      const completedCoords = stationCoords.slice(0, validIdx + 1);
      if (longitude && latitude && completedCoords.length > 0) {
        completedCoords.push([longitude, latitude]);
      }
      
      const upcomingCoords = [
        ...(longitude && latitude ? [[longitude, latitude] as [number, number]] : []),
        ...stationCoords.slice(validIdx + 1),
      ];

      // Add upcoming route (Blue line with glow)
      if (upcomingCoords.length >= 1) {
        try {
          map.addSource('train-route-upcoming', {
            type: 'geojson',
            data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: upcomingCoords.length === 1 ? [upcomingCoords[0], upcomingCoords[0]] : upcomingCoords } },
          });

          map.addLayer({
            id: 'train-route-upcoming-glow',
            type: 'line',
            source: 'train-route-upcoming',
            paint: { 'line-color': '#3b82f6', 'line-width': 12, 'line-opacity': 0.25, 'line-blur': 4 },
          });

          map.addLayer({
            id: 'train-route-upcoming-line',
            type: 'line',
            source: 'train-route-upcoming',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#2563eb', 'line-width': 5, 'line-opacity': 0.9 },
          });
        } catch (e) {
          console.warn('Error adding upcoming route layer:', e);
        }
      }

      // Add completed route (Emerald Green line with glow)
      if (completedCoords.length >= 2) {
        try {
          map.addSource('train-route-completed', {
            type: 'geojson',
            data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: completedCoords } },
          });

          map.addLayer({
            id: 'train-route-completed-glow',
            type: 'line',
            source: 'train-route-completed',
            paint: { 'line-color': '#10b981', 'line-width': 12, 'line-opacity': 0.25, 'line-blur': 4 },
          });

          map.addLayer({
            id: 'train-route-completed-line',
            type: 'line',
            source: 'train-route-completed',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#059669', 'line-width': 5, 'line-opacity': 0.95 },
          });
        } catch (e) {
          console.warn('Error adding completed route layer:', e);
        }
      }

      // Add station markers WITH permanent visible station name badges
      stations.forEach((st) => {
        const isCurrent = st.status === 'current';
        const isDeparted = st.status === 'departed';

        const wrapper = document.createElement('div');
        wrapper.className = 'station-marker-wrapper';
        wrapper.style.cssText = `
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          user-select: none;
          pointer-events: auto;
        `;

        const dot = document.createElement('div');
        dot.style.cssText = `
          width: ${isCurrent ? '18px' : '12px'};
          height: ${isCurrent ? '18px' : '12px'};
          border-radius: 50%;
          background: ${isDeparted ? '#10b981' : isCurrent ? '#f59e0b' : '#2563eb'};
          border: ${isCurrent ? '3px' : '2px'} solid #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.5)${isCurrent ? ', 0 0 0 4px rgba(245,158,11,0.4)' : ''};
          flex-shrink: 0;
        `;

        const badge = document.createElement('div');
        badge.style.cssText = `
          background: ${isCurrent ? 'rgba(217, 119, 6, 0.95)' : isDeparted ? 'rgba(15, 23, 42, 0.88)' : 'rgba(30, 58, 138, 0.88)'};
          color: #ffffff;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Inter', system-ui, sans-serif;
          white-space: nowrap;
          border: 1px solid ${isCurrent ? '#fcd34d' : 'rgba(255,255,255,0.2)'};
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          letter-spacing: -0.01em;
        `;
        badge.innerHTML = `${st.name} <span style="opacity:0.8;font-size:9px;font-family:monospace;margin-left:2px">${st.code}</span>`;

        wrapper.appendChild(dot);
        wrapper.appendChild(badge);

        const popup = new maplibregl.Popup({ offset: 16, className: 'train-popup' }).setHTML(`
          <div style="font-family:Inter,system-ui,sans-serif;padding:6px 4px;min-width:190px">
            <div style="font-weight:700;font-size:13px;color:#111827;margin-bottom:4px;display:flex;align-items:center;justify-content:space-between">
              <span>${st.name}</span>
              <span style="font-size:10px;font-family:monospace;color:#475569;background:#f1f5f9;padding:1px 6px;border-radius:4px;margin-left:6px">${st.code}</span>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">
              <span style="background:${isDeparted ? '#ecfdf5' : isCurrent ? '#fffbeb' : '#eff6ff'};color:${isDeparted ? '#059669' : isCurrent ? '#d97706' : '#2563eb'};padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600">
                ${isDeparted ? '✓ Departed' : isCurrent ? '● Current Station' : '○ Upcoming'}
              </span>
              <span style="background:#f8fafc;color:#64748b;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600;border:1px solid #e2e8f0">
                Plt ${st.platform}
              </span>
            </div>
            <div style="font-size:11px;color:#4b5563;display:grid;grid-template-columns:1fr 1fr;gap:4px;border-top:1px solid #f1f5f9;padding-top:6px">
              <div><span style="color:#9ca3af">Arr:</span> <strong>${st.scheduledArrival}</strong></div>
              <div><span style="color:#9ca3af">Dep:</span> <strong>${st.scheduledDeparture}</strong></div>
              <div><span style="color:#9ca3af">Dist:</span> <strong>${st.distance} km</strong></div>
              ${(st.delay ?? 0) > 0 ? `<div style="color:#ef4444;font-weight:600"><span style="color:#9ca3af">Delay:</span> +${st.delay}m</div>` : '<div style="color:#10b981;font-weight:600">On Time</div>'}
            </div>
          </div>
        `);

        const marker = new maplibregl.Marker({ element: wrapper, anchor: 'left' })
          .setLngLat([st.longitude, st.latitude])
          .setPopup(popup)
          .addTo(map);

        stationMarkersRef.current.push(marker);
      });

      // Fit bounds ONCE on map initialize
      if (stationCoords.length > 1 && !hasFittedBoundsRef.current) {
        try {
          hasFittedBoundsRef.current = true;
          const bounds = stationCoords.reduce(
            (acc, coord) => [
              [Math.min(acc[0][0], coord[0]), Math.min(acc[0][1], coord[1])],
              [Math.max(acc[1][0], coord[0]), Math.max(acc[1][1], coord[1])],
            ],
            [[stationCoords[0][0], stationCoords[0][1]], [stationCoords[0][0], stationCoords[0][1]]]
          );
          map.fitBounds(bounds as any, { padding: 50, maxZoom: 10, duration: 1000 });
        } catch (e) {
          console.warn('fitBounds error:', e);
        }
      }
    }

    // Live Train Position Marker with animated beacon
    const liveLat = latitude || stationCoords[0]?.[1] || 28.6422;
    const liveLon = longitude || stationCoords[0]?.[0] || 77.2194;

    const trainMarkerEl = document.createElement('div');
    trainMarkerEl.innerHTML = `
      <div style="position:relative;width:52px;height:52px">
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:rgba(37,99,235,0.25);
          animation:trainPulse 2s ease-in-out infinite;
        "></div>
        <div style="
          position:absolute;inset:4px;border-radius:50%;
          background:linear-gradient(135deg,#2563eb,#1d4ed8);
          border:3px solid white;
          box-shadow:0 4px 20px rgba(37,99,235,0.7);
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;
        ">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="20" height="11" rx="2"/>
            <path d="M12 7V3"/>
            <path d="M8 7V5"/>
            <path d="M16 7V5"/>
            <circle cx="7" cy="18" r="2"/>
            <circle cx="17" cy="18" r="2"/>
            <path d="M5 16H19"/>
          </svg>
        </div>
        <div style="
          position:absolute;top:1px;right:1px;
          width:13px;height:13px;border-radius:50%;
          background:#10b981;border:2.5px solid white;
          animation:liveBlink 1.2s ease-in-out infinite;
        "></div>
      </div>
    `;

    const markerPopup = new maplibregl.Popup({ offset: 28 }).setHTML(`
      <div style="font-family:Inter,system-ui,sans-serif;min-width:170px;padding:2px">
        <div style="font-weight:700;font-size:14px;margin-bottom:4px">🚆 Train #${trainNumber}</div>
        <div style="font-size:12px;color:#10b981;font-weight:600;margin-bottom:4px">● Live · ${currentStation}</div>
        ${nextStation ? `<div style="font-size:11px;color:#6b7280">Next: <strong>${nextStation}</strong></div>` : ''}
        ${journeyProgress !== undefined ? `<div style="margin-top:6px;background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden"><div style="width:${journeyProgress}%;height:100%;background:linear-gradient(90deg,#2563eb,#3b82f6);border-radius:99px"></div></div><div style="font-size:10px;color:#6b7280;margin-top:3px;text-align:right">${journeyProgress}% complete</div>` : ''}
      </div>
    `);

    const marker = new maplibregl.Marker({ element: trainMarkerEl, anchor: 'center' })
      .setLngLat([liveLon, liveLat])
      .setPopup(markerPopup)
      .addTo(map);

    markerRef.current = marker;
  }, [latitude, longitude, trainNumber, currentStation, nextStation, journeyProgress, removeAllMarkers]);

  // Initialize MapLibre GL
  const initMap = useCallback(async () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      const maplibregl = (await import('maplibre-gl')).default;
      const styleObj = MAP_STYLES.find((s) => s.id === activeStyle) || MAP_STYLES[0];
      const styleUrl = styleObj.getUrl(MAPTILER_KEY);

      const routeCoords = getRouteCoordinates(trainNumber);
      const initialLat = latitude || routeCoords[0]?.[1] || 28.6422;
      const initialLon = longitude || routeCoords[0]?.[0] || 77.2194;

      const map = new maplibregl.Map({
        container: mapRef.current,
        style: styleUrl,
        center: [initialLon, initialLat],
        zoom: 7,
        pitch: 25,
        bearing: 0,
        antialias: true,
      });

      mapInstanceRef.current = map;

      // Add navigation control
      map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: false }), 'bottom-right');

      let hasRendered = false;

      const handleMapReady = () => {
        if (hasRendered) return;
        hasRendered = true;
        setMapLoaded(true);
        setMapError(null);
        addRouteAndMarkers(map, maplibregl);
      };

      map.on('load', handleMapReady);

      // Fallback if load takes too long or style fails
      const loadTimeout = setTimeout(() => {
        if (!hasRendered && mapInstanceRef.current) {
          handleMapReady();
        }
      }, 3500);

      map.on('error', (e: any) => {
        console.warn('MapLibre style/tile warning:', e?.error?.message || e);
        // If initial style fail, fall back to CARTO Voyager
        if (!hasRendered && activeStyle === 'satellite') {
          clearTimeout(loadTimeout);
          setActiveStyle('streets');
          map.setStyle(MAP_STYLES[0].getUrl(''));
        }
      });
    } catch (err: any) {
      console.error('Failed to initialize map:', err);
      setMapError('Failed to load map graphics.');
    }
  }, [latitude, longitude, trainNumber, activeStyle, MAPTILER_KEY, addRouteAndMarkers]);

  // Style Switcher
  const changeStyle = useCallback(async (newStyle: MapStyle) => {
    if (!mapInstanceRef.current || newStyle === activeStyle) return;
    setIsChangingStyle(true);
    setActiveStyle(newStyle);
    setShowLayerPanel(false);

    try {
      const maplibregl = (await import('maplibre-gl')).default;
      const styleObj = MAP_STYLES.find((s) => s.id === newStyle)!;

      mapInstanceRef.current.setStyle(styleObj.getUrl(MAPTILER_KEY));
      mapInstanceRef.current.once('styledata', () => {
        addRouteAndMarkers(mapInstanceRef.current, maplibregl);
        setIsChangingStyle(false);
      });
    } catch {
      setIsChangingStyle(false);
    }
  }, [activeStyle, MAPTILER_KEY, addRouteAndMarkers]);

  useEffect(() => {
    initMap();
    return () => {
      removeAllMarkers();
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.remove(); } catch {}
        mapInstanceRef.current = null;
        setMapLoaded(false);
      }
    };
  }, []);

  // Update train position when props change
  useEffect(() => {
    if (markerRef.current && mapLoaded && longitude && latitude) {
      markerRef.current.setLngLat([longitude, latitude]);
      if (cameraFollow && mapInstanceRef.current) {
        mapInstanceRef.current.easeTo({ center: [longitude, latitude], duration: 1200 });
      }
    }
  }, [latitude, longitude, mapLoaded, cameraFollow]);

  // Toggle POI visibility
  const togglePOI = useCallback(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const map = mapInstanceRef.current;
    const newVal = !showPOI;
    setShowPOI(newVal);
    try {
      const vis = newVal ? 'visible' : 'none';
      ['poi', 'poi-label', 'place-label', 'airport-label'].forEach((layerId) => {
        if (map.getLayer(layerId)) map.setLayoutProperty(layerId, 'visibility', vis);
      });
    } catch {}
  }, [mapLoaded, showPOI]);

  const zoomIn = () => mapInstanceRef.current?.zoomIn({ duration: 300 });
  const zoomOut = () => mapInstanceRef.current?.zoomOut({ duration: 300 });
  
  const resetView = () => {
    mapInstanceRef.current?.easeTo({ bearing: 0, pitch: 25, duration: 600 });
    const routeCoords = getRouteCoordinates(trainNumber);
    if (routeCoords.length > 1 && mapInstanceRef.current) {
      const bounds = routeCoords.reduce(
        (acc, coord) => [
          [Math.min(acc[0][0], coord[0]), Math.min(acc[0][1], coord[1])],
          [Math.max(acc[1][0], coord[0]), Math.max(acc[1][1], coord[1])],
        ],
        [[routeCoords[0][0], routeCoords[0][1]], [routeCoords[0][0], routeCoords[0][1]]]
      );
      mapInstanceRef.current.fitBounds(bounds as any, { padding: 50, maxZoom: 10, duration: 1000 });
    }
  };

  const toggleFollow = () => {
    setCameraFollow((f) => !f);
    if (!cameraFollow && mapInstanceRef.current && longitude && latitude) {
      mapInstanceRef.current.flyTo({ center: [longitude, latitude], zoom: 9, duration: 1200 });
    }
  };

  const flyToTrain = () => {
    if (mapInstanceRef.current && longitude && latitude) {
      mapInstanceRef.current.flyTo({ center: [longitude, latitude], zoom: 10, pitch: 40, duration: 1500 });
    }
  };

  const currentStyleObj = MAP_STYLES.find((s) => s.id === activeStyle) || MAP_STYLES[0];

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-border shadow-card bg-slate-950 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
      style={{ height: isFullscreen ? '100dvh' : '540px' }}
    >
      {/* Map Container */}
      <div ref={mapRef} className="absolute inset-0 w-full h-full" />

      {/* Loading Overlay */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 z-10">
          <div className="text-center space-y-3 p-4">
            <div className="relative w-14 h-14 mx-auto">
              <div className="w-14 h-14 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
                  <rect x="2" y="7" width="20" height="11" rx="2"/>
                  <path d="M12 7V3"/><path d="M8 7V5"/><path d="M16 7V5"/>
                  <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
                </svg>
              </div>
            </div>
            <div>
              <p className="text-white text-sm font-bold">Rendering Route & Map</p>
              <p className="text-slate-400 text-xs mt-0.5">Plotting stations & live train telemetry…</p>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-white p-6 text-center z-10">
          <div className="space-y-3">
            <MapPin size={36} className="mx-auto text-blue-500" />
            <p className="text-sm font-semibold">{mapError}</p>
            <button
              onClick={() => { setMapError(null); initMap(); }}
              className="btn btn-primary text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 mx-auto"
            >
              <RefreshCw size={14} /> Retry Map
            </button>
          </div>
        </div>
      )}

      {/* Style switching indicator */}
      {isChangingStyle && (
        <div className="absolute inset-0 bg-slate-950/60 z-20 flex items-center justify-center">
          <div className="glass-dark px-4 py-3 rounded-xl text-white text-sm flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Switching to {currentStyleObj.label}…
          </div>
        </div>
      )}

      {/* Top Left: Live Station Status Badge */}
      {mapLoaded && (
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-auto">
          <div className="glass-dark px-3 py-2 rounded-xl text-white text-xs font-medium flex items-center gap-2.5 shadow-lg animate-fade-in border border-white/10">
            <span className="live-dot flex-shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Current Station</div>
              <div className="font-bold text-sm leading-tight text-white">{currentStation}</div>
            </div>
          </div>
          {nextStation && (
            <div className="glass-dark px-3 py-1.5 rounded-xl text-white text-xs shadow-lg animate-fade-in border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Next Stop</div>
              <div className="font-semibold text-blue-300">{nextStation}</div>
            </div>
          )}
        </div>
      )}

      {/* Top Right: Controls */}
      {mapLoaded && (
        <div className="absolute right-3 top-3 flex flex-col gap-2 z-10">
          <button onClick={zoomIn} className="glass p-2.5 rounded-xl shadow-float hover:bg-white transition-colors" aria-label="Zoom in">
            <ZoomIn size={16} className="text-slate-700" />
          </button>
          <button onClick={zoomOut} className="glass p-2.5 rounded-xl shadow-float hover:bg-white transition-colors" aria-label="Zoom out">
            <ZoomOut size={16} className="text-slate-700" />
          </button>
          <button onClick={flyToTrain} className="glass p-2.5 rounded-xl shadow-float hover:bg-white transition-colors" title="Locate Train" aria-label="Fly to train">
            <MapPin size={16} className="text-blue-600" />
          </button>
          <button onClick={resetView} className="glass p-2.5 rounded-xl shadow-float hover:bg-white transition-colors" title="Reset View" aria-label="Reset view">
            <RotateCcw size={16} className="text-slate-700" />
          </button>
          <button
            onClick={toggleFollow}
            className={`p-2.5 rounded-xl shadow-float transition-all ${
              cameraFollow ? 'bg-blue-600 text-white shadow-blue-200' : 'glass text-slate-700 hover:bg-white'
            }`}
            title="Camera Follow"
            aria-label="Camera follow"
          >
            <Navigation size={16} />
          </button>
          <button
            onClick={() => setIsFullscreen((f) => !f)}
            className="glass p-2.5 rounded-xl shadow-float hover:bg-white transition-colors"
            title="Fullscreen"
            aria-label="Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={16} className="text-slate-700" /> : <Maximize2 size={16} className="text-slate-700" />}
          </button>
        </div>
      )}

      {/* Top Layer Panel Switcher */}
      {mapLoaded && (
        <div className="absolute top-3 right-[54px] z-10">
          <button
            onClick={() => setShowLayerPanel((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl shadow-float text-xs font-semibold transition-all ${
              showLayerPanel ? 'bg-blue-600 text-white' : 'glass text-slate-700 hover:bg-white'
            }`}
            aria-label="Map layers"
          >
            <Layers size={14} />
            <span>{currentStyleObj.label.split(' ')[0]}</span>
          </button>

          {showLayerPanel && (
            <div className="absolute top-10 right-0 glass-dark rounded-2xl p-2 shadow-xl z-20 min-w-[190px] animate-scale-in border border-white/10">
              <div className="flex items-center justify-between px-2 py-1 mb-1">
                <span className="text-white text-xs font-bold uppercase tracking-wider">Map Layer Style</span>
                <button onClick={() => setShowLayerPanel(false)} className="text-slate-400 hover:text-white">
                  <X size={12} />
                </button>
              </div>
              <div className="space-y-1">
                {MAP_STYLES.map((style) => {
                  const Icon = style.icon;
                  return (
                    <button
                      key={style.id}
                      onClick={() => changeStyle(style.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        activeStyle === style.id
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon size={14} />
                      {style.label}
                      {activeStyle === style.id && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-white" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-white/10 mt-2 pt-2 px-1">
                <button
                  onClick={togglePOI}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-xs font-medium transition-all ${
                    showPOI ? 'text-emerald-400' : 'text-slate-400'
                  } hover:bg-white/10`}
                >
                  <MapPin size={13} />
                  Landmarks / POI
                  <span className={`ml-auto text-[10px] font-bold ${showPOI ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {showPOI ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Bar: Legend & Statistics */}
      {mapLoaded && (
        <div className="absolute bottom-3 left-3 right-[60px] z-10 flex items-end justify-between gap-2 pointer-events-auto">
          {/* Legend */}
          <div className="glass-dark px-3 py-2 rounded-xl text-xs flex items-center gap-3 shadow-lg flex-wrap border border-white/10">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <span className="inline-block w-5 h-1.5 rounded bg-emerald-500" /> Departed
            </span>
            <span className="flex items-center gap-1.5 text-white font-medium">
              <span className="inline-block w-5 h-1.5 rounded bg-blue-500" /> Upcoming
            </span>
            <span className="flex items-center gap-1.5 text-white font-medium">
              <span className="inline-block w-3 h-3 rounded-full bg-amber-400 border-2 border-white" /> Current
            </span>
          </div>

          {/* Progress stats */}
          {(coveredDistance !== undefined || remainingDistance !== undefined) && (
            <div className="glass-dark px-3.5 py-2 rounded-xl text-xs shadow-lg flex-shrink-0 border border-white/10 text-right">
              {journeyProgress !== undefined && (
                <div className="text-white font-bold text-sm leading-none mb-1">{journeyProgress}% Done</div>
              )}
              <div className="flex gap-3 text-[11px]">
                {coveredDistance !== undefined && (
                  <div className="text-slate-300">
                    <span className="text-emerald-400 font-semibold">{coveredDistance}</span> km done
                  </div>
                )}
                {remainingDistance !== undefined && (
                  <div className="text-slate-300">
                    <span className="text-blue-400 font-semibold">{remainingDistance}</span> km left
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
