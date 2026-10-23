'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

/** Under a second, the sweep says enough; past it, the time is worth showing. */
const SHOW_ELAPSED_AFTER = 1000;

/**
 * Stands in for a shader's canvas while it starts (#129): a band of light
 * sweeping across the canvas's place and, once it's taken a second, how
 * long so far. It fades out as the canvas fades in over it. With reduced
 * motion the band holds still.
 */
export function ShaderLoader({ visible }: { visible: boolean }) {
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
        'absolute inset-0 overflow-hidden pointer-events-none bg-root/5',
        'transition-opacity duration-(--duration-slow) ease-(--ease-smooth-out) motion-reduce:transition-none',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div className="absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-transparent via-root/30 to-transparent animate-shader-sweep motion-reduce:animate-none motion-reduce:translate-x-1/2" />
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
