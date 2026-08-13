import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';
import { BottomNav } from '@/components/layout/BottomNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { TelemetryTracker } from '@/components/telemetry/TelemetryTracker';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'RailGaadi — Live Indian Train Tracking',
    template: '%s | RailGaadi',
  },
  description:
    'Track Indian Railways trains in real-time with live maps, journey analytics, weather updates, and geographic insights.',
  keywords: ['Indian Railways', 'train tracking', 'live train status', 'IRCTC', 'PNR status', 'train schedule'],
  authors: [{ name: 'RailGaadi' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://railgaadi.in',
    siteName: 'RailGaadi',
    title: 'RailGaadi — Live Indian Train Tracking',
    description: 'Track Indian Railways trains in real-time with live maps and journey analytics.',
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <Providers>
          {/* Automatic Telemetry & Page Action Tracker */}
          <TelemetryTracker />

          <div className="min-h-screen flex flex-col">
            {/* Top Navbar & Slide-out 3-Bars Hamburger Sidebar Drawer */}
            <Sidebar />

            {/* Full-Screen Main Content Container */}
            <main className="w-full flex-1 pb-20 lg:pb-6">
              {children}
            </main>
          </div>

          {/* Mobile Bottom Nav */}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
