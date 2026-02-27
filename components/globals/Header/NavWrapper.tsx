'use client';

import { useDrawing } from '@/components/experimental/Drawing';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

export function NavWrapper({ children }: { children: React.ReactNode }) {
  const { isIframe } = useDrawing();
  const pathname = usePathname();

  const isProposalDetail = pathname?.startsWith('/proposals/') && pathname !== '/proposals/';

  if (isIframe || isProposalDetail) return null;

  return (
    <nav
      className={clsx(
        'w-full inline-flex row justify-between items-center fixed top-0 p-4',
        'after:content after:absolute after:inset-0 after:z-0 after:h-[5rem] after:pointer-events-none',
        'after:bg-gradient-to-b after:from-black after:to-transparent',
        'z-50',
      )}
    >
      {children}
    </nav>
  );
}
