'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useEffect } from 'react';

type ErrorViewProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Shared 500 view for `app/error.tsx` and `app/global-error.tsx`. Kept free of
 * site providers and animation so it still renders when those are what broke.
 */
export function ErrorView({ error, reset }: ErrorViewProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="min-h-[70vh] px-4 py-[10vw] flex flex-col justify-center">
      <h1 className="uppercase headline-display-xl leading-none text-root">
        500
      </h1>
      <p className="text-string mt-6">Something broke on our end.</p>
      <p className="headline-display-sm sm:headline-display-md mt-4 max-w-[40ch] text-root">
        This page hit an error while loading. Try again, or head back home.
      </p>
      <div className="flex flex-wrap gap-4 mt-10">
        <button
          type="button"
          onClick={reset}
          className={clsx(
            'bg-root text-white px-4 py-2 rounded-sm',
            'hover:opacity-70 transition-opacity',
          )}
        >
          Try again
        </button>
        <Link
          href="/"
          className="border-1 border-root text-root px-4 py-2 rounded-sm hover:opacity-70 transition-opacity"
        >
          Go home
        </Link>
      </div>
      {error.digest && (
        <p className="text-string mt-10 opacity-50">
          Error reference: {error.digest}
        </p>
      )}
    </section>
  );
}
