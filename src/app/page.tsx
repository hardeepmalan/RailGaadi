import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/HomePage';

export const metadata: Metadata = {
  title: 'RailGaadi — Live Indian Train Tracking',
  description: 'Search and track any Indian Railways train in real-time. View live location, ETA, delays, weather, and nearby places.',
};

export default function Home() {
  return <HomePage />;
}
