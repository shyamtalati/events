import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const googleSansFlex = localFont({
  src: [
    {
      path: './fonts/GoogleSansFlex-VariableFont_GRAD_ROND_opsz_slnt_wdth_wght.ttf',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-brand',
  display: 'swap',
});

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
    <html lang="en" className={googleSansFlex.variable}>
      <body>
        <Header />
        <main className="mx-auto w-full max-w-content flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
