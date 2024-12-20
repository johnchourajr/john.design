'use client';

import { FunShaderV1 } from '@/components/experimental/FunShader';
import InlineLink from '@/components/fragments/InlineLink';

export default function Page() {
  return (
    <>
      <InlineLink href="/exp/" className="no-underline">
        <h2 className="my-8">
          &larr; <span className="underline">Back</span>
        </h2>
      </InlineLink>
      <FunShaderV1 className="w-screen h-[100vw]" />
    </>
  );
}
