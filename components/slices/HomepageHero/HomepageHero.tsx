'use client';

import clsx from 'clsx';
import { m } from 'motion/react';
import dynamic from 'next/dynamic';
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useDrawing } from '@/components/experimental/Drawing/Drawing.context';
import {
  heroShaderVariants,
  isHeadlineInShader,
  nextShaderVariant,
  pickShaderVariant,
  type ShaderVariant,
} from '@/components/experimental/ImageThreeShader/shaders';
import { isShaderDebug } from '@/components/experimental/shaderDebug';
import { InformationalChunk } from '@/components/fragments/InformationalChunk';
import { JustifiedHeadlineInner } from '@/components/justified-headline';
import { RolesSection } from '@/components/slices/RolesSection';
import type { HomePageData } from '@/data/homepageContent';
import { basicAnimateDelayVariants } from '@/lib/config/motion-config';
import type { SectionStructure } from '@/types/content-types';

// The shader (vgpu, or three.js for the fallback) loads after the page.
const ImageShader = dynamic(
  () =>
    import('@/components/experimental/ImageThreeShader/ImageShader').then(
      (mod) => mod.ImageShader,
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

type HeroShader = {
  variant: ShaderVariant;
  /** Draw the headline inside the shader, so the effects warp it too (#108). */
  withHeadline: boolean;
  /** `?shader-debug`: heads the debug panel. */
  debug?: string;
};

export function HomepageHero({ heroSection, rolesSection }: HomepageHeroProps) {
  const { enableDrawing } = useDrawing();
  const headlineData = useMemo(() => {
    return heroSection.headlineData;
  }, [heroSection]);

  // The headline's box. The shader draws its text and hides it once it can.
  const headlineRef = useRef<HTMLDivElement>(null);
  const getHeadline = useCallback(() => headlineRef.current, []);

  // Defer shader variant selection to client to avoid hydration mismatch
  const [heroShader, setHeroShader] = useState<HeroShader | null>(null);
  // A click on the portrait moves on to the next effect, except while
  // drawing, where a click is a mark.
  const cycleShader = useCallback(
    () =>
      setHeroShader(
        (current) =>
          current && {
            ...current,
            variant: nextShaderVariant(current.variant, heroShaderVariants),
          },
      ),
    [],
  );

  useEffect(() => {
    // The variant is random, so choosing it during render would differ between server and
    // client and break hydration. Picking it once after mount is the intended pattern here.
    const variant = pickShaderVariant(heroShaderVariants);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeroShader({
      variant,
      withHeadline: isHeadlineInShader(),
      // Not the variant: a new label would rebuild the canvas on every click.
      debug: isShaderDebug() ? 'home' : undefined,
    });
  }, []);

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center z-10 min-h-screen overflow-hidden"
    >
      <div
        ref={headlineRef}
        className="flex self-start w-full py-[20vw] md:py-0 min-h-[60vw] pointer-events-none"
      >
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
          'flex items-start flex-col gap-6 p-4 justify-center relative z-100 mb-[8vw]',
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
          'translate-y-[-5%]',
        )}
      >
        {heroShader && (
          <ImageShader
            className={clsx('absolute', 'w-full h-full')}
            src="/me-alpha-moody.png"
            aspectRatio="1:1"
            variant={heroShader.variant}
            getHeadline={heroShader.withHeadline ? getHeadline : undefined}
            debug={heroShader.debug}
            onCanvasClick={enableDrawing ? undefined : cycleShader}
          />
        )}
      </div>
    </section>
  );
}
