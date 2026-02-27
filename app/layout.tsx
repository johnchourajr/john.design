import PlausibleProvider from 'next-plausible';

import { DrawingProvider } from '@/components/experimental/Drawing';
import { GlobalLayout } from '@/components/globals/layout';
import { SchemaJson } from '@/components/globals/SchemaJson';
import { AppProvider } from '@/context/AppProvider';
import { GtagProvider } from '@/context/GtagProvider';
import { domain, metadataContent, viewportContent } from '@/data/metadata';
import {
  DEFAULT_ROOT_BACKGROUND,
  DEFAULT_ROOT_COLOR,
  ROOT_COLOR_COOKIE_NAME,
  resolveThemeColor,
} from '@/lib/theme/theme-config';

import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import Script from 'next/script';
import type { CSSProperties } from 'react';

import '../styles/globals.css';

export const metadata: Metadata = metadataContent;

export const viewport: Viewport = viewportContent;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieColor = cookieStore.get(ROOT_COLOR_COOKIE_NAME)?.value;
  const rootColor = resolveThemeColor(DEFAULT_ROOT_COLOR, cookieColor);

  return (
    <html
      lang="en"
      style={
        {
          '--root-color': rootColor,
          '--root-background': DEFAULT_ROOT_BACKGROUND,
        } as CSSProperties
      }
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
      <body className="bg-[var(--root-background)]">
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
