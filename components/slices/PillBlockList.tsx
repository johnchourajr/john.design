import { slugify } from '@/lib/utils/slugify';
import { wrapLettersInSpansWithWordsInSpans } from '@/lib/utils/wrapInSpans';
import { SectionStructure } from '@/types/content-types';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export type PillBlockListProps = SectionStructure & {};

export function PillBlockList({ title, list }: PillBlockListProps) {
  if (!list) {
    return null;
  }

  const childVariants = {
    initial: {
      opacity: 1,
      inset: '-1px -1px -1px -1px',
    },
    hover: {
      opacity: 1,
      inset: '-32px -32px -1px -1px',
    },
  };

  return (
    <>
      <section
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
          {list.map((item, index) => (
            <motion.div
              key={index}
              className={clsx('relative px-10 py-6', 'group hover:z-20 z-10')}
              initial={'initial'}
              whileHover={'hover'}
            >
              <motion.div
                className={clsx(
                  'absolute border-2 border-root rounded-full flex items-center justify-center bg-black',
                )}
                variants={childVariants}
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
          ))}
        </motion.div>
      </section>
    </>
  );
}
