'use client';

import { useDrawing } from '@/components/Drawing/Drawing.context';
import { LiveblocksProvider } from '@liveblocks/react';
import { useEffect } from 'react';

export type ProviderProps = {
  children: React.ReactNode;
};

export function Provider({ children }: ProviderProps) {
  const { setEnableDrawing, clearStoredPoints } = useDrawing();

  useEffect(() => {
    setEnableDrawing(false);
    clearStoredPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setEnableDrawing]);

  return (
    <>
      <LiveblocksProvider publicApiKey={process.env.NEXT_LIVEBLOCKS_KEY || ''}>
        {children}
      </LiveblocksProvider>
    </>
  );
}
