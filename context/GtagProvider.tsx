'use client';

import * as gtag from '@/lib/core/gtag';
import { usePathname, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };

    handleRouteChange(pathname);
    // router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      handleRouteChange(pathname);

      // router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [pathname]);

  return (
    <GtagContext.Provider value={{}}>
      {children}

      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');`,
        }}
      />
    </GtagContext.Provider>
  );
}
