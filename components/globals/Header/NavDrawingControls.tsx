import SvgIconClear from '@/components/svg/SvgIconClear';
import SvgIconDraw from '@/components/svg/SvgIconDraw';
import SvgIconUndo from '@/components/svg/SvgIconUndo';
import { useDrawing } from '@/context/DrawingContext';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

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
