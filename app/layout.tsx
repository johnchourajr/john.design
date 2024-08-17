import { GlobalLayout } from '@/components/globals/layout';
import { AppProvider } from '@/context/AppProvider';
import { DrawingProvider } from '@/context/DrawingContext';
import { GtagProvider } from '@/context/GtagProvider';
import type { Metadata } from 'next';
import Head from 'next/head';
import { CSSProperties } from 'react';
import '../styles/globals.css';

// title = 'John.Design',
//   description = 'John is working on the internet',
//   image = '/og.png',

export const metadata: Metadata = {
  title: 'John.Design',
  description: 'John is working on the internet',
  openGraph: {
    images: '/og.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ '--root-color': '#ff0000' } as CSSProperties}>
      <Head>
        <link rel="stylesheet" href="https://use.typekit.net/wqj3mof.css" />
      </Head>
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
