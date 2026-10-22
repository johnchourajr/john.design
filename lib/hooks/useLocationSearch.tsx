'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getSnapshot = () => window.location.search;
const getServerSnapshot = () => '';

/**
 * The URL query string, read after hydration. Unlike `useSearchParams`, this
 * doesn't opt the page out of static rendering: the server and first client
 * render see an empty string, then the real value. Doesn't update on
 * client-side navigation that only changes the query.
 */
export function useLocationSearch() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
