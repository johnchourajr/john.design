import { ColorWheelSvg } from '@/components/experimental/ColorWheelSvg';
import clsx from 'clsx';
import { m } from 'motion/react';

export const ColorWheel = ({
  className,
  handleColorChange,
  handleClick,
}: any) => {
  const active = typeof handleColorChange === 'function' ? true : false;
  return (
    <m.button
      aria-label="Change color"
      title="Change color"
      onClick={handleClick}
      onMouseUp={handleColorChange}
      className={clsx('h-[1em] translate-y-[-0em] inline-block', className)}
    >
      <ColorWheelSvg active={active} />
    </m.button>
  );
};
