import type { Metadata } from 'next';
import PNRPageClient from './PNRPageClient';

export const metadata: Metadata = {
  title: 'PNR Status — RailGaadi',
  description: 'Check your Indian Railways PNR status. Get real-time passenger and journey information.',
};

export default function PNRPage() {
  return <PNRPageClient />;
}
