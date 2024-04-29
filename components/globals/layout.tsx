import { useDrawing } from '@/context/DrawingContext';
import clsx from 'clsx';
import GlobalHead from '../GlobalHead';
import Header from './Header';
import Footer from './footer';

export type GlobalLayoutProps = {
  children: React.ReactNode;
};

export function GlobalLayout({ children }: GlobalLayoutProps) {
  const { enableDrawing } = useDrawing();

  return (
    <>
      <div
        className={clsx(
          'text-root bg-black min-h-[100vh] font-sans relative',
          enableDrawing && 'drawing-cursor',
        )}
      >
        <GlobalHead />
        <Header />
        <main className="relative z-10 min-h-[100vh] pt-14">{children}</main>
        <Footer />
      </div>
    </>
  );
}
