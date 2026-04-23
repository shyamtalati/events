import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  metadataBase: new URL('https://universityevent.netlify.app'),
  title: 'Drexel University Events',
  description:
    'A clean, curated list of upcoming Drexel events, with the directory expanding from finance and career programming to university-wide student events.',
  openGraph: {
    title: 'Drexel University Events',
    description:
      'A clean, curated list of upcoming Drexel events, with the directory expanding from finance and career programming to university-wide student events.',
    type: 'website',
    url: 'https://universityevent.netlify.app',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Drexel University Events',
      },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="mx-auto w-full max-w-content px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
