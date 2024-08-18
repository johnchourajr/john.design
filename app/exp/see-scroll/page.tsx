'use client';

import InlineLink from '@/components/fragments/InlineLink';

export default function SeeScroll() {
  return (
    <>
      <InlineLink href="/exp/" className="no-underline">
        <h2 className="my-8">
          &larr; <span className="underline">Back</span>
        </h2>
      </InlineLink>
      Nothing to see here yet.
    </>
  );
}
