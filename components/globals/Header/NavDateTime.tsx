'use client';

import { useTime } from '@/hooks/useTime';
import clsx from 'clsx';
import { m } from 'framer-motion';

export function NavDateTime() {
  const { time, dateStr } = useTime();
  const hour = time?.split(':')[0];
  const timeRest = time?.split(':')[1];
  const isLoading = !time || !dateStr;

  return (
    <p
      className={clsx(
        'text-string relative',
        'inline-flex row gap-4 z-50 relative pointer-events-none',
        'lg:inline-flex hidden',
        'min-w-[165px]',
      )}
      aria-live="polite"
    >
      <span
        className={clsx(
          'min-w-[100px]',
          isLoading && 'bg-gray-200 animate-pulse rounded',
        )}
      >
        {dateStr || '\u00A0'}
      </span>
      <span
        className={clsx(
          'min-w-[65px]', // Fixed width for time
          isLoading && 'bg-gray-200 animate-pulse rounded',
        )}
      >
        {!isLoading ? (
          <>
            {hour}
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
            {timeRest}
          </>
        ) : (
          '\u00A0'
        )}
      </span>
    </p>
  );
}
