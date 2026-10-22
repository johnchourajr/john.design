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
    <main className={clsx('relative z-10', !isIframe && !isProposalDetail && 'min-h-[100vh] pt-14 [[data-iframe]_&]:min-h-0 [[data-iframe]_&]:pt-0', isProposalDetail && 'min-h-[100vh]')}>
      {children}
    </main>
  );
}
