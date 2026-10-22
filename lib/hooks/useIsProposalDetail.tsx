'use client';

import { usePathname } from 'next/navigation';

/** True on a single proposal (/proposals/<slug>), which hides the site chrome. */
export function useIsProposalDetail() {
  const pathname = usePathname();
  return !!pathname?.startsWith('/proposals/') && pathname !== '/proposals/';
}
