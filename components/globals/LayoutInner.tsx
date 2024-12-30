'use client';

import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDrawing } from '../experimental/Drawing';

export type LayoutInnerProps = {
  children: React.ReactNode;
};

export function LayoutInner({ children }: LayoutInnerProps) {
  const searchParams = useSearchParams();
  const isIframe = searchParams.get('iframe') !== null;
  const { setEnableDrawing } = useDrawing();

  useEffect(() => {
    if (isIframe) {
      setEnableDrawing(false);
    }
  }, [isIframe, setEnableDrawing]);

  return (
    <main className={clsx('relative z-10', !isIframe && 'min-h-[100vh] pt-14')}>
      {children}
    </main>
  );
}
