'use client';

import { useDrawing } from '@/components/experimental/Drawing/Drawing.context';
import SvgIconClear from '@/components/svg/SvgIconClear';
import SvgIconDraw from '@/components/svg/SvgIconDraw';
import SvgIconUndo from '@/components/svg/SvgIconUndo';
import clsx from 'clsx';
import { m } from 'framer-motion';

export function NavDrawingControls() {
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
        width: 'auto',
        scale: 1,
      },
      initial: {
        opacity: 1,
        width: 'auto',
        scale: 1,
      },
      disabled: {
        opacity: 1,
        width: 'auto',
        scale: 1,
      },
      inactive: {
        opacity: 1,
        width: 0,
        scale: 0,
      },
      hover: {
        opacity: 1,
        width: 'auto',
        scale: 1,
      },
    },
    initial: 'hidden',
    animate: !enableDrawing
      ? 'inactive'
      : !hasStoredPoints
      ? 'disabled'
      : 'initial',
    disabled: !hasStoredPoints,
    whileHover: 'hover',
    whileTap: 'initial',
    exit: 'hidden',
  };

  return (
    <>
      <m.button
        key="draw-button"
        onClick={() => setEnableDrawing(!enableDrawing)}
        className={clsx('text-string relative', 'z-50')}
        variants={{
          hidden: {
            opacity: 0,
            x: 0,
          },
          initial: {
            opacity: 1,
            x: 0,
          },
          hover: {
            opacity: 1,
            x: 0,
          },
          inactive: {
            opacity: 1,
            x: '3rem',
          },
          inactiveHover: {
            opacity: 1,
            x: '3rem',
          },
        }}
        initial="hidden"
        animate={enableDrawing ? 'initial' : 'inactive'}
        whileHover={enableDrawing ? 'hover' : ''}
        whileTap={enableDrawing ? 'initial' : ''}
        aria-label={`${enableDrawing ? 'Disable' : 'Enable'} drawing mode`}
        title={`${enableDrawing ? 'Disable' : 'Enable'} drawing mode`}
      >
        <SvgIconDraw />
      </m.button>
      <m.button
        key="undo-button"
        onClick={undo}
        aria-label="Undo the last drawn line"
        title="Undo the last drawn line"
        {...sharedProps}
      >
        <SvgIconUndo />
      </m.button>
      <m.button
        key="clear-button"
        onClick={clearStoredPoints}
        aria-label="Clear the drawing"
        title="Clear the drawing"
        {...sharedProps}
      >
        <SvgIconClear />
      </m.button>
    </>
  );
}
