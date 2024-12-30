'use client';

import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';

export function NavWrapper({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isIframe = searchParams.get('iframe') !== null;

  if (isIframe) return null;

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
