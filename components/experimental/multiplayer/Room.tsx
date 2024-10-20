'use client';

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from '@liveblocks/react/suspense';
import { ReactNode } from 'react';

export function Room({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider
      publicApiKey={
        'pk_prod_NyoWtxLwEXuxeVAf1QY6occTdzukPmEZTAyoVm09vdVQgGKQSpnmH1D-S8V3LWI4'
      }
    >
      <RoomProvider id="john.room">
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
