'use client';

import * as gtag from '@/lib/core/gtag';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import React, { useEffect, useRef } from 'react';

export function GtagProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const isFirstPage = useRef(true);

  useEffect(() => {
    if (!gaId) return;

    // The inline gtag('config') below already records the landing page.
    if (isFirstPage.current) {
      isFirstPage.current = false;
      return;
    }

    if (typeof window.gtag === 'function') {
      gtag.pageview(pathname);
    }
  }, [pathname, gaId]);

  return (
    <>
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
    </>
  );
}
