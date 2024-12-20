'use client';

import clsx from 'clsx';
import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';
import { getSettingValue } from '../experimental/SettingsComponents';
import { TextContainer } from './TextContainer';

export function JustifiedHeadlineInner({
  headline,
  letters = false,
  iterations = 4,
  settings,
  ...rest
}: any) {
  const [ani, setAni] = React.useState(0);
  const speed = getSettingValue(settings, 'Speed', 1000);
  const slant = getSettingValue(settings, 'Add Slant', false);
  const animateLetters = getSettingValue(settings, 'Letters', letters);
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
        'my-[10vw] w-full font-black pointer-events-none',
        slant && '!font-black-ritalic',
      )}
      data-id={ani}
      {...rest}
    >
      {headline.map(({ text, motionObject, className }: any, index: number) => {
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
