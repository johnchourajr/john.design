import PlausibleProvider from 'next-plausible';

import { DrawingProvider } from '@/components/experimental/Drawing';
import { GlobalLayout } from '@/components/globals/layout';
import { SchemaJson } from '@/components/globals/SchemaJson';
import { AppProvider } from '@/context/AppProvider';
import { GtagProvider } from '@/context/GtagProvider';
import { domain, metadataContent, viewportContent } from '@/data/metadata';

import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import type { CSSProperties } from 'react';

import '../styles/globals.css';

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
        {/* Load Typekit fonts asynchronously to prevent render blocking */}
        <link
          rel="stylesheet"
          href="https://use.typekit.net/wqj3mof.css"
          media="print"
        />
        <noscript>
          <link rel="stylesheet" href="https://use.typekit.net/wqj3mof.css" />
        </noscript>
      </head>
      <body className="bg-black">
        {/* Script to load Typekit CSS asynchronously after initial render */}
        <Script id="typekit-async" strategy="afterInteractive">
          {`
            (function() {
              const link = document.querySelector('link[href="https://use.typekit.net/wqj3mof.css"]');
              if (link) {
                link.media = 'all';
              } else {
                // Fallback: create link if it doesn't exist
                const newLink = document.createElement('link');
                newLink.rel = 'stylesheet';
                newLink.href = 'https://use.typekit.net/wqj3mof.css';
                document.head.appendChild(newLink);
              }
            })();
          `}
        </Script>
        <PlausibleProvider
          domain={domain}
          trackOutboundLinks
          trackFileDownloads
          enabled={domain.indexOf('localhost') === -1}
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
      </body>
    </html>
  );
}
