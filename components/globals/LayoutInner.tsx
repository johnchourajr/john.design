'use client';

import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export type LayoutInnerProps = {
  children: React.ReactNode;
};

function LayoutInnerLoader({ children }: LayoutInnerProps) {
  const searchParams = useSearchParams();
  const isIframe = searchParams.get('iframe') !== null;

  return (
    <main className={clsx('relative z-10', !isIframe && 'min-h-[100vh] pt-14')}>
      {children}
    </main>
  );
}

export function LayoutInner({ children }: LayoutInnerProps) {
  return (
    <Suspense>
      <LayoutInnerLoader>{children}</LayoutInnerLoader>
    </Suspense>
  );
}
