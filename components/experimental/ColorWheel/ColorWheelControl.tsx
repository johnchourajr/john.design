'use client';

import { useAppContext } from '@/context/AppProvider';
import { ColorWheel } from './ColorWheel';

export function ColorWheelControl() {
  const { toggleColorActive, setToggleColorActive } = useAppContext();

  return (
    <>
      {!toggleColorActive && (
        <ColorWheel
          handleClick={() => setToggleColorActive(true)}
          className="z-[9999] h-8 w-8 "
        />
      )}
    </>
  );
}
