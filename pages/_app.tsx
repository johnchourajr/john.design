import clsx from 'clsx';

/**
 * Components
 */
import GlobalHead from '@/components/GlobalHead';
import Footer from '@/components/globals/footer';
import Header from '@/components/globals/header';

/**
 * Types
 */
import type { AppProps } from 'next/app';

/**
 * Styles
 */
import { DrawingProvider } from '@/context/DrawingContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DrawingProvider>
      <div
        className={clsx(
          'text-[color:var(--root-color)] bg-black min-h-[100vh] font-sans relative',
        )}
        style={{
          cursor: "url('/pencil.svg') 6 18, auto",
        }}
      >
        <GlobalHead />
        <Header />
        <main className="relative z-10 min-h-[100vh]">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </DrawingProvider>
  );
}
