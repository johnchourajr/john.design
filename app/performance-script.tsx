'use client';

import { useEffect } from 'react';

export default function PerformanceScript() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'layout-shift') {
            console.log('CLS detected:', entry);
          }
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });

      window.requestIdleCallback(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          console.log('Performance Metrics:', {
            'DOM Content Loaded': navigation.domContentLoadedEventEnd - navigation.fetchStart,
            'Load Complete': navigation.loadEventEnd - navigation.fetchStart,
            'First Paint': performance.getEntriesByType('paint')[0]?.startTime,
            'LCP': performance.getEntriesByType('largest-contentful-paint')[0]?.startTime
          });
        }
      });

      return () => observer.disconnect();
    }
  }, []);

  return null;
}