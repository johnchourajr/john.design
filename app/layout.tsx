import { DrawingProvider } from '@/components/experimental/Drawing';
import { GlobalLayout } from '@/components/globals/layout';
import { SchemaJson } from '@/components/globals/SchemaJson';
import { AppProvider } from '@/context/AppProvider';
import { GtagProvider } from '@/context/GtagProvider';
import type { Metadata, Viewport } from 'next';
import { CSSProperties } from 'react';
import '../styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://john.design'),
  title: 'John.Design',
  description: 'John is working on the internet',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://john.design',
    siteName: 'John.Design',
    images: '/og.png',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@johnchourajr',
  },
  alternates: {
    canonical: 'https://john.design',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#fd0000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ '--root-color': '#ff0000' } as CSSProperties}>
      <head>
        <SchemaJson />
      </head>
      <body>
        <GtagProvider>
          <AppProvider>
            <DrawingProvider>
              <GlobalLayout>{children}</GlobalLayout>
            </DrawingProvider>
          </AppProvider>
        </GtagProvider>
      </body>
    </html>
  );
}
