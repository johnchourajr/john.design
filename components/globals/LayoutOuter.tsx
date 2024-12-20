'use client';

import { useDrawing } from '@/components/Drawing/Drawing.context';
import clsx from 'clsx';
import { domAnimation, LazyMotion } from 'framer-motion';

export type LayoutOuterProps = {
  children: React.ReactNode;
};

export function LayoutOuter({ children }: LayoutOuterProps) {
  const { enableDrawing } = useDrawing();

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={clsx(
          'text-root bg-black min-h-[100vh] font-sans relative',
          enableDrawing && 'drawing-cursor',
        )}
      >
        {children}
      </div>
    </LazyMotion>
  );
}
