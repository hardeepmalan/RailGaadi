'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLiveStatus } from '@/services/api';
import { LiveStatus } from '@/types';

const REFRESH_INTERVAL_MS = 30_000; // 30 seconds

export function useLiveTracking(trainNumber: string) {
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL_MS / 1000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const query = useQuery<LiveStatus, Error>({
    queryKey: ['liveStatus', trainNumber],
    queryFn: () => getLiveStatus(trainNumber),
    refetchInterval: REFRESH_INTERVAL_MS,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
    staleTime: 25_000,
    enabled: !!trainNumber,
  });

  // Countdown timer for next refresh
  useEffect(() => {
    setCountdown(REFRESH_INTERVAL_MS / 1000);
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) return REFRESH_INTERVAL_MS / 1000;
        return c - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [query.dataUpdatedAt]);

  const refresh = useCallback(() => {
    query.refetch();
    setCountdown(REFRESH_INTERVAL_MS / 1000);
  }, [query]);

  return {
    liveStatus: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    countdown,
    refresh,
    lastUpdated: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
  };
}
