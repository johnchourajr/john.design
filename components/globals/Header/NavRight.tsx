import { RenderColorWheel } from '@/components/experimental/ColorWheel';
import { useAppContext } from '@/context/AppProvider';
import { useTime } from '@/hooks/useTime';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { NavDrawingControls } from './NavDrawingControls';

export function NavRight() {
  const { toggleColorActive, setToggleColorActive } = useAppContext();

  const { time, dateStr } = useTime();
  const hour = time.split(':')[0];
  const timeRest = time.split(':')[1];

  return (
    <div className="inline-flex row gap-6 items-center h-5">
      <NavDrawingControls />
      {!toggleColorActive && (
        <RenderColorWheel
          handleClick={() => setToggleColorActive(true)}
          className="z-[9999] h-8 w-8 "
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
          <motion.span
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
          </motion.span>
          {timeRest}
        </span>
      </p>
    </div>
  );
}
