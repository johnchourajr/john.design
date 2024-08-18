'use client';

import InlineLink from '@/components/fragments/InlineLink';
import Logo from '@/components/svg/logo';

export default function SeeScroll() {
  return (
    <>
      <InlineLink href="/exp/" className="no-underline">
        <h2 className="my-8">
          &larr; <span className="underline">Back</span>
        </h2>
      </InlineLink>
      <div className="w-full h-[80vh] flex items-center justify-center">
        <Logo className="w-1/2 h-1/2" />
      </div>
    </>
  );
}
