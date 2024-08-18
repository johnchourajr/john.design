'use client';

import { slugify } from '@/lib/utils/slugify';
import { wrapLettersInSpansWithWordsInSpans } from '@/lib/utils/wrapInSpans';
import { SectionStructure } from '@/types/content-types';
import clsx from 'clsx';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export type PillBlockListProps = SectionStructure & {};

export function PillBlockList({ title, list }: PillBlockListProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 95%', 'end 85%'],
  });

  if (!list) {
    return null;
  }

  return (
    <>
      <section
        ref={ref}
        id={slugify(title || '')}
        className={clsx(
          'relative z-20 w-full overflow-hidden mb-[6vw] text-center flex flex-col gap-4',
        )}
      >
        <p className="text-string">{title}</p>
        <motion.div
          className={clsx(
            'flex flex-wrap items-center justify-center w-[112vw] -mx-[6vw]',
          )}
        >
          {list.map((item, index) => {
            const calc = -index / list.length + 0.1;
            const insetCalc = `${index * 4}px`;

            return (
              <motion.div
                key={index}
                className={clsx('relative px-10 py-6', 'group hover:z-20 z-10')}
                initial={'initial'}
                whileHover={'hover'}
                style={
                  {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    opacity: useTransform(scrollYProgress, [0, 1], [calc, 1]),
                  } as any
                }
              >
                <motion.div
                  className={clsx(
                    'absolute border-2 border-root rounded-full flex items-center justify-center bg-black',
                  )}
                  style={{
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    inset: useTransform(
                      scrollYProgress,
                      [0, 1],
                      [insetCalc, '-1px'],
                    ),
                  }}
                >
                  <p className="headline-display-sm group-hover:font-bold-ritalic">
                    {wrapLettersInSpansWithWordsInSpans({ text: item })}
                  </p>
                </motion.div>
                <p
                  className="headline-display-sm invisible select-none"
                  aria-hidden="true"
                >
                  {wrapLettersInSpansWithWordsInSpans({ text: item })}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </>
  );
}
