'use client';

import clsx from 'clsx';
import { m } from 'framer-motion';

export function ParentheticalChunk({ text }: any) {
  const blinkVariants = {
    initial: {
      opacity: 1,
    },
    hover: {
      // blink slowly on repeat
      opacity: [1, 0.1, 1],
      transition: {
        repeat: Infinity,
        duration: 1,
      },
    },
  };

  return (
    <m.span
      className="whitespace-nowrap"
      initial={'initial'}
      whileHover={'hover'}
    >
      <m.span variants={blinkVariants}>( </m.span>
      <span className="inline-flex h-fit items-center justify-center -translate-y-[50%] lg:-translate-y-[100%]">
        <span
          className={clsx(
            'text-body',
            'inline-flex text-center whitespace-pre-wrap max-w-[20em] md:max-w-[25em]',
          )}
        >
          {text}
        </span>
      </span>
      <m.span variants={blinkVariants}> )</m.span>
    </m.span>
  );
}
