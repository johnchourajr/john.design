'use client';
import { Suspense } from 'react';

import { fragmentThreeShaders } from '@/components/experimental/ImageThreeShader/shaders';
import InlineLink from '@/components/fragments/InlineLink';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

const ImageThreeShader = dynamic(() =>
  import('@/components/experimental/ImageThreeShader').then(
    (mod) => mod.ImageThreeShader,
  ),
);

export default function Page() {
  const searchParams = useSearchParams();
  const isIframe = searchParams.get('iframe') !== null;

  const shaderConfig = {
    fragmentShader: fragmentThreeShaders['distortion'],
  };

  return (
    <Suspense fallback={<div />}>
      {!isIframe && (
        <InlineLink href="/exp/" className="no-underline" underline={false}>
          <h2 className="m-4">
            &larr; <span>Back</span>
          </h2>
        </InlineLink>
      )}

      <div className="relative w-screen h-auto">
        <ImageThreeShader
          src="/film/clouds.jpg"
          shaderConfig={shaderConfig}
          aspectRatio="1680:1050"
        />
      </div>
    </Suspense>
  );
}
