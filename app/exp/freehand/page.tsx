'use client';

import FreehandCanvas from '@/components/experimental/FreehandCanvas/FreehandCanvas';
import InlineLink from '@/components/fragments/InlineLink';

export default function Freehand() {
  return (
    <>
      <InlineLink
        href="/exp/"
        className="relative z-50 no-underline"
        underline={false}
      >
        <h2 className="m-4">
          &larr; <span>Back</span>
        </h2>
      </InlineLink>
      <div className="relative flex items-center justify-start w-full h-[100vh]">
        <p className="fixed bottom-2">Start drawing with your cursor ✎</p>
      </div>
      <FreehandCanvas />
    </>
  );
}
