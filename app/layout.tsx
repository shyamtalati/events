import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Drexel Finance Events',
  description:
    'A clean, curated list of upcoming finance and business events for Drexel students.',
  openGraph: {
    title: 'Drexel Finance Events',
    description:
      'A clean, curated list of upcoming finance and business events for Drexel students.',
    type: 'website',
    url: 'https://drexel-finance-events.vercel.app',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Drexel Finance Events',
      },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="mx-auto w-full max-w-content px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
