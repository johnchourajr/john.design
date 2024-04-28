import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import InlineLink from '@/components/InlineLink';
import SvgIconClear from '@/components/svg/SvgIconClear';
import SvgIconDraw from '@/components/svg/SvgIconDraw';
import SvgIconUndo from '@/components/svg/SvgIconUndo';
import Logo from '@/components/svg/logo';
import { useDrawing } from '@/context/DrawingContext';
import navData from '@/data/navData';
import { useTime } from '@/hooks/useTime';
import { RenderColorWheel } from '@/pages/exp/RenderColorWheel';
import { setRootColor } from '@/utils/slugify';

function DrawingControls() {
  const {
    undo,
    storedPoints,
    clearStoredPoints,
    enableDrawing,
    setEnableDrawing,
  } = useDrawing();

  const hasStoredPoints = storedPoints.length > 0;

  const sharedProps = {
    className: clsx(
      'text-string relative',
      'z-40',
      !hasStoredPoints && 'cursor-not-allowed',
    ),
    variants: {
      hidden: {
        opacity: 0,
      },
      initial: {
        opacity: 1,
      },
      disabled: {
        opacity: 1,
      },
      hover: {
        opacity: 1,
      },
    },
    initial: 'hidden',
    animate: hasStoredPoints ? 'initial' : 'disabled',
    disabled: !hasStoredPoints,
    whileHover: 'hover',
    whileTap: 'initial',
    exit: 'hidden',
    layout: true,
  };

  return (
    <AnimatePresence>
      <motion.button
        onClick={() => setEnableDrawing(!enableDrawing)}
        className={clsx('text-string relative', 'z-50')}
        variants={{
          hidden: {
            opacity: 0,
          },
          initial: {
            opacity: 1,
          },
          hover: {
            opacity: 1,
          },
          inactive: {
            opacity: 1,
          },
        }}
        initial="hidden"
        animate={enableDrawing ? 'initial' : 'inactive'}
        whileHover="hover"
        whileTap="initial"
        aria-label={`${enableDrawing ? 'Disable' : 'Enable'} drawing mode`}
        title={`${enableDrawing ? 'Disable' : 'Enable'} drawing mode`}
        layout
      >
        <SvgIconDraw />
      </motion.button>

      {enableDrawing && (
        <motion.button
          onClick={undo}
          aria-label="Undo the last drawn line"
          title="Undo the last drawn line"
          {...sharedProps}
        >
          <SvgIconUndo />
        </motion.button>
      )}
      {enableDrawing && (
        <motion.button
          onClick={clearStoredPoints}
          aria-label="Clear the drawing"
          title="Clear the drawing"
          {...sharedProps}
        >
          <SvgIconClear />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function Slash() {
  return (
    <p
      className={clsx(
        'text-string relative',
        'z-50 opacity-50',
        'md:inline-flex hidden',
      )}
    >
      /
    </p>
  );
}

const handleColorChange = (e: any) => {
  const colorFromSVG = e.target.getAttribute('fill');
  if (colorFromSVG === null || colorFromSVG === 'none') {
    setRootColor('#ff0000');
  } else {
    setRootColor(colorFromSVG);
  }
};

export default function Header() {
  const [colorActive, setColorActive] = React.useState(false);
  const { time, dateStr } = useTime();
  const hour = time.split(':')[0];
  const timeRest = time.split(':')[1];

  const handleActive = (state: boolean) => {
    if (state) {
      document.documentElement.setAttribute('data-dim', 'true');
    } else {
      document.documentElement.setAttribute('data-dim', 'false');
    }

    setColorActive(state);
  };

  return (
    <>
      <nav
        className={clsx(
          'w-full inline-flex row justify-between items-center sticky top-0 p-4',
          'after:content after:absolute after:inset-0 after:z-0 after:h-[10vw] after:pointer-events-none',
          'after:bg-gradient-to-b after:from-black after:via-transparent after:to-transparent',
          'z-50',
        )}
      >
        <div className="inline-flex row gap-6 items-center">
          <InlineLink
            href="/"
            className={clsx('z-50 relative')}
            title="Home link"
            ariaLabel="Home link"
          >
            <Logo />
          </InlineLink>

          <InlineLink
            href="/"
            className={clsx(
              'text-string relative',
              'z-50 pointer-events-none',
              'md:inline-flex hidden',
              'no-underline',
            )}
          >
            John.Design™
          </InlineLink>
          <Slash />
          {navData.map(({ href, title }: any, i: number) => (
            <InlineLink
              key={i}
              href={href}
              className={clsx(
                'text-string relative',
                'z-50 pointer-events-none',
                'md:inline-flex hidden',
                'no-underline',
              )}
            >
              {title}
            </InlineLink>
          ))}
        </div>
        <div className="inline-flex row gap-6 items-center h-5">
          <DrawingControls />
          {!colorActive && (
            <RenderColorWheel
              handleClick={() => handleActive(true)}
              className="z-[9999] h-7 w-7 p-1"
            />
          )}
          <p
            className={clsx(
              'text-string relative',
              'inline-flex row gap-4 z-50 relative pointer-events-none',
              'md:inline-flex hidden',
            )}
          >
            <span>{dateStr}</span>
            <span>
              {hour}
              <motion.span>:</motion.span>
              {timeRest}
            </span>
          </p>
        </div>
      </nav>
      <AnimatePresence>
        {colorActive && (
          <div className="fixed flex flex-col items-center justify-center inset-0 z-[9000]">
            <RenderColorWheel
              handleClick={() => handleActive(false)}
              handleColorChange={handleColorChange}
              className="w-[20.25rem] h-[20.25rem] z-[9999]"
            />
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="dim-shim absolute inset-0 z-[9000] transition-all ease-out-expo"
              onClick={() => handleActive(false)}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
