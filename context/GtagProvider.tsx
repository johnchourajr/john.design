'use client';

import * as gtag from '@/lib/core/gtag';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import React, { createContext, useContext, useEffect } from 'react';

type GtagContextType = {};

const GtagContext = createContext<GtagContextType | undefined>(undefined);

export function useGtagContext() {
  const context = useContext(GtagContext);
  if (!context) {
    throw new Error('useGtag must be used within a GtagProvider');
  }
  return context;
}

export function GtagProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!gaId) return;

    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };

    handleRouteChange(pathname);

    return () => {
      handleRouteChange(pathname);
    };
  }, [pathname, gaId]);

  return (
    <GtagContext.Provider value={{}}>
      {children}

      {gaId && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');`,
            }}
          />
        </>
      )}
    </GtagContext.Provider>
  );
}
