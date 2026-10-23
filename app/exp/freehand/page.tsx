'use client';

import FreehandCanvas from '@/components/experimental/FreehandCanvas/FreehandCanvas';
import { ExpBackLink } from '@/components/experimental/ExpBackLink';

export default function Freehand() {
  return (
    <>
      <ExpBackLink />
      <div className="relative flex items-center justify-start w-full h-screen">
        <p className="fixed bottom-2">Start drawing with your cursor ✎</p>
      </div>
      <FreehandCanvas />
    </>
  );
}
