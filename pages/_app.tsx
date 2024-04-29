/**
 * Types
 */
import type { AppProps } from 'next/app';

/**
 * Styles
 */
import { GlobalLayout } from '@/components/globals/layout';
import { AppProvider } from '@/context/AppProvider';
import { DrawingProvider } from '@/context/DrawingContext';
import { GtagProvider } from '@/context/GtagProvider';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GtagProvider>
      <AppProvider>
        <DrawingProvider>
          <GlobalLayout>
            <Component {...pageProps} />
          </GlobalLayout>
        </DrawingProvider>
      </AppProvider>
    </GtagProvider>
  );
}
