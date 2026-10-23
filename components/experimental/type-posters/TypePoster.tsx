'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import type { Poster } from './posters';

// three.js loads after the page.
const TypePosterCanvas = dynamic(() => import('./TypePosterCanvas'), {
  ssr: false,
});

type TypePosterProps = Pick<Poster, 'slug' | 'title' | 'words' | 'paper'> & {
  className?: string;
};

/**
 * A type poster at 3:4. The words are in the page for screen readers; the
 * canvas draws them. Without WebGL the paper stays, titled.
 */
export function TypePoster({ slug, title, words, paper, className }: TypePosterProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      role="img"
      aria-label={`${title}: ${words}`}
      data-testid={`type-poster-${slug}`}
      className={clsx('relative w-full aspect-3/4 overflow-hidden', paper, className)}
    >
      {failed ? (
        <p className="absolute inset-0 flex items-center justify-center headline-display-md text-white mix-blend-difference">
          {title}
        </p>
      ) : (
        <TypePosterCanvas slug={slug} onError={() => setFailed(true)} />
      )}
    </div>
  );
}
