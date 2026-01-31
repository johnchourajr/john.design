'use client';

import clsx from 'clsx';
import { m } from 'motion/react';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useMemo, useState } from 'react';

import { useDrawing } from '@/components/experimental/Drawing/Drawing.context';
import {
  fragmentThreeShaders,
  type ShaderVariant,
} from '@/components/experimental/ImageThreeShader/shaders';
import { InformationalChunk } from '@/components/fragments/InformationalChunk';
import { JustifiedHeadlineInner } from '@/components/justified-headline';
import { RolesSection } from '@/components/slices/RolesSection';
import type { HomePageData } from '@/data/homepageContent';
import { basicAnimateDelayVariants } from '@/lib/config/motion-config';
import type { SectionStructure } from '@/types/content-types';

// Lazy load Three.js shader component to reduce initial bundle size
const ImageThreeShader = dynamic(
  () =>
    import('@/components/experimental/ImageThreeShader').then(
      (mod) => mod.ImageThreeShader,
    ),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-black" />,
  },
);

export type HomepageHeroProps = {
  heroSection: HomePageData['heroSection'];
  rolesSection: SectionStructure;
};

type ShaderConfig = {
  fragmentShader: string;
};

export function HomepageHero({ heroSection, rolesSection }: HomepageHeroProps) {
  const { enableDrawing } = useDrawing();
  const headlineData = useMemo(() => {
    return heroSection.headlineData;
  }, [heroSection]);

  // Defer shader variant selection to client to avoid hydration mismatch
  const [shaderConfig, setShaderConfig] = useState<ShaderConfig | null>(null);

  useEffect(() => {
    const variants: ShaderVariant[] = [
      'pixel',
      'distortion',
      'vertical',
      'loupe',
      'sphere',
      'prism',
    ];
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    setShaderConfig({
      fragmentShader: fragmentThreeShaders[randomVariant],
    });
  }, []);

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center z-10 min-h-[100vh] overflow-hidden"
    >
      <div className="flex self-start w-full py-[20vw] md:py-0 min-h-[60vw] pointer-events-none">
        <Suspense fallback={<div className="bg-black aspect-square w-full" />}>
          <JustifiedHeadlineInner
            className={clsx(
              'my-[16vw] w-full font-black pointer',
              enableDrawing && 'select-none',
            )}
            iterations={8}
            headline={headlineData}
          />
        </Suspense>
      </div>
      <m.div
        className={clsx(
          'flex items-start flex-col gap-6 p-4 justify-center relative z-[100] mb-[8vw]',
          enableDrawing && 'select-none',
        )}
        variants={basicAnimateDelayVariants({ delay: 0.5 })}
        initial="initial"
        animate="animate"
      >
        {heroSection.typographies.map(({ text, size }, index) => (
          <p key={index} className={size}>
            {text}
          </p>
        ))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {heroSection.informationalChunks.map((chunk, index) => (
            <InformationalChunk key={index} text={chunk.text} />
          ))}
        </div>
      </m.div>
      <RolesSection rolesSection={rolesSection} />
      <div
        className={clsx(
          'absolute w-screen aspect-square flex items-center justify-center -z-10 ',
          '-translate-y-[5%]',
        )}
      >
        {shaderConfig && (
          <ImageThreeShader
            className={clsx('absolute', 'w-full h-full')}
            src="/me-alpha-moody.png"
            aspectRatio="1:1"
            shaderConfig={shaderConfig}
          />
        )}
      </div>
    </section>
  );
}
