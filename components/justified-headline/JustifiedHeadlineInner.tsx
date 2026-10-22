'use client';

import clsx from 'clsx';
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import React from 'react';

import type { TextStructure } from '@/types/content-types';
import {
  getSettingValue,
  type BooleanSetting,
  type SliderSetting,
} from '../experimental/SettingsComponents';
import { TextContainer } from './TextContainer';

/** The settings /exp/justified-headline passes in. */
export type HeadlineSetting =
  | BooleanSetting<'slant'>
  | BooleanSetting<'letters'>
  | SliderSetting<'speed'>;

type JustifiedHeadlineInnerProps = Omit<HTMLMotionProps<'p'>, 'children'> & {
  headline: TextStructure[];
  letters?: boolean;
  iterations?: number;
  settings?: readonly HeadlineSetting[];
};

export function JustifiedHeadlineInner({
  headline,
  letters = false,
  iterations = 4,
  settings,
  ...rest
}: JustifiedHeadlineInnerProps) {
  const [ani, setAni] = React.useState(0);
  const speed = getSettingValue(settings, 'speed', 1000);
  const slant = getSettingValue(settings, 'slant', false);
  const animateLetters = getSettingValue(settings, 'letters', letters);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (reducedMotion) {
      return;
    }
    const interval = setInterval(() => {
      setAni((prev) => (prev + 1) % iterations);
    }, speed);
    return () => clearInterval(interval);
  }, [speed, iterations, reducedMotion]);

  return (
    <motion.p
      className={clsx(
        'my-[10vw] w-full min-h-screen font-black pointer-events-none',
        slant && 'font-black-ritalic!',
      )}
      data-id={ani}
      {...rest}
    >
      {headline.map(({ text, motionObject, className }) => {
        return (
          <span
            key={text}
            className={clsx('uppercase headline-display-xl', className)}
          >
            <TextContainer
              key={text}
              text={text}
              motionObject={motionObject}
              motionKey={ani}
              letters={animateLetters}
            />
          </span>
        );
      })}
    </motion.p>
  );
}
