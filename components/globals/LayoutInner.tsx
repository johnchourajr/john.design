'use client';

import clsx from 'clsx';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useDrawing } from '../experimental/Drawing';

export type LayoutInnerProps = {
  children: React.ReactNode;
};

export function LayoutInner({ children }: LayoutInnerProps) {
  const { setEnableDrawing, isIframe } = useDrawing();
  const pathname = usePathname();
  const isProposalDetail = pathname?.startsWith('/proposals/') && pathname !== '/proposals/';

  useEffect(() => {
    if (isIframe) {
      setEnableDrawing(false);
    }
  }, [isIframe, setEnableDrawing]);

  return (
    <main className={clsx('relative z-10', !isIframe && !isProposalDetail && 'min-h-[100vh] pt-14', isProposalDetail && 'min-h-[100vh]')}>
      {children}
    </main>
  );
}
