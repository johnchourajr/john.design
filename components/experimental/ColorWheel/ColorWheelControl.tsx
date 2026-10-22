'use client';

import { useAppContext } from '@/context/AppProvider';
import { ColorWheel } from './ColorWheel';

export function ColorWheelControl() {
  const { toggleColorActive, setToggleColorActive } = useAppContext();

  return (
    <ColorWheel
      handleClick={() => setToggleColorActive(!toggleColorActive)}
      className="z-[9999] h-8 w-8 "
    />
  );
}
