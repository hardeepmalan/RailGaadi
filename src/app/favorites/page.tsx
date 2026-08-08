'use client';

import { useRouter } from 'next/navigation';
import { Heart, Train, ArrowRight, Trash2, Search } from 'lucide-react';
import { useFavorites } from '@/hooks/useLocalStorage';
import { EmptyState } from '@/components/ui/EmptyState';
import { format } from 'date-fns';

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites, removeFavorite } = useFavorites();

  const handleTrack = (trainNumber: string) => {
    router.push(`/track/${trainNumber}`);
  };

  return (
    <div className="min-h-screen bg-background p-5 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-heading text-text-primary flex items-center gap-2">
            <Heart size={24} className="text-danger" fill="#DC2626" /> Saved Trains
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Quickly access live status for your favorite routes.
          </p>
        </div>
        {favorites.length > 0 && (
          <span className="badge badge-primary text-xs font-semibold px-3 py-1">
            {favorites.length} saved
          </span>
        )}
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          title="No saved trains yet"
          description="Heart any train while searching or tracking to save it here for fast access."
          icon="train"
          action={
            <button onClick={() => router.push('/')} className="btn btn-primary text-xs py-2 px-4 rounded-xl">
              Search Trains
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {favorites.map((fav) => (
            <div
              key={fav.trainNumber}
              className="card p-4 flex items-center justify-between gap-3 hover:shadow-card-hover transition-all group"
            >
              <div
                onClick={() => handleTrack(fav.trainNumber)}
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-danger-50 flex items-center justify-center flex-shrink-0">
                  <Train size={20} className="text-danger" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-text-primary truncate group-hover:text-primary transition-colors">
                    {fav.trainName}
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Train #{fav.trainNumber} · {fav.from} → {fav.to}
                  </p>
                  <p className="text-[10px] text-text-muted mt-1">
                    Saved on {format(new Date(fav.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleTrack(fav.trainNumber)}
                  className="btn btn-primary text-xs py-2 px-3 rounded-xl flex items-center gap-1"
                >
                  <span>Track</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => removeFavorite(fav.trainNumber)}
                  className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger-50 transition-colors"
                  aria-label="Remove favorite"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
