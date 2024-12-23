import ColorWheelSvg from '@/components/experimental/ColorWheelSvg/ColorWheelSvg';
import clsx from 'clsx';
import { m } from 'framer-motion';

export const RenderColorWheel = ({
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
