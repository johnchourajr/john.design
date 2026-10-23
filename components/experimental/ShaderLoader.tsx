'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

/** Under a second, the sweep says enough; past it, the time is worth showing. */
const SHOW_ELAPSED_AFTER = 1000;

/**
 * Stands in for a shader's canvas while it starts (#132): a band of light
 * sweeping across the canvas's place and, once it's taken a second, how
 * long so far. It fades out as the canvas fades in over it. With reduced
 * motion the band holds still.
 *
 * `accent` (the default) tints an empty, dark place in the site's colour.
 * `sheen` is a light glint for over a picture, like a type poster's
 * snapshot, that shows on light and dark alike.
 */
export function ShaderLoader({
  visible,
  variant = 'accent',
}: {
  visible: boolean;
  variant?: 'accent' | 'sheen';
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const id = window.setInterval(() => setElapsed(performance.now() - start), 100);
    return () => window.clearInterval(id);
  }, [visible]);

  return (
    <div
      aria-hidden
      data-testid="shader-loader"
      className={clsx(
        'absolute inset-0 overflow-hidden pointer-events-none',
        variant === 'accent' && 'bg-root/5',
        'transition-opacity duration-(--duration-slow) ease-(--ease-smooth-out) motion-reduce:transition-none',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div
        className={clsx(
          'absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-transparent to-transparent animate-shader-sweep motion-reduce:animate-none motion-reduce:translate-x-1/2',
          variant === 'accent' ? 'via-root/30' : 'via-white/60 mix-blend-overlay',
        )}
      />
      <p
        className={clsx(
          'absolute left-4 bottom-4 text-caption uppercase text-root tabular-nums',
          'transition-opacity duration-(--duration-fast) ease-(--ease-smooth-out)',
          elapsed >= SHOW_ELAPSED_AFTER ? 'opacity-60' : 'opacity-0',
        )}
      >
        Loading shader {(elapsed / 1000).toFixed(1)}s
      </p>
    </div>
  );
}
