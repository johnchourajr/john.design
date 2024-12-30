'use client';

import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';

export type LayoutInnerProps = {
  children: React.ReactNode;
};

export function LayoutInner({ children }: LayoutInnerProps) {
  const searchParams = useSearchParams();
  const isIframe = searchParams.get('iframe') !== null;

  return (
    <main className={clsx('relative z-10', !isIframe && 'min-h-[100vh] pt-14')}>
      {children}
    </main>
  );
}
