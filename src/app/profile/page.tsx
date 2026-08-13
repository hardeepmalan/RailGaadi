import type { Metadata } from 'next';
import ProfilePageClient from './ProfilePageClient';

export const metadata: Metadata = {
  title: 'Profile — RailGaadi by Hardeep Malan',
  description: 'Manage your settings, saved trains, and discover the creator behind RailGaadi.',
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
