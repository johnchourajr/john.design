import { ColorWheel } from '@/components/experimental/ColorWheel';
import { useAppContext } from '@/context/AppProvider';
import { AnimatePresence, m } from 'motion/react';

export type NavColorOverlayProps = {};

export function NavColorOverlay({}: NavColorOverlayProps) {
  const { toggleColorActive, handleActive, handleColorChange } =
    useAppContext();

  return (
    <AnimatePresence>
      {toggleColorActive && (
        <div className="fixed flex flex-col items-center justify-center inset-0 z-[9000]">
          <ColorWheel
            handleClick={() => handleActive(false)}
            handleColorChange={handleColorChange}
            className="!w-[20.25rem] !h-[20.25rem] z-[9999]"
          />
          <m.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-black bg-opacity-80 absolute inset-0 z-[9000] transition-all ease-out-expo"
            onClick={() => handleActive(false)}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
