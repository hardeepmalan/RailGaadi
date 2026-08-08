import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';
import { BottomNav } from '@/components/layout/BottomNav';
import { Sidebar } from '@/components/layout/Sidebar';

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
      <body className="bg-background text-text-primary antialiased">
        <Providers>
          <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
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
