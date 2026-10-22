'use client';

import clsx from 'clsx';
import { useEffect } from 'react';
import { useIsProposalDetail } from '@/hooks/useIsProposalDetail';
import { useDrawing } from '../experimental/Drawing';

export type LayoutInnerProps = {
  children: React.ReactNode;
};

export function LayoutInner({ children }: LayoutInnerProps) {
  const { setEnableDrawing, isIframe } = useDrawing();
  const isProposalDetail = useIsProposalDetail();

  useEffect(() => {
    if (isIframe) {
      setEnableDrawing(false);
    }
  }, [isIframe, setEnableDrawing]);

  return (
    <main className={clsx('relative z-10', !isIframe && !isProposalDetail && 'min-h-screen pt-14 in-data-iframe:min-h-0 in-data-iframe:pt-0', isProposalDetail && 'min-h-screen')}>
      {children}
    </main>
  );
}
