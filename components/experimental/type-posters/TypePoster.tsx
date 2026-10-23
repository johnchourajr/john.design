'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';

import { ShaderLoader } from '../ShaderLoader';
import type { Poster } from './posters';

// The renderer (three.js, or vgpu for the WebGPU port) loads after the page.
const TypePosterCanvas = dynamic(() => import('./TypePosterCanvas'), {
  ssr: false,
});

type TypePosterProps = Pick<Poster, 'slug' | 'title' | 'words' | 'paper'> & {
  className?: string;
  /** Run the shader over the snapshot. Off, the poster is its snapshot alone. */
  live?: boolean;
  /** Shimmer while the shader loads, for a poster someone is waiting on. */
  shimmer?: boolean;
  /** Its shader has drawn its first frame, or can't run. */
  onLoaded?: () => void;
};

/**
 * A type poster at 3:4. The words are in the page for screen readers; the
 * canvas draws them.
 *
 * The poster is its snapshot, its first frame captured by
 * `scripts/capture-poster-snapshots.sh`, in the prerendered page. Only when
 * it's `live` (on the wall, once it's been opened or its turn to load in
 * the background has come) does the shader load
 * and fade in over it; the snapshot stays if the shader can't run. The
 * first live frame is the snapshot's, so the hand-over doesn't show.
 */
export function TypePoster({
  slug,
  title,
  words,
  paper,
  className,
  live = false,
  shimmer = false,
  onLoaded,
}: TypePosterProps) {
  const [failed, setFailed] = useState(false);
  const [drawn, setDrawn] = useState(false);

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
      {live && !failed && (
        <TypePosterCanvas
          slug={slug}
          onError={() => {
            setFailed(true);
            onLoaded?.();
          }}
          onFirstFrame={() => {
            setDrawn(true);
            onLoaded?.();
          }}
        />
      )}
      {/* A shimmer over the snapshot from opening until the shader draws. */}
      {live && <ShaderLoader visible={shimmer && !drawn && !failed} variant="sheen" />}
    </div>
  );
}
