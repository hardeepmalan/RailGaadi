import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Train Between Stations — RailGaadi',
  description: 'Find trains between any two Indian railway stations. Real-time results with departure, arrival, and duration.',
};

export default function SearchPage() {
  return <SearchPageClient />;
}

import SearchPageClient from './SearchPageClient';
