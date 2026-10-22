'use client';

import { COLOR_DRAWER_ID } from '@/components/globals/Header/NavColorDrawer';
import { useAppContext } from '@/context/AppProvider';
import { ColorWheel } from './ColorWheel';

export function ColorWheelControl() {
  const { toggleColorActive, setToggleColorActive } = useAppContext();

  return (
    <ColorWheel
      handleClick={() => setToggleColorActive(!toggleColorActive)}
      expanded={toggleColorActive}
      controls={COLOR_DRAWER_ID}
      className="z-[9999] h-8 w-8"
    />
  );
}
