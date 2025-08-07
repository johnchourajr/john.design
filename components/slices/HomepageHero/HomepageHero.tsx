'use client';

import clsx from 'clsx';
import { m } from 'motion/react';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import { useDrawing } from '@/components/experimental/Drawing/Drawing.context';
import { fragmentThreeShaders } from '@/components/experimental/ImageThreeShader/shaders';
import type { HomePageData } from '@/data/homepageContent';
import { basicAnimateDelayVariants } from '@/lib/config/motion-config';
import type { SectionStructure } from '@/types/content-types';

const DynamicJustifiedHeadlineInner = dynamic(() =>
  import('@/components/justified-headline').then(
    (mod) => mod.JustifiedHeadlineInner,
  ),
  { ssr: false }
);

const RolesSection = dynamic(() =>
  import('@/components/slices/RolesSection').then((mod) => mod.RolesSection),
  { ssr: false }
);

const InformationalChunk = dynamic(() =>
  import('@/components/fragments/InformationalChunk').then(
    (mod) => mod.InformationalChunk,
  ),
);

const ImageThreeShader = dynamic(
  () =>
    import('@/components/experimental/ImageThreeShader').then(
      (mod) => mod.ImageThreeShader,
    ),
  {
    ssr: false,
  },
);

export type HomepageHeroProps = {
  heroSection: HomePageData['heroSection'];
  rolesSection: SectionStructure;
};

export function HomepageHero({ heroSection, rolesSection }: HomepageHeroProps) {
  const { enableDrawing } = useDrawing();
  const headlineData = useMemo(() => {
    return heroSection.headlineData.map((item) => ({
      ...item,
      motionObject:
        item.motionObject?.length === 0 || !item.motionObject
          ? typeof window !== 'undefined'
            ? require('@/components/justified-headline/data').getRandomParentAndChildClassesArray(
                8,
              )
            : []
          : item.motionObject,
    }));
  }, [heroSection]);

  const shaderConfig = useMemo(() => {
    const variants = ['pixel', 'distortion', 'vertical', 'loupe'] as const;
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    return {
      fragmentShader: fragmentThreeShaders[randomVariant],
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center z-10 min-h-[100vh] overflow-hidden"
    >
      <div className="flex self-start w-full py-[20vw] md:py-0 min-h-[60vw] pointer-events-none">
        <DynamicJustifiedHeadlineInner
          className={clsx(
            'my-[16vw] w-full font-black pointer',
            enableDrawing && 'select-none',
          )}
          iterations={8}
          headline={headlineData}
        />
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
        <ImageThreeShader
          className={clsx('absolute', 'w-full h-full')}
          src="/me-alpha-moody.png"
          aspectRatio="1:1"
          shaderConfig={shaderConfig}
        />
      </div>
    </section>
  );
}

export const DynamicHomepageHero = HomepageHero;
