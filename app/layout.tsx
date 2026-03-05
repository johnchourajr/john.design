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
} from '@/lib/theme/theme-config';

import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import type { CSSProperties } from 'react';

import '../styles/globals.css';

export const metadata: Metadata = metadataContent;

export const viewport: Viewport = viewportContent;

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={
        {
          '--root-color': DEFAULT_ROOT_COLOR,
          '--root-background': DEFAULT_ROOT_BACKGROUND,
        } as CSSProperties
      }
    >
      <head>
        <SchemaJson />
        <Script
          id="root-color-cookie"
          src="/scripts/root-color-cookie.js"
          strategy="beforeInteractive"
        />
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
        <Script id="typekit-async" src="/scripts/typekit-async.js" strategy="afterInteractive" />
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
