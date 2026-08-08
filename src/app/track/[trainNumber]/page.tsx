import type { Metadata } from 'next';
import { TrackingPage } from '@/components/pages/TrackingPage';
import { TRAINS_DB } from '@/data/trains';

interface Props {
  params: { trainNumber: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const train = TRAINS_DB.find((t) => t.number === params.trainNumber);
  return {
    title: train ? `${train.name} (${train.number}) — Live Status` : `Train ${params.trainNumber} — Live Status`,
    description: train
      ? `Track ${train.name} live — from ${train.from} to ${train.to}. Real-time location, ETA, delay updates, and journey analytics.`
      : `Live tracking for train ${params.trainNumber} on Indian Railways.`,
  };
}

export default function Page({ params }: Props) {
  return <TrackingPage trainNumber={params.trainNumber} />;
}
