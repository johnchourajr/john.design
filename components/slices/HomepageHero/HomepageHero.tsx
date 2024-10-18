'use client';

import clsx from 'clsx';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMemo, useRef } from 'react';

import { JohnGLCanvas } from '@/components/experimental/JohnGL';
import { InformationalChunk } from '@/components/fragments/InformationalChunk';
import { ParentheticalChunk } from '@/components/fragments/ParentheticalChunk';
import { useDrawing } from '@/context/DrawingContext';
import { HomePageData } from '@/data/homepageContent';
import { basicAnimateDelayVariants } from '@/lib/config/motion-config';
import { wrapLettersInSpansWithWordsInSpans } from '@/lib/utils/wrapInSpans';
import { SectionStructure } from '@/types/content-types';
import { makeRandomRotate } from '../../../lib/utils/randomBetween';
import { DynamicJustifiedHeadlineInner } from '../../justified-headline/JustifiedHeadlineInner';

export type HomepageHeroProps = {
  heroSection: HomePageData['heroSection'];
  rolesSection: SectionStructure;
};

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
          const list = rolesSection?.text || [];
          const calc = -index / list.length - 0.1;
          const opacity = useTransform(scrollYProgress, [0, 1], [calc, 1]);

          const letterVariants = {
            initial: { rotate: 0 },
            hover: { rotate: makeRandomRotate() },
          };

          return typeof item === 'string' ? (
            <motion.span key={index} style={{ opacity }}>
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
            </motion.span>
          ) : (
            <motion.span key={index} style={{ opacity }}>
              <ParentheticalChunk key={index} text={item.text} />
            </motion.span>
          );
        })}
      </p>
    </div>
  );
}

export function HomepageHero({ heroSection, rolesSection }: HomepageHeroProps) {
  const { enableDrawing } = useDrawing();
  const headlineData = useMemo(() => heroSection.headlineData, [heroSection]);

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center z-10 min-h-[100vh] overflow-hidden"
    >
      <div className="flex self-start w-full py-[20vw] md:py-0 min-h-[60vw]">
        <DynamicJustifiedHeadlineInner
          className={clsx(
            'my-[16vw] w-full font-black',
            enableDrawing && 'select-none',
          )}
          iterations={8}
          headline={headlineData}
        />
      </div>
      <motion.div
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
      </motion.div>
      <RolesSection rolesSection={rolesSection} />
      <JohnGLCanvas className="h-[150vw] md:h-[100vw]" />
    </section>
  );
}

export const DynamicHomepageHero = HomepageHero;
