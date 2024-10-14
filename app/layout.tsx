import { GlobalLayout } from '@/components/globals/layout';
import { AppProvider } from '@/context/AppProvider';
import { DrawingProvider } from '@/context/DrawingContext';
import { GtagProvider } from '@/context/GtagProvider';
import type { Metadata, Viewport } from 'next';
import { CSSProperties } from 'react';
import '../styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://john.design'),
  title: 'John.Design',
  description: 'John is working on the internet',
  openGraph: {
    images: '/og.png',
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
