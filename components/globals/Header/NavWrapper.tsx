'use client';

import { useDrawing } from '@/components/experimental/Drawing';
import { useAppContext } from '@/context/AppProvider';
import clsx from 'clsx';
import {
  COLOR_DRAWER_PUSH_CLASS,
  COLOR_DRAWER_TRANSITION_CLASS,
} from './NavColorDrawer';

export function NavWrapper({ children }: { children: React.ReactNode }) {
  const { isIframe } = useDrawing();
  const { toggleColorActive } = useAppContext();

  if (isIframe) return null;

  return (
    <nav
      className={clsx(
        'w-full inline-flex row justify-between items-center fixed top-0 p-4',
        'after:content after:absolute after:inset-0 after:z-0 after:h-20 after:pointer-events-none',
        'after:bg-linear-to-b after:from-(--root-background) after:to-transparent after:opacity-75',
        'z-50 in-data-iframe:hidden',
        COLOR_DRAWER_TRANSITION_CLASS,
        toggleColorActive && COLOR_DRAWER_PUSH_CLASS,
      )}
    >
      {children}
    </nav>
  );
}
