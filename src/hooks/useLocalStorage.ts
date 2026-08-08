'use client';

import { useState, useEffect, useCallback } from 'react';
import { Favorite, RecentSearch } from '@/types';

const FAVORITES_KEY = 'railgaadi_favorites';
const RECENTS_KEY = 'railgaadi_recents';
const MAX_RECENTS = 10;

// ─── Favorites ────────────────────────────────────────────────────────────────

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
  }, []);

  const save = useCallback((updated: Favorite[]) => {
    setFavorites(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  }, []);

  const addFavorite = useCallback(
    (fav: Omit<Favorite, 'createdAt'>) => {
      const exists = favorites.some((f) => f.trainNumber === fav.trainNumber);
      if (exists) return;
      save([{ ...fav, createdAt: new Date().toISOString() }, ...favorites]);
    },
    [favorites, save]
  );

  const removeFavorite = useCallback(
    (trainNumber: string) => {
      save(favorites.filter((f) => f.trainNumber !== trainNumber));
    },
    [favorites, save]
  );

  const isFavorite = useCallback(
    (trainNumber: string) => favorites.some((f) => f.trainNumber === trainNumber),
    [favorites]
  );

  return { favorites, addFavorite, removeFavorite, isFavorite };
}

// ─── Recent Searches ──────────────────────────────────────────────────────────

export function useRecentSearches() {
  const [recents, setRecents] = useState<RecentSearch[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENTS_KEY);
      if (stored) setRecents(JSON.parse(stored));
    } catch {}
  }, []);

  const addRecent = useCallback(
    (search: Omit<RecentSearch, 'searchedAt'>) => {
      const filtered = recents.filter((r) => r.trainNumber !== search.trainNumber);
      const updated = [
        { ...search, searchedAt: new Date().toISOString() },
        ...filtered,
      ].slice(0, MAX_RECENTS);
      setRecents(updated);
      localStorage.setItem(RECENTS_KEY, JSON.stringify(updated));
    },
    [recents]
  );

  const clearRecents = useCallback(() => {
    setRecents([]);
    localStorage.removeItem(RECENTS_KEY);
  }, []);

  return { recents, addRecent, clearRecents };
}
