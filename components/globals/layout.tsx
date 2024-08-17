'use client';

import { useDrawing } from '@/context/DrawingContext';
import clsx from 'clsx';
import Footer from './Footer';
import Header from './Header';

export type GlobalLayoutProps = {
  children: React.ReactNode;
};

export function GlobalLayout({ children }: GlobalLayoutProps) {
  const { enableDrawing } = useDrawing();

  return (
    <div
      className={clsx(
        'text-root bg-black min-h-[100vh] font-sans relative',
        enableDrawing && 'drawing-cursor',
      )}
    >
      <Header />
      <main className="relative z-10 min-h-[100vh] pt-14">{children}</main>
      <Footer />
    </div>
  );
}
