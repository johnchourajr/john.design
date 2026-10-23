'use client';
import { Suspense } from 'react';

import { ImageShader } from '@/components/experimental/ImageThreeShader/ImageShader';
import { fragmentThreeShaders } from '@/components/experimental/ImageThreeShader/shaders';
import { ExpBackLink } from '@/components/experimental/ExpBackLink';
import { useLocationSearch } from '@/hooks/useLocationSearch';

function PageContent({ searchParams }: { searchParams: URLSearchParams }) {
  const isIframe = searchParams.get('iframe') !== null;

  const variant = 'distortion';

  return (
    <Suspense fallback={<div />}>
      {!isIframe && (
        <ExpBackLink />
      )}

      <div className="relative w-screen h-auto">
        <ImageShader
          src="/film/clouds.jpg"
          variant={variant}
          aspectRatio="1680:1050"
        />
      </div>
    </Suspense>
  );
}

// Query params are read after hydration so the page stays statically rendered.
// Keying on them remounts with the right initial state once they're known.
export default function Page() {
  const search = useLocationSearch();

  return (
    <PageContent key={search} searchParams={new URLSearchParams(search)} />
  );
}
