'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNearbyPlaces } from '@/services/api';
import { NearbyPlace, PlaceCategory } from '@/types';
import {
  MapPin,
  ExternalLink,
  Compass,
  Landmark,
  Waves,
  Mountain,
  Building2,
  Sparkles,
  Search,
} from 'lucide-react';
import { clsx } from 'clsx';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

interface NearbyPlacesProps {
  lat: number;
  lon: number;
}

const CATEGORIES: { id: PlaceCategory | 'all'; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Places', icon: Compass },
  { id: 'attraction', label: 'Attractions', icon: Sparkles },
  { id: 'river', label: 'Rivers', icon: Waves },
  { id: 'mountain', label: 'Mountains', icon: Mountain },
  { id: 'city', label: 'Cities', icon: Building2 },
  { id: 'bridge', label: 'Bridges', icon: Landmark },
  { id: 'ghat', label: 'Ghats', icon: Waves },
];

export function NearbyPlaces({ lat, lon }: NearbyPlacesProps) {
  const [category, setCategory] = useState<PlaceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: places, isLoading, isError } = useQuery<NearbyPlace[]>({
    queryKey: ['nearbyPlaces', lat, lon, category === 'all' ? '' : category],
    queryFn: () => getNearbyPlaces(lat, lon, category === 'all' ? undefined : category),
    enabled: !!lat && !!lon,
  });

  const filteredPlaces = (places || []).filter((place) =>
    searchQuery ? place.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  return (
    <div className="space-y-6">
      {/* ─── Search & Category Filters ───────────────────────────── */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nearby landmarks along the route…"
            className="input pl-9 text-xs"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1">
          {CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCategory(id)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0',
                category === id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Places Grid ─────────────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-3">
          <SkeletonCard lines={3} />
          <SkeletonCard lines={3} />
        </div>
      ) : isError || filteredPlaces.length === 0 ? (
        <div className="card p-8 text-center text-text-muted text-sm space-y-2">
          <MapPin size={32} className="mx-auto text-text-muted opacity-50" />
          <div>No points of interest found nearby for this filter.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredPlaces.map((place) => (
            <div key={place.id} className="card p-4 hover:shadow-card-hover transition-all space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm text-text-primary leading-snug">{place.name}</h4>
                  <span className="badge badge-primary text-[10px] uppercase font-bold flex-shrink-0">
                    {place.category}
                  </span>
                </div>
                <p className="text-xs text-text-secondary line-clamp-2 mt-1.5">{place.description}</p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-text-muted font-medium flex items-center gap-1">
                  <MapPin size={13} className="text-primary" /> {place.distance.toFixed(1)} km from train
                </span>

                {place.wikiUrl ? (
                  <a
                    href={place.wikiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    Wiki <ExternalLink size={12} />
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    View Map <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
