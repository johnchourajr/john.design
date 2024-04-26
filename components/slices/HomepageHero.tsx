import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const JohnGLCanvas = dynamic(
  () =>
    import('@/components/experimental/JohnGL').then(
      (module) => module.JohnGLCanvas,
    ),
  {
    ssr: false,
  },
);

const InformationalChunk = dynamic(
  () =>
    import('@/components/chunks/InformationalChunk').then(
      (module) => module.InformationalChunk,
    ),
  { ssr: false },
);

const ParentheticalChunk = dynamic(
  () =>
    import('@/components/chunks/ParentheticalChunk').then(
      (module) => module.ParentheticalChunk,
    ),
  { ssr: false },
);

import type { HomePageData } from '@/data/homepageContent';
import { wrapLettersInSpansWithWordsInSpans } from '@/lib/utils/wrapInSpans';
import type { SectionStructure } from '@/types/content-types';
import { JustifiedHeadlineInner } from '../justified-headline/JustifiedHeadlineInner';
export type HomepageHeroProps = {
  heroSection: HomePageData['heroSection'];
  rolesSection: SectionStructure;
};

export function HomepageHero({ heroSection, rolesSection }: HomepageHeroProps) {
  const headlineData = useMemo(() => heroSection.headlineData, [heroSection]);

  return (
    <>
      <section
        id="hero"
        className="relative flex flex-col items-center z-10 min-h-[100vh]"
      >
        <div className="flex self-start w-full py-[20vw] md:py-0 min-h-[60vw]">
          <JustifiedHeadlineInner
            className={clsx('my-[16vw] w-full font-black select-none')}
            iterations={8}
            headline={headlineData}
          />
        </div>
        <div
          className={clsx(
            'flex items-start flex-col gap-6 justify-center relative z-[100] mb-[8vw]',
            'select-none',
          )}
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
        </div>
        <div
          className={clsx(
            'inline-flex items-center flex-col gap-6 justify-center w-full relative z-[100] mb-[8vw]',
            'relative z-10',
            'select-none',
          )}
        >
          <p className="headline-display-xl !normal-case !font-pixel !font-normal text-center items-center leading-tight">
            {rolesSection?.text &&
              rolesSection.text.map((item, index) =>
                typeof item === 'string' ? (
                  wrapLettersInSpansWithWordsInSpans({ text: item })
                ) : (
                  <ParentheticalChunk key={index} text={item.text} />
                ),
              )}
          </p>
        </div>
        <JohnGLCanvas className="h-[150vw] md:h-[100vw]" />
      </section>
    </>
  );
}
