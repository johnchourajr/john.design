'use client';

import { useEffect, useState } from 'react';

/**
 * True once the browser is first idle after mount (within `timeout` ms),
 * for work that shouldn't compete with the page's first render: preloads,
 * and the heroes' shaders, which would otherwise load during hydration.
 */
export function useIdle(timeout = 2000) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    if (!('requestIdleCallback' in window)) {
      const fallback = setTimeout(() => setIdle(true), timeout / 2);
      return () => clearTimeout(fallback);
    }
    const handle = requestIdleCallback(() => setIdle(true), { timeout });
    return () => cancelIdleCallback(handle);
  }, [timeout]);
  return idle;
}
