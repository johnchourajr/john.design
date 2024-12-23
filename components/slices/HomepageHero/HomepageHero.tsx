'use client';

import clsx from 'clsx';
import { m, useScroll, useTransform } from 'framer-motion';
import { useMemo, useRef } from 'react';

import { useDrawing } from '@/components/Drawing/Drawing.context';
import { ImageShader } from '@/components/experimental/ImageShader';
import { InformationalChunk } from '@/components/fragments/InformationalChunk';
import { ParentheticalChunk } from '@/components/fragments/ParentheticalChunk';
import { HomePageData } from '@/data/homepageContent';
import { basicAnimateDelayVariants } from '@/lib/config/motion-config';
import useLCP from '@/lib/hooks/useLCP';
import { wrapLettersInSpansWithWordsInSpans } from '@/lib/utils/wrapInSpans';
import { SectionStructure } from '@/types/content-types';
import { makeRandomRotate } from '../../../lib/utils/randomBetween';
import { DynamicJustifiedHeadlineInner } from '../../justified-headline';

export type HomepageHeroProps = {
  heroSection: HomePageData['heroSection'];
  rolesSection: SectionStructure;
};

function RolesItem({
  rolesSection,
  index,
  item,
  scrollYProgress,
}: {
  rolesSection: SectionStructure;
  index: number;
  item: string | { text: string };
  scrollYProgress: any;
}) {
  const list = rolesSection?.text || [];
  const calc = -index / list.length - 0.1;
  const opacity = useTransform(scrollYProgress, [0, 1], [calc, 1]);

  const letterVariants = {
    initial: { rotate: 0 },
    hover: { rotate: makeRandomRotate() },
  };

  return typeof item === 'string' ? (
    <m.span key={index} style={{ opacity }}>
      {wrapLettersInSpansWithWordsInSpans({
        text: item,
        layout: false,
        className: 'mx-[0.1em] inline-block',
        letterClassName: 'inline-flex',
        letterInitial: 'initial',
        letterWhileHover: 'hover',
        letterVariants,
        letterTransition: { duration: 0.05, ease: 'easeOut' },
      })}
    </m.span>
  ) : (
    <m.span key={index} style={{ opacity }}>
      <ParentheticalChunk key={index} text={item.text} />
    </m.span>
  );
}

function RolesSection({ rolesSection }: { rolesSection: SectionStructure }) {
  const ref = useRef(null);
  const { enableDrawing } = useDrawing();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 100%', 'end 95%'],
  });

  return (
    <div
      className={clsx(
        'inline-flex items-center flex-col p-4 gap-6 justify-center w-full relative z-[100] mb-[8vw]',
        'relative z-10',
        enableDrawing && 'select-none',
      )}
    >
      <p
        ref={ref}
        className="headline-display-xl !normal-case !font-pixel !font-normal text-center items-center leading-tight"
      >
        {rolesSection?.text?.map((item, index) => {
          return (
            <RolesItem
              key={index}
              index={index}
              item={item}
              rolesSection={rolesSection}
              scrollYProgress={scrollYProgress}
            />
          );
        })}
      </p>
    </div>
  );
}

export function HomepageHero({ heroSection, rolesSection }: HomepageHeroProps) {
  const { enableDrawing } = useDrawing();
  const headlineData = useMemo(() => heroSection.headlineData, [heroSection]);
  const lcpOccurred = useLCP();

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
        <ImageShader
          className={clsx('absolute', 'w-full h-full')}
          src="/me-alpha-moody.png"
          variant="distortion"
        />
      </div>
    </section>
  );
}

export const DynamicHomepageHero = HomepageHero;
