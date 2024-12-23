'use client';

import clsx from 'clsx';
import { m } from 'framer-motion';

import { useTime } from '@/hooks/useTime';

export function NavDateTime() {
  const { time, dateStr } = useTime();
  const hour = time.split(':')[0];
  const timeRest = time.split(':')[1];

  return (
    <p
      className={clsx(
        'text-string relative',
        'inline-flex row gap-4 z-50 relative pointer-events-none',
        'lg:inline-flex hidden',
      )}
    >
      <span>{dateStr || '000 000 00'}</span>
      <span>
        {hour || '00'}
        <m.span
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1],
            transition: {
              duration: 0.5,
              repeat: Infinity,
              repeatType: 'reverse',
            },
          }}
        >
          :
        </m.span>
        {timeRest || '00 00'}
      </span>
    </p>
  );
}
