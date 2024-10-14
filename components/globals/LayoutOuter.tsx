'use client';

import { useDrawing } from '@/context/DrawingContext';
import clsx from 'clsx';

export type LayoutOuterProps = {
  children: React.ReactNode;
};

export function LayoutOuter({ children }: LayoutOuterProps) {
  const { enableDrawing } = useDrawing();

  return (
    <div
      className={clsx(
        'text-root bg-black min-h-[100vh] font-sans relative',
        enableDrawing && 'drawing-cursor',
      )}
    >
      {children}
    </div>
  );
}
