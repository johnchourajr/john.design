'use client';

import clsx from 'clsx';
import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import InlineLink from '@/components/fragments/InlineLink';

const subscribe = () => () => {};

/**
 * The back link on every experiment. `<main>` is its own stacking context
 * (z-10), under the header's blur (z-50), so a link inside it can't rise
 * above the blur whatever its z-index. Once the page is running it moves to
 * the body, fixed under the nav and above the blur, and an invisible copy
 * holds its place; before that (and without JavaScript) it sits in the
 * page as it always has.
 */
export function ExpBackLink({ className }: { className?: string }) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const link = (floating: boolean) => (
    <InlineLink
      href="/exp/"
      className={clsx(
        'no-underline in-data-iframe:hidden',
        // Out of the site's wrapper, so it takes the wrapper's type and colour.
        floating && 'fixed! top-14 left-0 z-55! text-root font-sans',
        className,
      )}
      underline={false}
    >
      <h2 className="m-4">
        &larr; <span>Back</span>
      </h2>
    </InlineLink>
  );

  if (!mounted) return link(false);
  return (
    <>
      {/* Holds the link's place in the page, so nothing shifts when it moves. */}
      <div className="invisible" aria-hidden>
        {link(false)}
      </div>
      {createPortal(link(true), document.body)}
    </>
  );
}
