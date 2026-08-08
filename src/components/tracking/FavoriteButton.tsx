'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useLocalStorage';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

interface FavoriteButtonProps {
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
}

export function FavoriteButton({ trainNumber, trainName, from, to }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorited = isFavorite(trainNumber);

  const toggle = () => {
    if (favorited) {
      removeFavorite(trainNumber);
      toast('Removed from favorites');
    } else {
      addFavorite({ trainNumber, trainName, from, to });
      toast.success('Added to favorites!');
    }
  };

  return (
    <button
      onClick={toggle}
      className={clsx(
        'btn p-2 rounded-xl transition-all duration-200',
        favorited
          ? 'bg-danger-50 text-danger hover:bg-danger-100'
          : 'btn-ghost hover:bg-danger-50 hover:text-danger'
      )}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={favorited}
    >
      <Heart
        size={18}
        className="transition-transform duration-200"
        style={{ transform: favorited ? 'scale(1.1)' : 'scale(1)' }}
        fill={favorited ? 'currentColor' : 'none'}
      />
    </button>
  );
}
