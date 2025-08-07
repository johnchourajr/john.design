import PlausibleProvider from 'next-plausible';
import dynamic from 'next/dynamic';

import { DrawingProvider } from '@/components/experimental/Drawing';
import { GlobalLayout } from '@/components/globals/layout';
import { SchemaJson } from '@/components/globals/SchemaJson';
import { AppProvider } from '@/context/AppProvider';
import { GtagProvider } from '@/context/GtagProvider';
import { domain, metadataContent, viewportContent } from '@/data/metadata';

import type { Metadata, Viewport } from 'next';
import type { CSSProperties } from 'react';

import '../styles/globals.css';

const PerformanceScript = dynamic(() => import('./performance-script'), { 
  ssr: false 
});

export const metadata: Metadata = metadataContent;

export const viewport: Viewport = viewportContent;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      style={{ '--root-color': viewport.colorScheme } as CSSProperties}
    >
      <head>
        <SchemaJson />
      </head>
      <body>
        <PlausibleProvider
          domain={domain}
          trackOutboundLinks
          trackFileDownloads
          enabled={domain.indexOf('localhost') !== -1 || undefined}
          trackLocalhost={domain.indexOf('localhost') !== -1}
        >
          <GtagProvider>
            <AppProvider>
              <DrawingProvider>
                <GlobalLayout>{children}</GlobalLayout>
              </DrawingProvider>
            </AppProvider>
          </GtagProvider>
        </PlausibleProvider>
        <PerformanceScript />
      </body>
    </html>
  );
}
