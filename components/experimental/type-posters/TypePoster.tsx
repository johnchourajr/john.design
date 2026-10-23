'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';

import type { Poster } from './posters';

// The renderer (three.js, or vgpu for the WebGPU port) loads after the page.
const TypePosterCanvas = dynamic(() => import('./TypePosterCanvas'), {
  ssr: false,
});

type TypePosterProps = Pick<Poster, 'slug' | 'title' | 'words' | 'paper'> & {
  className?: string;
};

/**
 * A type poster at 3:4. The words are in the page for screen readers; the
 * canvas draws them.
 *
 * Under the canvas is the poster's snapshot, its first frame captured by
 * `scripts/capture-poster-snapshots.sh`. It's in the prerendered page, so the
 * poster shows at once while the shader loads, and stays if neither WebGPU
 * nor WebGL can run. The canvas is transparent until it draws, then covers
 * it.
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
      <Image
        src={`/exp/type-posters/${slug}.jpg`}
        alt=""
        fill
        // As wide as a poster gets: on the wall, or open in the middle.
        sizes="(max-width: 768px) 90vw, 45vw"
        className="object-cover pointer-events-none select-none"
        data-testid={`type-poster-snapshot-${slug}`}
      />
      {!failed && <TypePosterCanvas slug={slug} onError={() => setFailed(true)} />}
    </div>
  );
}
