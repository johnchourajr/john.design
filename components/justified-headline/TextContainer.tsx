import clsx from 'clsx';

import {
  basicAnimateParentVariants,
  basicAnimateVariants,
} from '@/lib/config/motion-config';
import { slugify } from '@/utils/slugify';
import { m } from 'motion/react';
import dynamic from 'next/dynamic';
import { addStrongTags } from './utils';

export const TextContainer = ({
  text,
  motionObject,
  motionKey,
  letters,
  className,
}: any) => {
  if (!text) return null;

  const motionController = motionObject[motionKey];

  const motionProps = {
    variants: basicAnimateVariants,
    layout: true,
  };

  const renderText = () => {
    if (letters) {
      // split each letter in text into its own span
      const lettersArray = text.split('');
      return lettersArray.map((letter: any, index: number) => {
        return (
          <m.span
            key={index}
            id={slugify(`${letter} ${index}`)}
            data-word={slugify(`${letter} ${index}`)}
            className={className}
            {...motionProps}
          >
            {addStrongTags(letter)}
          </m.span>
        );
      });
    } else {
      const childrenArray = typeof text === 'string' ? text.split(' ') : [];
      return childrenArray.map((child: any, index: number) => {
        return (
          <m.span
            key={index}
            id={slugify(`${child} ${index}`)}
            data-word={slugify(`${child} ${index}`)}
            className={className}
            {...motionProps}
          >
            {addStrongTags(child)} {index !== childrenArray.length - 1 && ' '}
          </m.span>
        );
      });
    }
  };

  return (
    <span
      className={clsx(
        'relative flex flex-col items-center justify-start w-full',
        motionController.parent,
      )}
    >
      <m.span
        className={clsx('inline-flex whitespace-pre', motionController.child)}
        variants={basicAnimateParentVariants({
          staggerChildren: 0.1,
          delayChildren: 0.3,
        })}
        initial="initial"
        animate="animate"
        layout
      >
        {renderText()}
      </m.span>
    </span>
  );
};

export const DynamicTextContainer = dynamic(
  () => Promise.resolve(TextContainer),
  {
    ssr: false,
  },
);
