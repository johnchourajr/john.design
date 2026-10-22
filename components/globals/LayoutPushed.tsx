'use client';

import { useAppContext } from '@/context/AppProvider';
import clsx from 'clsx';
import {
  COLOR_DRAWER_PUSH_CLASS,
  COLOR_DRAWER_TRANSITION_CLASS,
} from './Header/NavColorDrawer';

export type LayoutPushedProps = {
  children: React.ReactNode;
};

// Pushes page content down while the color drawer is open. The transform is
// only applied when open so it doesn't become a containing block for fixed
// descendants the rest of the time.
export function LayoutPushed({ children }: LayoutPushedProps) {
  const { toggleColorActive } = useAppContext();

  return (
    <div
      className={clsx(
        COLOR_DRAWER_TRANSITION_CLASS,
        toggleColorActive && COLOR_DRAWER_PUSH_CLASS,
      )}
    >
      {children}
    </div>
  );
}
